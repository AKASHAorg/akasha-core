import { renderHook } from '@testing-library/react-hooks';
import { mockSDK } from '@akashaorg/af-testing';
import { mockGetComment, mockGetComments, mockGetReplies } from '../__mocks__/comments';
import { useComment, useInfiniteComments, useInfiniteReplies } from '../use-comments';
import * as moderation from '../use-moderation';
import { mockCheckModerationStatus } from '../__mocks__/moderation';
import { createWrapper } from './utils';

jest.mock('@akashaorg/awf-sdk', () => {
  return () =>
    mockSDK({
      comments: {
        getComments: () => Promise.resolve(mockGetComments),
        getComment: () => Promise.resolve(mockGetComment),
        getReplies: () => Promise.resolve(mockGetReplies),
      },
    });
});

describe('useComments', () => {
  beforeAll(() => {
    const mock = jest.spyOn(moderation, 'checkStatus');
    mock.mockReturnValue(new Promise(resolve => resolve(mockCheckModerationStatus)));
  });

  it('should get infinite comments', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(
      () => useInfiniteComments({ limit: 5, postID: '0x00' }, true),
      {
        wrapper,
      },
    );
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    const page = result.current.data.pages[0];
    expect(page.total).toBe(2);
    expect(page.results).toHaveLength(2);
    expect(page.results[0]).toBe('abcd');
  });

  it('should get infinite replies', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(
      () => useInfiniteReplies({ limit: 5, postID: '0x00', commentID: '0x11' }, true),
      {
        wrapper,
      },
    );
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    const page = result.current.data.pages[0];
    expect(page.total).toBe(2);
    expect(page.results).toHaveLength(2);
    expect(page.results[0]).toBe('abcd');
  });

  it('should get comment', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(() => useComment('0x00'), {
      wrapper,
    });
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    const comment = result.current.data;
    expect(comment.content).toHaveLength(3);
    expect(comment.author.name).toBe('TesterTest');
    expect(comment.delisted).toBeFalsy();
  });
});
