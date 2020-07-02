import React, { PureComponent } from 'react';
import { I18nextProvider } from 'react-i18next';

import DS from '@akashaproject/design-system';
import Pages from './pages';

const { ThemeSelector, lightTheme, darkTheme } = DS;

export interface IAppProps {
  sdkModules: any;
  globalChannel: any;
  logger: any;
  i18n: any;
}

export default class App extends PureComponent<IAppProps> {
  public state: { errors: any } = {
    errors: {},
  };
  public componentDidCatch(error: Error, errorInfo: any) {
    if (this.props.logger) {
      this.props.logger.error('caught %j %j', error, errorInfo);
    }
    if (!this.state.errors[error.name]) {
      this.setState({
        errors: {
          [error.name]: {
            error: new Error(`${error} \n Additional info: \n ${errorInfo}`),
            critical: false,
          },
        },
      });
    }
  }
  static getDerivedStateFromError = (err: Error) => {
    return {
      errors: {
        [err.name]: {
          error: new Error(`${err.name} \n Additional info: \n ${err.message}`),
          critical: false,
        },
      },
    };
  };

  public componentDidMount() {
    // catch all errors (in case of uncaught errors occures)
    // if an error bubbles up till here, it's generally uncaught one.
    // treat it as critical because we don't know about it
    window.onerror = (message, _source, _col, _line, error) => {
      if (this.props.logger) {
        this.props.logger.error('window error %j %j', error, message);
      }
    };
  }
  public render() {
    const { i18n } = this.props;
    return (
      <React.Suspense fallback={<>Loading</>}>
        <I18nextProvider i18n={i18n ? i18n : null}>
          <ThemeSelector
            settings={{ activeTheme: 'Light-Theme' }}
            availableThemes={[lightTheme, darkTheme]}
            style={{ height: '100%' }}
            plain={true}
          >
            <Pages {...this.props} errors={this.state.errors} />
          </ThemeSelector>
        </I18nextProvider>
      </React.Suspense>
    );
  }
}
