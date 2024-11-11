import * as ReactNative from 'react-native';
import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.doMock('react-native', () => {
    return Object.setPrototypeOf(
        {
            Platform: {
                OS: 'android',
                select: () => { },
            },
            NativeModules: {
                ...ReactNative.NativeModules,
                NotifeeApiModule: {
                    addListener: jest.fn(),
                    eventsAddListener: jest.fn(),
                    eventsNotifyReady: jest.fn()
                }
            },
        },
        ReactNative,
    );
});
