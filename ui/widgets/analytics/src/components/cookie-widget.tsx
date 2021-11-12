import DS from '@akashaproject/design-system';
import i18next from '../i18n';
import React from 'react';
import { I18nextProvider, Translation } from 'react-i18next';
import { RootComponentProps } from '../../../../typings/lib';
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
  const analyticsConfig = React.useRef(props.analytics);
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
    <I18nextProvider i18n={i18next}>
      {cookieType === null && (
        <div>
          <Translation>
            {t => (
              <CookieWidgetCard
                titleLabel={`${t('But first, cookies')}! 🙈🍪`}
                contentLabel={
                  <>
                    {`${t(
                      'This website requires essential cookies for security and stability purposes',
                    )}. `}
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
                    {t(
                      ' cookies and tracking can be accepted for product improvement according to our',
                    )}
                  </>
                }
                privacyUrlLabel={`${t('Privacy Policy')}.`}
                privacyUrl={`${window.location.protocol}//${window.location.host}/legal/privacy-policy`}
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
