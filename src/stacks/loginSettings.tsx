import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../redux/store';
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
import {
  resetUpdateState,
  selectIsSettingsUpdated,
  selectServerIpAddress,
  selectSettingsError,
} from '../redux/slices/settingsSlice';
import {updateIpAddress} from '../redux/thunks/settings';

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
  infoText: {
    color: 'black',
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

const LoginSettings = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();
  const serverIpFromSettings = useSelector(selectServerIpAddress);
  const [serverIp, setServerIp] = useState<string>(serverIpFromSettings);
  const isSettingsUpdated = useSelector(selectIsSettingsUpdated);
  const settingsError = useSelector(selectSettingsError);

  useEffect(() => {
    if (isSettingsUpdated) {
      dispatch(resetUpdateState());
      navigation.goBack();
    }
  }, [isSettingsUpdated]);

  return (
    <SafeAreaView>
      <View>
        <Image style={styles.logo} source={require('../images/logo.png')} />
      </View>
      {settingsError != null && (
        <View style={{alignItems: 'center'}}>
          <Text style={styles.infoText}>
            Error occured while updating the settings
          </Text>
          <Text style={styles.infoText}>
            Check whether you have enough free space on your device
          </Text>
          <Text style={styles.infoText}>Error message:</Text>
          <Text style={styles.errorText}>{settingsError}</Text>
        </View>
      )}
      <View style={styles.container}>
        <View>
          <Text>Server IP address:</Text>
          <TextInput
            style={styles.usernameInput}
            inputMode="text"
            value={serverIp}
            onChangeText={setServerIp}
            keyboardType="default"
            autoFocus={true}
          />
        </View>
        <View>
          <TouchableOpacity
            key="save-settings"
            style={styles.button}
            onPress={() => dispatch(updateIpAddress(serverIp))}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginSettings;
