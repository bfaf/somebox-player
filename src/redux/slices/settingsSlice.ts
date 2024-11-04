import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store';
import { initialConfig, updateIpAddress } from '../thunks/settings';

interface SettingsState {
    serverIp: string,
    baseUrl: string,
    isLoading: boolean,
    isUpdated: boolean,
    error: unknown,
};

const initialState: SettingsState = {
    serverIp: '',
    baseUrl: '',
    isLoading: true,
    isUpdated: false,
    error: undefined,
};

export const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        resetUpdateState: (state) => {
            return {
                ...state,
                isUpdated: false,
            }
        },
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
        .addCase(updateIpAddress.fulfilled, (state, action) => {
            const newConfig = action.payload;
            return {
                ...state,
                serverIp: newConfig.serverIp,
                baseUrl: newConfig.baseUrl,
                isUpdated: true,
            }
        })
        .addCase(updateIpAddress.pending, (state, action) => {
            return {
                ...state,
                isUpdated: false,
                error: undefined
            }
        })
        .addCase(updateIpAddress.rejected, (state, action) => {
            return {
                ...state,
                isUpdated: false,
                error: action.payload,
            }
        })
    }
});

export const { resetUpdateState } = settingsSlice.actions

export const selectServerIpAddress = (state: RootState) => state.settings.serverIp;
export const selectIsSettingsLoading = (state: RootState) => state.settings.isLoading;
export const selectSettingsError = (state: RootState) => state.settings.error;
export const selectIsSettingsUpdated = (state: RootState) => state.settings.isUpdated;

export default settingsSlice.reducer;