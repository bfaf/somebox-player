import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../services/api';

type UserLogin = {
    username: string;
    password: string;
}

export const loginUser = createAsyncThunk(
    'login/loginUser',
    async (value: UserLogin, { fulfillWithValue, rejectWithValue }) => { 
        try {
            // consider using react-native-keychain package to store username and password
            // https://oblador.github.io/react-native-keychain/docs/usage
            await AsyncStorage.removeItem("SOMEBOX_ACCESS_TOKEN");
            await AsyncStorage.removeItem("SOMEBOX_REFRESH_TOKEN");
            const res = await api.post('/login', { ...value });
            await AsyncStorage.setItem("SOMEBOX_ACCESS_TOKEN", res.data.access_token);
            await AsyncStorage.setItem("SOMEBOX_REFRESH_TOKEN", res.data.refresh_token);
            await AsyncStorage.setItem("SOMEBOX_LOGIN_TIMESTAMP", Date.now().toString());

            await AsyncStorage.setItem("SOMEBOX_USERNAME", value.username);
            await AsyncStorage.setItem("SOMEBOX_PASSWORD", value.password);

            return fulfillWithValue(res.data);
        } catch (err) {
            return rejectWithValue(err);
        }
    },
);

export const refreshAccessToken = createAsyncThunk(
    'login/refreshAccessToken',
    async (_, { fulfillWithValue, rejectWithValue }) => {
        try {
            const refreshToken = await AsyncStorage.getItem("SOMEBOX_REFRESH_TOKEN");
            const res = await api.post('/refreshToken', { refreshToken }, {
                headers: {
                    'Authorization': undefined
                }
            });
            await AsyncStorage.setItem("SOMEBOX_ACCESS_TOKEN", res.data.access_token);
            await AsyncStorage.setItem("SOMEBOX_REFRESH_TOKEN", res.data.refresh_token);
            await AsyncStorage.setItem("SOMEBOX_LOGIN_TIMESTAMP", Date.now().toString());

            return fulfillWithValue(res.data);
        } catch (err) {
            return rejectWithValue(err);
        }
    },
);
