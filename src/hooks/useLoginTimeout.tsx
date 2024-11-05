import {useEffect, useRef} from 'react';
import {loginUser, refreshAccessToken} from '../redux/thunks/login';
import {AppDispatch} from '../redux/store';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {selectRefreshTokenExpiresIn} from '../redux/slices/loginSlice';

export const useLoginTimeout = () => {
  const appState = useRef(AppState.currentState);
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();
  const refreshTokenExpiresIn = useSelector(selectRefreshTokenExpiresIn);

  useEffect(() => {
    const verifyTimeout = async () => {
      const loginTimestamp =
        (await AsyncStorage.getItem('SOMEBOX_LOGIN_TIMESTAMP')) || '0';
      const loginTime = Number.parseInt(loginTimestamp);
      if (Date.now() - loginTime < refreshTokenExpiresIn * 1000) {
        dispatch(refreshAccessToken());
      } else {
        const username = await AsyncStorage.getItem('SOMEBOX_USERNAME');
        const password = await AsyncStorage.getItem('SOMEBOX_PASSWORD');
        if (username != null && password != null) {
          await dispatch(loginUser({username, password}));
        } else {
          throw new Error(
            'Cannot read username or password from storage. Please restart the app.',
          );
        }
      }
    };
    const appStateSubscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          await verifyTimeout();
        }

        appState.current = nextAppState;
      },
    );
    const navigationSubscribtion = navigation.addListener(
      'focus',
      async (_e: any) => {
        await verifyTimeout();
      },
    );

    return () => {
      navigationSubscribtion();
      appStateSubscription.remove();
    };
  }, [navigation, refreshTokenExpiresIn]);
};
