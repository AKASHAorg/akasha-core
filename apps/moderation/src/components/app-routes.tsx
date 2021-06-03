import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { IAkashaError, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { useLoginState } from '@akashaproject/ui-awf-hooks';

import routes, { HOME, UNAUTHENTICATED, rootRoute } from '../routes';

import ContentList from './content-list';
import PromptAuthentication from './prompt-authentication';

const { Box, LoginModal } = DS;

interface AppRoutesProps {
  onError: (err: IAkashaError) => void;
}

const AppRoutes: React.FC<RootComponentProps & AppRoutesProps> = props => {
  const { sdkModules, globalChannel, layoutConfig, onError, rxjsOperators } = props;

  const [loginModalState, setLoginModalState] = React.useState(false);

  const { t } = useTranslation();

  const [loginState, loginActions] = useLoginState({
    rxjsOperators,
    globalChannel: globalChannel,
    onError: onError,
    authService: sdkModules.auth.authService,
    ipfsService: sdkModules.commons.ipfsService,
    profileService: sdkModules.profiles.profileService,
  });

  const showLoginModal = () => {
    setLoginModalState(true);
  };

  const hideLoginModal = () => {
    setLoginModalState(false);
  };

  const handleLogin = (providerId: number) => {
    loginActions.login(providerId);
  };

  React.useEffect(() => {
    if (loginState.ethAddress) {
      setLoginModalState(false);
    }
  }, [loginState.ethAddress]);

  return (
    <Box>
      <Router>
        <Switch>
          <Route path={routes[HOME]}>
            <ContentList
              {...props}
              ethAddress={loginState.ethAddress}
              slotId={layoutConfig.modalSlotId}
            />
          </Route>
          <Route path={routes[UNAUTHENTICATED]}>
            <PromptAuthentication
              titleLabel={t('This page is restricted to Ethereum World Moderators')}
              subtitleLabel={t(
                'To view this page, you must be an Ethereum World Moderator and log in with your wallet to continue.',
              )}
              buttonLabel={t('Connect a wallet')}
              ethAddress={loginState.ethAddress}
              singleSpa={props.singleSpa}
              showLoginModal={showLoginModal}
            />
          </Route>
          <Redirect exact={true} from={rootRoute} to={routes[HOME]} />
        </Switch>
      </Router>
      <LoginModal
        showModal={loginModalState}
        slotId={layoutConfig.modalSlotId}
        onLogin={handleLogin}
        onModalClose={hideLoginModal}
        titleLabel={t('Connect a wallet')}
        metamaskModalHeadline={t('Connecting')}
        metamaskModalMessage={t('Please complete the process in your wallet')}
        error={null}
      />
    </Box>
  );
};

export default AppRoutes;
