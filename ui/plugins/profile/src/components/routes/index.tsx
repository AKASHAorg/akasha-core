import DS from '@akashaproject/design-system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import menuRoute, { MY_PROFILE, rootRoute } from '../../routes';
import MyProfilePage from './my-profile-page';
import ProfilePage from './profile-page';
import { RootComponentProps, IAkashaError } from '@akashaproject/ui-awf-typings';
import { useLoginState, useModalState } from '@akashaproject/ui-awf-hooks';

const { Box, LoginModal } = DS;

const Routes: React.FC<RootComponentProps> = props => {
  const { activeWhen, logger } = props;
  const { path } = activeWhen;

  const [loginState, loginActions] = useLoginState({
    globalChannel: props.globalChannel,
    authService: props.sdkModules.authService,
    profileService: props.sdkModules.profiles.profileService,
    ipfsService: props.sdkModules.commons.ipfsService,
    cacheService: props.sdkModules.commons.cacheService,
    onError: (errorInfo: IAkashaError) => {
      logger.error(errorInfo.error.message, errorInfo.errorKey);
    },
  });
  const [modalState, modalStateActions] = useModalState({
    initialState: {
      updateProfile: false,
      changeUsername: false,
      changeENS: false,
    },
    isLoggedIn: !!loginState.ethAddress,
  });

  const { t } = useTranslation();

  const hideLoginModal = () => {
    modalStateActions.hide('loginModal');
  };
  const handleTutorialLinkClick = () => {
    /* goto tutorials */
  };

  return (
    <Router>
      <Box>
        <Switch>
          <Route path={`${rootRoute}/list`} render={() => <>A list of profiles</>} />
          <Route path={menuRoute[MY_PROFILE]}>
            <MyProfilePage
              {...props}
              modalActions={modalStateActions}
              modalState={modalState}
              ethAddress={loginState.ethAddress}
              profileData={loginState.profileData}
              loginActions={loginActions}
              profileUpdateStatus={loginState.updateStatus}
            />
          </Route>
          <Route path={`${path}/:profileId`}>
            <ProfilePage
              {...props}
              ethAddress={loginState.ethAddress}
              onLogin={loginActions.login}
              modalActions={modalStateActions}
              modalState={modalState}
            />
          </Route>
          <Route render={() => <div>{t('Oops, Profile not found!')}</div>} />
        </Switch>
      </Box>
      <LoginModal
        showModal={modalState.loginModal}
        slotId={props.layout.app.modalSlotId}
        onLogin={loginActions.login}
        onModalClose={hideLoginModal}
        tutorialLinkLabel={t('Tutorial')}
        metamaskModalHeadline={t('Connecting')}
        metamaskModalMessage={t('Please complete the process in your wallet')}
        onTutorialLinkClick={handleTutorialLinkClick}
        helpText={t('What is a wallet? How do i get an Ethereum address?')}
      />
    </Router>
  );
};

export default Routes;
