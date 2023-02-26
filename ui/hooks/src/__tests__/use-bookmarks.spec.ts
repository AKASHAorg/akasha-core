import { act, renderHook } from '@testing-library/react-hooks';
import {
  BOOKMARKED_ENTRIES_KEY,
  useDeleteBookmark,
  useGetBookmarks,
  useSaveBookmark,
} from '../use-bookmarks';
import { mockSDK } from '@akashaorg/af-testing';
import { mockGetBookmarksAsync, mockQueryData } from '../__mocks__/bookmarks';
import { createWrapper } from './utils';

jest.mock('@akashaorg/awf-sdk', () => {
  return () =>
    mockSDK({
      settings: { get: () => mockGetBookmarksAsync, set: () => Promise.resolve({ data: 3 }) },
    });
});

describe('useBookmarks', () => {
  it('should return correct bookmarks', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(() => useGetBookmarks('0x00'), {
      wrapper,
    });
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    const { data } = result.current;
    expect(data).toHaveLength(4);
    if (data) {
      expect(data[0].entryId).toBe('01g0bxz7tgxx1ftbmark5v9tb1');
      expect(data[0].type).toBe(0);
    }
  });

  it('should save bookmarks', async () => {
    const [wrapper, queryClient] = createWrapper();
    queryClient.setQueryData([BOOKMARKED_ENTRIES_KEY], mockQueryData);
    const { result } = renderHook(() => useSaveBookmark(), {
      wrapper,
    });
    await act(async () => {
      await result.current.mutateAsync({ entryId: '0123', itemType: 0 });
      const bookmarks = queryClient.getQueryData([BOOKMARKED_ENTRIES_KEY]);
      expect(bookmarks).toHaveLength(mockQueryData.length + 1);
      expect(bookmarks[0].entryId).toBe('0123');
      expect(bookmarks[0].type).toBe(0);
    });
  });

  it('should delete bookmarks', async () => {
    const [wrapper, queryClient] = createWrapper();
    queryClient.setQueryData([BOOKMARKED_ENTRIES_KEY], mockQueryData);
    const { result } = renderHook(() => useDeleteBookmark(), {
      wrapper,
    });
    await act(async () => {
      await result.current.mutateAsync(mockQueryData[0].entryId);
      const bookmarks = queryClient.getQueryData([BOOKMARKED_ENTRIES_KEY]);
      expect(bookmarks).toHaveLength(mockQueryData.length - 1);
      expect(bookmarks[0].entryId).toBe('01g0bxz7tgxx1ftbmark5v9tb1');
      expect(bookmarks[0].type).toBe(0);
    });
  });
});
