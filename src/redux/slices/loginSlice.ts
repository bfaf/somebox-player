import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store';
import { loginUser, refreshAccessToken } from '../thunks/login';
import { AxiosError } from 'axios';

interface LoginState {
    loggedIn: boolean,
    isLoading: boolean,
    isLoginPerformed: boolean,
    refreshTokenExpiresIn: number;
    error: unknown,
}

// Define the initial state using that type
const initialState: LoginState = {
    loggedIn: false,
    isLoading: false,
    isLoginPerformed: false,
    refreshTokenExpiresIn: 300,
    error: undefined,
}

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        resetAccessTokenFreshness: (state) => {
            return {
                ...state,
                isAccessTokenRefreshed: false
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                const { refresh_expires_in } = action.payload;
                return {
                    ...state,
                    error: undefined,
                    loggedIn: true,
                    isLoading: false,
                    isLoginPerformed: true,
                    refreshTokenExpiresIn: refresh_expires_in
                }
            })
            .addCase(loginUser.pending, (state, action) => {
                return {
                    ...state,
                    loggedIn: false,
                    error: undefined,
                    isLoading: true,
                    isLoginPerformed: true
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                const error = action.payload && Object.keys(action.payload).length > 0 ? (action.payload as AxiosError) : { message: undefined };
                return {
                    ...state,
                    loggedIn: false,
                    isLoading: false,
                    error: error.message,
                    isLoginPerformed: false
                }
            })
            .addCase(refreshAccessToken.fulfilled, (state, action) => {
                const { refresh_expires_in } = action.payload;
                return {
                    ...state,
                    isAccessTokenRefreshed: true,
                    refreshTokenExpiresIn: refresh_expires_in
                }
            })
            .addCase(refreshAccessToken.pending, (state, action) => {
                return {
                    ...state,
                    error: undefined,
                    isAccessTokenRefreshed: false
                }
            })
            .addCase(refreshAccessToken.rejected, (state, action) => {
                const error = action.payload && Object.keys(action.payload).length > 0 ? (action.payload as AxiosError) : { message: undefined };
                return {
                    ...state,
                    isAccessTokenRefreshed: false,
                    error: error.message
                }
            })
    }
});

export const { resetAccessTokenFreshness } = loginSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectLoggedIn = (state: RootState) => state.login.loggedIn;
export const selectIsLoginPerformed = (state: RootState) => state.login.isLoginPerformed;
export const selectLoginError = (state: RootState) => state.login.error;
export const selectIsLoginLoading = (state: RootState) => state.login.isLoading;
export const selectRefreshTokenExpiresIn = (state: RootState) => state.login.refreshTokenExpiresIn;

export default loginSlice.reducer;
