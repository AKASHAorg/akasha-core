import React, { PureComponent } from 'react';
import DS from '@akashaproject/design-system';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import TrendingWidgetComponent from './trending-widget-component';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import Fetch from 'i18next-fetch-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const { ThemeSelector, lightTheme, darkTheme } = DS;

export default class TrendingWidgetRoot extends PureComponent<RootComponentProps> {
  public state: {
    hasErrors: boolean;
    errorMessage: string;
  };
  constructor(props: RootComponentProps) {
    super(props);
    this.state = {
      hasErrors: false,
      errorMessage: '',
    };
  }
  public componentDidCatch(err: Error, info: React.ErrorInfo) {
    this.setState({
      hasErrors: true,
      errorMessage: `${err.message} :: ${info.componentStack}`,
    });
    const { logger } = this.props;
    logger.error('an error has occurred %j %j', err, info);
  }
  // componentDidMount() {
  //   if (this.props.i18n) {
  //     this.props.i18n.loadNamespaces('ui-widget-trending');
  //   }
  // }
  public render() {
    const { logger } = this.props;

    if (this.state.hasErrors) {
      return (
        <div>
          Oh no, something went wrong in trending-widget
          <div>
            <code>{this.state.errorMessage}</code>
          </div>
        </div>
      );
    }

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
