import React, { useState } from 'react';
import { Linking, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import produce from 'immer';
import { catchAndLog, ScreenProps, showNotification, useEffectOnce } from '@app/core';
import { Button, Text, Container } from '@app/components';
import { authService, navigationService } from '@app/services';
import { mapStateToProps } from './map_state_to_props';
import { mapDispatchToProps } from './map_dispatch_to_props';
import { styles } from './styles';

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & ScreenProps;
interface ResendVerificationEmailStatus {
  isVerificationEmailSent: boolean;
  waitingTimeToResend: number;
}

export const Screen = ({ componentId, markEmailVerified, currentUser, logout }: Props): JSX.Element => {
  let resendInterval: NodeJS.Timeout | undefined;
  const { t } = useTranslation();
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [resendVerificationEmailStatus, setResendVerificationEmailStatus] = useState<ResendVerificationEmailStatus>({
    isVerificationEmailSent: false,
    waitingTimeToResend: 0,
  });

  useEffectOnce(() => {
    return () => {
      if (resendInterval) {
        clearInterval(resendInterval);
      }
    };
  });

  const checkStatus = catchAndLog(
    async () => {
      setIsBusy(true);
      if (await authService.isEmailVerified()) {
        markEmailVerified();
        navigationService.setRootHome();
      } else {
        showNotification({
          type: 'WARNING',
          message: t('emailVerificationScreen.emailNotVerified'),
        });
      }
    },
    async () => setIsBusy(false),
  );

  const resendVerificationEmail = catchAndLog(
    async () => {
      setIsBusy(true);
      await authService.resendVerificationEmail();
      showNotification({
        type: 'SUCCESS',
        message: t('emailVerificationScreen.resendEmailNotification'),
      });
      setResendVerificationEmailStatus({
        isVerificationEmailSent: true,
        waitingTimeToResend: 30,
      });
      resendInterval = setInterval(() => {
        setResendVerificationEmailStatus(
          produce((draftState: ResendVerificationEmailStatus) => {
            if (!draftState.isVerificationEmailSent) {
              draftState.isVerificationEmailSent = true;
            }
            if (draftState.waitingTimeToResend > 1) {
              draftState.waitingTimeToResend -= 1;
            } else if (draftState.waitingTimeToResend === 1) {
              draftState.isVerificationEmailSent = false;
              draftState.waitingTimeToResend = 0;
            }
          }),
        );
      }, 1000);
    },
    async () => setIsBusy(false),
  );

  const openMailbox = catchAndLog(
    async () => {
      setIsBusy(true);
      if (Platform.OS === `ios`) {
        Linking.openURL(`message:`);
      }
    },
    async () => setIsBusy(false),
  );

  const performLogout = catchAndLog(async () => {
    await authService.logout();
    logout();
    navigationService.setRootLogin();
  });

  const waitForResend =
    resendVerificationEmailStatus.isVerificationEmailSent && resendVerificationEmailStatus.waitingTimeToResend > 0;
  return (
    <Container showHeader componentId={componentId} headerTitle={t('emailVerificationScreen.verifyEmail')} center>
      <Text style={styles.notice}>
        {t('emailVerificationScreen.notice', {
          email: currentUser.email,
        })}
      </Text>
      <Button full onPress={checkStatus} disabled={isBusy} style={styles.button}>
        <Text>{t('emailVerificationScreen.check')}</Text>
      </Button>
      <Button full onPress={resendVerificationEmail} disabled={isBusy || waitForResend} style={styles.button}>
        <Text>
          {t('emailVerificationScreen.resendVerification')}
          {waitForResend ? ` (${resendVerificationEmailStatus.waitingTimeToResend})` : ''}
        </Text>
      </Button>
      {Platform.OS === 'ios' && (
        <Button full onPress={openMailbox} disabled={isBusy} style={styles.button}>
          <Text>{t('emailVerificationScreen.openMailbox')}</Text>
        </Button>
      )}
      <Button full onPress={performLogout} disabled={isBusy} style={styles.button}>
        <Text>{t('emailVerificationScreen.useAnotherAccount')}</Text>
      </Button>
    </Container>
  );
};
