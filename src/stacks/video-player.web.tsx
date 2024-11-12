import React, { useState, useEffect } from 'react';
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

export const videoLoader = ({ params }: { params: any }) => {
  return params.videoId;
};

const VideoPlayer = () => {
  const videoId = useLoaderData();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [videoError, setVideoError] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [baseURL, setBaseURL] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const movieData = useSelector((state: RootState) =>
    selectMovieById(state, Number.parseInt(`${videoId}`, 10)),
  );

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

  return (
    <SafeAreaView>
      <View style={styles.backgroundVideo}>
        <ReactPlayer
          url={`${baseURL}/web/play/${videoId}`}
          controls={true}
          width="100%"
          height="100%"
          onEnded={() => navigate('/list')}
          onError={onVideoError}
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
