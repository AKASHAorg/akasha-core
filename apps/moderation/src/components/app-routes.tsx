import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { createContextStore, ActionMapper } from 'easy-peasy';
import { IAkashaError, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { useGlobalLogin } from '@akashaproject/ui-awf-hooks';

import { LoggedProfileStateModel } from '../state/logged-profile-state';

import routes, { HOME, RESTRICTED, UNAUTHENTICATED, rootRoute } from '../routes';

import ContentList from './content-list';
import PromptAuthentication from './prompt-authentication';
import PromptAuthorization from './prompt-authorization';

const { Box, LoginModal, ViewportSizeProvider } = DS;

interface AppRoutesProps {
  profileStore: ReturnType<typeof createContextStore>;
  onError: (err: IAkashaError) => void;
}

const AppRoutes: React.FC<RootComponentProps & AppRoutesProps> = props => {
  const { globalChannel, logger, layout, profileStore, onError } = props;

  const [loginModalState, setLoginModalState] = React.useState(false);

  const { t } = useTranslation();

  const jwtToken = profileStore.useStoreState(
    (state: LoggedProfileStateModel) => state.data.jwtToken,
  );
  const ethAddress = profileStore.useStoreState(
    (state: LoggedProfileStateModel) => state.data.ethAddress,
  );
  const updateData = profileStore.useStoreActions(
    (act: ActionMapper<LoggedProfileStateModel, 'updateData'>) => act.updateData,
  );
  const authorize = profileStore.useStoreActions(
    (act: ActionMapper<LoggedProfileStateModel, 'authorize'>) => act.authorize,
  );

  const showLoginModal = () => {
    setLoginModalState(true);
  };

  const hideLoginModal = () => {
    setLoginModalState(false);
  };

  const handleLogin = (providerId: number) => {
    authorize(providerId);
  };

  React.useEffect(() => {
    if (jwtToken || ethAddress) {
      setLoginModalState(false);
    }
  }, [jwtToken, ethAddress]);

  React.useEffect(() => {
    if (ethAddress) {
      setLoginModalState(false);
    }
  }, [ethAddress]);

  useGlobalLogin({
    globalChannel,
    onLogin: data => {
      updateData({
        ethAddress: data.ethAddress,
        jwtToken: data.pubKey,
      });
    },
    onLogout: () => {
      /* Do logout */
    },
    onError: err => {
      logger.error('[app-routes.tsx]: useGlobalLogin err %j', err.error);
      onError({
        errorKey: 'moderation.appRoutes.useGlobalLogin',
        error: err.error,
        critical: false,
      });
      setLoginModalState(false);
    },
  });

  return (
    <ViewportSizeProvider>
      <Box>
        <Router>
          <Switch>
            <Route path={routes[HOME]}>
              <ContentList {...props} ethAddress={ethAddress} slotId={layout.app.modalSlotId} />
            </Route>
            <Route path={routes[UNAUTHENTICATED]}>
              <PromptAuthentication
                titleLabel={t('This page is restricted to Ethereum World Moderators')}
                subtitleLabel={t(
                  'To view this page, you must be an Ethereum World Moderator and log in with your wallet to continue.',
                )}
                buttonLabel={t('Connect a wallet')}
                ethAddress={ethAddress}
                singleSpa={props.singleSpa}
                showLoginModal={showLoginModal}
              />
            </Route>
            <Route path={routes[RESTRICTED]}>
              <PromptAuthorization
                titleLabel={t('You must be an Ethereum World Moderator to access this page')}
                subtitleLabel={t(
                  'The wallet you connected does not match a moderator account in our system. Please try again with the correct wallet.',
                )}
              />
            </Route>
            <Redirect exact={true} from={rootRoute} to={routes[HOME]} />
          </Switch>
        </Router>
        <LoginModal
          showModal={loginModalState}
          slotId={layout.app.modalSlotId}
          onLogin={handleLogin}
          onModalClose={hideLoginModal}
          titleLabel={t('Connect a wallet')}
          metamaskModalHeadline={t('Connecting')}
          metamaskModalMessage={t('Please complete the process in your wallet')}
          error={null}
        />
      </Box>
    </ViewportSizeProvider>
  );
};

export default AppRoutes;
