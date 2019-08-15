import { Sentry } from 'react-native-sentry';

export const recordError = async (error: Error): Promise<void> => {
  if (!__DEV__) {
    try {
      Sentry.captureException(error);
    } catch (internalError) {
      // do nothing
    }
  } else {
    // eslint-disable-next-line no-console
    console.log(error);
  }
};
