module.exports = {
  testEnvironment: 'node',
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/utils/jest-after-env.ts'],
  setupFiles: ['<rootDir>/utils/jest-setup.js'],
  transformIgnorePatterns: [
    // "node_modules/(?!(@react-native|react-native|react-native-iphone-x-helper|react-navigation|@react-navigation|react-native-vector-icons|@react-native-masked-view/masked-view)/)"
    'node_modules/(?!((jest-)?react-native(-.*)?|@react-native(-community)?|@react-navigation|@react-native(-.*)?)|@notifee/react-native/)',
  ],
};
