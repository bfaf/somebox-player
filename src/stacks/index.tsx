import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import List from './list';
import VideoPlayer from './video-player';

const Stack = createNativeStackNavigator();

const SomeBoxPlayerStack = () => {
    return (
      <Stack.Navigator screenOptions={{
        headerBackVisible: false,
        headerShown: false,
      }}>
        <Stack.Screen name="List" component={List}  />
        <Stack.Screen name="Player" component={VideoPlayer} />
      </Stack.Navigator>
    );
  }

export default SomeBoxPlayerStack;