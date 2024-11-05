import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import Login from './login';
import LoggedInStack from './loggedInStack';
import InitSettings from './initSettings';
import LoginSettings from './loginSettings';

export type RootStackParamList = {
  InitSettings: undefined;
  Login: undefined;
  LoggedInStack: undefined;
  LoginSettings: undefined;
};

export type LoginStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

const SomeBoxPlayerStack = (): React.JSX.Element => {
  return (
    <Stack.Navigator
      id="LoginNav"
      initialRouteName="InitSettings"
      screenOptions={{
        headerBackVisible: false,
        headerShown: false,
      }}>
      <Stack.Screen name="InitSettings" component={InitSettings} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="LoggedInStack" component={LoggedInStack} />
      <Stack.Screen name="LoginSettings" component={LoginSettings} />
    </Stack.Navigator>
  );
};

export default SomeBoxPlayerStack;
