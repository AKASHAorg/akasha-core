import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom } from 'rxjs';
import getSDK from '@akashaorg/awf-sdk';
import { DataProviderInput } from '@akashaorg/sdk-typings/lib/interfaces/common';
import { buildPublishObject } from './utils/entry-utils';
import { logError } from './utils/error-handler';
import { checkStatus } from './use-moderation';
import { IPublishData, CommentResponse, PostResponse } from '@akashaorg/ui-awf-typings/lib/entry';
import { Comment_Response, Post_Response } from '@akashaorg/sdk-typings/lib/interfaces/responses';
import { ENTRY_KEY } from './use-posts';

/**
 * @internal
 */
export const COMMENT_KEY = 'Comment';
/**
 * @internal
 */
export const COMMENTS_KEY = 'Comments';
/**
 * @internal
 */
export const PUBLISH_PENDING_KEY = 'PendingPublish_Comments';

export interface Publish_Options {
  data: DataProviderInput[];
  comment: { title?: string; tags?: string[]; postID: string };
}

const getComments = async (limit: number, postID: string, offset?: string) => {
  const sdk = getSDK();

  const res = await lastValueFrom(
    sdk.api.comments.getComments({
      limit: limit,
      offset: offset,
      postID: postID,
    }),
  );
  return {
    ...res.data.getComments,
    results: res.data.getComments.results.map(comment => {
      return comment._id;
    }),
  };
};

/**
 * Hook to get the comments for a specific post
 */
export function useInfiniteComments(limit: number, postID: string, offset?: string) {
  return useInfiniteQuery(
    [COMMENTS_KEY, postID],
    async ({ pageParam = offset }) => getComments(limit, postID, pageParam),
    {
      /* Return undefined to indicate there is no next page available. */
      getNextPageParam: lastPage => lastPage?.nextIndex,
      //getPreviousPageParam: (lastPage, allPages) => lastPage.posts.results[0]._id,
      enabled: !!(offset || limit),
      keepPreviousData: true,
      onError: (err: Error) => logError('useComments.getComments', err),
    },
  );
}

/**
 * Gets a comment
 */
const getComment = async (commentID): Promise<CommentResponse> => {
  const sdk = getSDK();

  const user = await lastValueFrom(sdk.api.auth.getCurrentUser());
  // check entry's moderation status
  const modStatus = await checkStatus({
    user: user.data ? user.data.pubKey : '',
    contentIds: [commentID],
  });
  const res = await lastValueFrom(sdk.api.comments.getComment(commentID));
  const modStatusAuthor = await checkStatus({
    user: user?.data?.pubKey || '',
    contentIds: [res.data?.getComment?.author?.pubKey],
  });
  // @TODO: assign modStatus to a single prop
  return {
    ...res.data.getComment,
    ...modStatus[0],
    author: { ...res.data.getComment.author, ...modStatusAuthor[0] },
  };
};

/**
 * Hook for fetching data for a specific comment
 */
export function useComment(commentID: string, enabler = true) {
  const queryClient = useQueryClient();
  return useQuery([COMMENT_KEY, commentID], () => getComment(commentID), {
    enabled: !!commentID && enabler,
    keepPreviousData: true,
    initialData: () => queryClient.getQueryData([COMMENT_KEY, commentID]),
    onError: (err: Error) => logError('useComments.getComment', err),
  });
}

const deleteComment = async (commentId: string) => {
  const sdk = getSDK();
  const resp = await lastValueFrom(sdk.api.comments.removeComment(commentId));
  if (resp.hasOwnProperty('error')) {
    throw new Error(resp['error']);
  }
  if (resp.data.removeComment) {
    return resp.data.removeComment;
  }
  throw new Error('Cannot delete this comment. Please try again later.');
};

/**
 * Hook for deleting a specific comment
 */
export function useDeleteComment(commentID: string) {
  const queryClient = useQueryClient();
  return useMutation((commentID: string) => deleteComment(commentID), {
    // When mutate is called:
    onMutate: async (commentID: string) => {
      // Snapshot the previous value
      const previousComment: CommentResponse = queryClient.getQueryData([COMMENT_KEY, commentID]);
      // can add some optimistic updates here
      // ex: queryClient.setQueryData([COMMENT_KEY, commentID], {})
      queryClient.setQueryData([COMMENT_KEY, commentID], {
        ...previousComment,
        content: [
          {
            property: 'removed',
            provider: 'awf.graphql.comments.api',
            value: '1',
          },
        ],
        updatedAt: Date.now().toString(),
      });
      return { previousComment };
    },
    onSuccess: () => {
      const parentEntryId = queryClient.getQueryData<Comment_Response>([
        COMMENT_KEY,
        commentID,
      ]).postId;
      queryClient.setQueryData<Post_Response>([ENTRY_KEY, parentEntryId], currentEntry => {
        if (currentEntry) {
          return {
            ...currentEntry,
            totalComments: `${+currentEntry.totalComments - 1}`,
          };
        }
      });
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, variables, context) => {
      if (context?.previousComment) {
        queryClient.setQueryData([COMMENT_KEY, commentID], context.previousComment);
      }
      logError('useComments.deleteComment', err as Error);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries([COMMENT_KEY, commentID]);
      await queryClient.invalidateQueries(COMMENTS_KEY);
    },
  });
}

/**
 * Hook for creating a new comment
 */
export function useCreateComment() {
  const sdk = getSDK();
  const queryClient = useQueryClient();

  const pendingID = 'pending' + new Date().getTime();
  return useMutation(
    async (publishObj: IPublishData & { postID: string }) => {
      const comment = buildPublishObject(publishObj, publishObj.postID);
      const res = await lastValueFrom(sdk.api.comments.addComment(comment));
      return res?.data?.addComment;
    },
    {
      onMutate: async (publishObj: IPublishData & { postID: string }) => {
        await queryClient.cancelQueries([COMMENTS_KEY, publishObj.postID]);

        const optimisticComment = Object.assign({}, publishObj);

        return { optimisticComment, entryId: pendingID };
      },
      onError: err => {
        logError('useComments.createComment', err as Error);
      },
      onSuccess: async (id, variables) => {
        await queryClient.fetchQuery([COMMENT_KEY, id], () => getComment(id));
        const { postID } = variables;
        queryClient.setQueryData<PostResponse>([ENTRY_KEY, postID], currentEntry => {
          if (currentEntry) {
            return {
              ...currentEntry,
              totalComments: `${+currentEntry.totalComments + 1}`,
            };
          }
        });
      },
      onSettled: async () => {
        await queryClient.invalidateQueries(COMMENTS_KEY);
      },
      mutationKey: PUBLISH_PENDING_KEY,
    },
  );
}

/**
 * Hook for editing a comment
 */
export function useEditComment(commentID: string, hasCommentData: boolean) {
  const sdk = getSDK();
  const queryClient = useQueryClient();

  return useMutation(
    async (comment: IPublishData & { postID: string }) => {
      if (!hasCommentData) return Promise.resolve();
      const { postID, ...commentData } = comment;
      const publishObj = buildPublishObject(commentData, postID);
      return lastValueFrom(
        sdk.api.comments.editComment({ commentID, ...Object.assign({}, publishObj) }),
      );
    },
    {
      onMutate: async (comment: IPublishData & { postID: string }) => {
        queryClient.setQueryData<CommentResponse>([COMMENT_KEY, commentID], current => {
          const commentPublishObj = buildPublishObject(comment, comment.postID);
          return {
            ...current,
            content: commentPublishObj.data,
            isPublishing: true,
            updatedAt: Date.now().toString(),
          };
        });

        return { comment };
      },
      onError: (err, _variables, context) => {
        if (context?.comment) {
          queryClient.setQueryData(
            [COMMENT_KEY, commentID],
            Object.assign({}, context.comment, { hasErrored: true }),
          );
        }
        logError('useComments.editComment', err as Error);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries([COMMENT_KEY, commentID]);
        await queryClient.fetchQuery([COMMENT_KEY, commentID], () => getComment(commentID));
      },
      onSettled: async () => {
        await queryClient.invalidateQueries([COMMENT_KEY, commentID]);
        // await queryClient.invalidateQueries(COMMENTS_KEY);
      },
    },
  );
}
