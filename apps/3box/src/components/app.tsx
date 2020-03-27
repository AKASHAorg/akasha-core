import React, { PureComponent } from 'react';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MyBoxProfile from './profile';
import DS from '@akashaproject/design-system';
import { default as subRoutes, rootRoute, EDIT_PAGE } from '../routes';

const { ThemeSelector, lightTheme, darkTheme } = DS;

const PageNotFound = () => {
  return (
    <div>
      This page is unknown to <code>3Box app</code>
    </div>
  );
};

export default class App extends PureComponent<any> {
  public state: { error: Error | null; errorInfo: { componentStack: string } } = {
    error: null,
    errorInfo: { componentStack: '' },
  };
  public componentDidCatch(error: Error, errorInfo: any) {
    this.setState({
      error,
      errorInfo,
    });
  }
  public render() {
    const { i18n, sdkModules, channelUtils } = this.props;
    if (this.state.error) {
      return (
        <div>
          <div>An error occured in 3box app.</div>
          <div>Error:</div>
          <code style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.message}
          </code>
          <div>Stack:</div>
          <code style={{ whiteSpace: 'pre-wrap' }}>{this.state.errorInfo.componentStack}</code>
        </div>
      );
    }
    return (
      <React.Suspense fallback={<>Loading</>}>
        <I18nextProvider i18n={i18n ? i18n : null}>
          <ThemeSelector
            settings={{ activeTheme: 'Light-Theme' }}
            availableThemes={[lightTheme, darkTheme]}
            style={{ height: '100%' }}
            plain={true}
          >
            <Router>
              <Switch>
                <Route
                  path={subRoutes[EDIT_PAGE]}
                  render={routeProps => (
                    <MyBoxProfile
                      {...routeProps}
                      sdkModules={sdkModules}
                      channelUtils={channelUtils}
                    />
                  )}
                />
                <Route path={rootRoute} component={PageNotFound} />
              </Switch>
            </Router>
          </ThemeSelector>
        </I18nextProvider>
      </React.Suspense>
    );
  }
}
