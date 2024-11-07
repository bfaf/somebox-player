import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import List from './list';
import VideoPlayer from './video-player.android.tv';
import {useLoginTimeout} from '../hooks/useLoginTimeout';

export type LoggedInStackParamList = {
  List: undefined;
  Player: {videoId: number};
};

export type LoggedInStackNavigationProp =
  NativeStackNavigationProp<LoggedInStackParamList>;

const Stack = createNativeStackNavigator<LoggedInStackParamList>();

const LoginRefresh = () => {
  useLoginTimeout();
  return <></>;
};

const LoggedInStack = () => {
  return (
    <Stack.Navigator
      id="AppNav"
      initialRouteName="List"
      screenOptions={{
        headerBackVisible: false,
        headerShown: false,
        headerTitle: () => <LoginRefresh />,
      }}>
      <Stack.Screen name="List" component={List} />
      <Stack.Screen name="Player" component={VideoPlayer} />
    </Stack.Navigator>
  );
};

export default LoggedInStack;
