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
                titleLabel={`${t('The Choice is Yours')} 🤘🏼`}
                paragraphOneLabel={
                  <Text size="medium">
                    {t(
                      'We use cookies. Some are necessary to operate effectively the platform, others are to help us improve Ethereum World. ',
                    )}
                  </Text>
                }
                paragraphTwoLabel={
                  <>
                    <Text weight="bold">{t('By opting-in you allow us to collect data via ')}</Text>
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
                      ", an open source analytics platform that will help us improve Ethereum World. As we respect your privacy, rest assured that we don't store personal identifiable information (PPI). In addition, if you change your mind, ",
                    )}
                    <Text weight="bold">{t('you can always opt-out ')}</Text>
                    {t('by accessing the ')}
                    <Text
                      color="accentText"
                      size="medium"
                      style={{ cursor: 'pointer' }}
                      onClick={() => props.singleSpa.navigateToUrl('/settings-app')}
                    >
                      {t('settings ')}
                    </Text>
                    {t('menu')}.
                  </>
                }
                privacyCTALabel={t('For more info, see our ')}
                privacyUrlLabel={t('Privacy Policy.')}
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
