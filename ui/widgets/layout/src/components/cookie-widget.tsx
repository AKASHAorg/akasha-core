import React from 'react';
import { Translation } from 'react-i18next';

import DS from '@akashaproject/design-system';

const { CookieWidgetCard } = DS;

export interface ICookieWidgetProps {
  style?: React.CSSProperties;
  acceptCookie: (all?: boolean) => void;
}

const CookieWidget: React.FC<ICookieWidgetProps> = props => {
  return (
    <div style={{ ...props.style }}>
      <React.Suspense fallback={<></>}>
        <Translation>
          {t => (
            <CookieWidgetCard
              titleLabel={`${t('Cookies')} 🍪`}
              contentLabel={t(
                'To help provide you with the best experience when visiting this Website, we use cookies for security and product improvement purposes in accordance with our',
              )}
              privacyUrlLabel={t('Privacy Policy')}
              privacyUrl={`${window.location.protocol}//${window.location.host}/legal/privacy-policy`}
              onlyEssentialLabel={t('Only essential')}
              acceptAllLabel={t('Accept all')}
              onClickOnlyEssential={() => props.acceptCookie()}
              onClickAcceptAll={() => props.acceptCookie(true)}
            />
          )}
        </Translation>
      </React.Suspense>
    </div>
  );
};

export default CookieWidget;
