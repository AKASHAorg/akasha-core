import { act, renderHook } from '@testing-library/react-hooks';
import { mockSDK } from '@akashaorg/af-testing';
import { of as mockOf } from 'rxjs';
import {
  mockCreateCommentInput,
  mockCreateCommentResponse,
  mockDeleteCommentResponse,
  mockEditCommentInput,
  mockEditCommentResponse,
  mockGetComment,
} from '../__mocks__/comments';
import { useCreateComment, useDeleteComment, useEditComment } from '../use-comments';
import * as moderation from '../use-moderation';
import { mockCheckModerationStatus } from '../__mocks__/moderation';
import { ENTRY_KEY } from '../use-posts';
import { createWrapper } from './utils';

jest.mock('@akashaorg/awf-sdk', () => {
  return () =>
    mockSDK({
      comments: {
        getComment: () => mockOf(mockGetComment),
        removeComment: () => mockOf(mockDeleteCommentResponse),
        addComment: () => mockOf(mockCreateCommentResponse),
        editComment: () => mockOf(mockEditCommentResponse),
      },
      common: {
        ipfs: {
          getSettings: () => ({ gateway: 'gateway' }),
        },
      },
    });
});

describe('useComments CRUD', () => {
  beforeAll(() => {
    const mock = jest.spyOn(moderation, 'checkStatus');
    mock.mockReturnValue(new Promise(resolve => resolve(mockCheckModerationStatus)));
  });

  it('should correctly create, edit and delete a comment', async () => {
    const [wrapper, queryClient] = createWrapper();
    const { result: createResult } = renderHook(() => useCreateComment(), {
      wrapper,
    });
    const mockComment = mockGetComment.data.getComment;
    queryClient.setQueryData([ENTRY_KEY, mockComment.postId], {
      ...mockComment,
      totalComments: 0,
    });
    let commentId;

    await act(async () => {
      commentId = await createResult.current.mutateAsync(mockCreateCommentInput);
      const entryData = queryClient.getQueryData([ENTRY_KEY, mockComment.postId]);
      expect(entryData.totalComments).toBe('1');
    });

    const { result: editResult } = renderHook(() => useEditComment(commentId, true), {
      wrapper,
    });
    await act(async () => {
      const pendingComment = await editResult.current.mutateAsync({
        ...mockEditCommentInput,
        postID: mockComment.postId,
      });
      expect(pendingComment?.data.editComment).toBeTruthy();
    });

    const { result: deleteResult } = renderHook(() => useDeleteComment(commentId), {
      wrapper,
    });

    await act(async () => {
      const deleteComment = await deleteResult.current.mutateAsync(commentId);
      expect(deleteComment).toBeTruthy();
    });
  });
});
