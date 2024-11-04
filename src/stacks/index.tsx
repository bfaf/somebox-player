import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './login';
import LoggedInStack from './loggedInStack';

const Stack = createNativeStackNavigator();

const SomeBoxPlayerStack = (): React.JSX.Element => {
    return (
      <Stack.Navigator id="LoginNav" screenOptions={{
        headerBackVisible: false,
        headerShown: false,
      }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="LoggedInStack" component={LoggedInStack} />
      </Stack.Navigator>
    );
  }

export default SomeBoxPlayerStack;