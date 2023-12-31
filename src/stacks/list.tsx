/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ActivityIndicator, AppBar, HStack, VStack, IconButton } from "@react-native-material/core";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisVertical, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Dimensions,
  useTVEventHandler,
  HWEvent,
  Platform
} from 'react-native';


import { SomeBoxFileInfo } from '../constants';


function List(): JSX.Element {
  const navigation = useNavigation();
  const [eventName, setEventName] = useState<string>('');
  const [movies, setMovies] = useState();
  const [errorMessage, setErrorMessage] = useState<any>('');
  const [micStatus, setMicStatus] = useState();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const m = await axios.get('http://192.168.1.9:8080/api/v1/list');
        setMovies(m.data);
        // const m = await axios.get('http://192.168.1.9:8080/api/v1/list');
        // setMicStatus(m.data);
      } catch (err) {
        setErrorMessage(err);
        // console.error(err);
      }
    };
    fetchMovies();
  }, []);

  const myTVEventHandler = (evt: HWEvent) => {
    // console.log(`EventType: ${evt.eventType}`);
    setEventName(evt.eventType);
    // setLastEventType(evt.eventType);
  };

  if (Platform.isTV) {
    useTVEventHandler(myTVEventHandler);
  }

  if (micStatus) {
    return (<View><Text style={{color: 'black'}}>Mic status is {JSON.stringify(micStatus, null, 2)}</Text></View>);
  }

  if (errorMessage) {
    return (<View><Text style={{color: 'black'}}>{JSON.stringify(errorMessage)}</Text></View>);
  }

  if (!movies || movies.length == 0) {
    return (<ActivityIndicator size="large" />);
  }
  // VStack
  const renderMovies = () => {
    const rows = [];

    for (let i = 0; i < movies.length; i+=4)
    {
      rows.push(movies.slice(i, i + 4))
    }
    
    return (
      <VStack style={{ marginTop: 0, marginLeft: 'auto', marginRight: 'auto', width: '83%'}}>
        {rows.map((row, idx) => <HStack m={30} spacing={8} key={idx}>
          {row.map((r: SomeBoxFileInfo) =>
            <View key={r.id}>
              <TouchableOpacity key={r.id} onPress={() => navigation.navigate('Player', { videoId: r.id })} >
                <Image source={{ uri: `http://192.168.1.9:8080/api/v1/image/${r.id}` }} style={{ width: 180, height: 101 }} />
                <Text numberOfLines={1} style={{fontSize: 14, width: 180, color: 'grey'}}>{r.filename}</Text>
              </TouchableOpacity>
            </View>
          )}
        </HStack>)}
      </VStack>
    );
    
  };

  return (
    <SafeAreaView>
      <View>
        <AppBar
          title="SomeBox Player"
          style={{marginBottom: 0, paddingBottom: 0}}
          trailing={props => (
            <HStack>
              <IconButton
                icon={props => <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: 'white' }} />}
                {...props}
              />
              <IconButton
                icon={props => <FontAwesomeIcon icon={faEllipsisVertical} style={{ color: 'white' }} />}
                {...props}
              />
            </HStack>
          )}
        />
      </View>
      
      <ScrollView>
        {renderMovies()}
      </ScrollView>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  backgroundVideo: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
});

export default List;
