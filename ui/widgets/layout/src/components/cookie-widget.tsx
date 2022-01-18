import DS from '@akashaproject/design-system';
import { useAnalytics, CookieConsentTypes } from '@akashaproject/ui-awf-hooks';
import React from 'react';
import { Translation } from 'react-i18next';

const { CookieWidgetCard, Text } = DS;

export interface ICookieWidgetProps {
  style?: React.CSSProperties;
  navigateToUrl: (url: string) => void;
}

const CookieWidget: React.FC<ICookieWidgetProps> = props => {
  const [analytics, analyticsActions] = useAnalytics();
  const acceptCookie = (all?: boolean) => {
    analyticsActions.acceptConsent(all ? CookieConsentTypes.ALL : CookieConsentTypes.ESSENTIAL);
  };

  return (
    <>
      {!analytics.cookieBannerDismissed && (
        <div style={{ ...props.style }}>
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
                      onClick={() => props.navigateToUrl('/settings')}
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
                onClickOnlyEssential={() => acceptCookie()}
                onClickAcceptAll={() => acceptCookie(true)}
              />
            )}
          </Translation>
        </div>
      )}
    </>
  );
};

export default React.memo(CookieWidget);
