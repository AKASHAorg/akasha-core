import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { COOKIE_CONSENT_NAME, CookieConsentTypes } from '@akashaorg/ui-awf-hooks';
import { EventTypes } from '@akashaorg/ui-awf-typings/lib/app-loader';
import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';

import AppsOption from './option-apps';
import SettingsPage from './settings-page';
import PrivacyOption from './option-privacy';
import AppearanceOption from './option-appearance';

import routes, { APPEARANCE, APPS, HOME, PRIVACY } from '../routes';

const { Box } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const currentTheme = window.localStorage.getItem('Theme');
  const [theme, setTheme] = React.useState<string>(currentTheme || 'Light-Theme');
  const cookieType = window.localStorage.getItem(COOKIE_CONSENT_NAME);
  const [checkedTracking, setCheckedTracking] = React.useState(
    cookieType === CookieConsentTypes.ALL,
  );
  const [checkedAutoUpdates, setCheckedAutoUpdates] = React.useState<boolean>(false);
  const [checkedDataAnalytics, setCheckedDataAnalytics] = React.useState<boolean>(false);

  const { t } = useTranslation('app-settings-ewa');

  const handleChevronLeftClick = () =>
    props.plugins?.routing?.navigateTo?.({
      appName: '@akashaorg/app-settings-ewa',
      getNavigationUrl: navRoutes => navRoutes.Home,
    });

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
    window.localStorage.setItem('Theme', event.target.value);

    /*
     * Custom event used in main html file
     * to update the theme in the <body> tag
     */
    const ev = new CustomEvent(EventTypes.ThemeChange, {
      detail: {
        theme: event.target.value,
      },
    });
    window.dispatchEvent(ev);
    /*
     * Propagate the change to all apps and widgets
     */
    props.uiEvents.next({
      event: EventTypes.ThemeChange,
      data: {
        name: event.target.value,
      },
    });
  };

  return (
    <Box>
      <Router basename={props.baseRouteName}>
        <Routes>
          <Route path={routes[HOME]} element={<SettingsPage {...props} />} />
          <Route
            path={routes[PRIVACY]}
            element={
              <PrivacyOption
                titleLabel={t('Privacy')}
                essentialCookiesLabel={t('Essential cookies')}
                essentialCookiesInfo1={t(
                  "We've gotta have essential cookies. The clue's in the name. They're essential to initiating your experience of Ethereum World, and keeping it secure, stable, and optimized so you'll feel like this is your kind of thing — to use, celebrate, and help grow. If you're a privacy geek like us, you'll find ",
                )}
                essentialCookiesInfo2={t(' makes for perfect bedtime reading.')}
                essentialCookiesInfo3={t(
                  'And the best thing about Ethereum World is that when we write “our app” and “our Privacy Policy” that means “your app” and “your Privacy Policy” because we’re doing this thing together.',
                )}
                privacyPolicyLabel={t('our privacy policy')}
                trackingAnalyticsLabel={t('Tracking and analytics')}
                trackingAnalyticsInfo1={t(
                  'As we’ve said ☝🏽, we’re doing this together. If you want to contribute some insight into how Ethereum World is used so we can all work all the more brilliantly to improve it, you can opt-in to our own ',
                )}
                trackingAnalyticsInfo2={t(
                  " analytics. We don't store personal identifiable information (PII) and you can opt-out at any time.",
                )}
                trackingAnalyticsLinkLabel={t('Click here to learn more.')}
                checkedTracking={checkedTracking}
                cookieType={cookieType}
                onTrackingOptionChange={handleTrackingOptionChange}
                onChevronLeftClick={handleChevronLeftClick}
              />
            }
          />
          <Route
            path={routes[APPS]}
            element={
              <AppsOption
                titleLabel={t('Apps')}
                autoUpdatesLabel={t('Automatic Updates')}
                autoUpdatesInfo={t(
                  'Ensure you have all the latest version of your apps, widgets & plugins. ',
                )}
                dataAnalyticsLabel={t('Data & Analytics')}
                dataAnalyticsinfo={t(
                  'We track usage data and report any bugs or issues, by activting data will be able to report any issues one app usage.',
                )}
                checkedAutoUpdates={checkedAutoUpdates}
                checkedDataAnalytics={checkedDataAnalytics}
                onAutoUpdatesChange={handleAutoUpdatesChange}
                onDataAnalyticsChange={handleDataAnalyticsChange}
                onChevronLeftClick={handleChevronLeftClick}
              />
            }
          />
          <Route
            path={routes[APPEARANCE]}
            element={
              <AppearanceOption
                titleLabel="Appearance"
                appThemeLabel={t('App Theme')}
                appThemeInfo={t(
                  'Choose your preferred Ethereum World’s theme. So what will it be today?',
                )}
                theme={theme}
                onThemeSelect={handleThemeSelect}
                onChevronLeftClick={handleChevronLeftClick}
              />
            }
          />
          <Route path="/" element={<Navigate to={routes[HOME]} replace />} />
        </Routes>
      </Router>
    </Box>
  );
};

export default AppRoutes;
