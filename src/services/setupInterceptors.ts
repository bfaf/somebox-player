import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from './api';
import {DEFAULT_BASE_URL} from '../constants';
import {Platform} from 'react-native';

export const createAxiosResponseInterceptor = () => {
  axiosInstance.interceptors.request.use(
    async config => {
      const url = config?.url || '';
      const isRefreshTokenUrl = url.indexOf('refreshToken') > 0;
      const isLoginUrl = url.indexOf('login') > 0;
      if (!isRefreshTokenUrl && !isLoginUrl) {
        const accessToken = await AsyncStorage.getItem('SOMEBOX_ACCESS_TOKEN');
        if (accessToken != null) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
      }

      if (Platform.OS !== 'web') {
        config.baseURL =
          (await AsyncStorage.getItem('SOMEBOX_BASE_URL_ADDRESS')) ||
          DEFAULT_BASE_URL;
      } else {
        config.baseURL = '/api/v1';
      }

      return config;
    },
    error => Promise.reject(error),
  );
  const interceptor = axiosInstance.interceptors.response.use(
    response => Promise.resolve(response),
    async error => {
      console.log('Error from interceptor: ', JSON.stringify(error, null, 2));
      const originalConfig = error.config;

      if (error.response == null) {
        return Promise.reject(error);
      }

      // Reject promise if usual error
      if (error.response.status !== 401) {
        return Promise.reject(error);
      }

      /*
       * When response code is 401, try to refresh the token.
       * Eject the interceptor so it doesn't loop in case
       * token refresh causes the 401 response.
       *
       * Must be re-attached later on or the token refresh will only happen once
       */
      axiosInstance.interceptors.response.eject(interceptor);

      if (originalConfig != null && !originalConfig._retry) {
        originalConfig._retry = true;
      }

      try {
        const refreshToken = await AsyncStorage.getItem(
          'SOMEBOX_REFRESH_TOKEN',
        );
        if (refreshToken != null) {
          const baseURL = await AsyncStorage.getItem(
            'SOMEBOX_BASE_URL_ADDRESS',
          );
          const response = await axiosInstance.post(
            `${baseURL}/refreshToken`,
            {
              refreshToken,
            },
            {
              headers: {
                Authorization: undefined,
              },
            },
          );

          const {access_token, refresh_token} = response.data;
          originalConfig.headers['Authorization'] = `Bearer ${access_token}`;

          await AsyncStorage.setItem('SOMEBOX_ACCESS_TOKEN', access_token);
          await AsyncStorage.setItem('SOMEBOX_REFRESH_TOKEN', refresh_token);

          return axiosInstance(originalConfig);
        }
      } catch (err) {
        return Promise.reject(err);
      } finally {
        createAxiosResponseInterceptor();
      }
    },
  );
};
