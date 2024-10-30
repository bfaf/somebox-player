import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { loginUser } from '../redux/thunks/login';
import { useNavigation } from '@react-navigation/native';
import { selectLoggedIn, selectRefreshToken, updateLoginData } from '../redux/slices/loginSlice';

const Login = (): JSX.Element => {
    const dispatch: AppDispatch = useDispatch();
    const navigation = useNavigation();
    const refreshToken = useSelector((state: RootState) => selectRefreshToken(state));
    const isLoggedIn = useSelector(selectLoggedIn);

    const createAxiosResponseInterceptor = () => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
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
                axios.interceptors.response.eject(interceptor);

                return axios
                    .post("http://192.168.1.9:8080/api/v1/refreshToken", {
                        refreshToken,
                    })
                    .then((response) => {
                        // saveToken();
                        error.response.config.headers["Authorization"] =
                            "Bearer " + response.data.access_token;
                        // Retry the initial call, but with the updated token in the headers. 
                        // Resolves the promise if successful
                        dispatch(updateLoginData(response.data));
                        return axios(error.response.config);
                    })
                    .catch((error2) => {
                        // Retry failed, clean up and reject the promise
                        // destroyToken();
                        // this.router.push("/login"); need the navigation stack for this
                        return Promise.reject(error2);
                    })
                    .finally(createAxiosResponseInterceptor); // Re-attach the interceptor by running the method
            }
        );
    }

    const login = async () => {
        await dispatch(loginUser({ username: 'somebox-dev', password: 'somebox-dev' }));
    };

    const refreshAccessToken = async (refreshToken) => {
        try {
            const response = await axios.post("http://192.168.1.9:8080/api/v1/refreshToken", {
                refreshToken,
            });
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
            dispatch(updateLoginData(response.data));
        } catch (error) {
            console.error('Cannot refresh token', error);
        }
    };

    useEffect(() => {
        login();
        createAxiosResponseInterceptor();
    }, []);

    useEffect(() => {
        const refreshInterval = setInterval(() => refreshAccessToken(refreshToken), ((4 * 60) * 1000));
        return () => {
            clearInterval(refreshInterval);
        }
    }, [refreshToken]);

    useEffect(() => {
        if (isLoggedIn) {
            navigation.navigate('LoggedInStack');
        }
    }, [isLoggedIn]);

    return (<></>);
};

export default Login;