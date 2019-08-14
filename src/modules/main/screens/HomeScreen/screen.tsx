import React from 'react';
import { ScreenProps, screenNames } from '@app/core';
import { navigationService } from '@app/services';
import { ScrollView, Container } from '@app/components';
import { LottieSample } from '@app/modules/main/screens/HomeScreen/components/LottieSample';
import { mapStateToProps } from './map_state_to_props';
import { mapDispatchToProps } from './map_dispatch_to_props';
import {
  NavigationSample,
  RematchSample,
  IconSample,
  CrashSample,
  NotificationSample,
  PickerSample,
  AnalyticsSample,
} from './components';

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & ScreenProps;

export const Screen = ({
  componentId,
  sharks,
  dolphins,
  incrementShark,
  incrementSharkAsync,
  incrementDolphin,
  incrementDolphinAsync,
}: Props): JSX.Element => {
  const pushNewScreen = (): void => {
    navigationService.navigateTo({
      componentId,
      screenName: screenNames.NewScreen,
    });
  };

  const changeTab = (): void => {
    navigationService.changeTab({
      componentId,
      tabIndex: 1,
    });
  };

  return (
    <Container componentId={componentId}>
      <ScrollView>
        <AnalyticsSample />
        <CrashSample />
        <PickerSample />
        <NavigationSample pushNewScreen={pushNewScreen} changeTab={changeTab} />
        <IconSample />
        <RematchSample
          sharks={sharks}
          dolphins={dolphins}
          incrementShark={incrementShark}
          incrementSharkAsync={incrementSharkAsync}
          incrementDolphin={incrementDolphin}
          incrementDolphinAsync={incrementDolphinAsync}
        />
        <NotificationSample />
        <LottieSample />
      </ScrollView>
    </Container>
  );
};
