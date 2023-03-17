import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { COOKIE_CONSENT_NAME, CookieConsentTypes } from '@akashaorg/ui-awf-hooks';
import { EventTypes, RootComponentProps } from '@akashaorg/typings/ui';
import DS from '@akashaorg/design-system';

import AppsOption from './option-apps';
import SettingsPage from './settings-page';
import PrivacyOption from './option-privacy';
import ThemeOption from './option-theme';

import routes, { THEME, APPS, HOME, PRIVACY } from '../routes';

const { Box } = DS;

export type theme = 'Light-Theme' | 'Dark-Theme';

const AppRoutes: React.FC<RootComponentProps> = props => {
  const currentTheme = window.localStorage.getItem('Theme') as theme | null;
  const cookieType = window.localStorage.getItem(COOKIE_CONSENT_NAME);

  const [theme, setTheme] = React.useState<theme | null>(currentTheme);
  const [checkedTracking, setCheckedTracking] = React.useState<boolean>(
    cookieType === CookieConsentTypes.ALL,
  );
  const [checkedAutoUpdates, setCheckedAutoUpdates] = React.useState<boolean>(false);
  const [checkedDataAnalytics, setCheckedDataAnalytics] = React.useState<boolean>(false);

  const { t } = useTranslation('app-settings-ewa');

  const routing = props.plugins['@akashaorg/app-routing']?.routing;

  const handlePrivacyPolicyClick = () => {
    routing.navigateTo({
      appName: '@akashaorg/app-legal',
      getNavigationUrl: () => '/legal/privacy-policy',
    });
  };

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

  const handleThemeSelect = () => {
    const selectedTheme = theme === 'Dark-Theme' ? 'Light-Theme' : 'Dark-Theme';

    setTheme(selectedTheme);

    window.localStorage.setItem('Theme', selectedTheme);

    /*
     * Custom event used in main html file
     * to update the theme in the <body> tag
     */
    const ev = new CustomEvent(EventTypes.ThemeChange, {
      detail: {
        theme: selectedTheme,
      },
    });

    window.dispatchEvent(ev);

    /*
     * Propagate the change to all apps and widgets
     */
    props.uiEvents.next({
      event: EventTypes.ThemeChange,
      data: {
        name: selectedTheme,
      },
    });
  };

  return (
    <Box>
      <Router basename={props.baseRouteName}>
        <Routes>
          <Route
            path={routes[HOME]}
            element={<SettingsPage titleLabel={t('Settings')} {...props} />}
          />
          <Route
            path={routes[PRIVACY]}
            element={
              <PrivacyOption
                titleLabel={t('Privacy')}
                worldLabel="AKASHA World"
                essentialCookiesLabel={t('Essential cookies')}
                essentialCookiesInfo1={t(
                  "We've gotta have essential cookies. The clue's in the name. They're essential to initiating your experience of ",
                )}
                essentialCookiesInfo2={t(
                  ", and keeping it secure, stable, and optimized so you'll feel like this is your kind of thing — to use, celebrate, and help grow. If you're a privacy geek like us, you'll find ",
                )}
                privacyPolicyLabel={t('our privacy policy')}
                essentialCookiesInfo3={t(' makes for perfect bedtime reading. ')}
                essentialCookiesInfo4={t(
                  "And the best thing about AKASHA World is that when we write “our app” and “our Privacy Policy” that means “your app” and “your Privacy Policy” because we're doing this thing together.",
                )}
                trackingAnalyticsLabel={t('Tracking and analytics')}
                trackingAnalyticsInfo1={t(
                  "As we've said ☝🏽, we're doing this together. If you want to contribute some insight into how ",
                )}
                trackingAnalyticsInfo2={t(
                  ' is used so we can all work all the more brilliantly to improve it, you can opt-in to our own ',
                )}
                matomoLabel="Matomo"
                matomoUrl="https://matomo.org"
                trackingAnalyticsInfo3={t(
                  " analytics. We don't store personal identifiable information (PII) and you can opt-out at any time.",
                )}
                ctaLabel={t('Click here')}
                trackingAnalyticsInfo4={t(' to learn more.')}
                ctaUrl="https://forum.akasha.org/t/implementing-analytics-on-ethereum-world-an-open-discussion-on-the-rationale-and-your-choices/100"
                checkedTracking={checkedTracking}
                cookieType={cookieType}
                onPrivacyPolicyClick={handlePrivacyPolicyClick}
                onTrackingOptionChange={handleTrackingOptionChange}
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
              />
            }
          />
          <Route
            path={routes[THEME]}
            element={
              <ThemeOption
                titleLabel="Theme"
                themeIntroLabel={t('What mode your feeling today?')}
                themeSubtitleLabel={t(
                  'You can change your theme between dark mode or light mode! Which side are you on 😼',
                )}
                theme={theme}
                onThemeSelect={handleThemeSelect}
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
