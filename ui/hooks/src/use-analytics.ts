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
  acceptConsent: (type: CookieConsentTypes) => void;
  /* Used to opt out a user from tracking */
  rejectConsent: () => void;
  /* Track an event. This is not used yet */
  trackEvent: (category: string, action: string, name: string, value?: string | number) => void;
}

export interface UseAnalyticsState {
  cookieBannerDismissed: null | boolean;
  consentType: null | CookieConsentTypes;
}

const hookGlobal = globalThis as any;

const useAnalytics = (): [UseAnalyticsState, UseAnalyticsActions] => {
  const [state, setState] = React.useState<UseAnalyticsState>({
    cookieBannerDismissed: null,
    consentType: null,
  });

  React.useLayoutEffect(() => {
    if (globalThis.localStorage) {
      const consentType = localStorage.getItem(COOKIE_CONSENT_NAME);
      if (consentType) {
        setState({
          cookieBannerDismissed: true,
          consentType: CookieConsentTypes[consentType],
        });
        if (consentType === CookieConsentTypes.ALL && hookGlobal._paq) {
          actions.enableTracking();
        }
      }
    }
  }, [hookGlobal._paq]);

  const actions: UseAnalyticsActions = {
    enableTracking() {
      if (hookGlobal._paq) {
        hookGlobal._paq.push(['setConsentGiven']);
        hookGlobal._paq.push(['setCookieConsentGiven']);
        hookGlobal._paq.push(['trackPageView']);
        hookGlobal._paq.push(['enableLinkTracking']);
      }
    },
    acceptConsent(type) {
      if (globalThis.localStorage) {
        localStorage.setItem(COOKIE_CONSENT_NAME, type);
        setState({
          cookieBannerDismissed: true,
          consentType: type,
        });
        if (type === CookieConsentTypes.ALL) {
          actions.enableTracking();
        }
      }
    },
    rejectConsent() {
      if (globalThis.localStorage) {
        localStorage.removeItem(COOKIE_CONSENT_NAME);
        setState({
          cookieBannerDismissed: null,
          consentType: null,
        });
        hookGlobal._paq.push(['forgetConsentGiven']);
        hookGlobal._paq.push(['forgetCookieConsentGiven']);
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
