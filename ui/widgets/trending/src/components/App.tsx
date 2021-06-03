import React, { PureComponent } from 'react';
import DS from '@akashaproject/design-system';
import { I18nextProvider } from 'react-i18next';
import TrendingWidgetComponent from './trending-widget-component';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import { i18n } from 'i18next';

const { ThemeSelector, lightTheme, darkTheme } = DS;

export interface ITrendingWidgetProps {
  logger: any;
  i18n: i18n;
  singleSpa: any;
  globalChannel: any;
  sdkModules: any;
  rxjsOperators: any;
  layout: any;
  errors?: { [key: string]: IAkashaError };
  installIntegration?: (name: string) => void;
  uninstallIntegration?: (name: string) => void;
}

export default class TrendingWidgetRoot extends PureComponent<ITrendingWidgetProps> {
  public state: { errors: any } = {
    errors: this.props.errors,
  };
  public componentDidCatch(error: Error, errorInfo: any) {
    if (this.props.logger) {
      this.props.logger.error('trending-widget error %j %j', error, errorInfo);
    }
    this.setState({
      errors: {
        'trendingWidget.app': {
          error: new Error(`${error} \n Additional info: \n ${errorInfo}`),
          critical: false,
        },
      },
    });
  }
  componentDidMount() {
    if (this.props.i18n) {
      this.props.i18n.loadNamespaces('ui-widget-trending');
    }
  }
  public render() {
    return (
      <React.Suspense fallback={<></>}>
        <I18nextProvider i18n={this.props.i18n} defaultNS="ui-widget-trending">
          <ThemeSelector
            settings={{ activeTheme: 'Light-Theme' }}
            availableThemes={[lightTheme, darkTheme]}
            style={{ height: '100%' }}
            plain={true}
          >
            <TrendingWidgetComponent {...this.props} />
          </ThemeSelector>
        </I18nextProvider>
      </React.Suspense>
    );
  }
}
