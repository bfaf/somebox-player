import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "./api";

export const createAxiosResponseInterceptor = () => {
    axiosInstance.interceptors.request.use(
        async (config) => {
            let serverAddress = await AsyncStorage.getItem("SOMEBOX_SERVER_ADDRESS");
            if (serverAddress == null) {
                serverAddress = '192.168.1.9';
                await AsyncStorage.setItem("SOMEBOX_SERVER_ADDRESS", serverAddress);
                await AsyncStorage.setItem("SOMEBOX_BASE_URL_ADDRESS", `http://${serverAddress}:8080/api/v1`);
            }
            const accessToken = await AsyncStorage.getItem("SOMEBOX_ACCESS_TOKEN");
            if (accessToken != null) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            config.baseURL = await AsyncStorage.getItem("SOMEBOX_BASE_URL_ADDRESS");

            return config;
    });
    const interceptor = axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalConfig = error.config;
            originalConfig._retry = true;
            // Reject promise if usual error
            if (error.response.status !== 401) {
                return Promise.reject(error);
            }

            /*
             * When response code is 401, try to refresh the token.
             * Eject the interceptor so it doesn't loop in case
             * token refresh causes the 401 response.
             *
             * Must be re-attached later on or the token refresh will only happen once
             */
            axiosInstance.interceptors.response.eject(interceptor);

            try {
                const refreshToken = await AsyncStorage.getItem("SOMEBOX_REFRESH_TOKEN");
                if (refreshToken != null) {
                    const baseURL = await AsyncStorage.getItem("SOMEBOX_BASE_URL_ADDRESS");
                    await AsyncStorage.removeItem("SOMEBOX_ACCESS_TOKEN");
                    const response = await axiosInstance
                        .post(`${baseURL}/refreshToken`, {
                            refreshToken,
                        }, {
                            headers: {
                                'Authorization': undefined
                            }
                        });

                    const { access_token, refresh_token } = response.data;
                    originalConfig.headers['Authorization'] = `Bearer ${access_token}`;

                    await AsyncStorage.setItem("SOMEBOX_ACCESS_TOKEN", access_token);
                    await AsyncStorage.setItem("SOMEBOX_REFRESH_TOKEN", refresh_token);
                    
                    return axiosInstance(originalConfig);
                } else {
                    // navigate to login
                    console.error('KRASIII cannot get refresh token from storage');
                }
            } catch (err) {
                return Promise.reject(err);
            }
            finally {
                createAxiosResponseInterceptor();
            }
        }
    );
}
