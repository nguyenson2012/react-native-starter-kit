import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App, { Hermes } from '@app/App';
import { Platform } from 'react-native';
import { i18n } from '@app/core';
import { config } from '@app/config';

jest.mock('react-native-splash-screen');
jest.mock('react-native-google-signin', () => {});

beforeAll(() => {
  i18n.initialize();
  config.android.version = '1.0.0';
  config.ios.version = '1.0.0';
});

describe('<App/>', () => {
  beforeEach(() => {
    Platform.OS = 'ios';
    ((global as unknown) as Hermes).HermesInternal = undefined;
  });
  it('renders successfully with effect', async () => {
    const { getByText, baseElement } = render(<App />);

    expect(getByText('Effect loaded: true')).toBeDefined();
    expect(baseElement).toMatchSnapshot();
  });

  it('renders correctly on android platform', async () => {
    Platform.OS = 'android';
    const { getByText, baseElement } = render(<App />);

    expect(getByText('Platform: android')).toBeDefined();
    expect(baseElement).toMatchSnapshot();
  });

  it('renders correctly with hermes engine', async () => {
    ((global as unknown) as Hermes).HermesInternal = true;
    const { getByText, baseElement } = render(<App />);

    expect(getByText('Engine: Hermes')).toBeDefined();
    expect(baseElement).toMatchSnapshot();
  });
  it('shows "Hello world" when clicking Hello button', async () => {
    const { getByText } = render(<App />);
    const button = getByText('Hello');
    fireEvent.press(button);

    expect(getByText('Hello world')).toBeDefined();
  });
});
