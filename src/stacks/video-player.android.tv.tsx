import React, {useState, useRef, useEffect} from 'react';
import Video from 'react-native-media-console';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  useTVEventHandler,
  HWEvent,
  Platform,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Debug from '../components/debug';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../redux/store';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInStackParamList} from './loggedInStack';
import {selectMovieById} from '../redux/slices/moviesSlice';
import {OnProgressData, OnVideoErrorData} from 'react-native-video';

type VideoPlayerProps = NativeStackScreenProps<
  LoggedInStackParamList,
  'Player'
>;

const VideoPlayer = ({route}: VideoPlayerProps) => {
  const {videoId} = route?.params;
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentTimeInSeconds, setCurrentTimeInSeconds] = useState<number>(0);
  const [videoError, setVideoError] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [baseURL, setBaseURL] = useState<string>('');
  const movieData = useSelector((state: RootState) =>
    selectMovieById(state, videoId),
  );

  let player: any = useRef();
  const myTVEventHandler = (evt: HWEvent) => {
    const type = evt.eventType;
    if (type === 'pause') {
      setIsPaused(true);
    } else if (type === 'play') {
      setIsPaused(false);
    } else if (type === 'fastForward') {
      player.current.seek(currentTimeInSeconds + 15);
    } else if (type === 'rewind') {
      player.current.seek(currentTimeInSeconds - 15);
    }
  };

  if (Platform.isTV) {
    useTVEventHandler(myTVEventHandler);
  }

  const onVideoError = (error: OnVideoErrorData) => {
    setVideoError(
      `Error occured during playback. Please press OK and try to play the movie again. Error:\n ${error.error.errorString}`,
    );
  };

  const onProgress = (data: OnProgressData): void => {
    setCurrentTimeInSeconds(data.currentTime);
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

  if (videoError != null) {
    return <Debug data={videoError} />;
  }

  if (accessToken.length === 0 && baseURL.length === 0) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <SafeAreaView>
      <View style={styles.backgroundVideo}>
        <Video
          source={{
            uri: `${baseURL}/play/${videoId}`,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }}
          resizeMode="cover"
          paused={isPaused}
          onError={onVideoError}
          videoRef={player}
          onProgress={onProgress}
          repeat={false}
          onEnd={() => navigation.goBack()}
          style={styles.backgroundVideo}
          navigator={navigation}
          showTimeRemaining={true}
          showHours={true}
          disableVolume={true}
          disableFullscreen={true}
          controlTimeoutDelay={5 * 1000}
          title={movieData?.name}
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
