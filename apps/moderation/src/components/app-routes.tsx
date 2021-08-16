import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { IAkashaError, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { useLoginState } from '@akashaproject/ui-awf-hooks';

import routes, { HOME, HISTORY, UNAUTHENTICATED, rootRoute } from '../routes';

import ContentList from './content-list';
import PromptAuthentication from './prompt-authentication';
import TransparencyLog from './transparency-log';

const { Box } = DS;

interface AppRoutesProps {
  onError: (err: IAkashaError) => void;
}

const AppRoutes: React.FC<RootComponentProps & AppRoutesProps> = props => {
  const { layoutConfig, onError } = props;

  const { t } = useTranslation();

  const [loginState] = useLoginState({
    onError: onError,
  });

  return (
    <Box>
      <Router>
        <Switch>
          <Route path={routes[HOME]}>
            <ContentList {...props} user={loginState.pubKey} slotId={layoutConfig.modalSlotId} />
          </Route>
          <Route path={routes[UNAUTHENTICATED]}>
            <PromptAuthentication
              titleLabel={t('This page is restricted to Ethereum World Moderators')}
              subtitleLabel={t(
                'To view this page, you must be an Ethereum World Moderator and log in with your wallet to continue.',
              )}
              buttonLabel={t('Moderation history')}
              ethAddress={loginState.ethAddress}
              singleSpa={props.singleSpa}
            />
          </Route>
          <Route path={routes[HISTORY]}>
            <TransparencyLog
              user={loginState.pubKey}
              logger={props.logger}
              isMobile={props.isMobile}
              navigateToUrl={props.singleSpa.navigateToUrl}
            />
          </Route>
          <Redirect exact={true} from={rootRoute} to={routes[HOME]} />
        </Switch>
      </Router>
    </Box>
  );
};

export default AppRoutes;
