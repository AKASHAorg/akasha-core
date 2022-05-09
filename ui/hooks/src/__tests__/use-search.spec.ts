import { renderHook } from '@testing-library/react-hooks';
import { mockSDK } from '@akashaproject/af-testing';
import { createWrapper } from './utils';
import { of as mockOf } from 'rxjs';
import { useSearchComments, useSearchPosts, useSearchProfiles, useSearchTags } from '../use-search';
import * as moderation from '../use-moderation';
import { mockCheckModerationStatus } from '../__mocks__/moderation';
import { mockGlobalSearch, mockSearchProfiles, mockSearchTags } from '../__mocks__/search';
import { mockEntry } from '../__mocks__/posts';
import { mockGetComment } from '../__mocks__/comments';

jest.mock('@akashaproject/awf-sdk', () => {
  return () =>
    mockSDK({
      profile: {
        searchProfiles: () => mockOf({ data: mockSearchProfiles }),
        globalSearch: () => mockOf({ data: mockGlobalSearch }),
      },
      entries: {
        getEntry: () => mockOf({ data: mockEntry }),
      },
      comments: {
        getComment: () => mockOf(mockGetComment),
      },
      tags: {
        searchTags: () => mockOf({ data: mockSearchTags }),
      },
      common: {
        ipfs: {
          buildIpfsLinks: () => 'link',
        },
      },
    });
});

describe('useSearch', () => {
  beforeAll(() => {
    const mock = jest.spyOn(moderation, 'checkStatus');
    mock.mockReturnValue(new Promise(resolve => resolve(mockCheckModerationStatus)));
  });

  it('should get search profiles', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(() => useSearchProfiles('test', 1), {
      wrapper,
    });
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data).toHaveLength(5);
  });

  it('should get search posts', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(() => useSearchPosts('test', 1), {
      wrapper,
    });
    await waitFor(() => result.current.data.length > 0, { timeout: 5000 });
    expect(result.current.data).toHaveLength(5);
  });

  it('should get search comments', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(() => useSearchComments('test', 1), {
      wrapper,
    });
    await waitFor(() => result.current.data.length > 0, { timeout: 5000 });
    expect(result.current.data).toHaveLength(5);
  });

  it('should get search tags', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(() => useSearchTags('test'), {
      wrapper,
    });
    await waitFor(() => result.current.data.length > 0, { timeout: 5000 });
    expect(result.current.data).toHaveLength(2);
  });
});
