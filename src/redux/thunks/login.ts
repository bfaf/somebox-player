import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../services/api';

type UserLogin = {
    username: string;
    password: string;
}

export const loginUser = createAsyncThunk(
    'login/loginUser',
    async (value: UserLogin, { rejectWithValue }) => {
        try {
            await AsyncStorage.removeItem("SOMEBOX_ACCESS_TOKEN");
            await AsyncStorage.removeItem("SOMEBOX_REFRESH_TOKEN");
            const res = await api.post('/login', { ...value });
            await AsyncStorage.setItem("SOMEBOX_ACCESS_TOKEN", res.data.access_token);
            await AsyncStorage.setItem("SOMEBOX_REFRESH_TOKEN", res.data.refresh_token);

            return res.data;
        } catch (err) {
            return rejectWithValue(err);
        }
    },
);
