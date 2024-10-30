import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

type UserLogin = {
    username: string;
    password: string;
}

export const loginUser = createAsyncThunk(
    'login/loginUser',
    async (value: UserLogin, { rejectWithValue }) => {
        try {
            const res = await axios.post('http://192.168.1.9:8080/api/v1/login', { ...value });
            return res.data;
        } catch (err) {
            return rejectWithValue(err);
        }
    },
);
