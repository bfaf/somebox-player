import 'react-native';
import React from 'react';
import Login from '../../src/stacks/login';

import { expect, it, jest, describe, beforeEach } from '@jest/globals';

import { renderWithProviders } from '../../utils/test-utils';
import { setupStore } from '../../src/redux/store';

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading spinner initially', async () => {
    const store = setupStore();

    // jest.spyOn(SettingsSlice, 'selectIsSettingsLoading').mockReturnValue(true);

    const res = renderWithProviders(<Login />, {
      store,
    });

    expect(await res.findByPlaceholderText('Username')).toBeVisible();
  });
});
