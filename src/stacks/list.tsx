import React, { useEffect, useState, useCallback } from 'react';
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
} from 'react-native';

import { MovieData } from '../constants';
import Debug from '../components/debug';
import { AppDispatch } from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectErrorMovies,
  selectIsLoadedMovies,
  selectIsLoadingMovies,
  selectMovies,
} from '../redux/slices/moviesSlice';
import { fetchMovies } from '../redux/thunks/movies';
import { LoggedInStackNavigationProp } from './loggedInStack';

const POSTER_WIDTH = 120;
const POSTER_HEIGHT = 179;
const POSTER_PADDING = 30;

function List(): JSX.Element {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation<LoggedInStackNavigationProp>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [eventName, setEventName] = useState<string>('');
  const movies = useSelector(selectMovies);
  const isLoaded = useSelector(selectIsLoadedMovies);
  const isLoading = useSelector(selectIsLoadingMovies);
  const errorMessage = useSelector(selectErrorMovies);

  // Prevent going back
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      e.preventDefault();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (!isLoaded && isLoading) {
      dispatch(fetchMovies());
    }
  }, [isLoaded, isLoading, dispatch]);

  const myTVEventHandler = (evt: HWEvent) => {
    setEventName(evt.eventType);
  };

  useTVEventHandler(myTVEventHandler);

  const renderMovies = useCallback(
    (moviesData: MovieData[]) => {
      const rows = [];
      const moviesPerRow = Math.floor(
        Dimensions.get('window').width / (POSTER_WIDTH + POSTER_PADDING),
      );

      for (let i = 0; i < moviesData.length; i += moviesPerRow) {
        rows.push(moviesData.slice(i, i + moviesPerRow));
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
            <HStack m={POSTER_PADDING} spacing={8} key={idx}>
              {row.map((r: MovieData, innerIdx: number) => (
                <View
                  key={r.filename}
                  style={{ display: 'flex', flexDirection: 'row' }}>
                  <TouchableOpacity
                    key={r.filename}
                    hasTVPreferredFocus={idx === 0 && innerIdx === 0}
                    onPress={() => {
                      navigation.navigate('Player', { videoId: r.movieId });
                    }}>
                    <Image
                      source={{
                        uri: `data:image/png;base64,${r.moviesMetadataEntity.poster}`,
                      }}
                      resizeMode="cover"
                      style={{ width: POSTER_WIDTH, height: POSTER_HEIGHT }}
                    />
                    <Text
                      numberOfLines={2}
                      style={{
                        fontSize: 14,
                        width: POSTER_WIDTH,
                        color: 'grey',
                      }}>
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

  if (errorMessage != null) {
    return <Debug data={errorMessage} />;
  }

  if (isLoading || !movies) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <SafeAreaView>
      <View>
        <AppBar
          title="YoFlix"
          style={{ marginBottom: 0, paddingBottom: 0 }}
          trailing={props => (
            <HStack>
              <IconButton
                icon={() => (
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    style={{ color: 'white' }}
                  />
                )}
                {...props}
              />
              <IconButton
                onPress={() => dispatch(fetchMovies())}
                icon={() => (
                  <FontAwesomeIcon
                    icon={faArrowsRotate}
                    style={{ color: 'white' }}
                  />
                )}
                {...props}
              />
              <IconButton
                icon={() => (
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
        <>{renderMovies(movies)}</>
      </ScrollView>
    </SafeAreaView>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
});

export default List;
