import React, {useEffect} from 'react';
import {Alert} from 'react-native';
import {useNavigate} from 'react-router-dom';

type AlertProps = {
  data: unknown;
};

const Debug = ({data}: AlertProps) => {
  const navigate = useNavigate();

  let newData = data;
  if (typeof data === 'object') {
    newData = JSON.stringify(data, null, 2);
  }

  useEffect(() => {
    if (newData != null) {
      window.alert(`Something went wrong\n${newData}`);
    }
  }, [newData]);

  return <></>;
};

export default Debug;
