import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { loginUser } from '../redux/thunks/login';
import { useNavigation } from '@react-navigation/native';
import { selectLoggedIn } from '../redux/slices/loginSlice';

const Login = (): JSX.Element => {
    const dispatch: AppDispatch = useDispatch();
    const navigation = useNavigation();
    const isLoggedIn = useSelector(selectLoggedIn);

    const login = async () => {
        // load user and password from storage
        await dispatch(loginUser({ username: 'somebox-dev', password: 'somebox-dev' }));
    };

    useEffect(() => {
        login();
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            navigation.navigate('LoggedInStack');
        }
    }, [isLoggedIn]);

    return (<></>);
};

export default Login;