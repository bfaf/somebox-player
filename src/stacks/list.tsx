import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  ActivityIndicator,
  AppBar,
  HStack,
  VStack,
  IconButton,
} from '@react-native-material/core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faArrowsRotate,
  faEllipsisVertical,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Dimensions,
  useTVEventHandler,
  HWEvent,
  Platform,
} from 'react-native';

import { MovieData } from '../constants';
import Debug from '../components/debug';

function List(): JSX.Element {
  const navigation = useNavigation();
  const [eventName, setEventName] = useState<string>('');
  const [movies, setMovies] = useState<MovieData | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<any>(null);

  // Prevent going back
  React.useEffect(() => navigation.addListener('beforeRemove', (e) => {
    e.preventDefault();
  }), []);

  const fetchMovies = async () => {
    setMovies(undefined);
    setErrorMessage(null);
    try {
      const m = await axios.get('http://192.168.1.9:8080/api/v1/list'); // replace redux with action
      // console.log('response', JSON.stringify(m.data, null, 2));
      setMovies(m.data);
    } catch (err) {
      setErrorMessage(err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const myTVEventHandler = (evt: HWEvent) => {
    setEventName(evt.eventType);
  };

  if (Platform.isTV) {
    useTVEventHandler(myTVEventHandler);
  }

  const renderMovies = useCallback(
    (moviesData: MovieData[]) => {
      if (!moviesData || moviesData.length === 0) {
        return <ActivityIndicator size="large" />;
      }

      const rows = [];

      for (let i = 0; i < moviesData.length; i += 4) {
        rows.push(moviesData.slice(i, i + 4));
      }

      return (
        <VStack
          style={{
            marginTop: 0,
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '83%',
          }}>
          {rows.map((row, idx: number) => (
            <HStack m={30} spacing={8} key={idx}>
              {row.map((r: MovieData, innerIdx: number) => (
                <View
                  key={r.filename}
                  style={{ display: 'flex', flexDirection: 'row' }}>
                  <TouchableOpacity
                    key={r.filename}
                    hasTVPreferredFocus={idx === 0 && innerIdx === 0}
                    onPress={() =>
                      navigation.navigate('Player', { videoId: r.movieId })
                    }>
                    <Image
                      source={{
                        uri: `data:image/png;base64,${r.moviesMetadataEntity.poster}`,
                      }}
                      resizeMode='cover'
                      style={{ width: 120, height: 179 }}
                    />
                    <Text
                      numberOfLines={1}
                      style={{ fontSize: 14, width: 120, color: 'grey' }}>
                      {r.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </HStack>
          ))}
        </VStack>
      );
    },
    [navigation],
  );

  return (
    <SafeAreaView>
      <View>
        <AppBar
          title="SomeBox Player"
          style={{ marginBottom: 0, paddingBottom: 0 }}
          trailing={props => (
            <HStack>
              <IconButton
                icon={props => (
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    style={{ color: 'white' }}
                  />
                )}
                {...props}
              />
              <IconButton
                onPress={fetchMovies}
                icon={props => (
                  <FontAwesomeIcon
                    icon={faArrowsRotate}
                    style={{ color: 'white' }}
                  />
                )}
                {...props}
              />
              <IconButton
                icon={props => (
                  <FontAwesomeIcon
                    icon={faEllipsisVertical}
                    style={{ color: 'white' }}
                  />
                )}
                {...props}
              />
            </HStack>
          )}
        />
      </View>

      <ScrollView style={{ marginBottom: 50 }}>
        <>
          {renderMovies(movies)}
          <Debug name="errorMessage" data={errorMessage} />
        </>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  backgroundVideo: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
});

export default List;
