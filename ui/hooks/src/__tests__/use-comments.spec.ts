import { renderHook } from '@testing-library/react-hooks';
import { mockSDK } from '@akashaproject/af-testing';
import { of as mockOf } from 'rxjs';
import { mockGetComment, mockGetComments } from '../__mocks__/comments';
import { useComment, useInfiniteComments } from '../use-comments';
import * as moderation from '../use-moderation';
import { mockCheckModerationStatus } from '../__mocks__/moderation';
import { createWrapper } from './utils';

jest.mock('@akashaproject/awf-sdk', () => {
  return () =>
    mockSDK({
      comments: {
        getComments: () => mockOf(mockGetComments),
        getComment: () => mockOf(mockGetComment),
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
    const { result, waitFor } = renderHook(() => useInfiniteComments(5, '0x00'), {
      wrapper,
    });
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
