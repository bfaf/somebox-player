/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import SomeBoxPlayerStack from './src/stacks';
import { Provider as StoreProvider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { setupStore } from './src/redux/store';
import { createAxiosResponseInterceptor } from './src/services/setupInterceptors';

createAxiosResponseInterceptor();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <StoreProvider store={setupStore()}>
        <SomeBoxPlayerStack />
      </StoreProvider>
    </NavigationContainer>
  );
}

export default App;
