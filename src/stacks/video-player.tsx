import React, { useState, useRef, useEffect } from 'react';
import Video from 'react-native-video';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  useTVEventHandler,
  HWEvent,
  Platform,
  ToastAndroid,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Debug from '../components/debug';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { useLoginTimeout } from '../hooks/useLoginTimeout';

const VideoPlayer = ({ route }) => {
  const { videoId } = route?.params;
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentTimeInSeconds, setCurrentTimeInSeconds] = useState<number>(0);
  const [videoError, setVideoError] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>(undefined);
  const [baseURL, setBaseURL] = useState<string>(undefined);

  let player: any = useRef();
  const myTVEventHandler = (evt: HWEvent) => {
    const type = evt.eventType;
    if (type === 'pause') {
      setIsPaused(true);
    } else if (type === 'play') {
      setIsPaused(false);
    } else if (type === 'fastForward') {
      ToastAndroid.showWithGravity('+10', ToastAndroid.SHORT, ToastAndroid.CENTER);
      player.current.seek(currentTimeInSeconds + 10);
    } else if (type === 'rewind') {
      ToastAndroid.showWithGravity('-10', ToastAndroid.SHORT, ToastAndroid.CENTER);
      player.current.seek(currentTimeInSeconds - 10);
    }
  };

  if (Platform.isTV) {
    useTVEventHandler(myTVEventHandler);
  }

  const onVideoError = (error: any) => {
    setVideoError('Error occured during playback. Please press OK and try to play the movie again.');
  }

  const onProgress = (data: any): void => {
    setCurrentTimeInSeconds(data.currentTime);
  };

  useEffect(() => {
    const getAccessToken = async () => {
      const accessToken = await AsyncStorage.getItem("SOMEBOX_ACCESS_TOKEN");
      const baseURL = await AsyncStorage.getItem("SOMEBOX_BASE_URL_ADDRESS");
      setAccessToken(accessToken);
      setBaseURL(baseURL);
    }
    getAccessToken();

    return () => {
      setAccessToken(undefined);
    }
  }, [dispatch, setAccessToken]);

  // useEffect(() => {
  //   const interval = setInterval(() => dispatch(refreshAccessToken()), (accessTokenExpiresIn - 10) * 1000);
  //   return () => clearInterval(interval);
  // }, [accessTokenExpiresIn]);

  // console.log((Date.now() - accessTokenTimestamp), ((accessTokenExpiresIn - 10) * 1000), ((Date.now() - accessTokenTimestamp) > (accessTokenExpiresIn - 10) * 1000));
  // // - 10 seconds just to have enough time to refresh the access token
  // if ((Date.now() - accessTokenTimestamp) > (accessTokenExpiresIn - 10) * 1000) {
  //   dispatch(refreshAccessToken());
  // }

  if (videoError != null) {
    return <Debug data={videoError} />
  }

  if (accessToken == null || baseURL == null) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <SafeAreaView>
      <View style={styles.backgroundVideo}>
        <Video source={{
          uri: `${baseURL}/play/${videoId}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
          }}
          resizeMode="cover"
          paused={isPaused}
          onError={onVideoError}
          ref={player}
          onProgress={onProgress}
          repeat={false}
          onEnd={() => navigation.goBack()}
          style={styles.backgroundVideo} />
        {/* <Text style={{ position: 'absolute', top: 300, left: 300, zIndex: 10000, fontSize: 20, color: 'white', backgroundColor: 'red'}}>Buffering: {buffering}</Text>*/}
      </View>
      {/* <View>
        <TouchableOpacity><Text>Some item to navigate 1</Text></TouchableOpacity>
        <TouchableOpacity><Text>Some item to navigate 2</Text></TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundVideo: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
});

export default VideoPlayer;
