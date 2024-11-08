import React, {useEffect, useState} from 'react';
import { useNavigate } from "react-router-dom";

import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../redux/store';
import {loginUser} from '../redux/thunks/login';
import {
  selectIsLoginLoading,
  selectIsLoginPerformed,
  selectLoggedIn,
  selectLoginError,
} from '../redux/slices/loginSlice';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const styles = StyleSheet.create({
  container: {
    width: '30%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 50,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '75%',
  },
  usernameInput: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    flexGrow: 3,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#6200ee',
    padding: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 20,
  },
  inputWithButton: {
    flexDirection: 'row',
    flexGrow: 3,
    alignItems: 'center',
  },
  logo: {
    marginTop: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

const Login = (): JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const isLoggedIn = useSelector(selectLoggedIn);
  const loginErrorMessage = useSelector(selectLoginError);
  const isLoading = useSelector(selectIsLoginLoading);
  const isLoginPerformed = useSelector(selectIsLoginPerformed);

  // add a listener to prevent going pack to initial settings

  const login = async (username: string, password: string) => {
    await dispatch(loginUser({username, password}));
  };

  useEffect(() => {
    const autoLogin = async () => {
      const username = await AsyncStorage.getItem('SOMEBOX_USERNAME');
      const password = await AsyncStorage.getItem('SOMEBOX_PASSWORD');
      if (username != null && password != null) {
        await login(username, password);
      } else {
        setShowForm(true);
      }
    };
    if (loginErrorMessage == null && !isLoginPerformed) {
      autoLogin();
    }
  }, [loginErrorMessage, isLoginPerformed, login, setShowForm]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/list');
    }
  }, [isLoggedIn]);

  if (loginErrorMessage == null && (isLoading || !showForm)) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <SafeAreaView>
      <View>
        <Image style={styles.logo} source={{ uri: '../images/logo.png'}} />
      </View>
      <View style={styles.container}>
        {loginErrorMessage != null && (
          <View>
            <Text>{loginErrorMessage}</Text>
          </View>
        )}
        <View style={styles.inputWithButton}>
          <TextInput
            style={styles.usernameInput}
            placeholder="Username"
            inputMode="text"
            value={username}
            onChangeText={(text: string) => setUsername(text)}
            autoFocus={true}
          />
        </View>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Password"
            inputMode="text"
            value={password}
            onChangeText={(text: string) => setPassword(text)}
            secureTextEntry={true}
          />
        </View>
        <View>
          <TouchableOpacity
            key="login"
            style={styles.button}
            onPress={() => login(username, password)}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
