import DS from '@akashaorg/design-system';
import React from 'react';
import { I18nextProvider, Translation } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
import {
  enableTracking,
  installPageTacking,
  installTrackingScript,
  registerEventBusSubscriber,
  uninstallPageTacking,
} from '../analytics';

const { CookieWidgetCard, Text } = DS;

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
              <CookieWidgetCard
                titleLabel={`${t('But first, cookies!')} 🙈🍪`}
                paragraphOneLabel={
                  <>
                    <Text size="medium">
                      {t(
                        'Ethereum World uses cookies. Some are essential for the technology to work, and others help us all improve things around here. You can contribute use data via ',
                      )}
                    </Text>
                    <Text
                      color="accentText"
                      size="medium"
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        window.open('https://matomo.org', 'Matomo', '_blank noopener noreferrer')
                      }
                    >
                      Matomo
                    </Text>
                    <Text size="medium">
                      {t(', an open source analytics platform, by choosing "Accept all".')}
                    </Text>
                  </>
                }
                paragraphTwoLabel={
                  <>
                    <Text>
                      {t(
                        'No personal identifiable information (PPI) will be stored. And if you change your mind at any time, you can always ',
                      )}
                    </Text>
                    <Text weight="bold">{t(' opt-out ')}</Text>
                    <Text>{t('via the ')}</Text>
                    <Text
                      color="accentText"
                      size="medium"
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        props.plugins['@akashaorg/app-routing']?.routing?.navigateTo?.({
                          appName: '@akashaorg/app-settings-ewa',
                          getNavigationUrl: navRoutes => navRoutes.Home,
                        })
                      }
                    >
                      {t('settings ')}
                    </Text>
                    {t('app.')}
                  </>
                }
                privacyCTALabel={t('For more info, see our ')}
                privacyUrlLabel={t('Privacy Policy.')}
                privacyUrl={`${window.location.protocol}//${window.location.host}/@akashaorg/app-legal/privacy-policy`}
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
