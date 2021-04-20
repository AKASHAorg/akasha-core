/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react-hooks';
import useAnalytics, { CookieConsentTypes } from '../use-analytics';

describe('useAnalytics', () => {
  it('should return [state, actions]', () => {
    const { result } = renderHook(() => useAnalytics());
    expect(result.current[0]).toBeDefined();
    expect(result.current[1]).toBeDefined();
  });

  it('should change state on .acceptConsent call', () => {
    const { result } = renderHook(() => useAnalytics());
    act(() => {
      result.current[1].acceptConsent(CookieConsentTypes.ALL);
    });
    expect(result.current[0].cookieBannerDismissed).toBe(true);
  });
});
