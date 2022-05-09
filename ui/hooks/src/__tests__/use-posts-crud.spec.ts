import { act, renderHook } from '@testing-library/react-hooks';
import { mockSDK } from '@akashaproject/af-testing';
import { of as mockOf } from 'rxjs';
import * as moderation from '../use-moderation';
import { mockCheckModerationStatus } from '../__mocks__/moderation';
import { ENTRY_KEY, useCreatePost, useDeletePost, useEditPost } from '../use-posts';
import { createWrapper } from './utils';
import {
  mockCreatePost,
  mockDeleteEntry,
  mockEditEntry,
  mockEditPost,
  mockEntry,
  mockPostEntry,
} from '../__mocks__/posts';
import { mockUser } from '../__mocks__/user';
import { PROFILE_KEY } from '../use-profile';
import { mockProfile } from '../__mocks__/profiles';

jest.mock('@akashaproject/awf-sdk', () => {
  return () =>
    mockSDK({
      auth: {
        getCurrentUser: () => mockOf({ data: mockUser }),
      },
      entries: {
        getEntry: () => mockOf({ data: mockEntry }),
        postEntry: () => mockOf({ data: mockPostEntry }),
        editEntry: () => mockOf(mockEditEntry),
        removeEntry: () => mockOf(mockDeleteEntry),
      },
      common: {
        ipfs: {
          getSettings: () => ({ gateway: 'gateway' }),
        },
      },
    });
});

describe('usePosts CRUD', () => {
  beforeAll(() => {
    const mock = jest.spyOn(moderation, 'checkStatus');
    mock.mockReturnValue(new Promise(resolve => resolve(mockCheckModerationStatus)));
  });

  it('should correctly create, edit and delete a post', async () => {
    const [wrapper, queryClient] = createWrapper();
    const { result: createResult } = renderHook(() => useCreatePost(), {
      wrapper,
    });
    queryClient.setQueryData([ENTRY_KEY, mockEntry.getPost._id], {
      ...mockEntry.getPost,
      totalComments: 0,
    });
    let post;
    await act(async () => {
      await createResult.current.mutateAsync(mockCreatePost);
      post = queryClient.getQueryData([ENTRY_KEY, mockEntry.getPost._id]);
      expect(post.content[0].value).toBe(
        'WwB7ACIAdAB5AHAAZQAiADoAIgBwAGEAcgBhAGcAcgBhAHAAaAAiACwAIgBjAGgAaQBsAGQAcgBlAG4AIgA6AFsAewAiAHQAZQB4AHQAIgA6ACIAYQBzAGQAZgAiAH0AXQB9AF0A',
      );
      expect(post.totalComments).toBe(0);
    });

    const { result: editResult } = renderHook(() => useEditPost(), {
      wrapper,
    });

    await act(async () => {
      const pendingComment = await editResult.current.mutateAsync({
        ...mockEditPost,
        entryID: mockPostEntry.data.createPost,
      });
      expect(pendingComment).toBeTruthy();
    });

    const { result: deleteResult } = renderHook(() => useDeletePost(post._id), {
      wrapper,
    });

    queryClient.setQueryData([PROFILE_KEY, mockUser.pubKey], mockProfile);

    await act(async () => {
      const deletePost = await deleteResult.current.mutateAsync(post._id);
      const cachedPost = queryClient.getQueryData([ENTRY_KEY, post._id]);
      expect(deletePost.data.removePost).toBeTruthy();
      expect(cachedPost.isRemoved).toBeTruthy();
      expect(cachedPost.content[0].property).toBe('removed');
    });
  });
});
