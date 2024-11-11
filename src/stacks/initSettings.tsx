import React, {useEffect, useState} from 'react';

import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../redux/store';
import {initialConfig} from '../redux/thunks/settings';
import {
  selectIsSettingsLoading,
  selectSettingsError,
} from '../redux/slices/settingsSlice';
import {useNavigation} from '@react-navigation/native';
import {
  SafeAreaView,
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {LoginStackNavigationProp} from '.';

const styles = StyleSheet.create({
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aligned: {
    // height: '40%'
  },
  titleText: {
    color: 'black',
    fontSize: 24,
    fontWeight: '600',
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

const InitSettings = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation<LoginStackNavigationProp>();
  const isSettingsLoading = useSelector(selectIsSettingsLoading);
  const settingsError = useSelector(selectSettingsError);

  useEffect(() => {
    dispatch(initialConfig());
  }, [dispatch, initialConfig]);

  useEffect(() => {
    if (settingsError == null && !isSettingsLoading) {
      navigation.navigate('Login');
    }
  }, [settingsError, isSettingsLoading, navigation]);

  if (settingsError != null) {
    // hope this never happens...
    return (
      <SafeAreaView style={styles.content}>
        <View style={styles.aligned}>
          <Text style={styles.titleText}>Cannot load settings</Text>
          <Text style={styles.infoText}>
            If this keeps happening please clear app data in device settings
          </Text>
          <Text style={styles.infoText}>Error message:</Text>
          <Text style={styles.errorText}>{settingsError}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (settingsError == null && isSettingsLoading) {
    return (
      <ActivityIndicator size="large" testID="init-settings-loading-spinner" />
    );
  }

  return <></>;
};

export default InitSettings;
