import React, { useState } from 'react';
import { BaseLayout, View, Image, Button, Text, MaterialIcon } from '@app/components';
// import { navigationService } from '@app/services';
import { ScreenProps, images, catchAndLog, LoginType, LOGIN_TYPE } from '@app/core';
import { mapStateToProps } from './map_state_to_props';
import { mapDispatchToProps } from './map_dispatch_to_props';
import { styles } from './styles';
import { useTranslation } from 'react-i18next';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { GoogleSignin } from 'react-native-google-signin';
// import auth, { Auth } from '@react-native-firebase/auth';

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & ScreenProps;

export const Screen = ({  }: Props) => {
  const { t } = useTranslation();
  const [isBusy, setIsBusy] = useState<boolean>(false);

  const loginFacebookAndGetCredential = async () => {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (result.isCancelled) {
      return undefined;
    }
    // get the access token
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      // handle this however suites the flow of your app
      throw new Error('Something went wrong obtaining the users access token');
    }
    // return firebase.auth.FacebookAuthProvider.credential(data.accessToken);
    return null;
  };

  const loginGoogleAndGetCredential = async () => {
    try {
      await GoogleSignin.signIn();
      const { idToken, accessToken } = await GoogleSignin.getTokens();
      console.log(idToken, accessToken);
      return null;
      // return auth.GoogleAuthProvider.credential(idToken, accessToken);
    } catch (error) {
      console.log(error);
      if (
        error.message.indexOf('The user canceled the sign in request') > -1 ||
        error.message.indexOf('Sign in action cancelled') > -1
      ) {
        return null;
      }
      throw error;
    }
    return null;
  };

  const performLogin = catchAndLog(
    async (loginType: LoginType) => {
      setIsBusy(true);
      let credential: any = null;
      switch (loginType) {
        case LOGIN_TYPE.FACEBOOK:
          credential = await loginFacebookAndGetCredential();
          break;
        case LOGIN_TYPE.GOOGLE:
          credential = await loginGoogleAndGetCredential();
          break;
        default:
          break;
      }

      if (!credential) {
        setIsBusy(false);
        return;
      }

      // login with credential
      // const { user } = await auth().signInWithCredential(credential!);
      // login({
      //   id: user.uid,
      //   displayName: user.displayName,
      //   avatarUrl: user.photoURL,
      //   isLoggedIn: true,
      // });
      // navigationService.setRootHome();
    },
    async () => setIsBusy(false),
  );

  const loginFacebook = () => performLogin(LOGIN_TYPE.FACEBOOK);

  const loginGoogle = () => performLogin(LOGIN_TYPE.GOOGLE);

  return (
    <BaseLayout>
      <View center centerVertical>
        <Image style={styles.appIcon} source={images.appIcon} />
        <Button disabled={isBusy} rounded onPress={loginFacebook} style={[styles.button, styles.buttonFacebook]}>
          <MaterialIcon name='facebook' />
          <Text>{t('loginScreen.loginWith')} Facebook</Text>
        </Button>
        <Button disabled={isBusy} rounded onPress={loginGoogle} style={[styles.button, styles.buttonGoogle]}>
          <MaterialIcon name='google' />
          <Text>{t('loginScreen.loginWith')} Google</Text>
        </Button>
      </View>
    </BaseLayout>
  );
};
