import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { AnalyticsProvider, useAnalytics } from '../use-analytics';
import { AnalyticsCategories } from '@akashaorg/typings/ui';

describe('useAnalytics', () => {
  const wrapper = ({ children }) => <AnalyticsProvider>{children}</AnalyticsProvider>;

  it.skip('should return [actions]', () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper });
    expect(result.current[0]).toBeDefined();
  });

  it.skip('Calling trackEvent should correctly update uiEvents bus', () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper });
    const { trackEvent } = result.current[0];
    // uiEventsMock.subscribe({
    //   next: (ev: TrackEventData) => {
    //     expect(ev.eventType).toBeDefined();
    //     expect(ev.eventType).toEqual(AnalyticsEventTypes.TRACK_EVENT);
    //     expect(ev.category).toEqual(AnalyticsCategories.EXPLORE);
    //     done();
    //   },
    // });
    trackEvent({ category: AnalyticsCategories.EXPLORE });
  });
});
