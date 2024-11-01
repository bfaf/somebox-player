import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store';
import { loginUser, refreshAccessToken } from '../thunks/login';
import { AxiosError } from 'axios';

interface LoginState {
    username?: string,
    password?: string,
    loggedIn: boolean,
    isLoading: boolean,
    isLoginPerformed: boolean,
    error: unknown,
}

// Define the initial state using that type
const initialState: LoginState = {
    username: undefined,
    password: undefined,
    loggedIn: false,
    isLoading: false,
    isLoginPerformed: false,
    error: undefined,
}

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(loginUser.fulfilled, (state, action) => {
            return {
                ...state,
                error: undefined,
                loggedIn: true,
                isLoading: false,
                isLoginPerformed: true
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
            const error = (action.payload as AxiosError);
            return {
                ...state,
                loggedIn: false,
                isLoading: false,
                error: error.message,
                isLoginPerformed: true
            }
        })
        // Don't know whether to catch this...
        // .addCase(refreshAccessToken.rejected, (state, action) => {
        //     return {
        //         ...state,
        //         error: undefined,
        //         loggedIn: true,
        //         isLoading: false,
        //         isLoginPerformed: true
        //     }
        // })
    }
  });
  
// export const {  } = loginSlice.actions
  
// Other code such as selectors can use the imported `RootState` type
export const selectLoggedIn = (state: RootState) => state.login.loggedIn;
export const selectIsLoginPerformed = (state: RootState) => state.login.isLoginPerformed;

export default loginSlice.reducer;
