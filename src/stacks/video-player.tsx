import React, { useState, useRef, useEffect, useMemo } from 'react';
import Video from 'react-native-video';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  useTVEventHandler,
  HWEvent,
  Platform,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';

const bufferConfig = {
  minBufferMs: 10000,
  maxBufferMs: 30000,
  bufferForPlaybackMs: 2500,
  bufferForPlaybackAfterRebufferMs: 5000
};

const VideoPlayer = ({ route }) => {
  const { videoId } = route?.params;
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentTimeInSeconds, setCurrentTimeInSeconds] = useState<number>(0);
  const [downPressedTimes, setDownPressedTimes] = useState<number>(0);
  const [audioTrack, setAudioTrack] = useState<number>(0);
  
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
    } else if (type === 'down') {
      console.log('Down pressed');
      setDownPressedTimes(downPressedTimes + 1);
      if (downPressedTimes > 0) {
        console.log('Switching audio track');
        setAudioTrack(audioTrack + 1);
        setDownPressedTimes(0);
      }
      if (audioTrack >= 3) {
        console.log('RESETING audio track');
        setAudioTrack(0);
      }
    }
  };

  if (Platform.isTV) {
    useTVEventHandler(myTVEventHandler);
  }

  const onVideoError = (error: any) => {
    console.log(`Error: ${JSON.stringify(error, null, 2)}`);
  }

  const onProgress = (data: any ): void => {
    setCurrentTimeInSeconds(data.currentTime);
  };

  const onLoad = (data) => console.log(JSON.stringify(data, null, 2));

  return (
    <SafeAreaView>
      <View>
        <Video source={{ uri: `http://192.168.1.9:8080/api/v1/play/${videoId}` }}   // Can be a URL or a local file.
          fullscreen={true}
          resizeMode="cover"
          paused={isPaused}
          onError={onVideoError}
          ref={player}
          onProgress={onProgress}
          repeat={true}
          selectedAudioTrack={{
            type: 'index',
            value: audioTrack
          }}
          onLoad={onLoad}
          style={styles.backgroundVideo} />
          {/* <Text style={{ position: 'absolute', top: 300, left: 300, zIndex: 10000, fontSize: 20, color: 'white', backgroundColor: 'red'}}>Buffering: {buffering}</Text>*/}
      </View>
      <View>
          <TouchableOpacity><Text>Some item to navigate 1</Text></TouchableOpacity>
          <TouchableOpacity><Text>Some item to navigate 2</Text></TouchableOpacity>
      </View>
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
