import { renderHook, act } from '@testing-library/react-hooks';
import { useDismissedCard } from '../use-dismissed-card';

describe('useDismissedCard', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('is callable', async () => {
    const { result } = renderHook(() => useDismissedCard());
    expect(result.current).toBeDefined();
  });
  it('should return an empty array of dismissed card IDs initially', async () => {
    const { result } = renderHook(() => useDismissedCard());
    expect(JSON.stringify(result.current[0])).toBe('[]');
  });
  it('should save dismissed card Ids to localstorage', async () => {
    const dismissedCardId = 'dismiss-private-alpha-notification';
    const { result } = renderHook(() => useDismissedCard());
    act(() => result.current[1](dismissedCardId));
    expect(JSON.stringify(result.current[0])).toBe(JSON.stringify([dismissedCardId]));
  });
  it('should get current saved dismissed card IDs from localstorage', async () => {
    const dismissedCardId1 = 'first-notification';
    const dismissedCardId2 = 'second-notification';
    const { result } = renderHook(() => useDismissedCard());
    act(() => {
      result.current[1](dismissedCardId1);
      result.current[1](dismissedCardId2);
    });

    expect(JSON.stringify(result.current[0])).toBe(
      JSON.stringify([dismissedCardId1, dismissedCardId2]),
    );
  });
});
