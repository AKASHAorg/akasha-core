import { renderHook, act } from '@testing-library/react-hooks';
import { useDismissedCard } from '../use-dismissed-card';
import { localStorageMock } from '@akashaorg/af-testing';

const LOCAL_STORAGE_KEY = 'dismissed-card-ids';

const sampleId = 'sample-id';

describe('useDismissedCard', () => {
  beforeEach(() => {
    /**
     * resets value of local storage before each test
     */
    localStorageMock.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
  });

  it('is callable', async () => {
    const { result } = renderHook(() => useDismissedCard(sampleId, localStorageMock));

    expect(result.current).toBeDefined();
  });

  it('should save an id to localStorage', async () => {
    const dismissedCardId = 'dismiss-private-alpha-notification';
    const { result } = renderHook(() => useDismissedCard(dismissedCardId));

    // value is false
    expect(result.current[0]).not.toBeTruthy();

    // call the dismissCard function
    act(() => result.current[1]());

    // value is true
    expect(result.current[0]).toBeTruthy();
  });
});
