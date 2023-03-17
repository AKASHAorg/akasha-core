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
  _FieldSet: any;
};

export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type Comment = {
  _id: Scalars['ID'];
  author: UserProfile;
  content?: Maybe<Array<DataProvider>>;
  creationDate: Scalars['String'];
  mentions?: Maybe<Array<Maybe<Scalars['String']>>>;
  postId: Scalars['String'];
  replyTo?: Maybe<Scalars['String']>;
  totalReplies?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type CommentData = {
  mentions?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  postID?: InputMaybe<Scalars['String']>;
  replyTo?: InputMaybe<Scalars['String']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type CommentsResult = {
  nextIndex?: Maybe<Scalars['String']>;
  results?: Maybe<Array<Comment>>;
  total?: Maybe<Scalars['Int']>;
};

export type DataProvider = {
  property: Scalars['String'];
  provider: Scalars['String'];
  value: Scalars['String'];
};

export type DataProviderInput = {
  property: Scalars['String'];
  provider: Scalars['String'];
  value: Scalars['String'];
};

export type Decision = {
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
  delisted?: Maybe<Scalars['Int']>;
  kept?: Maybe<Scalars['Int']>;
  pending?: Maybe<Scalars['Int']>;
};

export type GlobalSearchResult = {
  comments?: Maybe<Array<Maybe<GlobalSearchResultItem>>>;
  posts?: Maybe<Array<Maybe<GlobalSearchResultItem>>>;
  profiles?: Maybe<Array<Maybe<GlobalSearchResultItem>>>;
  tags?: Maybe<Array<Maybe<GlobalSearchResultTagItem>>>;
};

export type GlobalSearchResultItem = {
  id: Scalars['String'];
  name: Scalars['String'];
};

export type GlobalSearchResultTagItem = {
  id: Scalars['String'];
  name: Scalars['String'];
  totalPosts: Scalars['Int'];
};

export type InfoLink = {
  detailedDescription?: Maybe<Scalars['String']>;
  documentation?: Maybe<Scalars['String']>;
  publicRepository?: Maybe<Scalars['String']>;
};

export type IntegrationInfo = {
  author: Scalars['String'];
  enabled: Scalars['Boolean'];
  id: Scalars['String'];
  integrationType: Scalars['Int'];
  latestReleaseId: Scalars['String'];
  name: Scalars['String'];
};

export type IntegrationReleaseInfo = {
  author: Scalars['String'];
  createdAt?: Maybe<Scalars['Int']>;
  enabled: Scalars['Boolean'];
  id?: Maybe<Scalars['String']>;
  integrationID: Scalars['String'];
  integrationType: Scalars['Int'];
  links?: Maybe<InfoLink>;
  manifestData: ManifestInfo;
  name: Scalars['String'];
  sources?: Maybe<Array<Scalars['String']>>;
  version: Scalars['String'];
};

export type LinkPreview = {
  contentType: Scalars['String'];
  description?: Maybe<Scalars['String']>;
  faviconPreviewHash?: Maybe<Scalars['String']>;
  favicons?: Maybe<Array<Maybe<Scalars['String']>>>;
  imagePreviewHash?: Maybe<Scalars['String']>;
  images?: Maybe<Array<Maybe<Scalars['String']>>>;
  mediaType?: Maybe<Scalars['String']>;
  siteName?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  url: Scalars['String'];
  videos?: Maybe<Array<Maybe<VideoPreview>>>;
};

export type ManifestInfo = {
  description?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  keywords?: Maybe<Array<Maybe<Scalars['String']>>>;
  license?: Maybe<Scalars['String']>;
  mainFile: Scalars['String'];
};

export type Moderator = {
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
  nextIndex?: Maybe<Scalars['Int']>;
  results?: Maybe<Array<Post>>;
  total?: Maybe<Scalars['Int']>;
};

export type Post = {
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
  totalComments: Scalars['String'];
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
  nextIndex?: Maybe<Scalars['String']>;
  results?: Maybe<Array<Post>>;
  total?: Maybe<Scalars['Int']>;
};

export type ProfilesResult = {
  nextIndex?: Maybe<Scalars['Int']>;
  results?: Maybe<Array<UserProfile>>;
  total?: Maybe<Scalars['Int']>;
};

export type Query = {
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
  name: Scalars['String'];
  totalPosts: Scalars['Int'];
};

export type Tag = {
  _id: Scalars['ID'];
  comments?: Maybe<Array<Scalars['String']>>;
  creationDate: Scalars['String'];
  name: Scalars['String'];
  posts?: Maybe<Array<Scalars['String']>>;
  totalPosts: Scalars['Int'];
};

export type TagsResult = {
  nextIndex?: Maybe<Scalars['String']>;
  results?: Maybe<Array<Tag>>;
  total?: Maybe<Scalars['Int']>;
};

export type UserProfile = {
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
  totalFollowers: Scalars['Int'];
  totalFollowing: Scalars['Int'];
  totalInterests: Scalars['Int'];
  totalPosts?: Maybe<Scalars['String']>;
  userName?: Maybe<Scalars['String']>;
};

export type VideoPreview = {
  height?: Maybe<Scalars['String']>;
  secureUrl?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  width?: Maybe<Scalars['String']>;
};
