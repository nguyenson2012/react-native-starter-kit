import { connect as reduxConnect, ConnectedComponentClass } from 'react-redux';
import createRematchPersist from '@rematch/persist';
import { init, RematchRootState, RematchDispatch } from '@rematch/core';
import storage from '@react-native-community/async-storage';
import { persistStore } from 'redux-persist';
import { models } from './models';

const persistPlugin = createRematchPersist({
  whitelist: ['currentUser', 'settings', 'sharks'],
  throttle: 1000,
  version: 1,
  storage,
});

export const store = init({
  plugins: [persistPlugin],
  models,
});

export const persistor = persistStore(store, undefined, () => {
  const { settings } = store.getState();
  // we only should do it only 1 time when user installs & opens the app for the first time
  if (!settings.appLoaded) {
    store.dispatch.settings.finishLoadingApp();
  }
});

export type Store = typeof store;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Dispatch = RematchDispatch<any>;
export type RootState = RematchRootState<typeof models>;

type Connect = (
  mapStateToProps: (state: RootState) => {},
  mapDispatchToProps: (dispatch: Dispatch) => {},
) => // eslint-disable-next-line @typescript-eslint/no-explicit-any
(component: any) => ConnectedComponentClass<any, any>;

export const connect: Connect = (mapStateToProps, mapDispatchToProps) => (component) =>
  reduxConnect(mapStateToProps, mapDispatchToProps)(component);
