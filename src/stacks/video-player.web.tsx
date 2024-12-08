import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Debug from '../components/debug';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { selectMovieById } from '../redux/slices/moviesSlice';
import { useLoaderData } from 'react-router-dom';
import ReactPlayer from 'react-player';
import { useLoginTimeout } from '../hooks/useLoginTimeout';
import { OnProgressProps } from 'react-player/base';
import { updateMovieContinueTime } from '../redux/thunks/movies';

type LoaderData = {
  videoId: number;
  continue: boolean;
};

export const videoLoader = ({ params }: { params: any }): LoaderData => {
  return { videoId: params.videoId, continue: params.continue === 'true' };
};

const VideoPlayer = () => {
  const urlData = useLoaderData() as LoaderData;
  console.log('data', urlData);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [videoError, setVideoError] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [baseURL, setBaseURL] = useState<string>('');
  const [hasSeeked, setHasSeeked] = useState<boolean>(false);
  const movieData = useSelector((state: RootState) =>
    selectMovieById(state, Number.parseInt(`${urlData.videoId}`, 10)),
  );
  let player = useRef<ReactPlayer>();
  const ref = (plyr: ReactPlayer) => {
    player.current = plyr;
  };


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
    const startFrom = Math.ceil(state.playedSeconds * 100000);
    dispatch(updateMovieContinueTime({ movieId: movieData?.movieId || 0, seriesId: 0, time: startFrom }));
  };

  const onReady = (playerInstance: ReactPlayer) => {
    const startFrom = movieData?.moviesContinue?.startFrom || 0;
    if (urlData.continue && !hasSeeked && startFrom > 0) {
      const convertedToSeconds = startFrom / 100000;
      playerInstance.seekTo(convertedToSeconds, 'seconds');
      setHasSeeked(true);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.backgroundVideo}>
        <ReactPlayer
          url={`${baseURL}/web/play/${urlData.videoId}?t=${accessToken}`}
          ref={ref}
          controls={true}
          width="100%"
          height="100%"
          onEnded={() => navigate('/list')}
          onError={onVideoError}
          onProgress={onProgress}
          onReady={onReady}
          progressInterval={10 * 1000}
          playing={true}
          muted={false}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
});

export default VideoPlayer;
