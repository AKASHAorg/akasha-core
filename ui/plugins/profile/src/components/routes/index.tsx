import DS from '@akashaproject/design-system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import menuRoute, { MY_PROFILE, rootRoute } from '../../routes';
import MyProfilePage from './my-profile-page';
import ProfilePage from './profile-page';
import { RootComponentProps } from '@akashaproject/ui-awf-typings/src';

const { Box, LoginModal } = DS;

const Routes: React.FC<RootComponentProps> = props => {
  const { activeWhen } = props;
  const { path } = activeWhen;

  const [loginState, setLoginState] = React.useState<{ ethAddress?: string; token?: string }>({});
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

  const handleLogin = (providerId: number) => {
    const call = props.sdkModules.auth.authService.signIn(providerId);
    call.subscribe((res: any) => {
      const { ethAddress, token } = res.data;
      setLoginState({ ethAddress, token });
    });
  };

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
              onLogin={handleLogin}
              setModalOpen={setModalOpen}
              showLoginModal={showLoginModal}
            />
          </Route>
          <Route render={() => <div>{t('Oops, Profile not found!')}</div>} />
        </Switch>
      </Box>
      <LoginModal
        showModal={loginModalState}
        slotId={props.layout.modalSlotId}
        onLogin={handleLogin}
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
