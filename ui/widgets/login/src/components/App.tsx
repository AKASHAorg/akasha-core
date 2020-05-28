import React, { PureComponent, Suspense } from 'react';
import DS from '@akashaproject/design-system';
import WidgetErrorCard from './widget-error-card';
import { I18nextProvider } from 'react-i18next';
import LoginWidget from './login-widget';

const { ThemeSelector, lightTheme, darkTheme } = DS;

export interface ILoginWidgetProps {
  logger: any;
  i18n: any;
  globalChannel?: any;
  sdkModules: any;
  layout: any;
}

export default class App extends PureComponent<ILoginWidgetProps> {
  public state: { errors: any } = {
    errors: {},
  };
  public componentDidCatch(error: Error, errorInfo: any) {
    if (this.props.logger) {
      this.props.logger.error('auth-widget error %j %j', error, errorInfo);
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

  public render() {
    return (
      <I18nextProvider i18n={this.props.i18n}>
        <Suspense fallback={<>...</>}>
          <ThemeSelector
            settings={{ activeTheme: 'Light-Theme' }}
            availableThemes={[lightTheme, darkTheme]}
            style={{ height: '100%' }}
            plain={true}
          >
            <WidgetErrorCard errors={this.state.errors}>
              <LoginWidget
                sdkModules={this.props.sdkModules}
                globalChannel={this.props.globalChannel}
                logger={this.props.logger}
                layoutConfig={this.props.layout}
              />
            </WidgetErrorCard>
          </ThemeSelector>
        </Suspense>
      </I18nextProvider>
    );
  }
}
