import * as React from 'react';
import { I18nextProvider } from 'react-i18next';
import DS from '@akashaproject/design-system';
import AppsCardWidget from './apps-card-widget';

const { lightTheme, darkTheme, ThemeSelector } = DS;

class Widget extends React.Component<{ i18n: any; logger: any }> {
  public state: { errors: any } = {
    errors: {},
  };
  public componentDidCatch(error: Error, errorInfo: any) {
    if (this.props.logger) {
      this.props.logger.error('community-widget error %j %j', error, errorInfo);
    }
    // just replace the state since we treat any error caught here
    // as critical one
    this.setState({
      errors: {
        'caught.critical': {
          error: error,
          componentStack: errorInfo.componentStack,
          critical: true,
        },
      },
    });
  }
  render() {
    return (
      <I18nextProvider i18n={this.props.i18n}>
        <React.Suspense fallback={<>...</>}>
          <ThemeSelector
            settings={{ activeTheme: 'Light-Theme' }}
            availableThemes={[lightTheme, darkTheme]}
            style={{ height: '100%' }}
            plain={true}
          >
            <AppsCardWidget />
          </ThemeSelector>
        </React.Suspense>
      </I18nextProvider>
    );
  }
}

export default Widget;
