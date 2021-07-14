import React, { PureComponent, Suspense } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import TopbarComponent from './topbar-component';
import { BrowserRouter as Router } from 'react-router-dom';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import Fetch from 'i18next-fetch-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';

export default class TopbarWidget extends PureComponent<RootComponentProps> {
  public state: {
    hasErrors: boolean;
    errorMessage: string;
  };
  public showSidebarEvent = new CustomEvent('layout:showSidebar');
  public hideSidebarEvent = new CustomEvent('layout:hideSidebar');

  private subscription: any;
  constructor(props: RootComponentProps) {
    super(props);
    this.state = {
      hasErrors: false,
      errorMessage: '',
    };
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  public componentDidCatch(err: Error, info: React.ErrorInfo) {
    this.setState({
      hasErrors: true,
      errorMessage: `${err.message} :: ${info.componentStack}`,
    });
    const { logger } = this.props;
    logger.error('an error has occurred %j %j', err, info);
  }

  public toggleSidebar = (visible: boolean) => {
    if (visible) {
      window.dispatchEvent(this.showSidebarEvent);
    } else {
      window.dispatchEvent(this.hideSidebarEvent);
    }
  };
  public render() {
    const { logger } = this.props;

    if (this.state.hasErrors) {
      return (
        <div>
          Oh no, something went wrong in topbar-widget
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
        ns: ['ui-widget-topbar'],
        saveMissing: false,
        saveMissingTo: 'all',
        load: 'languageOnly',
        debug: true,
        cleanCode: true,
        keySeparator: false,
        defaultNS: 'ui-widget-topbar',
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
      <I18nextProvider i18n={i18next}>
        <Suspense fallback={<>...</>}>
          <Router>
            <TopbarComponent getMenuItems={this.props.getMenuItems} {...this.props} />
          </Router>
        </Suspense>
      </I18nextProvider>
    );
  }
}
