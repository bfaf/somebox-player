import React from 'react';
import { useLoginTimeout } from '../hooks/useLoginTimeout';

export const LoginRefresh = () => {
  useLoginTimeout();
  return <></>;
};
