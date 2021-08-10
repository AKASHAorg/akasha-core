import { QueryClient, useInfiniteQuery, useMutation, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom } from 'rxjs';
import getSDK from '@akashaproject/awf-sdk';
import { DataProviderInput } from '@akashaproject/sdk-typings/lib/interfaces/common';
import { buildPublishObject } from './utils/entry-utils';
import { Comment_Response } from '@akashaproject/sdk-typings/lib/interfaces/responses';
import { logError } from './utils/error-handler';
import { IAkashaError } from '@akashaproject/ui-awf-typings';

export const COMMENT_KEY = 'Comment';
export const COMMENTS_KEY = 'Comments';

const getComments = async (
  queryClient: QueryClient,
  limit: number,
  postID: string,
  offset?: string,
) => {
  const sdk = getSDK();
  try {
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
        queryClient.setQueryData([COMMENT_KEY, comment._id], () => comment);
        return comment._id;
      }),
    };
  } catch (error) {
    logError('useComments.getComments', error);
  }
};

export function useInfiniteComments(limit: number, postID: string, offset?: string) {
  const queryClient = useQueryClient();
  return useInfiniteQuery(
    [COMMENTS_KEY, postID],
    async ({ pageParam = offset }) => getComments(queryClient, limit, postID, pageParam),
    {
      getNextPageParam: (lastPage, allPages) => lastPage.nextIndex,
      //getPreviousPageParam: (lastPage, allPages) => lastPage.posts.results[0]._id,
      enabled: !!(offset || limit),
      keepPreviousData: true,
    },
  );
}

const getComment = async commentID => {
  const sdk = getSDK();
  try {
    const res = await lastValueFrom(sdk.api.comments.getComment(commentID));
    return res.data.getComment;
  } catch (error) {
    logError('useComments.getComments', error);
  }
};

// hook for fetching data for a specific commentID/entryID
export function useComment(commentID: string, enabler = true) {
  return useQuery([COMMENT_KEY, commentID], () => getComment(commentID), {
    enabled: !!commentID && enabler,
    keepPreviousData: true,
  });
}

export interface Publish_Options {
  data: DataProviderInput[];
  comment: { title?: string; tags?: string[]; postID: string };
}
export function useDeleteComment(commentID: string) {
  const sdk = getSDK();
  const queryClient = useQueryClient();
  return useMutation(commentID => lastValueFrom(sdk.api.entries.removeEntry(commentID)), {
    // When mutate is called:
    onMutate: async (commentID: string) => {
      // Snapshot the previous value
      const previousComment: Comment_Response = queryClient.getQueryData([COMMENT_KEY, commentID]);
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
      });
      return { previousComment };
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

export function useCreateComment() {
  const sdk = getSDK();
  const queryClient = useQueryClient();

  const pendingID = 'pending' + new Date().getTime();
  return useMutation(
    async (publishObj: Publish_Options) => {
      const res = await lastValueFrom(sdk.api.comments.addComment(publishObj));
      return res?.data?.addComment;
    },
    {
      onMutate: async (publishObj: {
        data: DataProviderInput[];
        comment: { title?: string; tags?: string[]; quotes?: string[] };
      }) => {
        const optimisticComment = Object.assign({}, publishObj, { isPublishing: true });
        queryClient.setQueryData([COMMENT_KEY, pendingID], optimisticComment);

        return { optimisticComment };
      },
      onError: (err, variables, context) => {
        if (context?.optimisticComment) {
          queryClient.setQueryData(
            [COMMENT_KEY, pendingID],
            Object.assign({}, context.optimisticComment, { hasErrored: true }),
          );
        }
        logError('useComments.createComment', err as Error);
      },
      onSuccess: async id => {
        await queryClient.fetchQuery([COMMENT_KEY, id], () => getComment(id));
      },
      onSettled: async () => {
        await queryClient.invalidateQueries([COMMENT_KEY, pendingID]);
        await queryClient.invalidateQueries(COMMENTS_KEY);
      },
    },
  );
}

// hook used for editing a comment
export function useEditComment(commentID: string) {
  const sdk = getSDK();
  const queryClient = useQueryClient();

  return useMutation(
    (comment: any) => {
      const { postID, ...commentData } = comment;
      const publishObj: Publish_Options = buildPublishObject(commentData, postID);
      return lastValueFrom(sdk.api.comments.editComment({ commentID, ...publishObj }));
    },
    {
      onMutate: async (comment: any) => {
        queryClient.setQueryData([COMMENT_KEY, commentID], (current: Comment_Response) => {
          const { data } = buildPublishObject(comment);
          return {
            ...current,
            content: data,
            isPublishing: true,
          };
        });

        return { comment };
      },
      onError: (err, variables, context) => {
        if (context?.comment) {
          queryClient.setQueryData(
            [COMMENT_KEY, commentID],
            Object.assign({}, context.comment, { hasErrored: true }),
          );
        }
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
