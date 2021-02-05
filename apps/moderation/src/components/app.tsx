import * as React from 'react';
import DS from '@akashaproject/design-system';
import { IAkashaError, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { I18nextProvider } from 'react-i18next';

import AppRoutes from './app-routes';

import { getLoggedProfileStore } from '../state/logged-profile-state';

const { ThemeSelector, lightTheme, darkTheme, Box } = DS;

export default class Application extends React.Component<RootComponentProps> {
  public state: { errors: any } = {
    errors: {},
  };
  public componentDidCatch(error: Error, errorInfo: any) {
    if (this.props.logger) {
      this.props.logger.error('moderation-app error %j %j', error, errorInfo);
    }
    if (!this.state.errors['caught.critical']) {
      this.setState({
        errors: {
          'caught.critical': {
            error: new Error(`${error} \n Additional info: \n ${errorInfo}`),
            critical: false,
          },
        },
      });
    }
  }
  public handleError(err: IAkashaError) {
    if (this.props.logger) {
      this.props.logger.error('moderation-app error %j', err);
    }
    if (!this.state.errors[err.errorKey]) {
      this.setState({
        errors: {
          [err.errorKey]: err,
        },
      });
    }
  }
  render() {
    const { i18n } = this.props;
    const Login = getLoggedProfileStore(
      this.props.sdkModules,
      this.props.globalChannel,
      this.props.logger,
    );

    return (
      <Box width="100vw">
        <React.Suspense fallback={<>Loading</>}>
          <ThemeSelector
            settings={{ activeTheme: 'Light-Theme' }}
            availableThemes={[lightTheme, darkTheme]}
          >
            <I18nextProvider i18n={i18n ? i18n : null}>
              <Login.Provider>
                <AppRoutes {...this.props} profileStore={Login} onError={this.handleError} />
              </Login.Provider>
            </I18nextProvider>
          </ThemeSelector>
        </React.Suspense>
      </Box>
    );
  }
}
