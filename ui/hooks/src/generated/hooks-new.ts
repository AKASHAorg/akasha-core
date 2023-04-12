import type * as Types from '@akashaorg/awf-sdk/src/gql/api.new';

import getSDK from '@akashaorg/awf-sdk';
const sdk = getSDK();
import { useQuery, useInfiniteQuery, useMutation, type UseQueryOptions, type UseInfiniteQueryOptions, type UseMutationOptions } from '@tanstack/react-query';

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch(sdk.services.ceramic.getOptions().endpointURL as string, {
    method: "POST",
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
export const CommentFragmentDoc = /*#__PURE__*/ `
    fragment CommentFragment on Comment {
  author {
    id
  }
  version
  active
  content {
    provider
    property
    value
  }
  isReply
  repliesCount
  post {
    id
    author {
      id
    }
  }
}
    `;
export const PostFragmentDoc = /*#__PURE__*/ `
    fragment PostFragment on Post {
  id
  commentsCount
  quotesCount
  active
  author {
    id
  }
  content {
    property
    provider
    value
  }
  tags
  version
}
    `;
export const UserProfileFragmentDoc = /*#__PURE__*/ `
    fragment UserProfileFragment on Profile {
  id
  did {
    id
  }
  name
  links {
    href
    label
  }
  background {
    alternatives {
      src
      width
      height
    }
    default {
      src
      width
      height
    }
  }
  description
  avatar {
    default {
      src
      width
      height
    }
    alternatives {
      src
      width
      height
    }
  }
  createdAt
}
    `;
export const GetCommentsFromPostDocument = /*#__PURE__*/ `
    query GetCommentsFromPost($id: ID!, $after: String, $before: String, $first: Int, $last: Int) {
  node(id: $id) {
    ... on Post {
      comments(after: $after, before: $before, first: $first, last: $last) {
        edges {
          node {
            ...CommentFragment
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
}
    ${CommentFragmentDoc}`;
export const useGetCommentsFromPostQuery = <
      TData = Types.GetCommentsFromPostQuery,
      TError = unknown
    >(
      variables: Types.GetCommentsFromPostQueryVariables,
      options?: UseQueryOptions<Types.GetCommentsFromPostQuery, TError, TData>
    ) =>
    useQuery<Types.GetCommentsFromPostQuery, TError, TData>(
      ['GetCommentsFromPost', variables],
      fetcher<Types.GetCommentsFromPostQuery, Types.GetCommentsFromPostQueryVariables>(GetCommentsFromPostDocument, variables),
      options
    );
useGetCommentsFromPostQuery.document = GetCommentsFromPostDocument;


useGetCommentsFromPostQuery.getKey = (variables: Types.GetCommentsFromPostQueryVariables) => ['GetCommentsFromPost', variables];
;

export const useInfiniteGetCommentsFromPostQuery = <
      TData = Types.GetCommentsFromPostQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetCommentsFromPostQueryVariables,
      variables: Types.GetCommentsFromPostQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetCommentsFromPostQuery, TError, TData>
    ) =>
    useInfiniteQuery<Types.GetCommentsFromPostQuery, TError, TData>(
      ['GetCommentsFromPost.infinite', variables],
      (metaData) => fetcher<Types.GetCommentsFromPostQuery, Types.GetCommentsFromPostQueryVariables>(GetCommentsFromPostDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteGetCommentsFromPostQuery.getKey = (variables: Types.GetCommentsFromPostQueryVariables) => ['GetCommentsFromPost.infinite', variables];
;

useGetCommentsFromPostQuery.fetcher = (variables: Types.GetCommentsFromPostQueryVariables) => fetcher<Types.GetCommentsFromPostQuery, Types.GetCommentsFromPostQueryVariables>(GetCommentsFromPostDocument, variables);
export const GetCommentsByAuthorDidDocument = /*#__PURE__*/ `
    query GetCommentsByAuthorDid($id: ID!, $after: String, $before: String, $first: Int, $last: Int) {
  node(id: $id) {
    ... on CeramicAccount {
      commentList(after: $after, before: $before, first: $first, last: $last) {
        edges {
          node {
            ...CommentFragment
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
}
    ${CommentFragmentDoc}`;
export const useGetCommentsByAuthorDidQuery = <
      TData = Types.GetCommentsByAuthorDidQuery,
      TError = unknown
    >(
      variables: Types.GetCommentsByAuthorDidQueryVariables,
      options?: UseQueryOptions<Types.GetCommentsByAuthorDidQuery, TError, TData>
    ) =>
    useQuery<Types.GetCommentsByAuthorDidQuery, TError, TData>(
      ['GetCommentsByAuthorDid', variables],
      fetcher<Types.GetCommentsByAuthorDidQuery, Types.GetCommentsByAuthorDidQueryVariables>(GetCommentsByAuthorDidDocument, variables),
      options
    );
useGetCommentsByAuthorDidQuery.document = GetCommentsByAuthorDidDocument;


useGetCommentsByAuthorDidQuery.getKey = (variables: Types.GetCommentsByAuthorDidQueryVariables) => ['GetCommentsByAuthorDid', variables];
;

export const useInfiniteGetCommentsByAuthorDidQuery = <
      TData = Types.GetCommentsByAuthorDidQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetCommentsByAuthorDidQueryVariables,
      variables: Types.GetCommentsByAuthorDidQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetCommentsByAuthorDidQuery, TError, TData>
    ) =>
    useInfiniteQuery<Types.GetCommentsByAuthorDidQuery, TError, TData>(
      ['GetCommentsByAuthorDid.infinite', variables],
      (metaData) => fetcher<Types.GetCommentsByAuthorDidQuery, Types.GetCommentsByAuthorDidQueryVariables>(GetCommentsByAuthorDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteGetCommentsByAuthorDidQuery.getKey = (variables: Types.GetCommentsByAuthorDidQueryVariables) => ['GetCommentsByAuthorDid.infinite', variables];
;

useGetCommentsByAuthorDidQuery.fetcher = (variables: Types.GetCommentsByAuthorDidQueryVariables) => fetcher<Types.GetCommentsByAuthorDidQuery, Types.GetCommentsByAuthorDidQueryVariables>(GetCommentsByAuthorDidDocument, variables);
export const GetCommentRepliesDocument = /*#__PURE__*/ `
    query GetCommentReplies($id: ID!, $after: String, $before: String, $first: Int, $last: Int) {
  node(id: $id) {
    ... on Comment {
      replies(after: $after, before: $before, first: $first, last: $last) {
        edges {
          node {
            reply {
              ...CommentFragment
            }
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
}
    ${CommentFragmentDoc}`;
export const useGetCommentRepliesQuery = <
      TData = Types.GetCommentRepliesQuery,
      TError = unknown
    >(
      variables: Types.GetCommentRepliesQueryVariables,
      options?: UseQueryOptions<Types.GetCommentRepliesQuery, TError, TData>
    ) =>
    useQuery<Types.GetCommentRepliesQuery, TError, TData>(
      ['GetCommentReplies', variables],
      fetcher<Types.GetCommentRepliesQuery, Types.GetCommentRepliesQueryVariables>(GetCommentRepliesDocument, variables),
      options
    );
useGetCommentRepliesQuery.document = GetCommentRepliesDocument;


useGetCommentRepliesQuery.getKey = (variables: Types.GetCommentRepliesQueryVariables) => ['GetCommentReplies', variables];
;

export const useInfiniteGetCommentRepliesQuery = <
      TData = Types.GetCommentRepliesQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetCommentRepliesQueryVariables,
      variables: Types.GetCommentRepliesQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetCommentRepliesQuery, TError, TData>
    ) =>
    useInfiniteQuery<Types.GetCommentRepliesQuery, TError, TData>(
      ['GetCommentReplies.infinite', variables],
      (metaData) => fetcher<Types.GetCommentRepliesQuery, Types.GetCommentRepliesQueryVariables>(GetCommentRepliesDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteGetCommentRepliesQuery.getKey = (variables: Types.GetCommentRepliesQueryVariables) => ['GetCommentReplies.infinite', variables];
;

useGetCommentRepliesQuery.fetcher = (variables: Types.GetCommentRepliesQueryVariables) => fetcher<Types.GetCommentRepliesQuery, Types.GetCommentRepliesQueryVariables>(GetCommentRepliesDocument, variables);
export const CreateCommentDocument = /*#__PURE__*/ `
    mutation CreateComment($i: CreateCommentInput!) {
  createComment(input: $i) {
    document {
      ...CommentFragment
    }
    clientMutationId
  }
}
    ${CommentFragmentDoc}`;
export const useCreateCommentMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.CreateCommentMutation, TError, Types.CreateCommentMutationVariables, TContext>) =>
    useMutation<Types.CreateCommentMutation, TError, Types.CreateCommentMutationVariables, TContext>(
      ['CreateComment'],
      (variables?: Types.CreateCommentMutationVariables) => fetcher<Types.CreateCommentMutation, Types.CreateCommentMutationVariables>(CreateCommentDocument, variables)(),
      options
    );
useCreateCommentMutation.getKey = () => ['CreateComment'];

useCreateCommentMutation.fetcher = (variables: Types.CreateCommentMutationVariables) => fetcher<Types.CreateCommentMutation, Types.CreateCommentMutationVariables>(CreateCommentDocument, variables);
export const UpdateCommentDocument = /*#__PURE__*/ `
    mutation UpdateComment($i: UpdateCommentInput!) {
  updateComment(input: $i) {
    document {
      ...CommentFragment
    }
    clientMutationId
  }
}
    ${CommentFragmentDoc}`;
export const useUpdateCommentMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpdateCommentMutation, TError, Types.UpdateCommentMutationVariables, TContext>) =>
    useMutation<Types.UpdateCommentMutation, TError, Types.UpdateCommentMutationVariables, TContext>(
      ['UpdateComment'],
      (variables?: Types.UpdateCommentMutationVariables) => fetcher<Types.UpdateCommentMutation, Types.UpdateCommentMutationVariables>(UpdateCommentDocument, variables)(),
      options
    );
useUpdateCommentMutation.getKey = () => ['UpdateComment'];

useUpdateCommentMutation.fetcher = (variables: Types.UpdateCommentMutationVariables) => fetcher<Types.UpdateCommentMutation, Types.UpdateCommentMutationVariables>(UpdateCommentDocument, variables);
export const CreateCommentReplyDocument = /*#__PURE__*/ `
    mutation CreateCommentReply($i: CreateCommentReplyInput!) {
  createCommentReply(input: $i) {
    document {
      active
      comment {
        ...CommentFragment
      }
      reply {
        ...CommentFragment
      }
    }
  }
}
    ${CommentFragmentDoc}`;
export const useCreateCommentReplyMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.CreateCommentReplyMutation, TError, Types.CreateCommentReplyMutationVariables, TContext>) =>
    useMutation<Types.CreateCommentReplyMutation, TError, Types.CreateCommentReplyMutationVariables, TContext>(
      ['CreateCommentReply'],
      (variables?: Types.CreateCommentReplyMutationVariables) => fetcher<Types.CreateCommentReplyMutation, Types.CreateCommentReplyMutationVariables>(CreateCommentReplyDocument, variables)(),
      options
    );
useCreateCommentReplyMutation.getKey = () => ['CreateCommentReply'];

useCreateCommentReplyMutation.fetcher = (variables: Types.CreateCommentReplyMutationVariables) => fetcher<Types.CreateCommentReplyMutation, Types.CreateCommentReplyMutationVariables>(CreateCommentReplyDocument, variables);
export const UpdateCommentReplyDocument = /*#__PURE__*/ `
    mutation UpdateCommentReply($i: UpdateCommentReplyInput!) {
  updateCommentReply(input: $i) {
    document {
      active
      comment {
        ...CommentFragment
      }
      reply {
        ...CommentFragment
      }
    }
  }
}
    ${CommentFragmentDoc}`;
export const useUpdateCommentReplyMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpdateCommentReplyMutation, TError, Types.UpdateCommentReplyMutationVariables, TContext>) =>
    useMutation<Types.UpdateCommentReplyMutation, TError, Types.UpdateCommentReplyMutationVariables, TContext>(
      ['UpdateCommentReply'],
      (variables?: Types.UpdateCommentReplyMutationVariables) => fetcher<Types.UpdateCommentReplyMutation, Types.UpdateCommentReplyMutationVariables>(UpdateCommentReplyDocument, variables)(),
      options
    );
useUpdateCommentReplyMutation.getKey = () => ['UpdateCommentReply'];

useUpdateCommentReplyMutation.fetcher = (variables: Types.UpdateCommentReplyMutationVariables) => fetcher<Types.UpdateCommentReplyMutation, Types.UpdateCommentReplyMutationVariables>(UpdateCommentReplyDocument, variables);
export const GetPostsDocument = /*#__PURE__*/ `
    query GetPosts($after: String, $before: String, $first: Int, $last: Int) {
  postIndex(after: $after, before: $before, first: $first, last: $last) {
    edges {
      node {
        ...PostFragment
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}
    ${PostFragmentDoc}`;
export const useGetPostsQuery = <
      TData = Types.GetPostsQuery,
      TError = unknown
    >(
      variables?: Types.GetPostsQueryVariables,
      options?: UseQueryOptions<Types.GetPostsQuery, TError, TData>
    ) =>
    useQuery<Types.GetPostsQuery, TError, TData>(
      variables === undefined ? ['GetPosts'] : ['GetPosts', variables],
      fetcher<Types.GetPostsQuery, Types.GetPostsQueryVariables>(GetPostsDocument, variables),
      options
    );
useGetPostsQuery.document = GetPostsDocument;


useGetPostsQuery.getKey = (variables?: Types.GetPostsQueryVariables) => variables === undefined ? ['GetPosts'] : ['GetPosts', variables];
;

export const useInfiniteGetPostsQuery = <
      TData = Types.GetPostsQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetPostsQueryVariables,
      variables?: Types.GetPostsQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetPostsQuery, TError, TData>
    ) =>
    useInfiniteQuery<Types.GetPostsQuery, TError, TData>(
      variables === undefined ? ['GetPosts.infinite'] : ['GetPosts.infinite', variables],
      (metaData) => fetcher<Types.GetPostsQuery, Types.GetPostsQueryVariables>(GetPostsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteGetPostsQuery.getKey = (variables?: Types.GetPostsQueryVariables) => variables === undefined ? ['GetPosts.infinite'] : ['GetPosts.infinite', variables];
;

useGetPostsQuery.fetcher = (variables?: Types.GetPostsQueryVariables) => fetcher<Types.GetPostsQuery, Types.GetPostsQueryVariables>(GetPostsDocument, variables);
export const GetPostsByAuthorDidDocument = /*#__PURE__*/ `
    query GetPostsByAuthorDid($id: ID!, $after: String, $before: String, $first: Int, $last: Int) {
  node(id: $id) {
    ... on CeramicAccount {
      postList(after: $after, before: $before, first: $first, last: $last) {
        edges {
          node {
            ...PostFragment
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
}
    ${PostFragmentDoc}`;
export const useGetPostsByAuthorDidQuery = <
      TData = Types.GetPostsByAuthorDidQuery,
      TError = unknown
    >(
      variables: Types.GetPostsByAuthorDidQueryVariables,
      options?: UseQueryOptions<Types.GetPostsByAuthorDidQuery, TError, TData>
    ) =>
    useQuery<Types.GetPostsByAuthorDidQuery, TError, TData>(
      ['GetPostsByAuthorDid', variables],
      fetcher<Types.GetPostsByAuthorDidQuery, Types.GetPostsByAuthorDidQueryVariables>(GetPostsByAuthorDidDocument, variables),
      options
    );
useGetPostsByAuthorDidQuery.document = GetPostsByAuthorDidDocument;


useGetPostsByAuthorDidQuery.getKey = (variables: Types.GetPostsByAuthorDidQueryVariables) => ['GetPostsByAuthorDid', variables];
;

export const useInfiniteGetPostsByAuthorDidQuery = <
      TData = Types.GetPostsByAuthorDidQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetPostsByAuthorDidQueryVariables,
      variables: Types.GetPostsByAuthorDidQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetPostsByAuthorDidQuery, TError, TData>
    ) =>
    useInfiniteQuery<Types.GetPostsByAuthorDidQuery, TError, TData>(
      ['GetPostsByAuthorDid.infinite', variables],
      (metaData) => fetcher<Types.GetPostsByAuthorDidQuery, Types.GetPostsByAuthorDidQueryVariables>(GetPostsByAuthorDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteGetPostsByAuthorDidQuery.getKey = (variables: Types.GetPostsByAuthorDidQueryVariables) => ['GetPostsByAuthorDid.infinite', variables];
;

useGetPostsByAuthorDidQuery.fetcher = (variables: Types.GetPostsByAuthorDidQueryVariables) => fetcher<Types.GetPostsByAuthorDidQuery, Types.GetPostsByAuthorDidQueryVariables>(GetPostsByAuthorDidDocument, variables);
export const GetPostByIdDocument = /*#__PURE__*/ `
    query GetPostById($id: ID!) {
  node(id: $id) {
    ... on Post {
      ...PostFragment
    }
  }
}
    ${PostFragmentDoc}`;
export const useGetPostByIdQuery = <
      TData = Types.GetPostByIdQuery,
      TError = unknown
    >(
      variables: Types.GetPostByIdQueryVariables,
      options?: UseQueryOptions<Types.GetPostByIdQuery, TError, TData>
    ) =>
    useQuery<Types.GetPostByIdQuery, TError, TData>(
      ['GetPostById', variables],
      fetcher<Types.GetPostByIdQuery, Types.GetPostByIdQueryVariables>(GetPostByIdDocument, variables),
      options
    );
useGetPostByIdQuery.document = GetPostByIdDocument;


useGetPostByIdQuery.getKey = (variables: Types.GetPostByIdQueryVariables) => ['GetPostById', variables];
;

export const useInfiniteGetPostByIdQuery = <
      TData = Types.GetPostByIdQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetPostByIdQueryVariables,
      variables: Types.GetPostByIdQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetPostByIdQuery, TError, TData>
    ) =>
    useInfiniteQuery<Types.GetPostByIdQuery, TError, TData>(
      ['GetPostById.infinite', variables],
      (metaData) => fetcher<Types.GetPostByIdQuery, Types.GetPostByIdQueryVariables>(GetPostByIdDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteGetPostByIdQuery.getKey = (variables: Types.GetPostByIdQueryVariables) => ['GetPostById.infinite', variables];
;

useGetPostByIdQuery.fetcher = (variables: Types.GetPostByIdQueryVariables) => fetcher<Types.GetPostByIdQuery, Types.GetPostByIdQueryVariables>(GetPostByIdDocument, variables);
export const GetQuotedPostsFromPostDocument = /*#__PURE__*/ `
    query GetQuotedPostsFromPost($id: ID!) {
  node(id: $id) {
    ... on Post {
      quotes(first: 5) {
        edges {
          node {
            quotedPost {
              ...PostFragment
            }
            post {
              ...PostFragment
            }
          }
        }
      }
    }
  }
}
    ${PostFragmentDoc}`;
export const useGetQuotedPostsFromPostQuery = <
      TData = Types.GetQuotedPostsFromPostQuery,
      TError = unknown
    >(
      variables: Types.GetQuotedPostsFromPostQueryVariables,
      options?: UseQueryOptions<Types.GetQuotedPostsFromPostQuery, TError, TData>
    ) =>
    useQuery<Types.GetQuotedPostsFromPostQuery, TError, TData>(
      ['GetQuotedPostsFromPost', variables],
      fetcher<Types.GetQuotedPostsFromPostQuery, Types.GetQuotedPostsFromPostQueryVariables>(GetQuotedPostsFromPostDocument, variables),
      options
    );
useGetQuotedPostsFromPostQuery.document = GetQuotedPostsFromPostDocument;


useGetQuotedPostsFromPostQuery.getKey = (variables: Types.GetQuotedPostsFromPostQueryVariables) => ['GetQuotedPostsFromPost', variables];
;

export const useInfiniteGetQuotedPostsFromPostQuery = <
      TData = Types.GetQuotedPostsFromPostQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetQuotedPostsFromPostQueryVariables,
      variables: Types.GetQuotedPostsFromPostQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetQuotedPostsFromPostQuery, TError, TData>
    ) =>
    useInfiniteQuery<Types.GetQuotedPostsFromPostQuery, TError, TData>(
      ['GetQuotedPostsFromPost.infinite', variables],
      (metaData) => fetcher<Types.GetQuotedPostsFromPostQuery, Types.GetQuotedPostsFromPostQueryVariables>(GetQuotedPostsFromPostDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteGetQuotedPostsFromPostQuery.getKey = (variables: Types.GetQuotedPostsFromPostQueryVariables) => ['GetQuotedPostsFromPost.infinite', variables];
;

useGetQuotedPostsFromPostQuery.fetcher = (variables: Types.GetQuotedPostsFromPostQueryVariables) => fetcher<Types.GetQuotedPostsFromPostQuery, Types.GetQuotedPostsFromPostQueryVariables>(GetQuotedPostsFromPostDocument, variables);
export const GetMentionsFromPostDocument = /*#__PURE__*/ `
    query GetMentionsFromPost($id: ID!) {
  node(id: $id) {
    ... on Post {
      mentions(first: 10) {
        edges {
          node {
            profile {
              ...UserProfileFragment
            }
            post {
              ...PostFragment
            }
          }
        }
      }
    }
  }
}
    ${UserProfileFragmentDoc}
${PostFragmentDoc}`;
export const useGetMentionsFromPostQuery = <
      TData = Types.GetMentionsFromPostQuery,
      TError = unknown
    >(
      variables: Types.GetMentionsFromPostQueryVariables,
      options?: UseQueryOptions<Types.GetMentionsFromPostQuery, TError, TData>
    ) =>
    useQuery<Types.GetMentionsFromPostQuery, TError, TData>(
      ['GetMentionsFromPost', variables],
      fetcher<Types.GetMentionsFromPostQuery, Types.GetMentionsFromPostQueryVariables>(GetMentionsFromPostDocument, variables),
      options
    );
useGetMentionsFromPostQuery.document = GetMentionsFromPostDocument;


useGetMentionsFromPostQuery.getKey = (variables: Types.GetMentionsFromPostQueryVariables) => ['GetMentionsFromPost', variables];
;

export const useInfiniteGetMentionsFromPostQuery = <
      TData = Types.GetMentionsFromPostQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetMentionsFromPostQueryVariables,
      variables: Types.GetMentionsFromPostQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetMentionsFromPostQuery, TError, TData>
    ) =>
    useInfiniteQuery<Types.GetMentionsFromPostQuery, TError, TData>(
      ['GetMentionsFromPost.infinite', variables],
      (metaData) => fetcher<Types.GetMentionsFromPostQuery, Types.GetMentionsFromPostQueryVariables>(GetMentionsFromPostDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteGetMentionsFromPostQuery.getKey = (variables: Types.GetMentionsFromPostQueryVariables) => ['GetMentionsFromPost.infinite', variables];
;

useGetMentionsFromPostQuery.fetcher = (variables: Types.GetMentionsFromPostQueryVariables) => fetcher<Types.GetMentionsFromPostQuery, Types.GetMentionsFromPostQueryVariables>(GetMentionsFromPostDocument, variables);
export const CreatePostDocument = /*#__PURE__*/ `
    mutation CreatePost($i: CreatePostInput!) {
  createPost(input: $i) {
    document {
      ...PostFragment
    }
  }
}
    ${PostFragmentDoc}`;
export const useCreatePostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.CreatePostMutation, TError, Types.CreatePostMutationVariables, TContext>) =>
    useMutation<Types.CreatePostMutation, TError, Types.CreatePostMutationVariables, TContext>(
      ['CreatePost'],
      (variables?: Types.CreatePostMutationVariables) => fetcher<Types.CreatePostMutation, Types.CreatePostMutationVariables>(CreatePostDocument, variables)(),
      options
    );
useCreatePostMutation.getKey = () => ['CreatePost'];

useCreatePostMutation.fetcher = (variables: Types.CreatePostMutationVariables) => fetcher<Types.CreatePostMutation, Types.CreatePostMutationVariables>(CreatePostDocument, variables);
export const UpdatePostDocument = /*#__PURE__*/ `
    mutation UpdatePost($i: UpdatePostInput!) {
  updatePost(input: $i) {
    document {
      ...PostFragment
    }
    clientMutationId
  }
}
    ${PostFragmentDoc}`;
export const useUpdatePostMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpdatePostMutation, TError, Types.UpdatePostMutationVariables, TContext>) =>
    useMutation<Types.UpdatePostMutation, TError, Types.UpdatePostMutationVariables, TContext>(
      ['UpdatePost'],
      (variables?: Types.UpdatePostMutationVariables) => fetcher<Types.UpdatePostMutation, Types.UpdatePostMutationVariables>(UpdatePostDocument, variables)(),
      options
    );
useUpdatePostMutation.getKey = () => ['UpdatePost'];

useUpdatePostMutation.fetcher = (variables: Types.UpdatePostMutationVariables) => fetcher<Types.UpdatePostMutation, Types.UpdatePostMutationVariables>(UpdatePostDocument, variables);
export const CreatePostQuoteDocument = /*#__PURE__*/ `
    mutation CreatePostQuote($i: CreatePostQuoteInput!) {
  createPostQuote(input: $i) {
    document {
      post {
        ...PostFragment
      }
      quotedPost {
        ...PostFragment
      }
      active
    }
    clientMutationId
  }
}
    ${PostFragmentDoc}`;
export const useCreatePostQuoteMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.CreatePostQuoteMutation, TError, Types.CreatePostQuoteMutationVariables, TContext>) =>
    useMutation<Types.CreatePostQuoteMutation, TError, Types.CreatePostQuoteMutationVariables, TContext>(
      ['CreatePostQuote'],
      (variables?: Types.CreatePostQuoteMutationVariables) => fetcher<Types.CreatePostQuoteMutation, Types.CreatePostQuoteMutationVariables>(CreatePostQuoteDocument, variables)(),
      options
    );
useCreatePostQuoteMutation.getKey = () => ['CreatePostQuote'];

useCreatePostQuoteMutation.fetcher = (variables: Types.CreatePostQuoteMutationVariables) => fetcher<Types.CreatePostQuoteMutation, Types.CreatePostQuoteMutationVariables>(CreatePostQuoteDocument, variables);
export const CreatePostProfileMentionDocument = /*#__PURE__*/ `
    mutation CreatePostProfileMention($i: CreateProfileMentionInput!) {
  createProfileMention(input: $i) {
    document {
      post {
        ...PostFragment
      }
      profile {
        ...UserProfileFragment
      }
    }
  }
}
    ${PostFragmentDoc}
${UserProfileFragmentDoc}`;
export const useCreatePostProfileMentionMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.CreatePostProfileMentionMutation, TError, Types.CreatePostProfileMentionMutationVariables, TContext>) =>
    useMutation<Types.CreatePostProfileMentionMutation, TError, Types.CreatePostProfileMentionMutationVariables, TContext>(
      ['CreatePostProfileMention'],
      (variables?: Types.CreatePostProfileMentionMutationVariables) => fetcher<Types.CreatePostProfileMentionMutation, Types.CreatePostProfileMentionMutationVariables>(CreatePostProfileMentionDocument, variables)(),
      options
    );
useCreatePostProfileMentionMutation.getKey = () => ['CreatePostProfileMention'];

useCreatePostProfileMentionMutation.fetcher = (variables: Types.CreatePostProfileMentionMutationVariables) => fetcher<Types.CreatePostProfileMentionMutation, Types.CreatePostProfileMentionMutationVariables>(CreatePostProfileMentionDocument, variables);
export const GetProfileByIdDocument = /*#__PURE__*/ `
    query GetProfileByID($id: ID!) {
  node(id: $id) {
    ... on Profile {
      ...UserProfileFragment
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const useGetProfileByIdQuery = <
      TData = Types.GetProfileByIdQuery,
      TError = unknown
    >(
      variables: Types.GetProfileByIdQueryVariables,
      options?: UseQueryOptions<Types.GetProfileByIdQuery, TError, TData>
    ) =>
    useQuery<Types.GetProfileByIdQuery, TError, TData>(
      ['GetProfileByID', variables],
      fetcher<Types.GetProfileByIdQuery, Types.GetProfileByIdQueryVariables>(GetProfileByIdDocument, variables),
      options
    );
useGetProfileByIdQuery.document = GetProfileByIdDocument;


useGetProfileByIdQuery.getKey = (variables: Types.GetProfileByIdQueryVariables) => ['GetProfileByID', variables];
;

export const useInfiniteGetProfileByIdQuery = <
      TData = Types.GetProfileByIdQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetProfileByIdQueryVariables,
      variables: Types.GetProfileByIdQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetProfileByIdQuery, TError, TData>
    ) =>
    useInfiniteQuery<Types.GetProfileByIdQuery, TError, TData>(
      ['GetProfileByID.infinite', variables],
      (metaData) => fetcher<Types.GetProfileByIdQuery, Types.GetProfileByIdQueryVariables>(GetProfileByIdDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteGetProfileByIdQuery.getKey = (variables: Types.GetProfileByIdQueryVariables) => ['GetProfileByID.infinite', variables];
;

useGetProfileByIdQuery.fetcher = (variables: Types.GetProfileByIdQueryVariables) => fetcher<Types.GetProfileByIdQuery, Types.GetProfileByIdQueryVariables>(GetProfileByIdDocument, variables);
export const GetProfileByDidDocument = /*#__PURE__*/ `
    query GetProfileByDid($id: ID!) {
  node(id: $id) {
    ... on CeramicAccount {
      profile {
        ...UserProfileFragment
      }
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const useGetProfileByDidQuery = <
      TData = Types.GetProfileByDidQuery,
      TError = unknown
    >(
      variables: Types.GetProfileByDidQueryVariables,
      options?: UseQueryOptions<Types.GetProfileByDidQuery, TError, TData>
    ) =>
    useQuery<Types.GetProfileByDidQuery, TError, TData>(
      ['GetProfileByDid', variables],
      fetcher<Types.GetProfileByDidQuery, Types.GetProfileByDidQueryVariables>(GetProfileByDidDocument, variables),
      options
    );
useGetProfileByDidQuery.document = GetProfileByDidDocument;


useGetProfileByDidQuery.getKey = (variables: Types.GetProfileByDidQueryVariables) => ['GetProfileByDid', variables];
;

export const useInfiniteGetProfileByDidQuery = <
      TData = Types.GetProfileByDidQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetProfileByDidQueryVariables,
      variables: Types.GetProfileByDidQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetProfileByDidQuery, TError, TData>
    ) =>
    useInfiniteQuery<Types.GetProfileByDidQuery, TError, TData>(
      ['GetProfileByDid.infinite', variables],
      (metaData) => fetcher<Types.GetProfileByDidQuery, Types.GetProfileByDidQueryVariables>(GetProfileByDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteGetProfileByDidQuery.getKey = (variables: Types.GetProfileByDidQueryVariables) => ['GetProfileByDid.infinite', variables];
;

useGetProfileByDidQuery.fetcher = (variables: Types.GetProfileByDidQueryVariables) => fetcher<Types.GetProfileByDidQuery, Types.GetProfileByDidQueryVariables>(GetProfileByDidDocument, variables);
export const GetProfilesDocument = /*#__PURE__*/ `
    query GetProfiles($after: String, $before: String, $first: Int, $last: Int) {
  profileIndex(after: $after, before: $before, first: $first, last: $last) {
    edges {
      node {
        ...UserProfileFragment
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const useGetProfilesQuery = <
      TData = Types.GetProfilesQuery,
      TError = unknown
    >(
      variables?: Types.GetProfilesQueryVariables,
      options?: UseQueryOptions<Types.GetProfilesQuery, TError, TData>
    ) =>
    useQuery<Types.GetProfilesQuery, TError, TData>(
      variables === undefined ? ['GetProfiles'] : ['GetProfiles', variables],
      fetcher<Types.GetProfilesQuery, Types.GetProfilesQueryVariables>(GetProfilesDocument, variables),
      options
    );
useGetProfilesQuery.document = GetProfilesDocument;


useGetProfilesQuery.getKey = (variables?: Types.GetProfilesQueryVariables) => variables === undefined ? ['GetProfiles'] : ['GetProfiles', variables];
;

export const useInfiniteGetProfilesQuery = <
      TData = Types.GetProfilesQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetProfilesQueryVariables,
      variables?: Types.GetProfilesQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetProfilesQuery, TError, TData>
    ) =>
    useInfiniteQuery<Types.GetProfilesQuery, TError, TData>(
      variables === undefined ? ['GetProfiles.infinite'] : ['GetProfiles.infinite', variables],
      (metaData) => fetcher<Types.GetProfilesQuery, Types.GetProfilesQueryVariables>(GetProfilesDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteGetProfilesQuery.getKey = (variables?: Types.GetProfilesQueryVariables) => variables === undefined ? ['GetProfiles.infinite'] : ['GetProfiles.infinite', variables];
;

useGetProfilesQuery.fetcher = (variables?: Types.GetProfilesQueryVariables) => fetcher<Types.GetProfilesQuery, Types.GetProfilesQueryVariables>(GetProfilesDocument, variables);
export const GetInterestsDocument = /*#__PURE__*/ `
    query GetInterests($after: String, $before: String, $first: Int, $last: Int) {
  interestsIndex(after: $after, before: $before, first: $first, last: $last) {
    edges {
      node {
        topics {
          value
          labelType
        }
        did {
          id
        }
        id
      }
    }
    pageInfo {
      startCursor
      endCursor
      hasNextPage
      hasPreviousPage
    }
  }
}
    `;
export const useGetInterestsQuery = <
      TData = Types.GetInterestsQuery,
      TError = unknown
    >(
      variables?: Types.GetInterestsQueryVariables,
      options?: UseQueryOptions<Types.GetInterestsQuery, TError, TData>
    ) =>
    useQuery<Types.GetInterestsQuery, TError, TData>(
      variables === undefined ? ['GetInterests'] : ['GetInterests', variables],
      fetcher<Types.GetInterestsQuery, Types.GetInterestsQueryVariables>(GetInterestsDocument, variables),
      options
    );
useGetInterestsQuery.document = GetInterestsDocument;


useGetInterestsQuery.getKey = (variables?: Types.GetInterestsQueryVariables) => variables === undefined ? ['GetInterests'] : ['GetInterests', variables];
;

export const useInfiniteGetInterestsQuery = <
      TData = Types.GetInterestsQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetInterestsQueryVariables,
      variables?: Types.GetInterestsQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetInterestsQuery, TError, TData>
    ) =>
    useInfiniteQuery<Types.GetInterestsQuery, TError, TData>(
      variables === undefined ? ['GetInterests.infinite'] : ['GetInterests.infinite', variables],
      (metaData) => fetcher<Types.GetInterestsQuery, Types.GetInterestsQueryVariables>(GetInterestsDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteGetInterestsQuery.getKey = (variables?: Types.GetInterestsQueryVariables) => variables === undefined ? ['GetInterests.infinite'] : ['GetInterests.infinite', variables];
;

useGetInterestsQuery.fetcher = (variables?: Types.GetInterestsQueryVariables) => fetcher<Types.GetInterestsQuery, Types.GetInterestsQueryVariables>(GetInterestsDocument, variables);
export const GetInterestsByDidDocument = /*#__PURE__*/ `
    query GetInterestsByDid($id: ID!) {
  node(id: $id) {
    ... on CeramicAccount {
      interests {
        topics {
          value
          labelType
        }
        did {
          id
        }
        id
      }
    }
  }
}
    `;
export const useGetInterestsByDidQuery = <
      TData = Types.GetInterestsByDidQuery,
      TError = unknown
    >(
      variables: Types.GetInterestsByDidQueryVariables,
      options?: UseQueryOptions<Types.GetInterestsByDidQuery, TError, TData>
    ) =>
    useQuery<Types.GetInterestsByDidQuery, TError, TData>(
      ['GetInterestsByDid', variables],
      fetcher<Types.GetInterestsByDidQuery, Types.GetInterestsByDidQueryVariables>(GetInterestsByDidDocument, variables),
      options
    );
useGetInterestsByDidQuery.document = GetInterestsByDidDocument;


useGetInterestsByDidQuery.getKey = (variables: Types.GetInterestsByDidQueryVariables) => ['GetInterestsByDid', variables];
;

export const useInfiniteGetInterestsByDidQuery = <
      TData = Types.GetInterestsByDidQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetInterestsByDidQueryVariables,
      variables: Types.GetInterestsByDidQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetInterestsByDidQuery, TError, TData>
    ) =>
    useInfiniteQuery<Types.GetInterestsByDidQuery, TError, TData>(
      ['GetInterestsByDid.infinite', variables],
      (metaData) => fetcher<Types.GetInterestsByDidQuery, Types.GetInterestsByDidQueryVariables>(GetInterestsByDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteGetInterestsByDidQuery.getKey = (variables: Types.GetInterestsByDidQueryVariables) => ['GetInterestsByDid.infinite', variables];
;

useGetInterestsByDidQuery.fetcher = (variables: Types.GetInterestsByDidQueryVariables) => fetcher<Types.GetInterestsByDidQuery, Types.GetInterestsByDidQueryVariables>(GetInterestsByDidDocument, variables);
export const GetInterestsByIdDocument = /*#__PURE__*/ `
    query GetInterestsById($id: ID!) {
  node(id: $id) {
    ... on Interests {
      topics {
        value
        labelType
      }
      did {
        id
      }
      id
    }
  }
}
    `;
export const useGetInterestsByIdQuery = <
      TData = Types.GetInterestsByIdQuery,
      TError = unknown
    >(
      variables: Types.GetInterestsByIdQueryVariables,
      options?: UseQueryOptions<Types.GetInterestsByIdQuery, TError, TData>
    ) =>
    useQuery<Types.GetInterestsByIdQuery, TError, TData>(
      ['GetInterestsById', variables],
      fetcher<Types.GetInterestsByIdQuery, Types.GetInterestsByIdQueryVariables>(GetInterestsByIdDocument, variables),
      options
    );
useGetInterestsByIdQuery.document = GetInterestsByIdDocument;


useGetInterestsByIdQuery.getKey = (variables: Types.GetInterestsByIdQueryVariables) => ['GetInterestsById', variables];
;

export const useInfiniteGetInterestsByIdQuery = <
      TData = Types.GetInterestsByIdQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetInterestsByIdQueryVariables,
      variables: Types.GetInterestsByIdQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetInterestsByIdQuery, TError, TData>
    ) =>
    useInfiniteQuery<Types.GetInterestsByIdQuery, TError, TData>(
      ['GetInterestsById.infinite', variables],
      (metaData) => fetcher<Types.GetInterestsByIdQuery, Types.GetInterestsByIdQueryVariables>(GetInterestsByIdDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteGetInterestsByIdQuery.getKey = (variables: Types.GetInterestsByIdQueryVariables) => ['GetInterestsById.infinite', variables];
;

useGetInterestsByIdQuery.fetcher = (variables: Types.GetInterestsByIdQueryVariables) => fetcher<Types.GetInterestsByIdQuery, Types.GetInterestsByIdQueryVariables>(GetInterestsByIdDocument, variables);
export const GetFollowingListByDidDocument = /*#__PURE__*/ `
    query GetFollowingListByDid($id: ID!, $after: String, $before: String, $first: Int, $last: Int) {
  node(id: $id) {
    ... on CeramicAccount {
      followList(after: $after, before: $before, first: $first, last: $last) {
        edges {
          node {
            isFollowing
            profile {
              ...UserProfileFragment
            }
          }
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
      }
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const useGetFollowingListByDidQuery = <
      TData = Types.GetFollowingListByDidQuery,
      TError = unknown
    >(
      variables: Types.GetFollowingListByDidQueryVariables,
      options?: UseQueryOptions<Types.GetFollowingListByDidQuery, TError, TData>
    ) =>
    useQuery<Types.GetFollowingListByDidQuery, TError, TData>(
      ['GetFollowingListByDid', variables],
      fetcher<Types.GetFollowingListByDidQuery, Types.GetFollowingListByDidQueryVariables>(GetFollowingListByDidDocument, variables),
      options
    );
useGetFollowingListByDidQuery.document = GetFollowingListByDidDocument;


useGetFollowingListByDidQuery.getKey = (variables: Types.GetFollowingListByDidQueryVariables) => ['GetFollowingListByDid', variables];
;

export const useInfiniteGetFollowingListByDidQuery = <
      TData = Types.GetFollowingListByDidQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetFollowingListByDidQueryVariables,
      variables: Types.GetFollowingListByDidQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetFollowingListByDidQuery, TError, TData>
    ) =>
    useInfiniteQuery<Types.GetFollowingListByDidQuery, TError, TData>(
      ['GetFollowingListByDid.infinite', variables],
      (metaData) => fetcher<Types.GetFollowingListByDidQuery, Types.GetFollowingListByDidQueryVariables>(GetFollowingListByDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteGetFollowingListByDidQuery.getKey = (variables: Types.GetFollowingListByDidQueryVariables) => ['GetFollowingListByDid.infinite', variables];
;

useGetFollowingListByDidQuery.fetcher = (variables: Types.GetFollowingListByDidQueryVariables) => fetcher<Types.GetFollowingListByDidQuery, Types.GetFollowingListByDidQueryVariables>(GetFollowingListByDidDocument, variables);
export const GetFollowersListByDidDocument = /*#__PURE__*/ `
    query GetFollowersListByDid($id: ID!, $after: String, $before: String, $first: Int, $last: Int) {
  node(id: $id) {
    ... on CeramicAccount {
      profile {
        followers(after: $after, before: $before, first: $first, last: $last) {
          edges {
            node {
              isFollowing
              profile {
                ...UserProfileFragment
              }
            }
          }
          pageInfo {
            startCursor
            endCursor
            hasNextPage
            hasPreviousPage
          }
        }
      }
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const useGetFollowersListByDidQuery = <
      TData = Types.GetFollowersListByDidQuery,
      TError = unknown
    >(
      variables: Types.GetFollowersListByDidQueryVariables,
      options?: UseQueryOptions<Types.GetFollowersListByDidQuery, TError, TData>
    ) =>
    useQuery<Types.GetFollowersListByDidQuery, TError, TData>(
      ['GetFollowersListByDid', variables],
      fetcher<Types.GetFollowersListByDidQuery, Types.GetFollowersListByDidQueryVariables>(GetFollowersListByDidDocument, variables),
      options
    );
useGetFollowersListByDidQuery.document = GetFollowersListByDidDocument;


useGetFollowersListByDidQuery.getKey = (variables: Types.GetFollowersListByDidQueryVariables) => ['GetFollowersListByDid', variables];
;

export const useInfiniteGetFollowersListByDidQuery = <
      TData = Types.GetFollowersListByDidQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetFollowersListByDidQueryVariables,
      variables: Types.GetFollowersListByDidQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetFollowersListByDidQuery, TError, TData>
    ) =>
    useInfiniteQuery<Types.GetFollowersListByDidQuery, TError, TData>(
      ['GetFollowersListByDid.infinite', variables],
      (metaData) => fetcher<Types.GetFollowersListByDidQuery, Types.GetFollowersListByDidQueryVariables>(GetFollowersListByDidDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteGetFollowersListByDidQuery.getKey = (variables: Types.GetFollowersListByDidQueryVariables) => ['GetFollowersListByDid.infinite', variables];
;

useGetFollowersListByDidQuery.fetcher = (variables: Types.GetFollowersListByDidQueryVariables) => fetcher<Types.GetFollowersListByDidQuery, Types.GetFollowersListByDidQueryVariables>(GetFollowersListByDidDocument, variables);
export const GetMyProfileDocument = /*#__PURE__*/ `
    query GetMyProfile {
  viewer {
    profile {
      ...UserProfileFragment
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const useGetMyProfileQuery = <
      TData = Types.GetMyProfileQuery,
      TError = unknown
    >(
      variables?: Types.GetMyProfileQueryVariables,
      options?: UseQueryOptions<Types.GetMyProfileQuery, TError, TData>
    ) =>
    useQuery<Types.GetMyProfileQuery, TError, TData>(
      variables === undefined ? ['GetMyProfile'] : ['GetMyProfile', variables],
      fetcher<Types.GetMyProfileQuery, Types.GetMyProfileQueryVariables>(GetMyProfileDocument, variables),
      options
    );
useGetMyProfileQuery.document = GetMyProfileDocument;


useGetMyProfileQuery.getKey = (variables?: Types.GetMyProfileQueryVariables) => variables === undefined ? ['GetMyProfile'] : ['GetMyProfile', variables];
;

export const useInfiniteGetMyProfileQuery = <
      TData = Types.GetMyProfileQuery,
      TError = unknown
    >(
      pageParamKey: keyof Types.GetMyProfileQueryVariables,
      variables?: Types.GetMyProfileQueryVariables,
      options?: UseInfiniteQueryOptions<Types.GetMyProfileQuery, TError, TData>
    ) =>
    useInfiniteQuery<Types.GetMyProfileQuery, TError, TData>(
      variables === undefined ? ['GetMyProfile.infinite'] : ['GetMyProfile.infinite', variables],
      (metaData) => fetcher<Types.GetMyProfileQuery, Types.GetMyProfileQueryVariables>(GetMyProfileDocument, {...variables, ...(metaData.pageParam ?? {})})(),
      options
    );


useInfiniteGetMyProfileQuery.getKey = (variables?: Types.GetMyProfileQueryVariables) => variables === undefined ? ['GetMyProfile.infinite'] : ['GetMyProfile.infinite', variables];
;

useGetMyProfileQuery.fetcher = (variables?: Types.GetMyProfileQueryVariables) => fetcher<Types.GetMyProfileQuery, Types.GetMyProfileQueryVariables>(GetMyProfileDocument, variables);
export const CreateProfileDocument = /*#__PURE__*/ `
    mutation CreateProfile($i: CreateProfileInput!) {
  createProfile(input: $i) {
    document {
      ...UserProfileFragment
    }
    clientMutationId
  }
}
    ${UserProfileFragmentDoc}`;
export const useCreateProfileMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.CreateProfileMutation, TError, Types.CreateProfileMutationVariables, TContext>) =>
    useMutation<Types.CreateProfileMutation, TError, Types.CreateProfileMutationVariables, TContext>(
      ['CreateProfile'],
      (variables?: Types.CreateProfileMutationVariables) => fetcher<Types.CreateProfileMutation, Types.CreateProfileMutationVariables>(CreateProfileDocument, variables)(),
      options
    );
useCreateProfileMutation.getKey = () => ['CreateProfile'];

useCreateProfileMutation.fetcher = (variables: Types.CreateProfileMutationVariables) => fetcher<Types.CreateProfileMutation, Types.CreateProfileMutationVariables>(CreateProfileDocument, variables);
export const UpdateProfileDocument = /*#__PURE__*/ `
    mutation UpdateProfile($i: UpdateProfileInput!) {
  updateProfile(input: $i) {
    document {
      ...UserProfileFragment
    }
    clientMutationId
  }
}
    ${UserProfileFragmentDoc}`;
export const useUpdateProfileMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpdateProfileMutation, TError, Types.UpdateProfileMutationVariables, TContext>) =>
    useMutation<Types.UpdateProfileMutation, TError, Types.UpdateProfileMutationVariables, TContext>(
      ['UpdateProfile'],
      (variables?: Types.UpdateProfileMutationVariables) => fetcher<Types.UpdateProfileMutation, Types.UpdateProfileMutationVariables>(UpdateProfileDocument, variables)(),
      options
    );
useUpdateProfileMutation.getKey = () => ['UpdateProfile'];

useUpdateProfileMutation.fetcher = (variables: Types.UpdateProfileMutationVariables) => fetcher<Types.UpdateProfileMutation, Types.UpdateProfileMutationVariables>(UpdateProfileDocument, variables);
export const CreateInterestsDocument = /*#__PURE__*/ `
    mutation CreateInterests($i: CreateInterestsInput!) {
  createInterests(input: $i) {
    document {
      topics {
        value
        labelType
      }
      did {
        id
      }
      id
    }
    clientMutationId
  }
}
    `;
export const useCreateInterestsMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.CreateInterestsMutation, TError, Types.CreateInterestsMutationVariables, TContext>) =>
    useMutation<Types.CreateInterestsMutation, TError, Types.CreateInterestsMutationVariables, TContext>(
      ['CreateInterests'],
      (variables?: Types.CreateInterestsMutationVariables) => fetcher<Types.CreateInterestsMutation, Types.CreateInterestsMutationVariables>(CreateInterestsDocument, variables)(),
      options
    );
useCreateInterestsMutation.getKey = () => ['CreateInterests'];

useCreateInterestsMutation.fetcher = (variables: Types.CreateInterestsMutationVariables) => fetcher<Types.CreateInterestsMutation, Types.CreateInterestsMutationVariables>(CreateInterestsDocument, variables);
export const UpdateInterestsDocument = /*#__PURE__*/ `
    mutation UpdateInterests($i: UpdateInterestsInput!) {
  updateInterests(input: $i) {
    document {
      topics {
        value
        labelType
      }
      did {
        id
      }
      id
    }
    clientMutationId
  }
}
    `;
export const useUpdateInterestsMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpdateInterestsMutation, TError, Types.UpdateInterestsMutationVariables, TContext>) =>
    useMutation<Types.UpdateInterestsMutation, TError, Types.UpdateInterestsMutationVariables, TContext>(
      ['UpdateInterests'],
      (variables?: Types.UpdateInterestsMutationVariables) => fetcher<Types.UpdateInterestsMutation, Types.UpdateInterestsMutationVariables>(UpdateInterestsDocument, variables)(),
      options
    );
useUpdateInterestsMutation.getKey = () => ['UpdateInterests'];

useUpdateInterestsMutation.fetcher = (variables: Types.UpdateInterestsMutationVariables) => fetcher<Types.UpdateInterestsMutation, Types.UpdateInterestsMutationVariables>(UpdateInterestsDocument, variables);
export const CreateFollowDocument = /*#__PURE__*/ `
    mutation CreateFollow($i: CreateFollowInput!) {
  createFollow(input: $i) {
    document {
      isFollowing
      profile {
        ...UserProfileFragment
      }
      did {
        id
      }
      id
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const useCreateFollowMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.CreateFollowMutation, TError, Types.CreateFollowMutationVariables, TContext>) =>
    useMutation<Types.CreateFollowMutation, TError, Types.CreateFollowMutationVariables, TContext>(
      ['CreateFollow'],
      (variables?: Types.CreateFollowMutationVariables) => fetcher<Types.CreateFollowMutation, Types.CreateFollowMutationVariables>(CreateFollowDocument, variables)(),
      options
    );
useCreateFollowMutation.getKey = () => ['CreateFollow'];

useCreateFollowMutation.fetcher = (variables: Types.CreateFollowMutationVariables) => fetcher<Types.CreateFollowMutation, Types.CreateFollowMutationVariables>(CreateFollowDocument, variables);
export const UpdateFollowDocument = /*#__PURE__*/ `
    mutation UpdateFollow($i: UpdateFollowInput!) {
  updateFollow(input: $i) {
    document {
      isFollowing
      profile {
        ...UserProfileFragment
      }
      did {
        id
      }
      id
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const useUpdateFollowMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<Types.UpdateFollowMutation, TError, Types.UpdateFollowMutationVariables, TContext>) =>
    useMutation<Types.UpdateFollowMutation, TError, Types.UpdateFollowMutationVariables, TContext>(
      ['UpdateFollow'],
      (variables?: Types.UpdateFollowMutationVariables) => fetcher<Types.UpdateFollowMutation, Types.UpdateFollowMutationVariables>(UpdateFollowDocument, variables)(),
      options
    );
useUpdateFollowMutation.getKey = () => ['UpdateFollow'];

useUpdateFollowMutation.fetcher = (variables: Types.UpdateFollowMutationVariables) => fetcher<Types.UpdateFollowMutation, Types.UpdateFollowMutationVariables>(UpdateFollowDocument, variables);