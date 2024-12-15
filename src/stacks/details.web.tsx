import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useLoaderData } from 'react-router-dom';
import { useLoginTimeout } from '../hooks/useLoginTimeout';
import Episodes from '../components/Episodes';

type LoaderData = {
  videoId: number;
};

export const detailsLoader = ({ params }: { params: any }): LoaderData => {
  return { videoId: params.videoId };
};

const Details = () => {
  const urlData = useLoaderData() as LoaderData;
  const navigate = useNavigate();
  const [isContinueHovered, setIsContinueHovered] = useState<boolean>(false);
  const [isRestartHovered, setIsRestartHovered] = useState<boolean>(false);
  const [isPlayHovered, setIsPlayHovered] = useState<boolean>(false);
  const [isEpisodesHovered, setIsEpisodesHovered] = useState<boolean>(false);
  const [showEpisodes, setShowEpisodes] = useState<boolean>(false);
  const movieId = Number.parseInt(`${urlData.videoId}`, 10);
  const movieData = useSelector((state: RootState) =>
    selectMovieById(state, movieId),
  );
  const canContinue = movieData?.moviesContinue && movieData.moviesContinue.startFrom > 0;
  const metadata = movieData?.moviesMetadataEntity;
  const isTvSeries = movieData && (movieData.moviesSeries || []).length > 0;
  const seriesId = movieData?.moviesContinue?.seriesId || 0;

  // TODO: Make this global for all components
  useLoginTimeout();

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
          <Text style={styles.plot} numberOfLines={5}>{metadata?.plot}</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.detailsText}>Release year: {movieData?.releaseYear}</Text>
            <Text style={styles.detailsText}>Duration: {metadata?.duration}</Text>
            <Text style={styles.detailsText}>Genre: {metadata?.ganre}</Text>
            <Text style={styles.detailsText}>IMDB rating: {metadata?.rated}</Text>
          </View>
          <View style={styles.buttonContainer}>
            {canContinue && (
              <>
                <Pressable style={isContinueHovered ? styles.buttonHovered : styles.button} key="continue" onPress={() => navigate(`/video/${movieData.movieId}/${seriesId}/true`)} onHoverIn={() => setIsContinueHovered(true)} onHoverOut={() => setIsContinueHovered(false)}>
                  <Text style={isContinueHovered ? styles.buttonTextHovered : styles.buttonText}>Continue</Text>
                </Pressable>
                <Pressable style={isRestartHovered ? styles.buttonHovered : styles.button} key="restart" onPress={() => navigate(`/video/${movieData.movieId}/${seriesId}/false`)} onHoverIn={() => setIsRestartHovered(true)} onHoverOut={() => setIsRestartHovered(false)}>
                  <Text style={isRestartHovered ? styles.buttonTextHovered : styles.buttonText}>Restart</Text>
                </Pressable>
              </>
            )}
            {!canContinue && (
              <Pressable style={isPlayHovered ? styles.buttonHovered : styles.button} key="play" onPress={() => navigate(`/video/${movieData.movieId}/${seriesId}/false`)} onHoverIn={() => setIsPlayHovered(true)} onHoverOut={() => setIsPlayHovered(false)}>
                <Text style={isPlayHovered ? styles.buttonTextHovered : styles.buttonText}>Play</Text>
              </Pressable>
            )}
            {isTvSeries && (
              <Pressable style={isEpisodesHovered ? styles.buttonHovered : styles.button} key="episodes" onPress={() => setShowEpisodes(true)} onHoverIn={() => setIsEpisodesHovered(true)} onHoverOut={() => setIsEpisodesHovered(false)}>
                <Text style={isEpisodesHovered ? styles.buttonTextHovered : styles.buttonText}>Episodes</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
      {<Episodes show={showEpisodes} movieId={movieId} setShowModal={setShowEpisodes} />}
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
