import { combineReducers, configureStore } from '@reduxjs/toolkit'
import loginReducer from './slices/loginSlice';

const rootReducer = combineReducers({
    login: loginReducer,
});

export const setupStore = (preloadedState?: RootState) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
    });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
