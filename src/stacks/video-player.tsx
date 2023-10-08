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
  // const [eventName, setEventName] = useState<string>('');
  const [buffering, SetBuffering] = useState<any>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentTimeInSeconds, setCurrentTimeInSeconds] = useState<number>(0);
  const [readyToDisplay, setReadyToDisplay] = useState<boolean>(false);

  let player: any = useRef();
  const myTVEventHandler = (evt: HWEvent) => {
    // setEventName(evt.eventType);
    const type = evt.eventType;
    if (type === 'pause') {
      setIsPaused(true);
    } else if (type === 'play') {
      setIsPaused(false);
    } else if (type === 'fastForward') {
      ToastAndroid.show('+10', ToastAndroid.SHORT);
      player.current.seek(currentTimeInSeconds + 10);
    } else if (type === 'rewind') {
      ToastAndroid.show('-10', ToastAndroid.SHORT);
      player.current.seek(currentTimeInSeconds - 10);
    }
  };

  if (Platform.isTV) {
    useTVEventHandler(myTVEventHandler);
  }

  const onBuffer = (isBuffering: any) => {
    console.log(`Buffering: ${isBuffering}`);
    SetBuffering(isBuffering);
  }

  const onVideoError = (error: any) => {
    console.log(`Error: ${JSON.stringify(error, null, 2)}`);
  }

  const onProgress = (data: any ): void => {
    setCurrentTimeInSeconds(data.currentTime);
  };

  const onLoad = () => {
    setReadyToDisplay(true);
  }

  const onReadyForDisplay = () => {
    setReadyToDisplay(true);
  }

  /*
  if (!readyToDisplay) {
    return (<ActivityIndicator size="large" />);
  }
  */
  

  return (
    <SafeAreaView>
      <View>
        <Video source={{ uri: `http://192.168.1.9:8080/api/v1/play/${videoId}` }}   // Can be a URL or a local file.
          fullscreen={true}
          resizeMode="cover"
          paused={isPaused}
          onBuffer={onBuffer}
          onError={onVideoError}
          ref={player}
          onProgress={onProgress}
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
