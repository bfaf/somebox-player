/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import SomeBoxPlayerStack from './src/stacks';
import { NavigationContainer } from '@react-navigation/native';

function App(): React.JSX.Element {

  return (
    <NavigationContainer>
      <SomeBoxPlayerStack />
    </NavigationContainer>
  );
}

export default App;
