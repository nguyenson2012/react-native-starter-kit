import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock';

/* eslint-disable no-console */
const originalConsoleError = console.error;
console.error = (...args) => {
  if (/Warning.*not wrapped in act/.test(args[0])) {
    return;
  }
  originalConsoleError(...args);
};

/* eslint-disable no-undef */
jest.mock('react-native-splash-screen', () => ({
  hide: jest.fn(),
}));
jest.mock('@react-native-community/async-storage', () => mockAsyncStorage);
jest.mock('@react-native-firebase/app', () => ({}));
jest.mock('@react-native-firebase/auth', () => ({}));
jest.mock('@react-native-firebase/config', () => ({}));
