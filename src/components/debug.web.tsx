import React, { useEffect } from 'react';

type AlertProps = {
  data: unknown;
};

const Debug = ({ data }: AlertProps) => {
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
