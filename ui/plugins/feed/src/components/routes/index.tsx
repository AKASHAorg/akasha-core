import DS from '@akashaproject/design-system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import FeedHomePage from './feed-home-page';
import routes, { MY_FEED_PAGE, SAVED_PAGE, rootRoute, SETTINGS_PAGE } from '../../routes';
import SavedEntriesPage from './saved-entries-page';
import SettingsPage from './settings-page';
import { useProfileState } from '../../state/profile-state';

const { Box, styled, useGlobalLogin } = DS;

export interface IRoutesProps {
  activeWhen: { path: string };
  mountParcel: any;
  i18n?: any;
  singleSpa: any;
  sdkModules: any;
  logger: any;
  globalChannel: any;
  isMobile: boolean;
}

const ArticleNotFound = () => {
  const { t } = useTranslation();
  return <div>{t('Article not found!')}</div>;
};

const FeedBox = styled(Box)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

/**
 *
 * @TODO: Add a new route loading only one card! static-like
 */

const Routes: React.FC<IRoutesProps> = props => {
  const [, profileStateActions] = useProfileState(props.sdkModules, props.logger);

  useGlobalLogin(
    props.globalChannel,
    profileStateActions.handleLoginSuccess,
    profileStateActions.handleLoginError,
  );

  return (
    <Router>
      <FeedBox>
        <Route
          path={`${rootRoute}`}
          component={() => (
            <>
              <Switch>
                <Route
                  path={`${routes[MY_FEED_PAGE]}`}
                  render={routeProps => <FeedHomePage {...props} {...routeProps} />}
                />
                <Route
                  path={routes[SAVED_PAGE]}
                  render={routeProps => <SavedEntriesPage {...props} {...routeProps} />}
                />
                <Route
                  path={`${routes[SETTINGS_PAGE]}`}
                  render={routeProps => <SettingsPage {...props} {...routeProps} />}
                />
                <Redirect from={`${rootRoute}`} to={`${routes[MY_FEED_PAGE]}`} />
                <Route component={ArticleNotFound} />
              </Switch>
            </>
          )}
        />
      </FeedBox>
    </Router>
  );
};

export default Routes;
