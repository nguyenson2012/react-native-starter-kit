import React from 'react';
import { ScreenProps, i18n, catchAndLog } from '@app/core';
import { config } from '@app/config';
import { List, ListItemData, Picker, Image, Text, Container } from '@app/components';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { navigationService, authService } from '@app/services';
import { mapDispatchToProps } from './map_dispatch_to_props';
import { mapStateToProps } from './map_state_to_props';
import { styles } from './styles';

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & ScreenProps;

export const Screen = ({ changeLanguage, language, currentUser, logout }: Props): JSX.Element => {
  const { t } = useTranslation();
  const appVersion = Platform.OS === 'android' ? config.android.version : config.ios.version;

  const performLogout = catchAndLog(async () => {
    await authService.logout();
    logout();
    navigationService.setRootLogin();
  });

  const selectLanguage = (): void => {
    Picker.show({
      pickerData: i18n.LANGUAGE_TEXTS,
      selectedValue: [i18n.getLanguageName(language)],
      onPickerConfirm: (data) => {
        const selectedLanguage = i18n.getLanguageByName(data[0]);
        if (selectedLanguage) {
          changeLanguage(selectedLanguage.id);
        }
      },
    });
  };

  const data: ListItemData[] = [
    {
      title: t('settingsScreen.settings'),
      isHeader: true,
    },
    {
      title: t('settingsScreen.language'),
      isHeader: false,
      value: i18n.getLanguageName(language),
      onPress: selectLanguage,
      showIcon: true,
    },
    {
      title: t('settingsScreen.about'),
      isHeader: true,
    },
    {
      title: t('settingsScreen.author'),
      isHeader: false,
      value: config.author,
    },
    {
      title: t('settingsScreen.version'),
      isHeader: false,
      value: appVersion,
    },
    {
      title: t('settingsScreen.logout'),
      isHeader: false,
      showIcon: true,
      onPress: performLogout,
    },
  ];

  return (
    <Container showHeader headerTitle={t('settingsScreen.settings')}>
      {!!currentUser.avatarUrl && (
        <Image
          source={{
            uri: currentUser.avatarUrl,
          }}
          style={styles.avatar}
        />
      )}
      <Text style={styles.displayName}>{currentUser.displayName}</Text>
      <List data={data} />
    </Container>
  );
};
