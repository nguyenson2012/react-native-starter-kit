import { WithStore } from '@app/components';
import { Navigation } from 'react-native-navigation';
import { HomeScreen, NewScreen } from './screens';
import { screenNames } from '@app/core';

const registerScreens = () => {
  Navigation.registerComponent(screenNames.HomeScreen, () => WithStore(HomeScreen));
  Navigation.registerComponent(screenNames.NewScreen, () => WithStore(NewScreen));
};

export default {
  registerScreens,
};
