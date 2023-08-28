import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { uiEventsMock } from '@akashaorg/af-testing';
// @ts-ignore
import { AnalyticsProvider, useAnalytics } from '../use-analytics';
import { AnalyticsCategories, AnalyticsEventTypes, TrackEventData } from '@akashaorg/typings/ui';

describe('useAnalytics', () => {
  const wrapper = ({ children }) => (
    <AnalyticsProvider uiEvents={uiEventsMock}>{children}</AnalyticsProvider>
  );

  it('should return [actions]', () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper });
    expect(result.current[0]).toBeDefined();
  });

  it('Calling trackEvent should correctly update uiEvents bus', done => {
    const { result } = renderHook(() => useAnalytics(), { wrapper });
    const { trackEvent } = result.current[0];
    uiEventsMock.subscribe({
      next: (ev: TrackEventData) => {
        expect(ev.eventType).toBeDefined();
        expect(ev.eventType).toEqual(AnalyticsEventTypes.TRACK_EVENT);
        expect(ev.category).toEqual(AnalyticsCategories.EXPLORE);
        done();
      },
    });
    trackEvent({ category: AnalyticsCategories.EXPLORE });
  });
});
