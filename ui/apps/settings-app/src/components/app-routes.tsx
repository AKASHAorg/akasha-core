import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { COOKIE_CONSENT_NAME, CookieConsentTypes } from '@akashaproject/ui-awf-hooks';

import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

import AppsOption from './option-apps';
import SettingsPage from './settings-page';
import PrivacyOption from './option-privacy';
import AppearanceOption from './option-appearance';

import routes, { APPEARANCE, APPS, HOME, PRIVACY, rootRoute } from '../routes';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const [theme, setTheme] = React.useState<string>('Light Theme');
  const cookieType = window.localStorage.getItem(COOKIE_CONSENT_NAME);
  const [checkedTracking, setCheckedTracking] = React.useState(
    cookieType === CookieConsentTypes.ALL,
  );
  const [checkedAutoUpdates, setCheckedAutoUpdates] = React.useState<boolean>(false);
  const [checkedDataAnalytics, setCheckedDataAnalytics] = React.useState<boolean>(false);

  const { t } = useTranslation('app-settings-ewa');

  const handleChevronLeftClick = () => props.singleSpa.navigateToUrl(routes[HOME]);

  const handleTrackingOptionChange = event => {
    setCheckedTracking(event.target.checked);
    if (cookieType) {
      if (event.target.checked) {
        if (cookieType === CookieConsentTypes.ESSENTIAL) {
          window.localStorage.setItem(COOKIE_CONSENT_NAME, CookieConsentTypes.ALL);
          if (window['_paq']) {
            window['_paq'].push(['forgetUserOptOut']);
          }
        }
      } else {
        window.localStorage.setItem(COOKIE_CONSENT_NAME, CookieConsentTypes.ESSENTIAL);
        if (window['_paq']) {
          window['_paq'].push(['optUserOut']);
        }
      }
    }
  };

  const handleAutoUpdatesChange = event => {
    setCheckedAutoUpdates(event.target.checked);
    // @TODO: handle auto updates subscription
  };

  const handleDataAnalyticsChange = event => {
    setCheckedDataAnalytics(event.target.checked);
    // @TODO: handle data analytics subscription
  };

  const handleThemeSelect = event => {
    setTheme(event.target.value);
    // @TODO: handle theme select
  };

  return (
    <Box>
      <Router>
        <Switch>
          <Route exact path={routes[HOME]}>
            <SettingsPage {...props} />
          </Route>
          <Route path={routes[PRIVACY]}>
            <PrivacyOption
              titleLabel={t('Privacy')}
              essentialCookiesLabel={t('Essential Cookies')}
              essentialCookiesInfo={t(
                'The collection and processing of these data are carried out for the purpose of enabling the use of our App (establishing a connection), ensuring system security and stability over the long term and optimising our internet presence as well as for internal statistical purposes. It is within our legitimate interest to process such data to offer you a well-functioning App. You can find out more by going to our ',
              )}
              trackingAnalyticsLabel={t('Tracking and Analytics')}
              trackingAnalyticsInfoIntro={t('We use ')}
              trackingAnalyticsInfo={t(
                " an open source analytics platform that will help us improve Ethereum World. As we respect your privacy, rest assured that we don't store personal identifiable information (PPI).",
              )}
              privacyPolicyLabel={t('Privacy Policy')}
              checkedTracking={checkedTracking}
              cookieType={cookieType}
              onTrackingOptionChange={handleTrackingOptionChange}
              OnChevronLeftClick={handleChevronLeftClick}
            />
          </Route>
          <Route path={routes[APPS]}>
            <AppsOption
              titleLabel={t('Apps')}
              autoUpdatesLabel={t('Automatic Updates')}
              autoUpdatesInfo={t(
                'Ensure you have all the latest version of your dapps, widgets & plugins. ',
              )}
              dataAnalyticsLabel={t('Data & Analytics')}
              dataAnalyticsinfo={t(
                'We track usage data and report any bugs or issues, by activting data will be able to report any issues one app usage.',
              )}
              checkedAutoUpdates={checkedAutoUpdates}
              checkedDataAnalytics={checkedDataAnalytics}
              onAutoUpdatesChange={handleAutoUpdatesChange}
              onDataAnalyticsChange={handleDataAnalyticsChange}
              OnChevronLeftClick={handleChevronLeftClick}
            />
          </Route>
          <Route path={routes[APPEARANCE]}>
            <AppearanceOption
              titleLabel="Appearance"
              appThemeLabel={t('App Theme')}
              appThemeInfo={t("Choose your preference for the Ethereum World's theme")}
              theme={theme}
              onThemeSelect={handleThemeSelect}
              OnChevronLeftClick={handleChevronLeftClick}
            />
          </Route>
          <Redirect exact={true} from={rootRoute} to={routes[HOME]} />
        </Switch>
      </Router>
    </Box>
  );
};

export default AppRoutes;
