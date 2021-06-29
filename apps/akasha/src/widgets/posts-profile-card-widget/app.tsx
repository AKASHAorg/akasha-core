import * as React from 'react';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import DS from '@akashaproject/design-system';
import ProfileCardWidget from './profile-card-widget';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import routes, { POST } from '../../routes';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-chained-backend';
import Fetch from 'i18next-fetch-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';

const { ThemeSelector, lightTheme, darkTheme, ErrorInfoCard, ErrorLoader } = DS;

class Widget extends React.Component<RootComponentProps> {
  public state: { errors: any } = {
    errors: {},
  };
  public componentDidCatch(error: Error, errorInfo: any) {
    if (this.props.logger) {
      this.props.logger.error('posts-profile-widget error %j %j', error, errorInfo);
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
        ns: ['posts-profile-card-widget'],
        saveMissing: false,
        saveMissingTo: 'all',
        load: 'languageOnly',
        debug: true,
        cleanCode: true,
        keySeparator: false,
        defaultNS: 'posts-profile-card-widget',
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
        <React.Suspense fallback={<>...</>}>
          <ThemeSelector
            settings={{ activeTheme: 'Light-Theme' }}
            availableThemes={[lightTheme, darkTheme]}
            style={{ height: '100%', width: '100vw', maxWidth: '100%' }}
            plain={true}
          >
            <Router>
              <ErrorInfoCard errors={this.state.errors}>
                {(messages, isCritical) => {
                  return (
                    <>
                      {messages && (
                        <ErrorLoader
                          type="script-error"
                          title={'Widget error'}
                          details={'Cannot load Profile card widget'}
                          devDetails={messages}
                        />
                      )}
                      {!isCritical && (
                        <Route path={`${routes[POST]}/:postId`}>
                          <ProfileCardWidget {...this.props} />
                        </Route>
                      )}
                    </>
                  );
                }}
              </ErrorInfoCard>
            </Router>
          </ThemeSelector>
        </React.Suspense>
      </I18nextProvider>
    );
  }
}

export default Widget;
