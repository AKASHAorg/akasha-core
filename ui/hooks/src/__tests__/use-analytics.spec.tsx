import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { uiEventsMock } from '@akashaorg/af-testing';
import { AnalyticsProvider, useAnalytics } from '../use-analytics';
import {
  AnalyticsCategories,
  AnalyticsEventData,
  AnalyticsEventTypes,
} from '@akashaorg/typings/lib/ui';
import { filterEvent } from '../utils/event-utils';

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
    uiEventsMock.pipe(filterEvent(AnalyticsEventTypes.TRACK_EVENT)).subscribe({
      next: (evData: AnalyticsEventData) => {
        expect(evData.event).toBeDefined();
        expect(evData.event).toEqual(AnalyticsEventTypes.TRACK_EVENT);
        expect(evData.data.category).toEqual(AnalyticsCategories.EXPLORE);
        done();
      },
    });
    trackEvent({ category: AnalyticsCategories.EXPLORE });
  });
});
