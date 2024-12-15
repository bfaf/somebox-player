import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Image,
  Pressable,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { selectMovieById } from '../redux/slices/moviesSlice';
import { useLoginTimeout } from '../hooks/useLoginTimeout';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LoggedInStackParamList } from './loggedInStack';

type DetailsProps = NativeStackScreenProps<
  LoggedInStackParamList,
  'Details'
>;

const Details = ({ route }: DetailsProps) => {
  const { videoId } = route?.params;
  const navigation = useNavigation();
  const [isContinueHovered, setIsContinueHovered] = useState<boolean>(false);
  const [isRestartHovered, setIsRestartHovered] = useState<boolean>(false);
  const [isPlayHovered, setIsPlayHovered] = useState<boolean>(false);
  // const [isEpisodesHovered, setIsEpisodesHovered] = useState<boolean>(false);
  const movieData = useSelector((state: RootState) =>
    selectMovieById(state, Number.parseInt(`${videoId}`, 10)),
  );
  const canContinue = movieData?.moviesContinue && movieData.moviesContinue.startFrom > 0;
  const metadata = movieData?.moviesMetadataEntity;

  // TODO: Make this global for all components
  useLoginTimeout();

  useEffect(() => {
    setIsContinueHovered(true);

    return () => {
      setIsContinueHovered(false);
      setIsRestartHovered(false);
      setIsPlayHovered(false);
    };
  }, []);

  if (!movieData) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <Image
            source={{
              uri: `data:image/png;base64,${movieData.moviesMetadataEntity.poster}`,
            }}
            resizeMode="cover"
            style={styles.poster}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{movieData.name}</Text>
          <Text style={styles.plot} numberOfLines={7}>{metadata?.plot}</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}>Release year: {movieData?.releaseYear}</Text>
            <Text style={styles.detailsText}>Duration: {metadata?.duration}</Text>
            <Text style={styles.detailsText}>Genre: {metadata?.ganre}</Text>
            <Text style={styles.detailsText}>IMDB rating: {metadata?.rated}</Text>
          </View>
          <View style={styles.buttonContainer}>
            {canContinue && (
              <>
                <Pressable style={isContinueHovered ? styles.buttonHovered : styles.button} key="continue" onPress={() => navigation.navigate('Player', { videoId, continuePlaying: true })} onFocus={() => setIsContinueHovered(true)} onBlur={() => setIsContinueHovered(false)} hasTVPreferredFocus={true}>
                  <Text style={isContinueHovered ? styles.buttonTextHovered : styles.buttonText}>Continue watching</Text>
                </Pressable>
                <Pressable style={isRestartHovered ? styles.buttonHovered : styles.button} key="restart" onPress={() => navigation.navigate('Player', { videoId, continuePlaying: false })} onFocus={() => setIsRestartHovered(true)} onBlur={() => setIsRestartHovered(false)}>
                  <Text style={isRestartHovered ? styles.buttonTextHovered : styles.buttonText}>Restart</Text>
                </Pressable>
              </>
            )}
            {!canContinue && (
              <Pressable style={isPlayHovered ? styles.buttonHovered : styles.button} key="play" onPress={() => navigation.navigate('Player', { videoId: movieData.movieId, continuePlaying: false })} onFocus={() => setIsPlayHovered(true)} onBlur={() => setIsPlayHovered(false)} hasTVPreferredFocus={true}>
                <Text style={isPlayHovered ? styles.buttonTextHovered : styles.buttonText}>Play</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  poster: {
    width: 250,
    height: 400,
  },
  container: {
    width: '70%',
    height: 'auto',
    flexDirection: 'row',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 50,
  },
  content: {
    width: '100%',
    height: 'auto',
    flexDirection: 'column',
    marginLeft: 50,
  },
  title: {
    color: 'black',
    fontSize: 30,
    fontWeight: '900',
  },
  plot: {
    width: '70%',
    color: 'black',
    fontSize: 18,
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailsText: {
    marginTop: 8,
    color: 'black',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 50,
  },
  button: {
    marginRight: 16,
    padding: 8,
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  buttonHovered: {
    marginRight: 16,
    padding: 8,
    borderColor: 'black',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#6200ee',
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  buttonTextHovered: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});

export default Details;
