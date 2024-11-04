import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

type AlertProps = {
  data: unknown;
}

const Debug = ({ data }: AlertProps) => {
  const navigation = useNavigation();

  let newData = data;
  if (typeof data === 'object') {
    newData = JSON.stringify(data, null, 2);
  }

  useEffect(() => {
    if (newData != null) {
      Alert.alert(
        'Something went wrong',
        `${newData}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
            style: 'destructive',
          },
        ],
        { cancelable: false },
      );
    }
  }, [newData]);

  return (<></>);
};

export default Debug;
