import * as Types from '@akashaorg/typings/sdk/graphql-operation-types';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export const DataProviderFragmentFragmentDoc = gql`
    fragment DataProviderFragment on DataProvider {
  provider
  property
  value
}
    `;
export const AuthorInfoFragmentDoc = gql`
    fragment AuthorInfo on UserProfile {
  pubKey
  name
  userName
  avatar
  coverImage
  description
  ethAddress
  totalPosts
  totalFollowers
  totalFollowing
  totalInterests
}
    `;
export const PostResultFragmentDoc = gql`
    fragment PostResult on Post {
  content {
    ...DataProviderFragment
  }
  author {
    ...AuthorInfo
  }
  title
  type
  _id
  creationDate
  updatedAt
  tags
  totalComments
  quotedBy
  quotedByAuthors {
    ...AuthorInfo
  }
  quotes {
    content {
      ...DataProviderFragment
    }
    author {
      ...AuthorInfo
    }
    title
    type
    _id
    creationDate
    updatedAt
    tags
    totalComments
  }
}
    ${DataProviderFragmentFragmentDoc}
${AuthorInfoFragmentDoc}`;
export const FeedResultFragmentDoc = gql`
    fragment FeedResult on NewPostsResult {
  results {
    ...PostResult
  }
  nextIndex
  total
}
    ${PostResultFragmentDoc}`;
export const VideoPreviewFFragmentDoc = gql`
    fragment VideoPreviewF on VideoPreview {
  url
  secureUrl
  type
  width
  height
}
    `;
export const LinkPreviewFFragmentDoc = gql`
    fragment LinkPreviewF on LinkPreview {
  url
  mediaType
  contentType
  favicons
  videos {
    ...VideoPreviewF
  }
  title
  siteName
  description
  images
  imagePreviewHash
  faviconPreviewHash
}
    ${VideoPreviewFFragmentDoc}`;
export const TagFieldsFragmentDoc = gql`
    fragment TagFields on Tag {
  name
  creationDate
  totalPosts
}
    `;
export const UserProfileFragmentDataFragmentDoc = gql`
    fragment UserProfileFragmentData on UserProfile {
  pubKey
  name
  userName
  avatar
  coverImage
  description
  ethAddress
  totalPosts
  totalFollowers
  totalFollowing
  totalInterests
}
    `;
export const IntegrationInfoFragmentFragmentDoc = gql`
    fragment IntegrationInfoFragment on IntegrationInfo {
  id
  name
  author
  integrationType
  latestReleaseId
  enabled
}
    `;
export const IntegrationReleaseInfoFragmentFragmentDoc = gql`
    fragment IntegrationReleaseInfoFragment on IntegrationReleaseInfo {
  id
  name
  version
  integrationType
  sources
  integrationID
  author
  enabled
  links {
    publicRepository
    documentation
    detailedDescription
  }
  manifestData {
    mainFile
    license
    keywords
    description
    displayName
  }
  createdAt
}
    `;
export const GetCommentDocument = gql`
    query GetComment($commentID: String!) {
  getComment(commentID: $commentID) {
    content {
      ...DataProviderFragment
    }
    author {
      ...AuthorInfo
    }
    creationDate
    updatedAt
    replyTo
    postId
    totalReplies
    _id
  }
}
    ${DataProviderFragmentFragmentDoc}
${AuthorInfoFragmentDoc}`;
export const GetCommentsDocument = gql`
    query GetComments($offset: String, $limit: Int, $postID: String!) {
  getComments(postID: $postID, offset: $offset, limit: $limit) {
    total
    nextIndex
    results {
      content {
        ...DataProviderFragment
      }
      author {
        ...AuthorInfo
      }
      creationDate
      replyTo
      postId
      totalReplies
      _id
    }
  }
}
    ${DataProviderFragmentFragmentDoc}
${AuthorInfoFragmentDoc}`;
export const GetRepliesDocument = gql`
    query GetReplies($offset: String, $limit: Int, $postID: String!, $commentID: String!) {
  getReplies(
    postID: $postID
    commentID: $commentID
    offset: $offset
    limit: $limit
  ) {
    total
    nextIndex
    results {
      content {
        ...DataProviderFragment
      }
      author {
        ...AuthorInfo
      }
      creationDate
      replyTo
      postId
      totalReplies
      _id
    }
  }
}
    ${DataProviderFragmentFragmentDoc}
${AuthorInfoFragmentDoc}`;
export const AddCommentDocument = gql`
    mutation AddComment($content: [DataProviderInput!], $comment: CommentData) {
  addComment(content: $content, comment: $comment)
}
    `;
export const EditCommentDocument = gql`
    mutation EditComment($content: [DataProviderInput!], $comment: CommentData, $id: String!) {
  editComment(content: $content, comment: $comment, id: $id)
}
    `;
export const RemoveCommentDocument = gql`
    mutation RemoveComment($id: String!) {
  removeComment(id: $id)
}
    `;
export const GetEntryDocument = gql`
    query GetEntry($id: String!, $pubKey: String) {
  getPost(id: $id, pubKey: $pubKey) {
    ...PostResult
  }
}
    ${PostResultFragmentDoc}`;
export const GetEntriesDocument = gql`
    query GetEntries($offset: String, $limit: Int, $pubKey: String) {
  posts(offset: $offset, limit: $limit, pubKey: $pubKey) {
    results {
      ...PostResult
    }
    nextIndex
    total
  }
}
    ${PostResultFragmentDoc}`;
export const CreateEntryDocument = gql`
    mutation CreateEntry($content: [DataProviderInput!], $post: PostData) {
  createPost(content: $content, post: $post)
}
    `;
export const EditEntryDocument = gql`
    mutation EditEntry($content: [DataProviderInput!], $post: PostData, $id: String!) {
  editPost(content: $content, post: $post, id: $id)
}
    `;
export const RemoveEntryDocument = gql`
    mutation RemoveEntry($id: String!) {
  removePost(id: $id)
}
    `;
export const GetPostsByAuthorDocument = gql`
    query GetPostsByAuthor($author: String!, $offset: Int, $limit: Int, $pubKey: String) {
  getPostsByAuthor(
    author: $author
    offset: $offset
    limit: $limit
    pubKey: $pubKey
  ) {
    ...FeedResult
  }
}
    ${FeedResultFragmentDoc}`;
export const GetPostsByTagDocument = gql`
    query GetPostsByTag($tag: String!, $offset: Int, $limit: Int, $pubKey: String) {
  getPostsByTag(tag: $tag, offset: $offset, limit: $limit, pubKey: $pubKey) {
    ...FeedResult
  }
}
    ${FeedResultFragmentDoc}`;
export const GetLinkPreviewDocument = gql`
    mutation GetLinkPreview($link: String!) {
  getLinkPreview(link: $link) {
    ...LinkPreviewF
  }
}
    ${LinkPreviewFFragmentDoc}`;
export const GetCustomFeedDocument = gql`
    query GetCustomFeed($limit: Int, $offset: Int) {
  getCustomFeed(limit: $limit, offset: $offset) {
    ...FeedResult
  }
}
    ${FeedResultFragmentDoc}`;
export const GetTagDocument = gql`
    query GetTag($name: String!) {
  getTag(name: $name) {
    ...TagFields
  }
}
    ${TagFieldsFragmentDoc}`;
export const GetTagsDocument = gql`
    query GetTags($offset: String, $limit: Int) {
  tags(offset: $offset, limit: $limit) {
    results {
      ...TagFields
    }
    nextIndex
    total
  }
}
    ${TagFieldsFragmentDoc}`;
export const SearchTagsDocument = gql`
    query SearchTags($name: String!) {
  searchTags(name: $name) {
    name
    totalPosts
  }
}
    `;
export const CreateTagDocument = gql`
    mutation CreateTag($name: String!) {
  createTag(name: $name)
}
    `;
export const AddProfileProviderDocument = gql`
    mutation AddProfileProvider($data: [DataProviderInput]) {
  addProfileProvider(data: $data)
}
    `;
export const MakeDefaultProviderDocument = gql`
    mutation MakeDefaultProvider($data: [DataProviderInput]) {
  makeDefaultProvider(data: $data)
}
    `;
export const ToggleInterestSubDocument = gql`
    mutation ToggleInterestSub($sub: String!) {
  toggleInterestSub(sub: $sub)
}
    `;
export const RegisterUsernameDocument = gql`
    mutation RegisterUsername($name: String!) {
  registerUserName(name: $name)
}
    `;
export const ResolveProfileDocument = gql`
    query ResolveProfile($pubKey: String!) {
  resolveProfile(pubKey: $pubKey) {
    ...UserProfileFragmentData
    providers {
      ...DataProviderFragment
    }
    default {
      ...DataProviderFragment
    }
  }
}
    ${UserProfileFragmentDataFragmentDoc}
${DataProviderFragmentFragmentDoc}`;
export const GetProfileDocument = gql`
    query GetProfile($ethAddress: String!) {
  getProfile(ethAddress: $ethAddress) {
    ...UserProfileFragmentData
    providers {
      ...DataProviderFragment
    }
    default {
      ...DataProviderFragment
    }
  }
}
    ${UserProfileFragmentDataFragmentDoc}
${DataProviderFragmentFragmentDoc}`;
export const FollowDocument = gql`
    mutation Follow($pubKey: String!) {
  follow(pubKey: $pubKey)
}
    `;
export const UnFollowDocument = gql`
    mutation UnFollow($pubKey: String!) {
  unFollow(pubKey: $pubKey)
}
    `;
export const IsFollowingDocument = gql`
    query IsFollowing($follower: String!, $following: String!) {
  isFollowing(follower: $follower, following: $following)
}
    `;
export const SaveMetaDataDocument = gql`
    mutation SaveMetaData($data: DataProviderInput) {
  saveMetaData(data: $data)
}
    `;
export const SearchProfilesDocument = gql`
    query SearchProfiles($name: String!) {
  searchProfiles(name: $name) {
    ...UserProfileFragmentData
  }
}
    ${UserProfileFragmentDataFragmentDoc}`;
export const GlobalSearchDocument = gql`
    query GlobalSearch($keyword: String!) {
  globalSearch(keyword: $keyword) {
    posts {
      id
    }
    profiles {
      id
    }
    tags {
      id
      name
      totalPosts
    }
    comments {
      id
    }
  }
}
    `;
export const GetFollowersDocument = gql`
    query GetFollowers($pubKey: String!, $limit: Int, $offset: Int) {
  getFollowers(pubKey: $pubKey, limit: $limit, offset: $offset) {
    results {
      ...UserProfileFragmentData
    }
    nextIndex
    total
  }
}
    ${UserProfileFragmentDataFragmentDoc}`;
export const GetFollowingDocument = gql`
    query GetFollowing($pubKey: String!, $limit: Int, $offset: Int) {
  getFollowing(pubKey: $pubKey, limit: $limit, offset: $offset) {
    results {
      ...UserProfileFragmentData
    }
    nextIndex
    total
  }
}
    ${UserProfileFragmentDataFragmentDoc}`;
export const GetInterestsDocument = gql`
    query GetInterests($pubKey: String!) {
  getInterests(pubKey: $pubKey)
}
    `;
export const IsUserNameAvailableDocument = gql`
    query IsUserNameAvailable($userName: String!) {
  isUserNameAvailable(userName: $userName)
}
    `;
export const GetLatestReleaseDocument = gql`
    query GetLatestRelease($integrationIDs: [String]) {
  getLatestRelease(integrationIDs: $integrationIDs) {
    ...IntegrationReleaseInfoFragment
  }
}
    ${IntegrationReleaseInfoFragmentFragmentDoc}`;
export const GetIntegrationInfoDocument = gql`
    query GetIntegrationInfo($integrationIDs: [String]) {
  getIntegrationInfo(integrationIDs: $integrationIDs) {
    ...IntegrationInfoFragment
  }
}
    ${IntegrationInfoFragmentFragmentDoc}`;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetComment(variables: Types.GetCommentQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.GetCommentQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetCommentQuery>(GetCommentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetComment', 'query');
    },
    GetComments(variables: Types.GetCommentsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.GetCommentsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetCommentsQuery>(GetCommentsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetComments', 'query');
    },
    GetReplies(variables: Types.GetRepliesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.GetRepliesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetRepliesQuery>(GetRepliesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetReplies', 'query');
    },
    AddComment(variables?: Types.AddCommentMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.AddCommentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.AddCommentMutation>(AddCommentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddComment', 'mutation');
    },
    EditComment(variables: Types.EditCommentMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.EditCommentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.EditCommentMutation>(EditCommentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditComment', 'mutation');
    },
    RemoveComment(variables: Types.RemoveCommentMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.RemoveCommentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.RemoveCommentMutation>(RemoveCommentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RemoveComment', 'mutation');
    },
    GetEntry(variables: Types.GetEntryQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.GetEntryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetEntryQuery>(GetEntryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetEntry', 'query');
    },
    GetEntries(variables?: Types.GetEntriesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.GetEntriesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetEntriesQuery>(GetEntriesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetEntries', 'query');
    },
    CreateEntry(variables?: Types.CreateEntryMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.CreateEntryMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.CreateEntryMutation>(CreateEntryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateEntry', 'mutation');
    },
    EditEntry(variables: Types.EditEntryMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.EditEntryMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.EditEntryMutation>(EditEntryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditEntry', 'mutation');
    },
    RemoveEntry(variables: Types.RemoveEntryMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.RemoveEntryMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.RemoveEntryMutation>(RemoveEntryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RemoveEntry', 'mutation');
    },
    GetPostsByAuthor(variables: Types.GetPostsByAuthorQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.GetPostsByAuthorQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetPostsByAuthorQuery>(GetPostsByAuthorDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetPostsByAuthor', 'query');
    },
    GetPostsByTag(variables: Types.GetPostsByTagQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.GetPostsByTagQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetPostsByTagQuery>(GetPostsByTagDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetPostsByTag', 'query');
    },
    GetLinkPreview(variables: Types.GetLinkPreviewMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.GetLinkPreviewMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetLinkPreviewMutation>(GetLinkPreviewDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetLinkPreview', 'mutation');
    },
    GetCustomFeed(variables?: Types.GetCustomFeedQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.GetCustomFeedQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetCustomFeedQuery>(GetCustomFeedDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetCustomFeed', 'query');
    },
    GetTag(variables: Types.GetTagQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.GetTagQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetTagQuery>(GetTagDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetTag', 'query');
    },
    GetTags(variables?: Types.GetTagsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.GetTagsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetTagsQuery>(GetTagsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetTags', 'query');
    },
    SearchTags(variables: Types.SearchTagsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.SearchTagsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.SearchTagsQuery>(SearchTagsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SearchTags', 'query');
    },
    CreateTag(variables: Types.CreateTagMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.CreateTagMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.CreateTagMutation>(CreateTagDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateTag', 'mutation');
    },
    AddProfileProvider(variables?: Types.AddProfileProviderMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.AddProfileProviderMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.AddProfileProviderMutation>(AddProfileProviderDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddProfileProvider', 'mutation');
    },
    MakeDefaultProvider(variables?: Types.MakeDefaultProviderMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.MakeDefaultProviderMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.MakeDefaultProviderMutation>(MakeDefaultProviderDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MakeDefaultProvider', 'mutation');
    },
    ToggleInterestSub(variables: Types.ToggleInterestSubMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.ToggleInterestSubMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.ToggleInterestSubMutation>(ToggleInterestSubDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ToggleInterestSub', 'mutation');
    },
    RegisterUsername(variables: Types.RegisterUsernameMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.RegisterUsernameMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.RegisterUsernameMutation>(RegisterUsernameDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RegisterUsername', 'mutation');
    },
    ResolveProfile(variables: Types.ResolveProfileQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.ResolveProfileQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.ResolveProfileQuery>(ResolveProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ResolveProfile', 'query');
    },
    GetProfile(variables: Types.GetProfileQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.GetProfileQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetProfileQuery>(GetProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetProfile', 'query');
    },
    Follow(variables: Types.FollowMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.FollowMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.FollowMutation>(FollowDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Follow', 'mutation');
    },
    UnFollow(variables: Types.UnFollowMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.UnFollowMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.UnFollowMutation>(UnFollowDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UnFollow', 'mutation');
    },
    IsFollowing(variables: Types.IsFollowingQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.IsFollowingQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.IsFollowingQuery>(IsFollowingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'IsFollowing', 'query');
    },
    SaveMetaData(variables?: Types.SaveMetaDataMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.SaveMetaDataMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.SaveMetaDataMutation>(SaveMetaDataDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SaveMetaData', 'mutation');
    },
    SearchProfiles(variables: Types.SearchProfilesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.SearchProfilesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.SearchProfilesQuery>(SearchProfilesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SearchProfiles', 'query');
    },
    GlobalSearch(variables: Types.GlobalSearchQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.GlobalSearchQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GlobalSearchQuery>(GlobalSearchDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GlobalSearch', 'query');
    },
    GetFollowers(variables: Types.GetFollowersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.GetFollowersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetFollowersQuery>(GetFollowersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetFollowers', 'query');
    },
    GetFollowing(variables: Types.GetFollowingQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.GetFollowingQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetFollowingQuery>(GetFollowingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetFollowing', 'query');
    },
    GetInterests(variables: Types.GetInterestsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.GetInterestsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetInterestsQuery>(GetInterestsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetInterests', 'query');
    },
    IsUserNameAvailable(variables: Types.IsUserNameAvailableQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.IsUserNameAvailableQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.IsUserNameAvailableQuery>(IsUserNameAvailableDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'IsUserNameAvailable', 'query');
    },
    GetLatestRelease(variables?: Types.GetLatestReleaseQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.GetLatestReleaseQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetLatestReleaseQuery>(GetLatestReleaseDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetLatestRelease', 'query');
    },
    GetIntegrationInfo(variables?: Types.GetIntegrationInfoQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<Types.GetIntegrationInfoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<Types.GetIntegrationInfoQuery>(GetIntegrationInfoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetIntegrationInfo', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;