import DS from '@akashaproject/design-system';
import { useAnalytics, CookieConsentTypes } from '@akashaproject/ui-awf-hooks';
import React from 'react';
import { Translation } from 'react-i18next';

const { CookieWidgetCard, Text } = DS;

export interface ICookieWidgetProps {
  style?: React.CSSProperties;
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
                titleLabel={`${t('But first, cookies!')} 🙈🍪`}
                contentLabel={
                  <>
                    {t(
                      'This website requires essential cookies for security and stability purposes. ',
                    )}
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
