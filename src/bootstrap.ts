import { navigationService, appService } from '@app/services';
import { registerModules } from '@app/modules';
import { config } from '@app/config';
import { i18n, catchAndLog, handleGlobalErrors, configureGoogleSignIn } from '@app/core';
import { Sentry } from 'react-native-sentry';

catchAndLog(
  async (): Promise<void> => {
    handleGlobalErrors();
    await i18n.initialize();
    registerModules();
    navigationService.initialize();
    await configureGoogleSignIn();
    await appService.setDefaults();
    await appService.checkUpdate();
    Sentry.config(config.sentryDns).install();
  },
)();
