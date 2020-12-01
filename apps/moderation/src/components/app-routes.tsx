import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import DS from '@akashaproject/design-system';

import routes, { HOME, RESTRICTED, UNAUTHENTICATED, rootRoute } from '../routes';

import ContentList from './content-list';
import PromptAuthentication from './prompt-authentication';
import PromptAuthorization from './prompt-authorization';

const { Box, ModalRenderer, ViewportSizeProvider } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const { layout } = props;

  const { t } = useTranslation();

  return (
    <ViewportSizeProvider>
      <Box>
        <Router>
          <Switch>
            <Route path={routes[HOME]}>
              <ContentList
                slotId={layout.app.modalSlotId}
                // sdkModules={sdkModules}
                // globalChannel={globalChannel}
                // logger={logger}
                // navigateToUrl={singleSpa.navigateToUrl}
                // showLoginModal={showLoginModal}
                // onError={onError}
              />
            </Route>
            <Route path={routes[UNAUTHENTICATED]}>
              <ModalRenderer slotId={layout.app.modalSlotId}>
                <PromptAuthentication
                  titleLabel={t('This page is restricted to Ethereum World Moderators')}
                  subtitleLabel={t(
                    'To view this page, you must be an Ethereum World Moderator and log in with your wallet to continue.',
                  )}
                  buttonLabel={t('Connect a wallet')}
                />
              </ModalRenderer>
            </Route>
            <Route path={routes[RESTRICTED]}>
              <ModalRenderer slotId={layout.app.modalSlotId}>
                <PromptAuthorization
                  titleLabel={t('You must be an Ethereum World Moderator to access this page')}
                  subtitleLabel={t(
                    'The wallet you connected does not match a moderator account in our system. Please try again with the correct wallet.',
                  )}
                />
              </ModalRenderer>
            </Route>
            <Redirect exact={true} from={rootRoute} to={routes[HOME]} />
          </Switch>
        </Router>
      </Box>
    </ViewportSizeProvider>
  );
};

export default AppRoutes;
