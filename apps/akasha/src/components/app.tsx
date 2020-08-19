import * as React from 'react';
import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AKASHASettings from './settings-page';
import NewPostPage from './new-post-page';
import FeedPage from './feed-page';
import PostsPage from './posts-page';
import { I18nextProvider } from 'react-i18next';
import routes, { FEED, NEW_POST, POSTS, SETTINGS_PAGE } from '../routes';

const { ThemeSelector, lightTheme, darkTheme, Box } = DS;

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
              <Box>
                <Switch>
                  <Route path={routes[NEW_POST]}>
                    <NewPostPage
                      sdkModules={sdkModules}
                      globalChannel={globalChannel}
                      logger={logger}
                    />
                  </Route>
                  <Route path={routes[SETTINGS_PAGE]}>
                    <AKASHASettings
                      sdkModules={sdkModules}
                      globalChannel={globalChannel}
                      logger={logger}
                    />
                  </Route>
                  <Route path={routes[FEED]}>
                    <FeedPage
                      sdkModules={sdkModules}
                      globalChannel={globalChannel}
                      logger={logger}
                    />
                  </Route>
                  <Route path={routes[POSTS]}>
                    <PostsPage
                      sdkModules={sdkModules}
                      globalChannel={globalChannel}
                      logger={logger}
                    />
                  </Route>
                </Switch>
              </Box>
            </Router>
          </I18nextProvider>
        </React.Suspense>
      </ThemeSelector>
    );
  }
}
