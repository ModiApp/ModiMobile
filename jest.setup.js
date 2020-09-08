/* eslint-disable no-undef */

jest.mock('react-native-share', () => ({
  default: jest.fn(),
}));

jest.useFakeTimers();
