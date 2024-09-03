import React from 'react';
import {View, Text} from 'react-native';

const Debug = props => {
  const { name, data} = props;
  let newData = data;
  if (typeof data === 'object') {
    newData = JSON.stringify(data, null, 2);
  }

  if (!data) {
    return <></>;
  }

  return (
    <View>
      <Text style={{ color: 'black', fontSize: 16, fontWeight: 600}}>------------start {name}------------</Text>
      <Text style={{ color: 'black'}}>{newData}</Text>
      <Text style={{ color: 'black', fontSize: 16, fontWeight: 600}}>------------end {name}------------</Text>
    </View>
  );
};

export default Debug;
