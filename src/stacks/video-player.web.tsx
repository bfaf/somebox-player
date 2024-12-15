import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Pressable,
  Text,
} from 'react-native';
import Debug from '../components/debug';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { selectMovieById, selectSeriesById } from '../redux/slices/moviesSlice';
import { useLoaderData } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { useLoginTimeout } from '../hooks/useLoginTimeout';
import { OnProgressProps } from 'react-player/base';
import { updateMovieContinueTime } from '../redux/thunks/movies';

type LoaderData = {
  videoId: number;
  seriesId: number | undefined;
  continue: boolean;
};

export const videoLoader = ({ params }: { params: any }): LoaderData => {
  return { videoId: params.videoId, seriesId: params.seriesId, continue: params.continue === 'true' };
};

const VideoPlayer = () => {
  const urlData = useLoaderData() as LoaderData;
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [videoError, setVideoError] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [baseURL, setBaseURL] = useState<string>('');
  const [hasSeeked, setHasSeeked] = useState<boolean>(false);
  const [secondsPassed, setSecondsPassed] = useState<number>(5);
  const [showSkipIntro, setShowSkipIntro] = useState<boolean>(false);
  const [playNextEpisode, setPlayNextEpisode] = useState<boolean>(false);
  const [skipIntroHovered, setSkipIntroHovered] = useState<boolean>(false);
  const movieId = Number.parseInt(`${urlData.videoId}`, 10);
  const seriesId = Number.parseInt(`${urlData?.seriesId}`, 10) || 0;
  const movieData = useSelector((state: RootState) =>
    selectMovieById(state, movieId),
  );
  const seriesData = movieData!.moviesSeries?.find(s => s.id === seriesId);
  let player = useRef<ReactPlayer>();
  const ref = (plyr: ReactPlayer) => {
    player.current = plyr;
  };

  const getEpisode = (filename: string): number => {
    const currentEpisodeString = filename.split('-')[1];

    return Number(currentEpisodeString.substring(1));
  };

  const findNextEpisode = () => {
    const currentEpisode = getEpisode(seriesData!.filename);
    const nextEpisode = movieData?.moviesSeries?.find(m => {
      const episode = getEpisode(m.filename);
      if ((currentEpisode + 1) === episode) {
        return m;
      }
    });

    return nextEpisode;
  };
  const nextEpisode = findNextEpisode();

  // TODO: Make this global for all components
  useLoginTimeout();

  const onVideoError = (error: any) => {
    let err: string;
    if (typeof error === 'object') {
      err = JSON.stringify(error, null, 2);
    } else {
      err = error;
    }
    console.error(error);
    setVideoError(
      `Error occured during playback. Please press OK and try to play the movie again. Error:\n ${err}`,
    );
  };

  useEffect(() => {
    const getAccessToken = async () => {
      const accToken = await AsyncStorage.getItem('SOMEBOX_ACCESS_TOKEN');
      const bURL = await AsyncStorage.getItem('SOMEBOX_BASE_URL_ADDRESS');
      if (accToken != null && bURL != null) {
        setAccessToken(accToken);
        setBaseURL(bURL);
      } else {
        setVideoError(
          'Cannot read access token from storage. Please restart the app',
        );
      }
    };
    getAccessToken();

    return () => {
      setAccessToken('');
    };
  }, [dispatch, setAccessToken, setVideoError]);

  if (videoError != null) {
    return <Debug data={videoError} />;
  }

  if (accessToken.length === 0 && baseURL.length === 0) {
    return <ActivityIndicator size="large" />;
  }

  const onProgress = (state: OnProgressProps) => {
    if (playNextEpisode) {
      setSecondsPassed(secondsPassed - 1);
    }

    const startFrom = Number(state.playedSeconds.toFixed(3)) * 1000;
    dispatch(updateMovieContinueTime({ movieId: movieData?.movieId || 0, seriesId: seriesId, time: startFrom }));

    const wholeSeconds = Number(state.playedSeconds.toFixed());
    if (seriesId > 0) {
      // console.log('seriesData', seriesData);
      // console.log('wholeSeconds >= seriesData!.introTime', wholeSeconds >= seriesData!.introTime);
      // console.log('(seriesData!.introTime + 2)', (seriesData!.introTime + 2));
      // console.log('wholeSeconds <= (seriesData!.introTime + 2)', wholeSeconds <= (seriesData!.introTime + 2));
      if (wholeSeconds >= seriesData!.introTime && wholeSeconds <= (seriesData!.introTime + 10)) {
        setShowSkipIntro(true);
      }
      if (wholeSeconds >= (seriesData!.introTime + 15)) {
        setShowSkipIntro(false);
      }
      if (nextEpisode != null && wholeSeconds >= seriesData!.creditsTime) {
        setPlayNextEpisode(true);
      }
      if (nextEpisode && secondsPassed <= 0) {
        navigate(`/video/${movieId}/${nextEpisode.id}/false`);
      }
    }
  };

  const onReady = (playerInstance: ReactPlayer) => {
    const startFrom = movieData?.moviesContinue?.startFrom || 0;
    if (urlData.continue && !hasSeeked && startFrom > 0) {
      const convertedToSeconds = startFrom / 1000;
      playerInstance.seekTo(convertedToSeconds, 'seconds');
      setHasSeeked(true);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.backgroundVideo}>
        <ReactPlayer
          url={`${baseURL}/web/play/${urlData.videoId}?seriesId=${seriesId}&t=${accessToken}`}
          ref={ref}
          controls={true}
          width="100%"
          height="100%"
          onEnded={() => navigate('/list')}
          onError={onVideoError}
          onProgress={onProgress}
          onReady={onReady}
          progressInterval={1 * 1000}
          playing={true}
          muted={false}
        />
      </View>
      {showSkipIntro && (
        <Pressable style={skipIntroHovered ? [styles.buttonHovered, styles.skipIntro] : [styles.button, styles.skipIntro]} key="skipIntro" onPress={() => { setShowSkipIntro(false); player.current!.seekTo(Number(seriesData!.skipIntroSeconds), 'seconds'); }} onHoverIn={() => setSkipIntroHovered(true)} onHoverOut={() => setSkipIntroHovered(false)}>
          <Text style={skipIntroHovered ? styles.buttonTextHovered : styles.buttonText}>Skip intro</Text>
        </Pressable>
      )}
      {playNextEpisode && (
        <Pressable style={skipIntroHovered ? [styles.buttonHovered, styles.skipIntro] : [styles.button, styles.skipIntro]} key="nextEpisode" onPress={() => { setShowSkipIntro(false); player.current!.seekTo(Number(seriesData!.skipIntroSeconds), 'seconds'); }} onHoverIn={() => setSkipIntroHovered(true)} onHoverOut={() => setSkipIntroHovered(false)}>
          <Text style={skipIntroHovered ? styles.buttonTextHovered : styles.buttonText}>Next episode in {secondsPassed} seconds</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
  skipIntro: {
    position: 'absolute',
    bottom: 64,
    right: 64,
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

export default VideoPlayer;
