import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
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
import { OnVideoErrorData } from 'react-native-video';
import { useLoaderData } from 'react-router-dom';
import ReactPlayer from 'react-player';

// { params: { videoId: number }}

export const videoLoader = (({ params }: { params: any }) => {
  return params.videoId;
});

// const Video = (props) => {
//   const attrs = {
//     src: props.source,
//     poster: props.poster,
//     controls: "controls"
//   }
//   const videoPlayer = document.createElement('video');
//   videoPlayer.setAttribute('src', props.source);
//   videoPlayer.setAttribute('src', props.source);
//   return document.createElement("video");
// }

// const originalFunc = XMLHttpRequest.prototype.setRequestHeader;
// XMLHttpRequest.prototype.setRequestHeader = (header, value) => {
//   console.log('setRequestHeader', header);
//   // originalFunc.call(this, header, value);
// };

const VideoPlayer = () => {
  const videoId = useLoaderData();
  console.log('videoId', videoId);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [videoError, setVideoError] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [baseURL, setBaseURL] = useState<string>('');
  const movieData = useSelector((state: RootState) =>
    selectMovieById(state, Number.parseInt(`${videoId}`)),
  );

  const onVideoError = (error: any) => {
    console.log('onVideoError', error);
    setVideoError(
      `Error occured during playback. Please press OK and try to play the movie again. Error:\n ${error}`,
    );
  };

  useEffect(() => {
    const getAccessToken = async () => {
      const accessToken = await AsyncStorage.getItem('SOMEBOX_ACCESS_TOKEN');
      const baseURL = await AsyncStorage.getItem('SOMEBOX_BASE_URL_ADDRESS');
      if (accessToken != null && baseURL != null) {
        setAccessToken(accessToken);
        setBaseURL(baseURL);
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
  }, [dispatch, setAccessToken]);

  // if (videoError != null) {
  //   return <Debug data={videoError} />;
  // }

  if (accessToken.length === 0 && baseURL.length === 0) {
    return <ActivityIndicator size="large" />;
  }

  console.log('NODE_ENV', process.env.NODE_ENV);

  // dev server
  // `http://localhost:3000/api/v1/web/play/${videoId}`

  return (
    <SafeAreaView>
      <View style={styles.backgroundVideo}>
        <ReactPlayer
          url={`http://localhost/api/v1/web/play/${videoId}`}
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
