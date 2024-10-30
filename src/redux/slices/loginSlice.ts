import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { loginUser } from '../thunks/login'
import { AxiosError } from 'axios'
import axios from 'axios';

interface LoginState {
    username?: string,
    password?: string,
    access_token?: string,
    expires_in: number, // seconds
    refresh_expires_in: number, // seconds
    refresh_token: string,
    token_type: string,
    loggedIn: boolean,
    isLoading: boolean,
    error: unknown,
}

type LoginData = Partial<LoginState>;

  // Define the initial state using that type
const initialState: LoginState = {
    username: undefined,
    password: undefined,
    access_token: undefined,
    expires_in: 0, // seconds
    refresh_expires_in: 0, // seconds
    refresh_token: 'not_set',
    token_type: '',
    loggedIn: false,
    isLoading: false,
    error: undefined,
}

export const loginSlice = createSlice({
    name: 'login',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        updateLoginData: (state, action: PayloadAction<LoginData>) => {
            return {
                ...state,
                ...action.payload,
            }
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.fulfilled, (state, action) => {
            axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.access_token}`;

            return {
                ...state,
                ...action.payload,
                error: undefined,
                loggedIn: true,
                isLoading: false
            }
        })
        .addCase(loginUser.pending, (state, action) => {
            return {
                ...state,
                loggedIn: false,
                error: undefined,
                isLoading: true
            }
        })
        .addCase(loginUser.rejected, (state, action) => {
            const error = (action.payload as AxiosError);
            return {
                ...state,
                loggedIn: false,
                isLoading: false,
                access_token: undefined,
                refresh_token: undefined,
                error: error.message
            }
        })
    }
  })
  
export const { updateLoginData } = loginSlice.actions
  
// Other code such as selectors can use the imported `RootState` type
export const selectAccessToken = (state: RootState) => state.login.access_token;
export const selectRefreshToken = (state: RootState) => state.login.refresh_token;
export const selectLoggedIn = (state: RootState) => state.login.loggedIn;

export default loginSlice.reducer;
