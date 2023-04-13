import type * as Types from '@akashaorg/typings/sdk/graphql-operation-types-new';

import type { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export const CommentFragmentDoc = /*#__PURE__*/ gql`
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
export const PostFragmentDoc = /*#__PURE__*/ gql`
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
export const UserProfileFragmentDoc = /*#__PURE__*/ gql`
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
export const GetCommentsFromPostDocument = /*#__PURE__*/ gql`
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
export const GetCommentsByAuthorDidDocument = /*#__PURE__*/ gql`
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
export const GetCommentRepliesDocument = /*#__PURE__*/ gql`
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
export const CreateCommentDocument = /*#__PURE__*/ gql`
    mutation CreateComment($i: CreateCommentInput!) {
  createComment(input: $i) {
    document {
      ...CommentFragment
    }
    clientMutationId
  }
}
    ${CommentFragmentDoc}`;
export const UpdateCommentDocument = /*#__PURE__*/ gql`
    mutation UpdateComment($i: UpdateCommentInput!) {
  updateComment(input: $i) {
    document {
      ...CommentFragment
    }
    clientMutationId
  }
}
    ${CommentFragmentDoc}`;
export const CreateCommentReplyDocument = /*#__PURE__*/ gql`
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
export const UpdateCommentReplyDocument = /*#__PURE__*/ gql`
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
export const GetPostsDocument = /*#__PURE__*/ gql`
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
export const GetPostsByAuthorDidDocument = /*#__PURE__*/ gql`
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
export const GetPostByIdDocument = /*#__PURE__*/ gql`
    query GetPostById($id: ID!) {
  node(id: $id) {
    ... on Post {
      ...PostFragment
    }
  }
}
    ${PostFragmentDoc}`;
export const GetQuotedPostsFromPostDocument = /*#__PURE__*/ gql`
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
export const GetMentionsFromPostDocument = /*#__PURE__*/ gql`
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
export const CreatePostDocument = /*#__PURE__*/ gql`
    mutation CreatePost($i: CreatePostInput!) {
  createPost(input: $i) {
    document {
      ...PostFragment
    }
  }
}
    ${PostFragmentDoc}`;
export const UpdatePostDocument = /*#__PURE__*/ gql`
    mutation UpdatePost($i: UpdatePostInput!) {
  updatePost(input: $i) {
    document {
      ...PostFragment
    }
    clientMutationId
  }
}
    ${PostFragmentDoc}`;
export const CreatePostQuoteDocument = /*#__PURE__*/ gql`
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
export const CreatePostProfileMentionDocument = /*#__PURE__*/ gql`
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
export const GetProfileByIdDocument = /*#__PURE__*/ gql`
    query GetProfileByID($id: ID!) {
  node(id: $id) {
    ... on Profile {
      ...UserProfileFragment
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const GetProfileByDidDocument = /*#__PURE__*/ gql`
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
export const GetProfilesDocument = /*#__PURE__*/ gql`
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
export const GetInterestsDocument = /*#__PURE__*/ gql`
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
export const GetInterestsByDidDocument = /*#__PURE__*/ gql`
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
export const GetInterestsByIdDocument = /*#__PURE__*/ gql`
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
export const GetFollowingListByDidDocument = /*#__PURE__*/ gql`
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
export const GetFollowersListByDidDocument = /*#__PURE__*/ gql`
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
export const GetMyProfileDocument = /*#__PURE__*/ gql`
    query GetMyProfile {
  viewer {
    profile {
      ...UserProfileFragment
    }
  }
}
    ${UserProfileFragmentDoc}`;
export const CreateProfileDocument = /*#__PURE__*/ gql`
    mutation CreateProfile($i: CreateProfileInput!) {
  createProfile(input: $i) {
    document {
      ...UserProfileFragment
    }
    clientMutationId
  }
}
    ${UserProfileFragmentDoc}`;
export const UpdateProfileDocument = /*#__PURE__*/ gql`
    mutation UpdateProfile($i: UpdateProfileInput!) {
  updateProfile(input: $i) {
    document {
      ...UserProfileFragment
    }
    clientMutationId
  }
}
    ${UserProfileFragmentDoc}`;
export const CreateInterestsDocument = /*#__PURE__*/ gql`
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
export const UpdateInterestsDocument = /*#__PURE__*/ gql`
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
export const CreateFollowDocument = /*#__PURE__*/ gql`
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
export const UpdateFollowDocument = /*#__PURE__*/ gql`
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
export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    GetCommentsFromPost(variables: Types.GetCommentsFromPostQueryVariables, options?: C): Promise<Types.GetCommentsFromPostQuery> {
      return requester<Types.GetCommentsFromPostQuery, Types.GetCommentsFromPostQueryVariables>(GetCommentsFromPostDocument, variables, options) as Promise<Types.GetCommentsFromPostQuery>;
    },
    GetCommentsByAuthorDid(variables: Types.GetCommentsByAuthorDidQueryVariables, options?: C): Promise<Types.GetCommentsByAuthorDidQuery> {
      return requester<Types.GetCommentsByAuthorDidQuery, Types.GetCommentsByAuthorDidQueryVariables>(GetCommentsByAuthorDidDocument, variables, options) as Promise<Types.GetCommentsByAuthorDidQuery>;
    },
    GetCommentReplies(variables: Types.GetCommentRepliesQueryVariables, options?: C): Promise<Types.GetCommentRepliesQuery> {
      return requester<Types.GetCommentRepliesQuery, Types.GetCommentRepliesQueryVariables>(GetCommentRepliesDocument, variables, options) as Promise<Types.GetCommentRepliesQuery>;
    },
    CreateComment(variables: Types.CreateCommentMutationVariables, options?: C): Promise<Types.CreateCommentMutation> {
      return requester<Types.CreateCommentMutation, Types.CreateCommentMutationVariables>(CreateCommentDocument, variables, options) as Promise<Types.CreateCommentMutation>;
    },
    UpdateComment(variables: Types.UpdateCommentMutationVariables, options?: C): Promise<Types.UpdateCommentMutation> {
      return requester<Types.UpdateCommentMutation, Types.UpdateCommentMutationVariables>(UpdateCommentDocument, variables, options) as Promise<Types.UpdateCommentMutation>;
    },
    CreateCommentReply(variables: Types.CreateCommentReplyMutationVariables, options?: C): Promise<Types.CreateCommentReplyMutation> {
      return requester<Types.CreateCommentReplyMutation, Types.CreateCommentReplyMutationVariables>(CreateCommentReplyDocument, variables, options) as Promise<Types.CreateCommentReplyMutation>;
    },
    UpdateCommentReply(variables: Types.UpdateCommentReplyMutationVariables, options?: C): Promise<Types.UpdateCommentReplyMutation> {
      return requester<Types.UpdateCommentReplyMutation, Types.UpdateCommentReplyMutationVariables>(UpdateCommentReplyDocument, variables, options) as Promise<Types.UpdateCommentReplyMutation>;
    },
    GetPosts(variables?: Types.GetPostsQueryVariables, options?: C): Promise<Types.GetPostsQuery> {
      return requester<Types.GetPostsQuery, Types.GetPostsQueryVariables>(GetPostsDocument, variables, options) as Promise<Types.GetPostsQuery>;
    },
    GetPostsByAuthorDid(variables: Types.GetPostsByAuthorDidQueryVariables, options?: C): Promise<Types.GetPostsByAuthorDidQuery> {
      return requester<Types.GetPostsByAuthorDidQuery, Types.GetPostsByAuthorDidQueryVariables>(GetPostsByAuthorDidDocument, variables, options) as Promise<Types.GetPostsByAuthorDidQuery>;
    },
    GetPostById(variables: Types.GetPostByIdQueryVariables, options?: C): Promise<Types.GetPostByIdQuery> {
      return requester<Types.GetPostByIdQuery, Types.GetPostByIdQueryVariables>(GetPostByIdDocument, variables, options) as Promise<Types.GetPostByIdQuery>;
    },
    GetQuotedPostsFromPost(variables: Types.GetQuotedPostsFromPostQueryVariables, options?: C): Promise<Types.GetQuotedPostsFromPostQuery> {
      return requester<Types.GetQuotedPostsFromPostQuery, Types.GetQuotedPostsFromPostQueryVariables>(GetQuotedPostsFromPostDocument, variables, options) as Promise<Types.GetQuotedPostsFromPostQuery>;
    },
    GetMentionsFromPost(variables: Types.GetMentionsFromPostQueryVariables, options?: C): Promise<Types.GetMentionsFromPostQuery> {
      return requester<Types.GetMentionsFromPostQuery, Types.GetMentionsFromPostQueryVariables>(GetMentionsFromPostDocument, variables, options) as Promise<Types.GetMentionsFromPostQuery>;
    },
    CreatePost(variables: Types.CreatePostMutationVariables, options?: C): Promise<Types.CreatePostMutation> {
      return requester<Types.CreatePostMutation, Types.CreatePostMutationVariables>(CreatePostDocument, variables, options) as Promise<Types.CreatePostMutation>;
    },
    UpdatePost(variables: Types.UpdatePostMutationVariables, options?: C): Promise<Types.UpdatePostMutation> {
      return requester<Types.UpdatePostMutation, Types.UpdatePostMutationVariables>(UpdatePostDocument, variables, options) as Promise<Types.UpdatePostMutation>;
    },
    CreatePostQuote(variables: Types.CreatePostQuoteMutationVariables, options?: C): Promise<Types.CreatePostQuoteMutation> {
      return requester<Types.CreatePostQuoteMutation, Types.CreatePostQuoteMutationVariables>(CreatePostQuoteDocument, variables, options) as Promise<Types.CreatePostQuoteMutation>;
    },
    CreatePostProfileMention(variables: Types.CreatePostProfileMentionMutationVariables, options?: C): Promise<Types.CreatePostProfileMentionMutation> {
      return requester<Types.CreatePostProfileMentionMutation, Types.CreatePostProfileMentionMutationVariables>(CreatePostProfileMentionDocument, variables, options) as Promise<Types.CreatePostProfileMentionMutation>;
    },
    GetProfileByID(variables: Types.GetProfileByIdQueryVariables, options?: C): Promise<Types.GetProfileByIdQuery> {
      return requester<Types.GetProfileByIdQuery, Types.GetProfileByIdQueryVariables>(GetProfileByIdDocument, variables, options) as Promise<Types.GetProfileByIdQuery>;
    },
    GetProfileByDid(variables: Types.GetProfileByDidQueryVariables, options?: C): Promise<Types.GetProfileByDidQuery> {
      return requester<Types.GetProfileByDidQuery, Types.GetProfileByDidQueryVariables>(GetProfileByDidDocument, variables, options) as Promise<Types.GetProfileByDidQuery>;
    },
    GetProfiles(variables?: Types.GetProfilesQueryVariables, options?: C): Promise<Types.GetProfilesQuery> {
      return requester<Types.GetProfilesQuery, Types.GetProfilesQueryVariables>(GetProfilesDocument, variables, options) as Promise<Types.GetProfilesQuery>;
    },
    GetInterests(variables?: Types.GetInterestsQueryVariables, options?: C): Promise<Types.GetInterestsQuery> {
      return requester<Types.GetInterestsQuery, Types.GetInterestsQueryVariables>(GetInterestsDocument, variables, options) as Promise<Types.GetInterestsQuery>;
    },
    GetInterestsByDid(variables: Types.GetInterestsByDidQueryVariables, options?: C): Promise<Types.GetInterestsByDidQuery> {
      return requester<Types.GetInterestsByDidQuery, Types.GetInterestsByDidQueryVariables>(GetInterestsByDidDocument, variables, options) as Promise<Types.GetInterestsByDidQuery>;
    },
    GetInterestsById(variables: Types.GetInterestsByIdQueryVariables, options?: C): Promise<Types.GetInterestsByIdQuery> {
      return requester<Types.GetInterestsByIdQuery, Types.GetInterestsByIdQueryVariables>(GetInterestsByIdDocument, variables, options) as Promise<Types.GetInterestsByIdQuery>;
    },
    GetFollowingListByDid(variables: Types.GetFollowingListByDidQueryVariables, options?: C): Promise<Types.GetFollowingListByDidQuery> {
      return requester<Types.GetFollowingListByDidQuery, Types.GetFollowingListByDidQueryVariables>(GetFollowingListByDidDocument, variables, options) as Promise<Types.GetFollowingListByDidQuery>;
    },
    GetFollowersListByDid(variables: Types.GetFollowersListByDidQueryVariables, options?: C): Promise<Types.GetFollowersListByDidQuery> {
      return requester<Types.GetFollowersListByDidQuery, Types.GetFollowersListByDidQueryVariables>(GetFollowersListByDidDocument, variables, options) as Promise<Types.GetFollowersListByDidQuery>;
    },
    GetMyProfile(variables?: Types.GetMyProfileQueryVariables, options?: C): Promise<Types.GetMyProfileQuery> {
      return requester<Types.GetMyProfileQuery, Types.GetMyProfileQueryVariables>(GetMyProfileDocument, variables, options) as Promise<Types.GetMyProfileQuery>;
    },
    CreateProfile(variables: Types.CreateProfileMutationVariables, options?: C): Promise<Types.CreateProfileMutation> {
      return requester<Types.CreateProfileMutation, Types.CreateProfileMutationVariables>(CreateProfileDocument, variables, options) as Promise<Types.CreateProfileMutation>;
    },
    UpdateProfile(variables: Types.UpdateProfileMutationVariables, options?: C): Promise<Types.UpdateProfileMutation> {
      return requester<Types.UpdateProfileMutation, Types.UpdateProfileMutationVariables>(UpdateProfileDocument, variables, options) as Promise<Types.UpdateProfileMutation>;
    },
    CreateInterests(variables: Types.CreateInterestsMutationVariables, options?: C): Promise<Types.CreateInterestsMutation> {
      return requester<Types.CreateInterestsMutation, Types.CreateInterestsMutationVariables>(CreateInterestsDocument, variables, options) as Promise<Types.CreateInterestsMutation>;
    },
    UpdateInterests(variables: Types.UpdateInterestsMutationVariables, options?: C): Promise<Types.UpdateInterestsMutation> {
      return requester<Types.UpdateInterestsMutation, Types.UpdateInterestsMutationVariables>(UpdateInterestsDocument, variables, options) as Promise<Types.UpdateInterestsMutation>;
    },
    CreateFollow(variables: Types.CreateFollowMutationVariables, options?: C): Promise<Types.CreateFollowMutation> {
      return requester<Types.CreateFollowMutation, Types.CreateFollowMutationVariables>(CreateFollowDocument, variables, options) as Promise<Types.CreateFollowMutation>;
    },
    UpdateFollow(variables: Types.UpdateFollowMutationVariables, options?: C): Promise<Types.UpdateFollowMutation> {
      return requester<Types.UpdateFollowMutation, Types.UpdateFollowMutationVariables>(UpdateFollowDocument, variables, options) as Promise<Types.UpdateFollowMutation>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;