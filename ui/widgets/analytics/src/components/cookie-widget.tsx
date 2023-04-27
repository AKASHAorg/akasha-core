import React from 'react';
import CookieCard from '@akashaorg/design-system-components/lib/components/CookieCard';
import { I18nextProvider, Translation } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
import {
  enableTracking,
  installPageTacking,
  installTrackingScript,
  registerEventBusSubscriber,
  uninstallPageTacking,
} from '../analytics';

export const COOKIE_CONSENT_NAME = 'ewa-cookie-consent';

export enum CookieConsentTypes {
  ESSENTIAL = 'ESSENTIAL',
  ALL = 'ALL',
}

const CookieWidget: React.FC<RootComponentProps> = props => {
  const [cookieType, setCookieType] = React.useState(null);
  const eventSub = React.useRef(null);
  const analyticsConfig = React.useRef(props.worldConfig.analytics);
  const uiEvents = React.useRef(props.uiEvents);
  React.useLayoutEffect(() => {
    const consentType = window.localStorage.getItem(COOKIE_CONSENT_NAME);
    if (consentType) {
      setCookieType(consentType);
    } else {
      setCookieType(null);
    }
  }, []);

  React.useEffect(() => {
    if (cookieType && cookieType === CookieConsentTypes.ESSENTIAL) {
      return;
    }
    if (cookieType && cookieType === CookieConsentTypes.ALL) {
      if (analyticsConfig.current) {
        installTrackingScript(analyticsConfig.current);
        enableTracking();
        installPageTacking();
        eventSub.current = registerEventBusSubscriber(uiEvents.current);
      }
    }
    return () => {
      if (eventSub.current) {
        eventSub.current.unsubscribe();
      }
      uninstallPageTacking();
    };
  }, [cookieType]);

  const handleAcceptCookie = (all?: boolean) => {
    window.localStorage.setItem(
      COOKIE_CONSENT_NAME,
      all ? CookieConsentTypes.ALL : CookieConsentTypes.ESSENTIAL,
    );
    setCookieType(all ? CookieConsentTypes.ALL : CookieConsentTypes.ESSENTIAL);
  };

  return (
    <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
      {cookieType === null && (
        <div>
          <Translation ns="ui-widget-analytics">
            {t => (
              <CookieCard
                titleLabel={t('The Choice is Yours 🤘🏼')}
                paragraphOneLabel={t(
                  `We use cookies. Some are necessary to operate effectively the platform, others are to help us improve AKASHA World.`,
                )}
                paragraphTwo={{
                  ctaLabel: t(`By opting-in you allow us to collect data via `),
                  analyticsLabel: t('Matomo'),
                  analyticsURL: 'https://matomo.org',
                  middleParagraphLabeL: t(
                    `, an open source analytics platform that will help us improve AKASHA World. As we respect your privacy, rest assured that we don't store personal identifiable information (PII). In addition, if you change your mind, you can always opt-out by accessing the `,
                  ),
                  settingsLabel: t('settings '),
                  onSettingsClick: () =>
                    props.plugins['@akashaorg/app-routing']?.routing?.navigateTo?.({
                      appName: '@akashaorg/app-settings-ewa',
                      getNavigationUrl: navRoutes => navRoutes.Home,
                    }),
                  lastParagraphLabel: t(' menu.'),
                }}
                paragraphThree={{
                  ctaLabel: t('For more info, see our '),
                  urlLabel: t('Privacy Policy'),
                  url: `${window.location.protocol}//${window.location.host}/@akashaorg/app-legal/privacy-policy`,
                }}
                onlyEssentialLabel={t('Only essential')}
                acceptAllLabel={t('Accept all')}
                onClickOnlyEssential={() => handleAcceptCookie()}
                onClickAcceptAll={() => handleAcceptCookie(true)}
              />
            )}
          </Translation>
        </div>
      )}
    </I18nextProvider>
  );
};

export default React.memo(CookieWidget);
