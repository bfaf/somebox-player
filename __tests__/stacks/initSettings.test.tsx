import 'react-native';
import React from 'react';
import InitSettings from '../../src/stacks/initSettings';

import {expect, it, jest, describe, beforeEach} from '@jest/globals';

import {renderWithProviders} from '../../utils/test-utils';
import {setupStore} from '../../src/redux/store';
import * as SettingsSlice from '../../src/redux/slices/settingsSlice';

describe('InitSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading spinner initially', async () => {
    const store = setupStore();

    jest.spyOn(SettingsSlice, 'selectIsSettingsLoading').mockReturnValue(true);

    const res = renderWithProviders(<InitSettings />, {
      store,
    });

    expect(
      await res.findByTestId('init-settings-loading-spinner'),
    ).toBeVisible();
  });

  it('shows error message when error occurs', async () => {
    const store = setupStore();

    const errorMessage = 'Test error';
    jest
      .spyOn(SettingsSlice, 'selectSettingsError')
      .mockReturnValue(errorMessage);

    const res = renderWithProviders(<InitSettings />, {
      store,
    });

    expect(await res.findByText(errorMessage)).toBeOnTheScreen();
  });
});
