import DS from '@akashaproject/design-system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import menuRoute, { MY_PROFILE, rootRoute } from '../../routes';
import MyProfilePage from './my-profile-page';
import ProfilePage from './profile-page';
import { RootComponentProps, IAkashaError } from '@akashaproject/ui-awf-typings';
import { useLoginState } from '@akashaproject/ui-awf-hooks';

const { Box, LoginModal } = DS;

const Routes: React.FC<RootComponentProps> = props => {
  const { activeWhen, logger } = props;
  const { path } = activeWhen;

  const [ loginState, loginActions ] = useLoginState({
    globalChannel: props.globalChannel,
    authService: props.sdkModules.authService,
    profileService: props.sdkModules.profiles.profileService,
    onError: (error: IAkashaError) => {
      logger.error(error);
    },
    cacheService: props.sdkModules.commons.cacheService,
  });
  const [loginModalState, setLoginModalState] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);

  const { t } = useTranslation();

  React.useEffect(() => {
    if (loginState.ethAddress) {
      setLoginModalState(false);
      setModalOpen(true);
    }
  }, [loginState.ethAddress]);

  const showLoginModal = () => {
    setLoginModalState(true);
  };

  const hideLoginModal = () => {
    setLoginModalState(false);
  };

  const handleTutorialLinkClick = () => {
    /* goto tutorials */
  };
  console.log(loginState, 'the login state');
  return (
    <Router>
      <Box>
        <Switch>
          <Route path={`${rootRoute}/list`} render={() => <>A list of profiles</>} />
          <Route path={menuRoute[MY_PROFILE]}>
            <MyProfilePage {...props} />
          </Route>
          <Route path={`${path}/:profileId`}>
            <ProfilePage
              {...props}
              modalOpen={modalOpen}
              ethAddress={loginState.ethAddress}
              onLogin={loginActions.login}
              setModalOpen={setModalOpen}
              showLoginModal={showLoginModal}
            />
          </Route>
          <Route render={() => <div>{t('Oops, Profile not found!')}</div>} />
        </Switch>
      </Box>
      <LoginModal
        showModal={loginModalState}
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
