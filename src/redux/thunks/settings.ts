import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";

type InitialConfig = {
    serverIp?: string;
    baseUrl?: string;
}

export const initialConfig = createAsyncThunk(
    'settings/initialConfig',
    async (_, { fulfillWithValue, rejectWithValue }) => {
        try {
            let initialConfig: InitialConfig = {};
            const isInitialConfigPassed = await AsyncStorage.getItem("SOMEBOX_INITIAL_CONFIG_PASSED");
            if (isInitialConfigPassed == null) {
                initialConfig = {
                    serverIp: '192.168.1.9',
                    baseUrl: `http://192.168.1.9:8080/api/v1`,
                };
                await AsyncStorage.setItem("SOMEBOX_SERVER_ADDRESS", initialConfig.serverIp);
                await AsyncStorage.setItem("SOMEBOX_BASE_URL_ADDRESS", initialConfig.baseUrl);
                await AsyncStorage.setItem("SOMEBOX_INITIAL_CONFIG_PASSED", 'true');
            } else {
                initialConfig = {
                    serverIp: await AsyncStorage.getItem("SOMEBOX_SERVER_ADDRESS"),
                    baseUrl: await AsyncStorage.getItem("SOMEBOX_BASE_URL_ADDRESS"),
                };
            }

            return fulfillWithValue(initialConfig);
        } catch (err) {
            return rejectWithValue(err);
        }
    });

export const updateIpAddress = createAsyncThunk(
    'settings/updateIpAddress',
    async (ipAddress: string, { fulfillWithValue, rejectWithValue }) => {
        try {
            const newConfig = {
                serverIp: ipAddress,
                baseUrl: `http://${ipAddress}:8080/api/v1`,
            }
            await AsyncStorage.setItem("SOMEBOX_SERVER_ADDRESS", newConfig.serverIp);
            await AsyncStorage.setItem("SOMEBOX_BASE_URL_ADDRESS", newConfig.baseUrl);

            return fulfillWithValue(newConfig);
        } catch (err) {
            return rejectWithValue(err);
        }
    });