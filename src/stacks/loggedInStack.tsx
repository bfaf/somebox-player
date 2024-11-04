import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import List from "./list";
import VideoPlayer from "./video-player";
import { useLoginTimeout } from '../hooks/useLoginTimeout';

const Stack = createNativeStackNavigator();

const LoginRefresh = (props) => {
    useLoginTimeout();
    return (<></>);
};

const LoggedInStack = () => {
    return (
        <Stack.Navigator initialRouteName="List" screenOptions={{
            headerBackVisible: false,
            headerShown: false,
            headerTitle: (props) => <LoginRefresh {...props}/>
        }}>
            <Stack.Screen name="List" component={List}  />
            <Stack.Screen name="Player" component={VideoPlayer} />
        </Stack.Navigator>
    );
};

export default LoggedInStack;