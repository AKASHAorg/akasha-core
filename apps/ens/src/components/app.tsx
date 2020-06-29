import React, { PureComponent } from 'react';
import { I18nextProvider } from 'react-i18next';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  RouteComponentProps,
  Redirect,
} from 'react-router-dom';
import EnsEditPage from './ens-edit-page';
import EnsSettings from './ens-settings-page';
import DS from '@akashaproject/design-system';
import { default as subRoutes, rootRoute, ENS_EDIT_PAGE, SETTINGS_PAGE } from '../routes';

const { ThemeSelector, lightTheme, darkTheme, ErrorInfoCard } = DS;

export default class App extends PureComponent<any> {
  public state: { errors: any } = {
    errors: {},
  };
  public componentDidCatch(error: Error, errorInfo: any) {
    if (this.props.logger) {
      this.props.logger.error('caught %j %j', error, errorInfo);
    }
    this.setState({
      errors: {
        'caught.critical': {
          error: new Error(`${error} \n Additional info: \n ${errorInfo}`),
          critical: false,
        },
      },
    });
  }
  public componentDidMount() {
    // catch all errors (in case of uncaught errors occures)
    // if an error bubbles up till here, it's generally uncaught one.
    // treat it as critical because we don't know about it
    window.onerror = (message, source, col, line, _error) => {
      if (this.props.logger) {
        this.props.logger.error('window error %j %j', _error, message);
      }
      this.setState({
        errors: {
          'uncaught.critical': {
            error: {
              message,
              stack: `Line: ${line} \nColumn: ${col} \nSource: ${source}`,
            },
            critical: true,
          },
        },
      });
    };
  }
  public render() {
    const { i18n, sdkModules, globalChannel, logger } = this.props;
    return (
      <React.Suspense fallback={<>Loading</>}>
        <I18nextProvider i18n={i18n ? i18n : null}>
          <ThemeSelector
            settings={{ activeTheme: 'Light-Theme' }}
            availableThemes={[lightTheme, darkTheme]}
            style={{ height: '100%' }}
            plain={true}
          >
            <ErrorInfoCard errors={this.state.errors}>
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
                        <EnsSettings
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
                  <Redirect
                    push={true}
                    from={rootRoute}
                    to={subRoutes[ENS_EDIT_PAGE]}
                    exact={true}
                  />
                </Switch>
              </Router>
            </ErrorInfoCard>
          </ThemeSelector>
        </I18nextProvider>
      </React.Suspense>
    );
  }
}
