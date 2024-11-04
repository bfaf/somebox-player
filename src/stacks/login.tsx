import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { loginUser, refreshAccessToken } from '../redux/thunks/login';
import { useNavigation } from '@react-navigation/native';
import { selectIsLoginLoading, selectIsLoginPerformed, selectLoggedIn, selectLoginError } from '../redux/slices/loginSlice';
import { SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AppBar, HStack, IconButton } from '@react-native-material/core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
    container: {
        width: '30%',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#6200ee',
        padding: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 20
    }
});

const Login = (): JSX.Element => {
    const dispatch: AppDispatch = useDispatch();
    const navigation = useNavigation();
    const [username, setUsername] = useState<string>(undefined);
    const [password, setPassword] = useState<string>(undefined);
    const [showForm, setShowForm] = useState<boolean>(false);
    const isLoggedIn = useSelector(selectLoggedIn);
    const loginErrorMessage = useSelector(selectLoginError);
    const isLoading = useSelector(selectIsLoginLoading);
    const isLoginPerformed = useSelector(selectIsLoginPerformed);

    const login = async (username: string, password: string) => {
        await dispatch(loginUser({ username, password }));
    };

    useEffect(() => {
        const autoLogin = async () => {
            const username = await AsyncStorage.getItem("SOMEBOX_USERNAME");
            const password = await AsyncStorage.getItem("SOMEBOX_PASSWORD");
            if (username != null && password != null) {
                await login(username, password);
            } else {
                setShowForm(true);
            }
        }
        if (loginErrorMessage == null && !isLoginPerformed) {
            autoLogin();
        }
        else if (loginErrorMessage != null && isLoginPerformed) {
            setShowForm(true);
        }
    }, [loginErrorMessage, isLoginPerformed, login, setShowForm]);

    useEffect(() => {
        if (isLoggedIn) {
            navigation.navigate('LoggedInStack');
        }
    }, [isLoggedIn]);

    if (isLoading || !showForm) {
        return <ActivityIndicator size="large" />;
    }

    return (
        <SafeAreaView>
            <View>
                <AppBar
                    title="SomeBox Player Login screen"
                    style={{ marginBottom: 0, paddingBottom: 0 }}
                    trailing={props => (
                        <HStack>
                            <IconButton
                                icon={props => (
                                    <FontAwesomeIcon
                                        icon={faGear}
                                        style={{ color: 'white' }}
                                    />
                                )}
                                {...props}
                            />
                        </HStack>
                    )}
                />
            </View>

            <View style={styles.container}>
                {loginErrorMessage != null && (<View>
                    <Text>{loginErrorMessage}</Text>
                </View>)}
                <View>
                    <TextInput
                        style={styles.input}
                        // contentStyle={styles.applyButtonContent}
                        placeholder="Username"
                        mode="outlined"
                        inputMode="text"
                        value={username}
                        onChangeText={(text) => setUsername(text)}
                        keyboardType="default"
                        autoFocus={true}
                    />
                </View>
                <View>
                    <TextInput
                        style={styles.input}
                        // contentStyle={styles.applyButtonContent}
                        placeholder="Password"
                        mode="outlined"
                        inputMode="text"
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        keyboardType="default"
                        secureTextEntry={true}
                    />
                </View>
                <View>
                    <TouchableOpacity
                        key={login}
                        style={styles.button}
                        onPress={() => login(username, password)}>
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>);
};

export default Login;