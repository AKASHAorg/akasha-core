import * as React from 'react';

export const COOKIE_CONSENT_NAME = 'ewa-cookie-consent';

export enum CookieConsentTypes {
  ESSENTIAL = 'ESSENTIAL',
  ALL = 'ALL',
}

export interface UseAnalyticsActions {
  /* enable tracking */
  enableTracking: () => void;
  /* Store cookie consent in localstorage and enable tracking if it's the case */
  acceptCookie: (type: CookieConsentTypes) => void;
  /* Track an event. This is not used yet */
  trackEvent: (category: string, action: string, name: string, value?: string | number) => void;
}

export interface UseAnalyticsState {
  consentGiven: null | boolean;
  consentType: null | CookieConsentTypes;
}

const hookGlobal = globalThis as any;

const useAnalytics = (): [UseAnalyticsState, UseAnalyticsActions] => {
  const [state, setState] = React.useState<UseAnalyticsState>({
    consentGiven: null,
    consentType: null,
  });

  React.useLayoutEffect(() => {
    if (globalThis.localStorage && hookGlobal._paq) {
      const consentType = localStorage.getItem(COOKIE_CONSENT_NAME);
      if (consentType) {
        setState({
          consentGiven: true,
          consentType: CookieConsentTypes[consentType],
        });
        if (consentType === CookieConsentTypes.ALL) {
          actions.enableTracking();
        }
      }
    }
  }, [hookGlobal._paq]);

  const actions: UseAnalyticsActions = {
    enableTracking() {
      if (hookGlobal._paq) {
        hookGlobal._paq.push(['setCookieConsentGiven']);
      }
    },
    acceptCookie(type) {
      if (globalThis.localStorage) {
        localStorage.setItem(COOKIE_CONSENT_NAME, type);
        setState({
          consentGiven: true,
          consentType: type,
        });
        if (type === CookieConsentTypes.ALL) {
          actions.enableTracking();
        }
      }
    },
    trackEvent(category, action, name, value) {
      if (hookGlobal._paq) {
        hookGlobal._paq.push(['trackEvent', category, action, name, value]);
      }
    },
  };

  return [state, actions];
};

export default useAnalytics;
