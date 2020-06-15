import DS from '@akashaproject/design-system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
// import WidgetList from '../widgets';
import FeedHomePage from './feed-home-page';
import routes, { MY_FEED_PAGE, SAVED_PAGE, rootRoute, SETTINGS_PAGE } from '../../routes';
import SavedEntriesPage from './saved-entries-page';
import SettingsPage from './settings-page';

const { Box, styled } = DS;

export interface IRoutesProps {
  activeWhen: { path: string };
  mountParcel: any;
  i18n?: any;
  singleSpa: any;
  sdkModules: any;
  logger: any;
}

const ArticleNotFound = () => {
  const { t } = useTranslation();
  return <div>{t('Article not found!')}</div>;
};

const FeedBox = styled(Box)`
  padding: 0.5em 0;
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    width: 100%;
  }
`;

// const WidgetBox = styled(Box)`
//   padding: 0.5em 0;
//   @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
//     max-width: 40%;
//     width: 100%;
//     margin: 0 1em;
//   }
// `;

const Feed = styled(Box)`
  height: 100%;
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const Routes: React.FC<IRoutesProps> = props => {
  return (
    <Router>
      <Feed>
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
      </Feed>
    </Router>
  );
};

export default Routes;
