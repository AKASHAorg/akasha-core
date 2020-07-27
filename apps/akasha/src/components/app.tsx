import * as React from 'react';
import DS from '@akashaproject/design-system';
import { BrowserRouter as Router, Route, RouteComponentProps, Switch } from 'react-router-dom';
import AKASHASettings from './settings-page';
import NewPostPage from './new-post-page';
import FeedPage from './feed-page';
import PostsPage from './posts-page';
import { I18nextProvider } from 'react-i18next';
import routes, { FEED, NEW_POST, POSTS, SETTINGS_PAGE } from '../routes';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const { ThemeSelector, lightTheme, darkTheme } = DS;

export default class Application extends React.Component<RootComponentProps> {
  render() {
    const { i18n, sdkModules, globalChannel, logger } = this.props;
    return (
      <ThemeSelector
        settings={{ activeTheme: 'Light-Theme' }}
        availableThemes={[lightTheme, darkTheme]}
      >
        <React.Suspense fallback={<>Loading</>}>
          <I18nextProvider i18n={i18n ? i18n : null}>
            <Router>
              <Switch>
                <Route
                  path={routes[NEW_POST]}
                  render={(routeProps: RouteComponentProps) => (
                    <NewPostPage
                      {...routeProps}
                      sdkModules={sdkModules}
                      globalChannel={globalChannel}
                      logger={logger}
                    />
                  )}
                />
                <Route
                  path={routes[SETTINGS_PAGE]}
                  render={(routeProps: RouteComponentProps) => (
                    <AKASHASettings
                      {...routeProps}
                      sdkModules={sdkModules}
                      globalChannel={globalChannel}
                      logger={logger}
                    />
                  )}
                />
                <Route
                  path={routes[FEED]}
                  render={(routeProps: RouteComponentProps) => (
                    <FeedPage
                      {...routeProps}
                      sdkModules={sdkModules}
                      globalChannel={globalChannel}
                      logger={logger}
                    />
                  )}
                />
                <Route
                  path={routes[POSTS]}
                  render={(routeProps: RouteComponentProps) => (
                    <PostsPage
                      {...routeProps}
                      sdkModules={sdkModules}
                      globalChannel={globalChannel}
                      logger={logger}
                    />
                  )}
                />
              </Switch>
            </Router>
          </I18nextProvider>
        </React.Suspense>
      </ThemeSelector>
    );
  }
}
