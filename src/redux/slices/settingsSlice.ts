import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store';
import { initialConfig } from '../thunks/settings';

interface SettingsState {
    serverIp: string,
    baseUrl: string,
    isLoading: boolean,
    error: unknown,
};

const initialState: SettingsState = {
    serverIp: '',
    baseUrl: '',
    isLoading: true,
    error: undefined,
};

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
        .addCase(initialConfig.fulfilled, (state, action) => {
            const initialConfig = action.payload;
            return {
                ...state,
                serverIp: initialConfig.serverIp,
                baseUrl: initialConfig.baseUrl,
                isLoading: false,
                error: undefined,
            };
        })
        .addCase(initialConfig.rejected, (state, action) => {
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            }
        })
    }
});

// export const { resetAccessTokenFreshness } = loginSlice.actions

export const selectIsSettingsLoading = (state: RootState) => state.settings.isLoading;
export const selectSettingsError = (state: RootState) => state.settings.error;

export default settingsSlice.reducer;