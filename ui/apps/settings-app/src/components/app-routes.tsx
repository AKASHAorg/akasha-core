import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  COOKIE_CONSENT_NAME,
  CookieConsentTypes,
  useRootComponentProps,
  useTheme,
} from '@akashaorg/ui-awf-hooks';
import { EventTypes, UIEventData } from '@akashaorg/typings/lib/ui';
import ErrorBoundary, {
  ErrorBoundaryProps,
} from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import AppsOption from './option-apps';
import SettingsPage from './settings-page';
import PrivacyOption from './option-privacy';
import ThemeOption from './option-theme';
import NsfwOption from './option-nsfw';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import routes, { THEME, NSFW, APPS, HOME, PRIVACY } from '../routes';

export type theme = 'Light-Theme' | 'Dark-Theme';

const AppRoutes: React.FC<unknown> = () => {
  const [cookieType, setCookieType] = useState(window.localStorage.getItem(COOKIE_CONSENT_NAME));

  const [checkedTracking, setCheckedTracking] = useState<boolean>(
    cookieType === CookieConsentTypes.ALL,
  );
  const [checkedAutoUpdates, setCheckedAutoUpdates] = useState<boolean>(false);
  const [checkedDataAnalytics, setCheckedDataAnalytics] = useState<boolean>(false);

  const { theme, propagateTheme } = useTheme();
  const { baseRouteName, logger, uiEvents, getRoutingPlugin } = useRootComponentProps();
  const uiEventsRef = useRef(uiEvents);
  const { t } = useTranslation('app-settings-ewa');

  useEffect(() => {
    const eventsSub = uiEventsRef.current.subscribe({
      next: (eventInfo: UIEventData) => {
        // listen to set initial cookie type event when fired
        if (eventInfo.event === EventTypes.SetInitialCookieType) {
          // check for cookie type
          const _cookieType = window.localStorage.getItem(COOKIE_CONSENT_NAME);

          // if all cookies allowed, toggle checked tracking
          if (_cookieType === CookieConsentTypes.ALL) {
            setCheckedTracking(true);
          }

          setCookieType(_cookieType);
        }
      },
    });

    return () => {
      if (eventsSub) {
        eventsSub.unsubscribe();
      }
    };
  }, []);

  const routing = getRoutingPlugin();

  const handlePrivacyPolicyClick = () => {
    routing.navigateTo({
      appName: '@akashaorg/app-legal',
      getNavigationUrl: () => '/privacy-policy',
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

    propagateTheme(selectedTheme, true);
  };

  const errorBoundaryProps: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: 'script-error',
      title: t('Error in settings app'),
    },
    logger,
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>Settings | AKASHA World</title>
      </Helmet>
      <Router basename={baseRouteName}>
        <Routes>
          <Route
            path={routes[HOME]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <SettingsPage titleLabel={t('Settings')} />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[PRIVACY]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
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
                    " analytics. We don't store personal identifiable information (PII) and you can opt-out at any time. ",
                  )}
                  ctaLabel={t('Click here')}
                  trackingAnalyticsInfo4={t(' to learn more.')}
                  ctaUrl="https://forum.akasha.org/t/implementing-analytics-on-ethereum-world-an-open-discussion-on-the-rationale-and-your-choices/100"
                  checkedTracking={checkedTracking}
                  cookieType={cookieType}
                  onPrivacyPolicyClick={handlePrivacyPolicyClick}
                  onTrackingOptionChange={handleTrackingOptionChange}
                />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[APPS]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
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
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[THEME]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <ThemeOption
                  titleLabel="Theme"
                  themeIntroLabel={t('What mode are you feeling today?')}
                  themeSubtitleLabel={t(
                    'You can change your theme between dark mode or light mode! Which side are you on 😼',
                  )}
                  theme={theme}
                  onThemeSelect={handleThemeSelect}
                />
              </ErrorBoundary>
            }
          />
          <Route
            path={routes[NSFW]}
            element={
              <ErrorBoundary {...errorBoundaryProps}>
                <NsfwOption
                  titleLabel="NSFW Content"
                  introLabel={t('Show NSFW Content')}
                  subtitleLabel={t(
                    'If you enable NSFW content, any sensitive content will show up in your search results when you lookup anything.',
                  )}
                />
              </ErrorBoundary>
            }
          />
          <Route path="/" element={<Navigate to={routes[HOME]} replace />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
};

export default AppRoutes;
