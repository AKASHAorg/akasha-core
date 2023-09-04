import * as React from 'react';
import { BehaviorSubject } from 'rxjs';

import { AnalyticsEventData, AnalyticsEventTypes, TrackEventData } from '@akashaorg/typings/ui';

import { useRootComponentProps } from './use-root-props';

/**
 * @internal
 */
export const COOKIE_CONSENT_NAME = 'ewa-cookie-consent';

export enum CookieConsentTypes {
  ESSENTIAL = 'ESSENTIAL',
  ALL = 'ALL',
}

const AnalyticsContext = React.createContext(null);

const AnalyticsProvider = ({ children }: { children?: React.ReactNode }) => {
  const { uiEvents } = useRootComponentProps();

  return <AnalyticsContext.Provider value={uiEvents}>{children}</AnalyticsContext.Provider>;
};

export interface UseAnalyticsActions {
  /* Track a custom event */
  trackEvent: (eventData: Omit<TrackEventData, 'eventType'>) => void;
}

/**
 * Hook to handle analytics
 * @example useAnalytics hook
 * ```typescript
 * const [analyticsActions] = useAnalytics();
 *
 * analyticsActions.trackEvent({
 category: 'some-category',
 action: 'some-action',
 });
 * ```
 */
const useAnalytics = (): [UseAnalyticsActions] => {
  const analyticsBus = React.useContext<BehaviorSubject<AnalyticsEventData>>(AnalyticsContext);

  if (!analyticsBus) {
    throw new Error('useAnalytics must be used within a AnalyticsProvider!');
  }

  const actions: UseAnalyticsActions = {
    trackEvent(eventData) {
      analyticsBus.next({
        eventType: AnalyticsEventTypes.TRACK_EVENT,
        ...eventData,
      });
    },
  };

  return [actions];
};

export { useAnalytics, AnalyticsProvider };
