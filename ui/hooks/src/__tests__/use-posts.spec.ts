import { renderHook } from '@testing-library/react-hooks';
import { mockSDK } from '@akashaorg/af-testing';
import { of as mockOf } from 'rxjs';
import * as moderation from '../use-moderation';
import { mockCheckModerationStatus } from '../__mocks__/moderation';
import { createWrapper } from './utils';
import { useInfinitePosts, useInfinitePostsByAuthor, usePost, usePosts } from '../use-posts';
import { mockUser } from '../__mocks__/user';
import { mockEntriesByAuthor, mockEntry, mockGetEntries } from '../__mocks__/posts';

jest.mock('@akashaorg/awf-sdk', () => {
  return () =>
    mockSDK({
      auth: {
        getCurrentUser: () => mockOf({ data: mockUser }),
      },
      entries: {
        entriesByAuthor: () => mockOf({ data: mockEntriesByAuthor }),
        getEntry: () => mockOf({ data: mockEntry }),
        getEntries: () => mockOf({ data: mockGetEntries }),
      },
    });
});

describe('usePosts', () => {
  beforeAll(() => {
    const mock = jest.spyOn(moderation, 'checkStatus');
    mock.mockReturnValue(new Promise(resolve => resolve(mockCheckModerationStatus)));
  });

  it('should get infinite posts', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(() => useInfinitePosts(5), {
      wrapper,
    });
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    const { pages } = result.current.data;
    expect(pages[0].total).toBe(416);
    expect(pages[0].results).toHaveLength(15);
  });

  it('should get post', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(
      () => usePost({ postId: mockEntry.getPost._id, loggedUser: mockUser.pubKey, enabler: true }),
      {
        wrapper,
      },
    );
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    const post = result.current.data;
    expect(post.content).toHaveLength(2);
    expect(post.author.name).toBe('Tetrarcha');
  });

  it('should get posts', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(
      () =>
        usePosts({
          postIds: mockGetEntries.posts.results.map(result => result._id),
          loggedUser: mockUser.pubKey,
          enabler: true,
        }),
      {
        wrapper,
      },
    );

    await waitFor(() => result.current[0].isFetched, { timeout: 5000 });
    const post = result.current[0].data;
    expect(post.content).toHaveLength(2);
    expect(post.author.name).toBe('Tetrarcha');
  });

  it('should get posts by author', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(
      () => useInfinitePostsByAuthor(mockUser.pubKey, 5, true),
      {
        wrapper,
      },
    );
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    const { pages } = result.current.data;
    expect(pages[0].total).toBe(3);
    expect(pages[0].results).toHaveLength(3);
  });
});
