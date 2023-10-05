import React, { useState } from 'react';
import Video from 'react-native-video';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Dimensions,
    useTVEventHandler,
    HWEvent,
    Platform,
    Text
  } from 'react-native';

const VideoPlayer = ({ route }) => {
    const { videoId } = route?.params;
    const [eventName, setEventName] = useState<string>('');
    const myTVEventHandler = (evt: HWEvent) => {
        // console.log(`EventType: ${evt.eventType}`);
        setEventName(evt.eventType);
        // setLastEventType(evt.eventType);
      };
    
      if (Platform.isTV) {
        useTVEventHandler(myTVEventHandler);
      }

    return (
        <SafeAreaView>
          <View>
              <Text style={{ position: 'absolute', top: 20, left: 20, color: 'white', fontSize: 20}}>Event: {eventName}</Text>
            </View>
            <View>
                <Video source={{uri: `http://192.168.1.9:8080/api/v1/play/${videoId}`}}   // Can be a URL or a local file.
                    fullscreen={true}
                    resizeMode="cover"
                    paused={false}
                    controls={true}
                    style={styles.backgroundVideo} />
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
