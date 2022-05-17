import * as React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { uiEventsMock } from '@akashaorg/af-testing';
import useAnalytics, { AnalyticsProvider } from '../use-analytics';

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
      next: (data: { eventType: number; test: boolean }) => {
        expect(data.eventType).toBe(1);
        expect(data.test).toBeTruthy();
        done();
      },
    });
    trackEvent({ test: true });
  });
});
