import * as React from 'react';
import {
  AnalyticsEventData,
  AnalyticsEventTypes,
  TrackEventData,
} from '@akashaproject/ui-awf-typings/lib/analytics';
import { BehaviorSubject } from 'rxjs';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const AnalyticsContext = React.createContext(null);

export const AnalyticsProvider: React.FC<RootComponentProps> = props => {
  const { uiEvents } = props;
  return <AnalyticsContext.Provider value={uiEvents}>{props.children}</AnalyticsContext.Provider>;
};

export interface UseAnalyticsActions {
  /* Track a custom event */
  trackEvent: (eventData: Omit<TrackEventData, 'eventType'>) => void;
}

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

export default useAnalytics;
