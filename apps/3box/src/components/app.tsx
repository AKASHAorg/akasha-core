import React, { PureComponent } from 'react';
import { I18nextProvider } from 'react-i18next';
import DS from '@akashaproject/design-system';
import Routes from './routes';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { getProfileStore } from '../state';
const { ThemeSelector, lightTheme, darkTheme, Box } = DS;

export default class App extends PureComponent<RootComponentProps> {
  public state: { errors: any } = {
    errors: {},
  };
  public componentDidCatch(error: Error, errorInfo: any) {
    if (this.props.logger) {
      this.props.logger.error('catched %j %j', error, errorInfo);
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
    const Profile = getProfileStore(sdkModules, globalChannel, logger);
    return (
      <Box width="100vw">
        <React.Suspense fallback={<>Loading</>}>
          <I18nextProvider i18n={i18n ? i18n : null}>
            <ThemeSelector
              settings={{ activeTheme: 'Light-Theme' }}
              availableThemes={[lightTheme, darkTheme]}
              plain={true}
            >
              <Profile.Provider>
                <Routes {...this.props} errors={this.state.errors} />
              </Profile.Provider>
            </ThemeSelector>
          </I18nextProvider>
        </React.Suspense>
      </Box>
    );
  }
}
