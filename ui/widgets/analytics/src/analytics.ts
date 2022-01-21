import { filter } from 'rxjs';
import type { SingleSpaCustomEventDetail } from 'single-spa';
import {
  AnalyticsEventData,
  AnalyticsEventTypes,
  TrackEventData,
} from '@akashaproject/ui-awf-typings/lib/analytics';
import { RootComponentProps } from '../../../typings/lib';

export interface CustomSingleSpaEvent extends Event {
  detail: SingleSpaCustomEventDetail;
  currentTarget: typeof window;
}
export const enableTracking = () => {
  if (window['_paq']) {
    window['_paq'].push(['setConsentGiven']);
    window['_paq'].push(['setCookieConsentGiven']);
    window['_paq'].push(['trackPageView']);
    window['_paq'].push(['enableLinkTracking']);
  }
};

export const trackEvent = (event: TrackEventData) => {
  if (checkTrackingIsAllowed() && window['_paq']) {
    window['_paq'].push(['trackEvent', event.category, event.action, event.name, event.value]);
  }
};

export const registerEventBusSubscriber = (eventBus: RootComponentProps['uiEvents']) => {
  return eventBus
    .pipe(filter(ev => ev.hasOwnProperty('eventType') && !!AnalyticsEventTypes[ev['eventType']]))
    .subscribe((event: AnalyticsEventData) => {
      if (!event) {
        return;
      }
      if (checkTrackingIsAllowed()) {
        switch (event.eventType) {
          // enable tracking can be 'requested' from another integration. e.g. User Settings
          case AnalyticsEventTypes.ENABLE_TRACKING:
            enableTracking();
            break;
          case AnalyticsEventTypes.TRACK_EVENT:
            trackEvent(event);
            break;
          default:
            break;
        }
      }
    });
};

export const installPageTacking = () => {
  window.addEventListener('single-spa:routing-event', trackRoutingEvent);
  // also track the current page
  if (window['_paq']) {
    window['_paq'].push(['trackPageView']);
  }
};

export const uninstallPageTacking = () => {
  window.removeEventListener('single-spa:routing-event', trackRoutingEvent);
};

export const trackRoutingEvent = (event: CustomSingleSpaEvent) => {
  if (checkTrackingIsAllowed() && window.hasOwnProperty('_paq')) {
    const { detail } = event;
    window['_paq'].push(['setCustomUrl', `${detail.newUrl}`]);
    window['_paq'].push(['setReferrerUrl', `${detail.oldUrl}`]);
    window['_paq'].push(['deleteCustomVariables', 'page']);
    window['_paq'].push(['trackPageView']);
  }
};

export const checkTrackingIsAllowed = () => {
  const matomo = window['Matomo'];
  // should we include browser DNT Feature? Deprecated in some browsers!
  // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/doNotTrack

  if (matomo && matomo.getTracker()?.hasConsent()) {
    return true;
  }
  return false;
};

export const installTrackingScript = ({ trackerUrl, siteId }) => {
  installMatomo({ trackerUrl, siteId });
};

export const installMatomo = ({ trackerUrl, siteId }) => {
  if (window.hasOwnProperty('Matomo')) {
    return;
  }

  const url = new URL(trackerUrl);
  const _paq = (window['_paq'] = window['_paq'] || []);
  _paq.push(['setTrackerUrl', `${url.toString()}matomo.php`]);
  _paq.push(['setSiteId', siteId]);
  const script = document.createElement('script');
  const headScript = document.getElementsByTagName('script')[0];
  script.type = 'text/javascript';
  script.src = `//cdn.matomo.cloud/${url.hostname}/matomo.js`;
  script.async = true;
  headScript.parentNode.insertBefore(script, headScript);
};
