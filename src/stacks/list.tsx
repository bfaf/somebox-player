/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState, useCallback, useRef} from 'react';
import axios from 'axios';
import {
  ActivityIndicator,
  AppBar,
  HStack,
  VStack,
  IconButton,
} from '@react-native-material/core';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowsRotate,
  faEllipsisVertical,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import {useNavigation} from '@react-navigation/native';

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
  Pressable,
} from 'react-native';

import {SomeBoxFileInfo} from '../constants';
import Debug from '../components/debug';

function List(): JSX.Element {
  const navigation = useNavigation();
  const [eventName, setEventName] = useState<string>('');
  const [movies, setMovies] = useState([]);
  const [errorMessage, setErrorMessage] = useState<any>(null);

  const fetchMovies = async () => {
    setMovies([]);
    setErrorMessage(null);
    try {
      const m = await axios.get('http://192.168.1.9:8080/api/v1/list');
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
    movies => {
      if (!movies || movies.length === 0) {
        return <ActivityIndicator size="large" />;
      }

      movies.sort((a: SomeBoxFileInfo, b: SomeBoxFileInfo) => {
        if (a.filename > b.filename) {
          return 1;
        } else if (a.filename < b.filename) {
          return -1;
        }

        return 0;
      });

      const rows = [];

      for (let i = 0; i < movies.length; i += 4) {
        rows.push(movies.slice(i, i + 4));
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
              {row.map((r: SomeBoxFileInfo, innerIdx: number) => (
                <View
                  key={r.filename}
                  style={{display: 'flex', flexDirection: 'row'}}>
                  <TouchableOpacity
                    key={r.filename}
                    hasTVPreferredFocus={idx === 0 && innerIdx === 0}
                    onPress={() =>
                      navigation.navigate('Player', {videoId: r.filename})
                    }>
                    <Image
                      source={{
                        uri: `http://192.168.1.9:8080/api/v1/image/${r.filename}`,
                      }}
                      style={{width: 180, height: 101}}
                    />
                    <Text
                      numberOfLines={1}
                      style={{fontSize: 14, width: 180, color: 'grey'}}>
                      {r.filename}
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
          style={{marginBottom: 0, paddingBottom: 0}}
          trailing={props => (
            <HStack>
              <IconButton
                icon={props => (
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    style={{color: 'white'}}
                  />
                )}
                {...props}
              />
              <IconButton
              onPress={fetchMovies}
                icon={props => (
                  <FontAwesomeIcon
                    icon={faArrowsRotate}
                    style={{color: 'white'}}
                  />
                )}
                {...props}
              />
              <IconButton
                icon={props => (
                  <FontAwesomeIcon
                    icon={faEllipsisVertical}
                    style={{color: 'white'}}
                  />
                )}
                {...props}
              />
            </HStack>
          )}
        />
      </View>

      <ScrollView style={{marginBottom: 50}}>
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
