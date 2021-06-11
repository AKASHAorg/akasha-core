import React, { PureComponent } from 'react';
import DS from '@akashaproject/design-system';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import TrendingWidgetComponent from './trending-widget-component';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import Fetch from 'i18next-fetch-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';

const { ThemeSelector, lightTheme, darkTheme } = DS;

export interface ITrendingWidgetProps {
  logger: any;
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
  // componentDidMount() {
  //   if (this.props.i18n) {
  //     this.props.i18n.loadNamespaces('ui-widget-trending');
  //   }
  // }
  public render() {
    const { logger } = this.props;

    i18next
      .use(initReactI18next)
      .use(Backend)
      .use(LanguageDetector)
      .use({
        type: 'logger',
        log: logger.info,
        warn: logger.warn,
        error: logger.error,
      })
      .init({
        fallbackLng: 'en',
        ns: ['trending'],
        saveMissing: false,
        saveMissingTo: 'all',
        load: 'languageOnly',
        debug: true,
        cleanCode: true,
        keySeparator: false,
        defaultNS: 'trending',
        backend: {
          backends: [LocalStorageBackend, Fetch],
          backendOptions: [
            {
              prefix: 'i18next_res_v0',
              expirationTime: 24 * 60 * 60 * 1000,
            },
            {
              loadPath: '/locales/{{lng}}/{{ns}}.json',
            },
          ],
        },
      });

    return (
      <React.Suspense fallback={<></>}>
        <I18nextProvider i18n={i18next} defaultNS="ui-widget-trending">
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
