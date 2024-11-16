import { useDispatch, useSelector } from 'react-redux';
import { selectRefreshTokenExpiresIn } from '../redux/slices/loginSlice';
import { AppDispatch } from '../redux/store';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, refreshAccessToken } from '../redux/thunks/login';
import { useLocation } from 'react-router-dom';

export const useLoginTimeout = () => {
  const dispatch: AppDispatch = useDispatch();
  const refreshTokenExpiresIn = useSelector(selectRefreshTokenExpiresIn);
  const location = useLocation();

  useEffect(() => {
    const verifyTimeout = async () => {
      const loginTimestamp =
        (await AsyncStorage.getItem('SOMEBOX_LOGIN_TIMESTAMP')) || '0';
      const loginTime = Number.parseInt(loginTimestamp, 10);
      if (Date.now() - loginTime < refreshTokenExpiresIn * 1000) {
        // Refresh the token if 30 seconds passed since last refresh
        if (Date.now() - loginTime > 30 * 1000) {
          dispatch(refreshAccessToken());
        }
      } else {
        const username = await AsyncStorage.getItem('SOMEBOX_USERNAME');
        const password = await AsyncStorage.getItem('SOMEBOX_PASSWORD');
        if (username != null && password != null) {
          await dispatch(loginUser({ username, password }));
        } else {
          throw new Error(
            'Cannot read username or password from storage. Please restart the app.',
          );
        }
      }
    };
    verifyTimeout();
  }, [location.pathname, refreshTokenExpiresIn, dispatch]);
};
