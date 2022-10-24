/* eslint-disable */
import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type Comment = {
  __typename?: 'Comment';
  _id: Scalars['ID'];
  author: UserProfile;
  content?: Maybe<Array<DataProvider>>;
  creationDate: Scalars['String'];
  mentions?: Maybe<Array<Maybe<Scalars['String']>>>;
  postId?: Maybe<Scalars['String']>;
  replyTo?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type CommentData = {
  mentions?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  postID?: InputMaybe<Scalars['String']>;
  replyTo?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CommentsResult = {
  __typename?: 'CommentsResult';
  nextIndex?: Maybe<Scalars['String']>;
  results?: Maybe<Array<Comment>>;
  total?: Maybe<Scalars['Int']>;
};

export type DataProvider = {
  __typename?: 'DataProvider';
  property?: Maybe<Scalars['String']>;
  provider?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type DataProviderInput = {
  property?: InputMaybe<Scalars['String']>;
  provider?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export type Decision = {
  __typename?: 'Decision';
  _id: Scalars['ID'];
  contentID: Scalars['String'];
  contentType: Scalars['String'];
  creationDate: Scalars['String'];
  delisted?: Maybe<Scalars['Boolean']>;
  explanation?: Maybe<Scalars['String']>;
  moderated?: Maybe<Scalars['Boolean']>;
  moderatedDate?: Maybe<Scalars['String']>;
  moderator?: Maybe<UserProfile>;
  reasons: Array<Maybe<Scalars['String']>>;
  reportedBy: UserProfile;
  reportedDate: Scalars['String'];
  reports: Scalars['Int'];
};

export type DecisionData = {
  delisted?: InputMaybe<Scalars['Boolean']>;
  explanation?: InputMaybe<Scalars['String']>;
};

export type DecisionMeta = {
  contentID?: InputMaybe<Scalars['String']>;
};

export type DecisionsCount = {
  __typename?: 'DecisionsCount';
  delisted?: Maybe<Scalars['Int']>;
  kept?: Maybe<Scalars['Int']>;
  pending?: Maybe<Scalars['Int']>;
};

export type GlobalSearchResult = {
  __typename?: 'GlobalSearchResult';
  comments?: Maybe<Array<Maybe<GlobalSearchResultItem>>>;
  posts?: Maybe<Array<Maybe<GlobalSearchResultItem>>>;
  profiles?: Maybe<Array<Maybe<GlobalSearchResultItem>>>;
  tags?: Maybe<Array<Maybe<GlobalSearchResultTagItem>>>;
};

export type GlobalSearchResultItem = {
  __typename?: 'GlobalSearchResultItem';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type GlobalSearchResultTagItem = {
  __typename?: 'GlobalSearchResultTagItem';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  totalPosts?: Maybe<Scalars['Int']>;
};

export type InfoLink = {
  __typename?: 'InfoLink';
  detailedDescription?: Maybe<Scalars['String']>;
  documentation?: Maybe<Scalars['String']>;
  publicRepository?: Maybe<Scalars['String']>;
};

export type IntegrationInfo = {
  __typename?: 'IntegrationInfo';
  author?: Maybe<Scalars['String']>;
  enabled?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['String']>;
  integrationType?: Maybe<Scalars['Int']>;
  latestReleaseId?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type IntegrationReleaseInfo = {
  __typename?: 'IntegrationReleaseInfo';
  author?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Int']>;
  enabled?: Maybe<Scalars['Boolean']>;
  id?: Maybe<Scalars['String']>;
  integrationID?: Maybe<Scalars['String']>;
  integrationType?: Maybe<Scalars['Int']>;
  links?: Maybe<InfoLink>;
  manifestData?: Maybe<ManifestInfo>;
  name?: Maybe<Scalars['String']>;
  sources?: Maybe<Array<Maybe<Scalars['String']>>>;
  version?: Maybe<Scalars['String']>;
};

export type LinkPreview = {
  __typename?: 'LinkPreview';
  contentType?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  faviconPreviewHash?: Maybe<Scalars['String']>;
  favicons?: Maybe<Array<Maybe<Scalars['String']>>>;
  imagePreviewHash?: Maybe<Scalars['String']>;
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  mediaType?: Maybe<Scalars['String']>;
  siteName?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  videos?: Maybe<Array<Maybe<VideoPreview>>>;
};

export type ManifestInfo = {
  __typename?: 'ManifestInfo';
  description?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  keywords?: Maybe<Array<Maybe<Scalars['String']>>>;
  license?: Maybe<Scalars['String']>;
  mainFile?: Maybe<Scalars['String']>;
};

export type Moderator = {
  __typename?: 'Moderator';
  _id: Scalars['ID'];
  active?: Maybe<Scalars['Boolean']>;
  admin?: Maybe<Scalars['Boolean']>;
  creationDate: Scalars['String'];
  ethAddress: Scalars['String'];
};

export type ModeratorData = {
  active?: InputMaybe<Scalars['Boolean']>;
  admin?: InputMaybe<Scalars['Boolean']>;
  ethAddress?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addComment?: Maybe<Scalars['String']>;
  addProfileProvider: Scalars['String'];
  createPost?: Maybe<Scalars['String']>;
  createTag?: Maybe<Scalars['String']>;
  editComment?: Maybe<Scalars['Boolean']>;
  editPost?: Maybe<Scalars['Boolean']>;
  follow?: Maybe<Scalars['Boolean']>;
  getLinkPreview?: Maybe<LinkPreview>;
  makeDefaultProvider: Scalars['String'];
  moderateContent?: Maybe<Scalars['Boolean']>;
  registerUserName: Scalars['String'];
  removeComment?: Maybe<Scalars['Boolean']>;
  removePost?: Maybe<Scalars['Boolean']>;
  reportContent?: Maybe<Scalars['String']>;
  saveMetaData: Scalars['String'];
  toggleInterestSub?: Maybe<Scalars['Boolean']>;
  unFollow?: Maybe<Scalars['Boolean']>;
  updateModerator?: Maybe<Scalars['Boolean']>;
};


export type MutationAddCommentArgs = {
  comment?: InputMaybe<CommentData>;
  content?: InputMaybe<Array<DataProviderInput>>;
};


export type MutationAddProfileProviderArgs = {
  data?: InputMaybe<Array<InputMaybe<DataProviderInput>>>;
};


export type MutationCreatePostArgs = {
  content?: InputMaybe<Array<DataProviderInput>>;
  post?: InputMaybe<PostData>;
};


export type MutationCreateTagArgs = {
  name: Scalars['String'];
};


export type MutationEditCommentArgs = {
  comment?: InputMaybe<CommentData>;
  content?: InputMaybe<Array<DataProviderInput>>;
  id: Scalars['String'];
};


export type MutationEditPostArgs = {
  content?: InputMaybe<Array<DataProviderInput>>;
  id: Scalars['String'];
  post?: InputMaybe<PostData>;
};


export type MutationFollowArgs = {
  pubKey: Scalars['String'];
};


export type MutationGetLinkPreviewArgs = {
  link: Scalars['String'];
};


export type MutationMakeDefaultProviderArgs = {
  data?: InputMaybe<Array<InputMaybe<DataProviderInput>>>;
};


export type MutationModerateContentArgs = {
  decision?: InputMaybe<DecisionData>;
  meta?: InputMaybe<DecisionMeta>;
};


export type MutationRegisterUserNameArgs = {
  name: Scalars['String'];
};


export type MutationRemoveCommentArgs = {
  id: Scalars['String'];
};


export type MutationRemovePostArgs = {
  id: Scalars['String'];
};


export type MutationReportContentArgs = {
  meta?: InputMaybe<ReportMeta>;
  report?: InputMaybe<ReportData>;
};


export type MutationSaveMetaDataArgs = {
  data?: InputMaybe<DataProviderInput>;
};


export type MutationToggleInterestSubArgs = {
  sub: Scalars['String'];
};


export type MutationUnFollowArgs = {
  pubKey: Scalars['String'];
};


export type MutationUpdateModeratorArgs = {
  moderator?: InputMaybe<ModeratorData>;
};

export type NewPostsResult = {
  __typename?: 'NewPostsResult';
  nextIndex?: Maybe<Scalars['Int']>;
  results?: Maybe<Array<Post>>;
  total?: Maybe<Scalars['Int']>;
};

export type Post = {
  __typename?: 'Post';
  _id: Scalars['ID'];
  author: UserProfile;
  content?: Maybe<Array<DataProvider>>;
  creationDate: Scalars['String'];
  mentions?: Maybe<Array<Maybe<Scalars['String']>>>;
  quotedBy?: Maybe<Array<Maybe<Scalars['String']>>>;
  quotedByAuthors?: Maybe<Array<Maybe<UserProfile>>>;
  quotes?: Maybe<Array<Post>>;
  tags?: Maybe<Array<Scalars['String']>>;
  title?: Maybe<Scalars['String']>;
  totalComments?: Maybe<Scalars['String']>;
  type: PostType;
  updatedAt?: Maybe<Scalars['String']>;
};

export type PostData = {
  mentions?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  quotes?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  title?: InputMaybe<Scalars['String']>;
  type?: InputMaybe<PostType>;
};

export enum PostType {
  App = 'APP',
  Article = 'ARTICLE',
  Default = 'DEFAULT',
  Removed = 'REMOVED'
}

export type PostsResult = {
  __typename?: 'PostsResult';
  nextIndex?: Maybe<Scalars['String']>;
  results?: Maybe<Array<Post>>;
  total?: Maybe<Scalars['Int']>;
};

export type ProfilesResult = {
  __typename?: 'ProfilesResult';
  nextIndex?: Maybe<Scalars['Int']>;
  results?: Maybe<Array<UserProfile>>;
  total?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  getComment: Comment;
  getComments?: Maybe<CommentsResult>;
  getCustomFeed?: Maybe<NewPostsResult>;
  getFollowers?: Maybe<ProfilesResult>;
  getFollowing?: Maybe<ProfilesResult>;
  getIntegrationInfo?: Maybe<Array<Maybe<IntegrationInfo>>>;
  getInterests?: Maybe<Array<Maybe<Scalars['String']>>>;
  getLatestRelease?: Maybe<Array<Maybe<IntegrationReleaseInfo>>>;
  getPost: Post;
  getPostsByAuthor?: Maybe<NewPostsResult>;
  getPostsByTag?: Maybe<NewPostsResult>;
  getProfile: UserProfile;
  getReplies?: Maybe<CommentsResult>;
  getTag?: Maybe<Tag>;
  globalSearch?: Maybe<GlobalSearchResult>;
  isFollowing?: Maybe<Scalars['Boolean']>;
  isUserNameAvailable?: Maybe<Scalars['Boolean']>;
  posts?: Maybe<PostsResult>;
  resolveProfile: UserProfile;
  searchProfiles?: Maybe<Array<Maybe<UserProfile>>>;
  searchTags?: Maybe<Array<Maybe<SearchTagsResult>>>;
  tags?: Maybe<TagsResult>;
};


export type QueryGetCommentArgs = {
  commentID: Scalars['String'];
};


export type QueryGetCommentsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['String']>;
  postID: Scalars['String'];
};


export type QueryGetCustomFeedArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryGetFollowersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  pubKey: Scalars['String'];
};


export type QueryGetFollowingArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  pubKey: Scalars['String'];
};


export type QueryGetIntegrationInfoArgs = {
  integrationIDs?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryGetInterestsArgs = {
  pubKey: Scalars['String'];
};


export type QueryGetLatestReleaseArgs = {
  integrationIDs?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type QueryGetPostArgs = {
  id: Scalars['String'];
  pubKey?: InputMaybe<Scalars['String']>;
};


export type QueryGetPostsByAuthorArgs = {
  author: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  pubKey?: InputMaybe<Scalars['String']>;
};


export type QueryGetPostsByTagArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  pubKey?: InputMaybe<Scalars['String']>;
  tag: Scalars['String'];
};


export type QueryGetProfileArgs = {
  ethAddress: Scalars['String'];
};


export type QueryGetRepliesArgs = {
  commentID: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['String']>;
  postID: Scalars['String'];
};


export type QueryGetTagArgs = {
  name: Scalars['String'];
};


export type QueryGlobalSearchArgs = {
  keyword: Scalars['String'];
};


export type QueryIsFollowingArgs = {
  follower: Scalars['String'];
  following: Scalars['String'];
};


export type QueryIsUserNameAvailableArgs = {
  userName: Scalars['String'];
};


export type QueryPostsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['String']>;
  pubKey?: InputMaybe<Scalars['String']>;
};


export type QueryResolveProfileArgs = {
  pubKey: Scalars['String'];
};


export type QuerySearchProfilesArgs = {
  name: Scalars['String'];
};


export type QuerySearchTagsArgs = {
  name: Scalars['String'];
};


export type QueryTagsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['String']>;
};

export type ReportData = {
  explanation?: InputMaybe<Scalars['String']>;
  reason?: InputMaybe<Scalars['String']>;
};

export type ReportMeta = {
  contentID?: InputMaybe<Scalars['String']>;
  contentType?: InputMaybe<Scalars['String']>;
};

export type SearchTagsResult = {
  __typename?: 'SearchTagsResult';
  name?: Maybe<Scalars['String']>;
  totalPosts?: Maybe<Scalars['Int']>;
};

export type Tag = {
  __typename?: 'Tag';
  _id: Scalars['ID'];
  comments?: Maybe<Array<Scalars['String']>>;
  creationDate: Scalars['String'];
  name: Scalars['String'];
  posts?: Maybe<Array<Scalars['String']>>;
  totalPosts?: Maybe<Scalars['Int']>;
};

export type TagsResult = {
  __typename?: 'TagsResult';
  nextIndex?: Maybe<Scalars['String']>;
  results?: Maybe<Array<Tag>>;
  total?: Maybe<Scalars['Int']>;
};

export type UserProfile = {
  __typename?: 'UserProfile';
  _id: Scalars['ID'];
  avatar?: Maybe<Scalars['String']>;
  coverImage?: Maybe<Scalars['String']>;
  creationDate?: Maybe<Scalars['String']>;
  default?: Maybe<Array<Maybe<DataProvider>>>;
  description?: Maybe<Scalars['String']>;
  ethAddress: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  providers?: Maybe<Array<Maybe<DataProvider>>>;
  pubKey: Scalars['String'];
  totalFollowers?: Maybe<Scalars['Int']>;
  totalFollowing?: Maybe<Scalars['Int']>;
  totalInterests?: Maybe<Scalars['Int']>;
  totalPosts?: Maybe<Scalars['String']>;
  userName?: Maybe<Scalars['String']>;
};

export type VideoPreview = {
  __typename?: 'VideoPreview';
  height?: Maybe<Scalars['String']>;
  secureUrl?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  width?: Maybe<Scalars['String']>;
};

export type DataProviderFragmentFragment = { __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null };

export type UserProfileFragmentFragment = { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null };

export type GetCommentQueryVariables = Exact<{
  commentID: Scalars['String'];
}>;


export type GetCommentQuery = { __typename?: 'Query', getComment: { __typename?: 'Comment', creationDate: string, updatedAt?: string | null, replyTo?: string | null, postId?: string | null, _id: string, content?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null }> | null, author: { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null } } };

export type GetCommentsQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  postID: Scalars['String'];
}>;


export type GetCommentsQuery = { __typename?: 'Query', getComments?: { __typename?: 'CommentsResult', total?: number | null, nextIndex?: string | null, results?: Array<{ __typename?: 'Comment', creationDate: string, replyTo?: string | null, postId?: string | null, _id: string, content?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null }> | null, author: { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null } }> | null } | null };

export type GetRepliesQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  postID: Scalars['String'];
  commentID: Scalars['String'];
}>;


export type GetRepliesQuery = { __typename?: 'Query', getReplies?: { __typename?: 'CommentsResult', total?: number | null, nextIndex?: string | null, results?: Array<{ __typename?: 'Comment', creationDate: string, replyTo?: string | null, postId?: string | null, _id: string, content?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null }> | null, author: { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null } }> | null } | null };

export type AddCommentMutationVariables = Exact<{
  content?: InputMaybe<Array<DataProviderInput> | DataProviderInput>;
  comment?: InputMaybe<CommentData>;
}>;


export type AddCommentMutation = { __typename?: 'Mutation', addComment?: string | null };

export type EditCommentMutationVariables = Exact<{
  content?: InputMaybe<Array<DataProviderInput> | DataProviderInput>;
  comment?: InputMaybe<CommentData>;
  id: Scalars['String'];
}>;


export type EditCommentMutation = { __typename?: 'Mutation', editComment?: boolean | null };

export type RemoveCommentMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type RemoveCommentMutation = { __typename?: 'Mutation', removeComment?: boolean | null };

export type PostResultFragment = { __typename?: 'Post', title?: string | null, type: PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments?: string | null, quotedBy?: Array<string | null> | null, content?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null }> | null, author: { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null }, quotedByAuthors?: Array<{ __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null } | null> | null, quotes?: Array<{ __typename?: 'Post', title?: string | null, type: PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, content?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null }> | null, author: { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null } }> | null };

export type FeedResultFragment = { __typename?: 'NewPostsResult', nextIndex?: number | null, total?: number | null, results?: Array<{ __typename?: 'Post', title?: string | null, type: PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments?: string | null, quotedBy?: Array<string | null> | null, content?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null }> | null, author: { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null }, quotedByAuthors?: Array<{ __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null } | null> | null, quotes?: Array<{ __typename?: 'Post', title?: string | null, type: PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, content?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null }> | null, author: { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null } }> | null }> | null };

export type GetEntryQueryVariables = Exact<{
  id: Scalars['String'];
  pubKey?: InputMaybe<Scalars['String']>;
}>;


export type GetEntryQuery = { __typename?: 'Query', getPost: { __typename?: 'Post', title?: string | null, type: PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments?: string | null, quotedBy?: Array<string | null> | null, content?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null }> | null, author: { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null }, quotedByAuthors?: Array<{ __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null } | null> | null, quotes?: Array<{ __typename?: 'Post', title?: string | null, type: PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, content?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null }> | null, author: { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null } }> | null } };

export type GetEntriesQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  pubKey?: InputMaybe<Scalars['String']>;
}>;


export type GetEntriesQuery = { __typename?: 'Query', posts?: { __typename?: 'PostsResult', nextIndex?: string | null, total?: number | null, results?: Array<{ __typename?: 'Post', title?: string | null, type: PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments?: string | null, quotedBy?: Array<string | null> | null, content?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null }> | null, author: { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null }, quotedByAuthors?: Array<{ __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null } | null> | null, quotes?: Array<{ __typename?: 'Post', title?: string | null, type: PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, content?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null }> | null, author: { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null } }> | null }> | null } | null };

export type CreateEntryMutationVariables = Exact<{
  content?: InputMaybe<Array<DataProviderInput> | DataProviderInput>;
  post?: InputMaybe<PostData>;
}>;


export type CreateEntryMutation = { __typename?: 'Mutation', createPost?: string | null };

export type EditEntryMutationVariables = Exact<{
  content?: InputMaybe<Array<DataProviderInput> | DataProviderInput>;
  post?: InputMaybe<PostData>;
  id: Scalars['String'];
}>;


export type EditEntryMutation = { __typename?: 'Mutation', editPost?: boolean | null };

export type RemoveEntryMutationVariables = Exact<{
  id: Scalars['String'];
}>;


export type RemoveEntryMutation = { __typename?: 'Mutation', removePost?: boolean | null };

export type GetPostsByAuthorQueryVariables = Exact<{
  author: Scalars['String'];
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  pubKey?: InputMaybe<Scalars['String']>;
}>;


export type GetPostsByAuthorQuery = { __typename?: 'Query', getPostsByAuthor?: { __typename?: 'NewPostsResult', nextIndex?: number | null, total?: number | null, results?: Array<{ __typename?: 'Post', title?: string | null, type: PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments?: string | null, quotedBy?: Array<string | null> | null, content?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null }> | null, author: { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null }, quotedByAuthors?: Array<{ __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null } | null> | null, quotes?: Array<{ __typename?: 'Post', title?: string | null, type: PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, content?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null }> | null, author: { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null } }> | null }> | null } | null };

export type GetPostsByTagQueryVariables = Exact<{
  tag: Scalars['String'];
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  pubKey?: InputMaybe<Scalars['String']>;
}>;


export type GetPostsByTagQuery = { __typename?: 'Query', getPostsByTag?: { __typename?: 'NewPostsResult', nextIndex?: number | null, total?: number | null, results?: Array<{ __typename?: 'Post', title?: string | null, type: PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments?: string | null, quotedBy?: Array<string | null> | null, content?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null }> | null, author: { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null }, quotedByAuthors?: Array<{ __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null } | null> | null, quotes?: Array<{ __typename?: 'Post', title?: string | null, type: PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, content?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null }> | null, author: { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null } }> | null }> | null } | null };

export type VideoPreviewFFragment = { __typename?: 'VideoPreview', url?: string | null, secureUrl?: string | null, type?: string | null, width?: string | null, height?: string | null };

export type LinkPreviewFFragment = { __typename?: 'LinkPreview', url?: string | null, mediaType?: string | null, contentType?: string | null, favicons?: Array<string | null> | null, title?: string | null, siteName?: string | null, description?: string | null, images?: Array<string | null> | null, imagePreviewHash?: string | null, faviconPreviewHash?: string | null, videos?: Array<{ __typename?: 'VideoPreview', url?: string | null, secureUrl?: string | null, type?: string | null, width?: string | null, height?: string | null } | null> | null };

export type GetLinkPreviewMutationVariables = Exact<{
  link: Scalars['String'];
}>;


export type GetLinkPreviewMutation = { __typename?: 'Mutation', getLinkPreview?: { __typename?: 'LinkPreview', url?: string | null, mediaType?: string | null, contentType?: string | null, favicons?: Array<string | null> | null, title?: string | null, siteName?: string | null, description?: string | null, images?: Array<string | null> | null, imagePreviewHash?: string | null, faviconPreviewHash?: string | null, videos?: Array<{ __typename?: 'VideoPreview', url?: string | null, secureUrl?: string | null, type?: string | null, width?: string | null, height?: string | null } | null> | null } | null };

export type GetCustomFeedQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type GetCustomFeedQuery = { __typename?: 'Query', getCustomFeed?: { __typename?: 'NewPostsResult', nextIndex?: number | null, total?: number | null, results?: Array<{ __typename?: 'Post', title?: string | null, type: PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, totalComments?: string | null, quotedBy?: Array<string | null> | null, content?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null }> | null, author: { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null }, quotedByAuthors?: Array<{ __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null } | null> | null, quotes?: Array<{ __typename?: 'Post', title?: string | null, type: PostType, _id: string, creationDate: string, updatedAt?: string | null, tags?: Array<string> | null, content?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null }> | null, author: { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null } }> | null }> | null } | null };

export type TagFieldsFragment = { __typename?: 'Tag', name: string, creationDate: string, totalPosts?: number | null };

export type GetTagQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type GetTagQuery = { __typename?: 'Query', getTag?: { __typename?: 'Tag', name: string, creationDate: string, totalPosts?: number | null } | null };

export type GetTagsQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type GetTagsQuery = { __typename?: 'Query', tags?: { __typename?: 'TagsResult', nextIndex?: string | null, total?: number | null, results?: Array<{ __typename?: 'Tag', name: string, creationDate: string, totalPosts?: number | null }> | null } | null };

export type SearchTagsQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type SearchTagsQuery = { __typename?: 'Query', searchTags?: Array<{ __typename?: 'SearchTagsResult', name?: string | null, totalPosts?: number | null } | null> | null };

export type CreateTagMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateTagMutation = { __typename?: 'Mutation', createTag?: string | null };

export type UserProfileFragmentDataFragment = { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null, totalInterests?: number | null };

export type AddProfileProviderMutationVariables = Exact<{
  data?: InputMaybe<Array<InputMaybe<DataProviderInput>> | InputMaybe<DataProviderInput>>;
}>;


export type AddProfileProviderMutation = { __typename?: 'Mutation', addProfileProvider: string };

export type MakeDefaultProviderMutationVariables = Exact<{
  data?: InputMaybe<Array<InputMaybe<DataProviderInput>> | InputMaybe<DataProviderInput>>;
}>;


export type MakeDefaultProviderMutation = { __typename?: 'Mutation', makeDefaultProvider: string };

export type ToggleInterestSubMutationVariables = Exact<{
  sub: Scalars['String'];
}>;


export type ToggleInterestSubMutation = { __typename?: 'Mutation', toggleInterestSub?: boolean | null };

export type RegisterUsernameMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type RegisterUsernameMutation = { __typename?: 'Mutation', registerUserName: string };

export type ResolveProfileQueryVariables = Exact<{
  pubKey: Scalars['String'];
}>;


export type ResolveProfileQuery = { __typename?: 'Query', resolveProfile: { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null, totalInterests?: number | null, providers?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null } | null> | null, default?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null } | null> | null } };

export type GetProfileQueryVariables = Exact<{
  ethAddress: Scalars['String'];
}>;


export type GetProfileQuery = { __typename?: 'Query', getProfile: { __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null, totalInterests?: number | null, providers?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null } | null> | null, default?: Array<{ __typename?: 'DataProvider', provider?: string | null, property?: string | null, value?: string | null } | null> | null } };

export type FollowMutationVariables = Exact<{
  pubKey: Scalars['String'];
}>;


export type FollowMutation = { __typename?: 'Mutation', follow?: boolean | null };

export type UnFollowMutationVariables = Exact<{
  pubKey: Scalars['String'];
}>;


export type UnFollowMutation = { __typename?: 'Mutation', unFollow?: boolean | null };

export type IsFollowingQueryVariables = Exact<{
  follower: Scalars['String'];
  following: Scalars['String'];
}>;


export type IsFollowingQuery = { __typename?: 'Query', isFollowing?: boolean | null };

export type SaveMetaDataMutationVariables = Exact<{
  data?: InputMaybe<DataProviderInput>;
}>;


export type SaveMetaDataMutation = { __typename?: 'Mutation', saveMetaData: string };

export type SearchProfilesQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type SearchProfilesQuery = { __typename?: 'Query', searchProfiles?: Array<{ __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null, totalInterests?: number | null } | null> | null };

export type GlobalSearchQueryVariables = Exact<{
  keyword: Scalars['String'];
}>;


export type GlobalSearchQuery = { __typename?: 'Query', globalSearch?: { __typename?: 'GlobalSearchResult', posts?: Array<{ __typename?: 'GlobalSearchResultItem', id?: string | null } | null> | null, profiles?: Array<{ __typename?: 'GlobalSearchResultItem', id?: string | null } | null> | null, tags?: Array<{ __typename?: 'GlobalSearchResultTagItem', id?: string | null, name?: string | null, totalPosts?: number | null } | null> | null, comments?: Array<{ __typename?: 'GlobalSearchResultItem', id?: string | null } | null> | null } | null };

export type GetFollowersQueryVariables = Exact<{
  pubKey: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type GetFollowersQuery = { __typename?: 'Query', getFollowers?: { __typename?: 'ProfilesResult', nextIndex?: number | null, total?: number | null, results?: Array<{ __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null, totalInterests?: number | null }> | null } | null };

export type GetFollowingQueryVariables = Exact<{
  pubKey: Scalars['String'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
}>;


export type GetFollowingQuery = { __typename?: 'Query', getFollowing?: { __typename?: 'ProfilesResult', nextIndex?: number | null, total?: number | null, results?: Array<{ __typename?: 'UserProfile', pubKey: string, name?: string | null, userName?: string | null, avatar?: string | null, coverImage?: string | null, description?: string | null, ethAddress: string, totalPosts?: string | null, totalFollowers?: number | null, totalFollowing?: number | null, totalInterests?: number | null }> | null } | null };

export type GetInterestsQueryVariables = Exact<{
  pubKey: Scalars['String'];
}>;


export type GetInterestsQuery = { __typename?: 'Query', getInterests?: Array<string | null> | null };

export type IsUserNameAvailableQueryVariables = Exact<{
  userName: Scalars['String'];
}>;


export type IsUserNameAvailableQuery = { __typename?: 'Query', isUserNameAvailable?: boolean | null };

export type IntegrationInfoFragmentFragment = { __typename?: 'IntegrationInfo', id?: string | null, name?: string | null, author?: string | null, integrationType?: number | null, latestReleaseId?: string | null, enabled?: boolean | null };

export type IntegrationReleaseInfoFragmentFragment = { __typename?: 'IntegrationReleaseInfo', id?: string | null, name?: string | null, version?: string | null, integrationType?: number | null, sources?: Array<string | null> | null, integrationID?: string | null, author?: string | null, enabled?: boolean | null, createdAt?: number | null, links?: { __typename?: 'InfoLink', publicRepository?: string | null, documentation?: string | null, detailedDescription?: string | null } | null, manifestData?: { __typename?: 'ManifestInfo', mainFile?: string | null, license?: string | null, keywords?: Array<string | null> | null, description?: string | null, displayName?: string | null } | null };

export type GetLatestReleaseQueryVariables = Exact<{
  integrationIDs?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;


export type GetLatestReleaseQuery = { __typename?: 'Query', getLatestRelease?: Array<{ __typename?: 'IntegrationReleaseInfo', id?: string | null, name?: string | null, version?: string | null, integrationType?: number | null, sources?: Array<string | null> | null, integrationID?: string | null, author?: string | null, enabled?: boolean | null, createdAt?: number | null, links?: { __typename?: 'InfoLink', publicRepository?: string | null, documentation?: string | null, detailedDescription?: string | null } | null, manifestData?: { __typename?: 'ManifestInfo', mainFile?: string | null, license?: string | null, keywords?: Array<string | null> | null, description?: string | null, displayName?: string | null } | null } | null> | null };

export type GetIntegrationInfoQueryVariables = Exact<{
  integrationIDs?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;


export type GetIntegrationInfoQuery = { __typename?: 'Query', getIntegrationInfo?: Array<{ __typename?: 'IntegrationInfo', id?: string | null, name?: string | null, author?: string | null, integrationType?: number | null, latestReleaseId?: string | null, enabled?: boolean | null } | null> | null };

export const DataProviderFragmentFragmentDoc = gql`
    fragment DataProviderFragment on DataProvider {
  provider
  property
  value
}
    `;
export const UserProfileFragmentFragmentDoc = gql`
    fragment UserProfileFragment on UserProfile {
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
}
    `;
export const PostResultFragmentDoc = gql`
    fragment PostResult on Post {
  content {
    ...DataProviderFragment
  }
  author {
    ...UserProfileFragment
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
    ...UserProfileFragment
  }
  quotes {
    content {
      ...DataProviderFragment
    }
    author {
      ...UserProfileFragment
    }
    title
    type
    _id
    creationDate
    updatedAt
    tags
  }
}
    ${DataProviderFragmentFragmentDoc}
${UserProfileFragmentFragmentDoc}`;
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
      ...UserProfileFragment
    }
    creationDate
    updatedAt
    replyTo
    postId
    _id
  }
}
    ${DataProviderFragmentFragmentDoc}
${UserProfileFragmentFragmentDoc}`;
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
        ...UserProfileFragment
      }
      creationDate
      replyTo
      postId
      _id
    }
  }
}
    ${DataProviderFragmentFragmentDoc}
${UserProfileFragmentFragmentDoc}`;
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
        ...UserProfileFragment
      }
      creationDate
      replyTo
      postId
      _id
    }
  }
}
    ${DataProviderFragmentFragmentDoc}
${UserProfileFragmentFragmentDoc}`;
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
    GetComment(variables: GetCommentQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetCommentQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCommentQuery>(GetCommentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetComment', 'query');
    },
    GetComments(variables: GetCommentsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetCommentsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCommentsQuery>(GetCommentsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetComments', 'query');
    },
    GetReplies(variables: GetRepliesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetRepliesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetRepliesQuery>(GetRepliesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetReplies', 'query');
    },
    AddComment(variables?: AddCommentMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddCommentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddCommentMutation>(AddCommentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddComment', 'mutation');
    },
    EditComment(variables: EditCommentMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditCommentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditCommentMutation>(EditCommentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditComment', 'mutation');
    },
    RemoveComment(variables: RemoveCommentMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RemoveCommentMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveCommentMutation>(RemoveCommentDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RemoveComment', 'mutation');
    },
    GetEntry(variables: GetEntryQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetEntryQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetEntryQuery>(GetEntryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetEntry', 'query');
    },
    GetEntries(variables?: GetEntriesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetEntriesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetEntriesQuery>(GetEntriesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetEntries', 'query');
    },
    CreateEntry(variables?: CreateEntryMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateEntryMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateEntryMutation>(CreateEntryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateEntry', 'mutation');
    },
    EditEntry(variables: EditEntryMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EditEntryMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EditEntryMutation>(EditEntryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'EditEntry', 'mutation');
    },
    RemoveEntry(variables: RemoveEntryMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RemoveEntryMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoveEntryMutation>(RemoveEntryDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RemoveEntry', 'mutation');
    },
    GetPostsByAuthor(variables: GetPostsByAuthorQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetPostsByAuthorQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPostsByAuthorQuery>(GetPostsByAuthorDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetPostsByAuthor', 'query');
    },
    GetPostsByTag(variables: GetPostsByTagQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetPostsByTagQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetPostsByTagQuery>(GetPostsByTagDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetPostsByTag', 'query');
    },
    GetLinkPreview(variables: GetLinkPreviewMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetLinkPreviewMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetLinkPreviewMutation>(GetLinkPreviewDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetLinkPreview', 'mutation');
    },
    GetCustomFeed(variables?: GetCustomFeedQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetCustomFeedQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetCustomFeedQuery>(GetCustomFeedDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetCustomFeed', 'query');
    },
    GetTag(variables: GetTagQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetTagQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTagQuery>(GetTagDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetTag', 'query');
    },
    GetTags(variables?: GetTagsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetTagsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetTagsQuery>(GetTagsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetTags', 'query');
    },
    SearchTags(variables: SearchTagsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchTagsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchTagsQuery>(SearchTagsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SearchTags', 'query');
    },
    CreateTag(variables: CreateTagMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateTagMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateTagMutation>(CreateTagDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'CreateTag', 'mutation');
    },
    AddProfileProvider(variables?: AddProfileProviderMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddProfileProviderMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddProfileProviderMutation>(AddProfileProviderDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'AddProfileProvider', 'mutation');
    },
    MakeDefaultProvider(variables?: MakeDefaultProviderMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MakeDefaultProviderMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<MakeDefaultProviderMutation>(MakeDefaultProviderDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'MakeDefaultProvider', 'mutation');
    },
    ToggleInterestSub(variables: ToggleInterestSubMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ToggleInterestSubMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ToggleInterestSubMutation>(ToggleInterestSubDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ToggleInterestSub', 'mutation');
    },
    RegisterUsername(variables: RegisterUsernameMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RegisterUsernameMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RegisterUsernameMutation>(RegisterUsernameDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'RegisterUsername', 'mutation');
    },
    ResolveProfile(variables: ResolveProfileQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ResolveProfileQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ResolveProfileQuery>(ResolveProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'ResolveProfile', 'query');
    },
    GetProfile(variables: GetProfileQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetProfileQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetProfileQuery>(GetProfileDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetProfile', 'query');
    },
    Follow(variables: FollowMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FollowMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<FollowMutation>(FollowDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'Follow', 'mutation');
    },
    UnFollow(variables: UnFollowMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UnFollowMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UnFollowMutation>(UnFollowDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'UnFollow', 'mutation');
    },
    IsFollowing(variables: IsFollowingQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<IsFollowingQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<IsFollowingQuery>(IsFollowingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'IsFollowing', 'query');
    },
    SaveMetaData(variables?: SaveMetaDataMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SaveMetaDataMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SaveMetaDataMutation>(SaveMetaDataDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SaveMetaData', 'mutation');
    },
    SearchProfiles(variables: SearchProfilesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchProfilesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchProfilesQuery>(SearchProfilesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'SearchProfiles', 'query');
    },
    GlobalSearch(variables: GlobalSearchQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GlobalSearchQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GlobalSearchQuery>(GlobalSearchDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GlobalSearch', 'query');
    },
    GetFollowers(variables: GetFollowersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetFollowersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetFollowersQuery>(GetFollowersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetFollowers', 'query');
    },
    GetFollowing(variables: GetFollowingQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetFollowingQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetFollowingQuery>(GetFollowingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetFollowing', 'query');
    },
    GetInterests(variables: GetInterestsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetInterestsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetInterestsQuery>(GetInterestsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetInterests', 'query');
    },
    IsUserNameAvailable(variables: IsUserNameAvailableQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<IsUserNameAvailableQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<IsUserNameAvailableQuery>(IsUserNameAvailableDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'IsUserNameAvailable', 'query');
    },
    GetLatestRelease(variables?: GetLatestReleaseQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetLatestReleaseQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetLatestReleaseQuery>(GetLatestReleaseDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetLatestRelease', 'query');
    },
    GetIntegrationInfo(variables?: GetIntegrationInfoQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetIntegrationInfoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetIntegrationInfoQuery>(GetIntegrationInfoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetIntegrationInfo', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;
