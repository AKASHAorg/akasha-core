import DS from '@akashaproject/design-system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import menuRoute, { MY_PROFILE, rootRoute } from '../../routes';
import MyProfilePage from './my-profile-page';
import ProfilePage from './profile-page';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useLoginState, useModalState, useErrors, useProfile } from '@akashaproject/ui-awf-hooks';
import { MODAL_NAMES } from '@akashaproject/ui-awf-hooks/lib/use-modal-state';

const { Box, LoginModal } = DS;

const Routes: React.FC<RootComponentProps> = props => {
  const { activeWhen, logger } = props;
  const { path } = activeWhen;

  const [errorState, errorActions] = useErrors({ logger });

  const [loginState, loginActions] = useLoginState({
    globalChannel: props.globalChannel,
    authService: props.sdkModules.auth.authService,
    profileService: props.sdkModules.profiles.profileService,
    ipfsService: props.sdkModules.commons.ipfsService,
    onError: errorActions.createError,
  });

  const [loggedProfileData, loggedProfileActions, profileUpdateStatus] = useProfile({
    profileService: props.sdkModules.profiles.profileService,
    ipfsService: props.sdkModules.commons.ipfsService,
    onError: errorActions.createError,
  });

  React.useEffect(() => {
    if (loginState.pubKey) {
      loggedProfileActions.getProfileData({ pubKey: loginState.pubKey });
    }
  }, [loginState.pubKey]);

  const [modalState, modalStateActions] = useModalState({
    initialState: {},
    isLoggedIn: !!loginState.ethAddress,
  });

  const { t } = useTranslation();

  const loginErrors: string | null = React.useMemo(() => {
    if (errorState && Object.keys(errorState).length) {
      const txt = Object.keys(errorState)
        .filter(key => key.split('.')[0] === 'useLoginState')
        .map(k => errorState![k])
        .reduce((acc, errObj) => `${acc}\n${errObj.error.message}`, '');
      return txt;
    }
    return null;
  }, [errorState]);

  const hideLoginModal = () => {
    modalStateActions.hide(MODAL_NAMES.LOGIN);
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
              loggedProfileData={loggedProfileData}
              loggedProfileActions={loggedProfileActions}
              loginActions={loginActions}
              profileUpdateStatus={profileUpdateStatus}
            />
          </Route>
          <Route path={`${path}/:pubKey`}>
            <ProfilePage
              {...props}
              ethAddress={loginState.ethAddress}
              onLogin={loginActions.login}
              modalActions={modalStateActions}
              modalState={modalState}
              loggedProfileData={loggedProfileData}
            />
          </Route>
          <Route render={() => <div>{t('Oops, Profile not found!')}</div>} />
        </Switch>
      </Box>
      <LoginModal
        showModal={modalState[MODAL_NAMES.LOGIN]}
        slotId={props.layout.app.modalSlotId}
        onLogin={loginActions.login}
        onModalClose={hideLoginModal}
        tutorialLinkLabel={t('Tutorial')}
        metamaskModalHeadline={t('Connecting')}
        metamaskModalMessage={t('Please complete the process in your wallet')}
        onTutorialLinkClick={handleTutorialLinkClick}
        helpText={t('What is a wallet? How do i get an Ethereum address?')}
        error={loginErrors}
      />
    </Router>
  );
};

export default Routes;
