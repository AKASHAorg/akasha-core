import DS from '@akashaproject/design-system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import menuRoute, { MY_PROFILE, rootRoute } from '../../routes';
import ProfilePage from './profile-page';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useLoginState, useModalState, useErrors, useProfile } from '@akashaproject/ui-awf-hooks';

const { Box, ViewportSizeProvider } = DS;

const Routes: React.FC<RootComponentProps> = props => {
  const { logger } = props;
  // const { path } = activeWhen;
  const [, errorActions] = useErrors({ logger });

  const [loginState, loginActions] = useLoginState({
    onError: errorActions.createError,
  });

  const [loggedProfileData, loggedProfileActions] = useProfile({
    onError: errorActions.createError,
  });

  React.useEffect(() => {
    if (loginState.pubKey) {
      loggedProfileActions.getProfileData({ pubKey: loginState.pubKey });
    }
  }, [loginState.pubKey]);

  const [modalState, modalStateActions] = useModalState({
    initialState: {
      reportModal: false,
    },
    isLoggedIn: !!loginState.ethAddress,
  });

  const { t } = useTranslation();

  const showLoginModal = () => {
    props.navigateToModal({ name: 'login' });
  };

  return (
    <ViewportSizeProvider>
      <Router>
        <Box>
          <Switch>
            <Route path={`${rootRoute}/list`} render={() => <>A list of profiles</>} />
            <Route path={[`${rootRoute}/:pubKey`, menuRoute[MY_PROFILE]]}>
              <ProfilePage
                {...props}
                loggedEthAddress={loginState.ethAddress}
                loginActions={loginActions}
                modalActions={modalStateActions}
                modalState={modalState}
                loggedProfileData={loggedProfileData}
                showLoginModal={showLoginModal}
              />
            </Route>
            <Route render={() => <div>{t('Oops, Profile not found!')}</div>} />
          </Switch>
        </Box>
      </Router>
    </ViewportSizeProvider>
  );
};

export default Routes;
