import * as React from 'react';
import DS from '@akashaproject/design-system';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  RouteComponentProps,
  Redirect,
} from 'react-router-dom';
import EnsEditPage from './ens-edit-page';
import EnsSettingsPage from './ens-settings-page';

import { default as subRoutes, rootRoute, ENS_EDIT_PAGE, SETTINGS_PAGE } from '../../routes';
import { useTranslation } from 'react-i18next';
import { IAppProps } from '../app';
import { useProfileState } from '../../state/profile-state';

const { ErrorInfoCard, useGlobalLogin, ErrorLoader } = DS;

export interface IPagesProps extends IAppProps {
  errors: any;
}

const Pages: React.FC<IPagesProps> = props => {
  const { errors, sdkModules, globalChannel, logger } = props;
  const { t } = useTranslation();
  const [, profileStateActions] = useProfileState(sdkModules, logger);

  useGlobalLogin(
    globalChannel,
    profileStateActions.handleLoginSuccess,
    profileStateActions.handleLoginError,
  );
  return (
    <ErrorInfoCard errors={errors}>
      {(messages, isCritical) => (
        <>
          {messages && (
            <ErrorLoader
              type="script-error"
              title={t('There was an error loading the entry')}
              details={t('We cannot show this entry right now')}
              devDetails={messages}
            />
          )}
          {!isCritical && (
            <Router>
              <Switch>
                <Route
                  path={subRoutes[ENS_EDIT_PAGE]}
                  render={routeProps => (
                    <>
                      <DS.Helmet>
                        <title>ENS | {ENS_EDIT_PAGE}</title>
                      </DS.Helmet>
                      <EnsEditPage
                        {...routeProps}
                        sdkModules={sdkModules}
                        globalChannel={globalChannel}
                        logger={logger}
                      />
                    </>
                  )}
                />
                <Route
                  path={subRoutes[SETTINGS_PAGE]}
                  render={(routeProps: RouteComponentProps) => (
                    <>
                      <DS.Helmet>
                        <title>ENS | {SETTINGS_PAGE}</title>
                      </DS.Helmet>
                      <EnsSettingsPage
                        {...routeProps}
                        sdkModules={sdkModules}
                        globalChannel={globalChannel}
                        logger={logger}
                      />
                    </>
                  )}
                />
                {/* Make the edit page default landing page for this app
                          404 routes gets redirected to this page also */}
                <Redirect push={true} from={rootRoute} to={subRoutes[ENS_EDIT_PAGE]} exact={true} />
              </Switch>
            </Router>
          )}
        </>
      )}
    </ErrorInfoCard>
  );
};

export default Pages;
