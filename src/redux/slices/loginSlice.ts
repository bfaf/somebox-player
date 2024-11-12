import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { loginUser, refreshAccessToken } from '../thunks/login';
import { AxiosError } from 'axios';

const MAX_RETRY_ATTEMPTS = 3;
interface LoginState {
  loggedIn: boolean;
  isLoading: boolean;
  isLoginPerformed: boolean;
  refreshTokenExpiresIn: number;
  retryAttempts: number;
  error: string | undefined;
}

// Define the initial state using that type
const initialState: LoginState = {
  loggedIn: false,
  isLoading: false,
  isLoginPerformed: false,
  refreshTokenExpiresIn: 300,
  retryAttempts: 0,
  error: undefined,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        const { refresh_expires_in } = action.payload;
        return {
          ...state,
          error: undefined,
          loggedIn: true,
          isLoading: false,
          isLoginPerformed: true,
          refreshTokenExpiresIn: refresh_expires_in,
          retryAttempts: 0,
        };
      })
      .addCase(loginUser.pending, state => {
        if (state.retryAttempts >= MAX_RETRY_ATTEMPTS) {
          return {
            ...state,
            loggedIn: false,
            error: 'Unable to login. Please check your internet connection',
            isLoading: false,
            isLoginPerformed: true,
          };
        }
        return {
          ...state,
          loggedIn: false,
          error: undefined,
          isLoading: true,
          isLoginPerformed: true,
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        const error =
          action.payload && Object.keys(action.payload).length > 0
            ? (action.payload as AxiosError)
            : { message: undefined };
        return {
          ...state,
          loggedIn: false,
          isLoading: false,
          error: error.message,
          isLoginPerformed: false,
          retryAttempts: state.retryAttempts + 1,
        };
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        const { refresh_expires_in } = action.payload;
        return {
          ...state,
          isAccessTokenRefreshed: true,
          refreshTokenExpiresIn: refresh_expires_in,
          retryAttempts: 0,
        };
      })
      .addCase(refreshAccessToken.pending, state => {
        return {
          ...state,
          error: undefined,
          isAccessTokenRefreshed: false,
        };
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        if (state.retryAttempts >= MAX_RETRY_ATTEMPTS) {
          return {
            ...state,
            loggedIn: false,
            error:
              'Unable to refresh access token. Please restart the application',
            isLoading: false,
            isLoginPerformed: true,
          };
        }
        const error =
          action.payload && Object.keys(action.payload).length > 0
            ? (action.payload as AxiosError)
            : { message: undefined };
        return {
          ...state,
          isAccessTokenRefreshed: false,
          error: error.message,
          retryAttempts: state.retryAttempts + 1,
        };
      });
  },
});

// export const { resetAccessTokenFreshness } = loginSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectLoggedIn = (state: RootState) => state.login.loggedIn;
export const selectIsLoginPerformed = (state: RootState) =>
  state.login.isLoginPerformed;
export const selectLoginError = (state: RootState) => state.login.error;
export const selectIsLoginLoading = (state: RootState) => state.login.isLoading;
export const selectRefreshTokenExpiresIn = (state: RootState) =>
  state.login.refreshTokenExpiresIn;

export default loginSlice.reducer;
