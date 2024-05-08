import * as Types from './graphql-types';

import { GraphQLResolveInfo } from 'graphql';
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };


export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Types.Maybe<TTypes> | Promise<Types.Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  CacheControlScope: Types.CacheControlScope;
  Comment: ResolverTypeWrapper<Types.Comment>;
  ID: ResolverTypeWrapper<Types.Scalars['ID']>;
  String: ResolverTypeWrapper<Types.Scalars['String']>;
  Int: ResolverTypeWrapper<Types.Scalars['Int']>;
  CommentData: Types.CommentData;
  CommentsResult: ResolverTypeWrapper<Types.CommentsResult>;
  DataProvider: ResolverTypeWrapper<Types.DataProvider>;
  DataProviderInput: Types.DataProviderInput;
  Decision: ResolverTypeWrapper<Types.Decision>;
  Boolean: ResolverTypeWrapper<Types.Scalars['Boolean']>;
  DecisionData: Types.DecisionData;
  DecisionMeta: Types.DecisionMeta;
  DecisionsCount: ResolverTypeWrapper<Types.DecisionsCount>;
  GlobalSearchResult: ResolverTypeWrapper<Types.GlobalSearchResult>;
  GlobalSearchResultItem: ResolverTypeWrapper<Types.GlobalSearchResultItem>;
  GlobalSearchResultTagItem: ResolverTypeWrapper<Types.GlobalSearchResultTagItem>;
  InfoLink: ResolverTypeWrapper<Types.InfoLink>;
  IntegrationInfo: ResolverTypeWrapper<Types.IntegrationInfo>;
  IntegrationReleaseInfo: ResolverTypeWrapper<Types.IntegrationReleaseInfo>;
  LinkPreview: ResolverTypeWrapper<Types.LinkPreview>;
  ManifestInfo: ResolverTypeWrapper<Types.ManifestInfo>;
  Moderator: ResolverTypeWrapper<Types.Moderator>;
  ModeratorData: Types.ModeratorData;
  Mutation: ResolverTypeWrapper<{}>;
  NewPostsResult: ResolverTypeWrapper<Types.NewPostsResult>;
  Post: ResolverTypeWrapper<Types.Post>;
  PostData: Types.PostData;
  PostType: Types.PostType;
  PostsResult: ResolverTypeWrapper<Types.PostsResult>;
  ProfilesResult: ResolverTypeWrapper<Types.ProfilesResult>;
  Query: ResolverTypeWrapper<{}>;
  ReportData: Types.ReportData;
  ReportMeta: Types.ReportMeta;
  SearchTagsResult: ResolverTypeWrapper<Types.SearchTagsResult>;
  Tag: ResolverTypeWrapper<Types.Tag>;
  TagsResult: ResolverTypeWrapper<Types.TagsResult>;
  UserProfile: ResolverTypeWrapper<Types.UserProfile>;
  VideoPreview: ResolverTypeWrapper<Types.VideoPreview>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Comment: Types.Comment;
  ID: Types.Scalars['ID'];
  String: Types.Scalars['String'];
  Int: Types.Scalars['Int'];
  CommentData: Types.CommentData;
  CommentsResult: Types.CommentsResult;
  DataProvider: Types.DataProvider;
  DataProviderInput: Types.DataProviderInput;
  Decision: Types.Decision;
  Boolean: Types.Scalars['Boolean'];
  DecisionData: Types.DecisionData;
  DecisionMeta: Types.DecisionMeta;
  DecisionsCount: Types.DecisionsCount;
  GlobalSearchResult: Types.GlobalSearchResult;
  GlobalSearchResultItem: Types.GlobalSearchResultItem;
  GlobalSearchResultTagItem: Types.GlobalSearchResultTagItem;
  InfoLink: Types.InfoLink;
  IntegrationInfo: Types.IntegrationInfo;
  IntegrationReleaseInfo: Types.IntegrationReleaseInfo;
  LinkPreview: Types.LinkPreview;
  ManifestInfo: Types.ManifestInfo;
  Moderator: Types.Moderator;
  ModeratorData: Types.ModeratorData;
  Mutation: {};
  NewPostsResult: Types.NewPostsResult;
  Post: Types.Post;
  PostData: Types.PostData;
  PostsResult: Types.PostsResult;
  ProfilesResult: Types.ProfilesResult;
  Query: {};
  ReportData: Types.ReportData;
  ReportMeta: Types.ReportMeta;
  SearchTagsResult: Types.SearchTagsResult;
  Tag: Types.Tag;
  TagsResult: Types.TagsResult;
  UserProfile: Types.UserProfile;
  VideoPreview: Types.VideoPreview;
};

export type CacheControlDirectiveArgs = {
  inheritMaxAge?: Types.Maybe<Types.Scalars['Boolean']>;
  maxAge?: Types.Maybe<Types.Scalars['Int']>;
  scope?: Types.Maybe<Types.CacheControlScope>;
};

export type CacheControlDirectiveResolver<Result, Parent, ContextType = any, Args = CacheControlDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type CommentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType>;
  content?: Resolver<Types.Maybe<Array<ResolversTypes['DataProvider']>>, ParentType, ContextType>;
  creationDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mentions?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  postId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  replyTo?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalReplies?: Resolver<Types.Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  updatedAt?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['CommentsResult'] = ResolversParentTypes['CommentsResult']> = {
  nextIndex?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  results?: Resolver<Types.Maybe<Array<ResolversTypes['Comment']>>, ParentType, ContextType>;
  total?: Resolver<Types.Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DataProviderResolvers<ContextType = any, ParentType extends ResolversParentTypes['DataProvider'] = ResolversParentTypes['DataProvider']> = {
  property?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  provider?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DecisionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Decision'] = ResolversParentTypes['Decision']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  contentID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contentType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creationDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  delisted?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  explanation?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  moderated?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  moderatedDate?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  moderator?: Resolver<Types.Maybe<ResolversTypes['UserProfile']>, ParentType, ContextType>;
  reasons?: Resolver<Array<Types.Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  reportedBy?: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType>;
  reportedDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reports?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DecisionsCountResolvers<ContextType = any, ParentType extends ResolversParentTypes['DecisionsCount'] = ResolversParentTypes['DecisionsCount']> = {
  delisted?: Resolver<Types.Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  kept?: Resolver<Types.Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  pending?: Resolver<Types.Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GlobalSearchResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['GlobalSearchResult'] = ResolversParentTypes['GlobalSearchResult']> = {
  comments?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['GlobalSearchResultItem']>>>, ParentType, ContextType>;
  posts?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['GlobalSearchResultItem']>>>, ParentType, ContextType>;
  profiles?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['GlobalSearchResultItem']>>>, ParentType, ContextType>;
  tags?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['GlobalSearchResultTagItem']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GlobalSearchResultItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['GlobalSearchResultItem'] = ResolversParentTypes['GlobalSearchResultItem']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GlobalSearchResultTagItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['GlobalSearchResultTagItem'] = ResolversParentTypes['GlobalSearchResultTagItem']> = {
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalPosts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InfoLinkResolvers<ContextType = any, ParentType extends ResolversParentTypes['InfoLink'] = ResolversParentTypes['InfoLink']> = {
  detailedDescription?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  documentation?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  publicRepository?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IntegrationInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['IntegrationInfo'] = ResolversParentTypes['IntegrationInfo']> = {
  author?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  integrationType?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  latestReleaseId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IntegrationReleaseInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['IntegrationReleaseInfo'] = ResolversParentTypes['IntegrationReleaseInfo']> = {
  author?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<Types.Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  enabled?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  integrationID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  integrationType?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  links?: Resolver<Types.Maybe<ResolversTypes['InfoLink']>, ParentType, ContextType>;
  manifestData?: Resolver<ResolversTypes['ManifestInfo'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sources?: Resolver<Types.Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LinkPreviewResolvers<ContextType = any, ParentType extends ResolversParentTypes['LinkPreview'] = ResolversParentTypes['LinkPreview']> = {
  contentType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  faviconPreviewHash?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  favicons?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  imagePreviewHash?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  images?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  mediaType?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  siteName?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  videos?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['VideoPreview']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ManifestInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['ManifestInfo'] = ResolversParentTypes['ManifestInfo']> = {
  description?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  displayName?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  keywords?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  license?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mainFile?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ModeratorResolvers<ContextType = any, ParentType extends ResolversParentTypes['Moderator'] = ResolversParentTypes['Moderator']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  active?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  admin?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  creationDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ethAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addComment?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<Types.MutationAddCommentArgs>>;
  addProfileProvider?: Resolver<ResolversTypes['String'], ParentType, ContextType, Partial<Types.MutationAddProfileProviderArgs>>;
  createPost?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<Types.MutationCreatePostArgs>>;
  createTag?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType, RequireFields<Types.MutationCreateTagArgs, 'name'>>;
  editComment?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<Types.MutationEditCommentArgs, 'id'>>;
  editPost?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<Types.MutationEditPostArgs, 'id'>>;
  follow?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<Types.MutationFollowArgs, 'pubKey'>>;
  getLinkPreview?: Resolver<Types.Maybe<ResolversTypes['LinkPreview']>, ParentType, ContextType, RequireFields<Types.MutationGetLinkPreviewArgs, 'link'>>;
  makeDefaultProvider?: Resolver<ResolversTypes['String'], ParentType, ContextType, Partial<Types.MutationMakeDefaultProviderArgs>>;
  moderateContent?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<Types.MutationModerateContentArgs>>;
  registerUserName?: Resolver<ResolversTypes['String'], ParentType, ContextType, RequireFields<Types.MutationRegisterUserNameArgs, 'name'>>;
  removeComment?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<Types.MutationRemoveCommentArgs, 'id'>>;
  removePost?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<Types.MutationRemovePostArgs, 'id'>>;
  reportContent?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<Types.MutationReportContentArgs>>;
  saveMetaData?: Resolver<ResolversTypes['String'], ParentType, ContextType, Partial<Types.MutationSaveMetaDataArgs>>;
  toggleInterestSub?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<Types.MutationToggleInterestSubArgs, 'sub'>>;
  unFollow?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<Types.MutationUnFollowArgs, 'pubKey'>>;
  updateModerator?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<Types.MutationUpdateModeratorArgs>>;
};

export type NewPostsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['NewPostsResult'] = ResolversParentTypes['NewPostsResult']> = {
  nextIndex?: Resolver<Types.Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  results?: Resolver<Types.Maybe<Array<ResolversTypes['Post']>>, ParentType, ContextType>;
  total?: Resolver<Types.Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType>;
  content?: Resolver<Types.Maybe<Array<ResolversTypes['DataProvider']>>, ParentType, ContextType>;
  creationDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  mentions?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  quotedBy?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  quotedByAuthors?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['UserProfile']>>>, ParentType, ContextType>;
  quotes?: Resolver<Types.Maybe<Array<ResolversTypes['Post']>>, ParentType, ContextType>;
  tags?: Resolver<Types.Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  title?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalComments?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['PostType'], ParentType, ContextType>;
  updatedAt?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['PostsResult'] = ResolversParentTypes['PostsResult']> = {
  nextIndex?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  results?: Resolver<Types.Maybe<Array<ResolversTypes['Post']>>, ParentType, ContextType>;
  total?: Resolver<Types.Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfilesResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProfilesResult'] = ResolversParentTypes['ProfilesResult']> = {
  nextIndex?: Resolver<Types.Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  results?: Resolver<Types.Maybe<Array<ResolversTypes['UserProfile']>>, ParentType, ContextType>;
  total?: Resolver<Types.Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getComment?: Resolver<ResolversTypes['Comment'], ParentType, ContextType, RequireFields<Types.QueryGetCommentArgs, 'commentID'>>;
  getComments?: Resolver<Types.Maybe<ResolversTypes['CommentsResult']>, ParentType, ContextType, RequireFields<Types.QueryGetCommentsArgs, 'postID'>>;
  getCustomFeed?: Resolver<Types.Maybe<ResolversTypes['NewPostsResult']>, ParentType, ContextType, Partial<Types.QueryGetCustomFeedArgs>>;
  getFollowers?: Resolver<Types.Maybe<ResolversTypes['ProfilesResult']>, ParentType, ContextType, RequireFields<Types.QueryGetFollowersArgs, 'pubKey'>>;
  getFollowing?: Resolver<Types.Maybe<ResolversTypes['ProfilesResult']>, ParentType, ContextType, RequireFields<Types.QueryGetFollowingArgs, 'pubKey'>>;
  getIntegrationInfo?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['IntegrationInfo']>>>, ParentType, ContextType, Partial<Types.QueryGetIntegrationInfoArgs>>;
  getInterests?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['String']>>>, ParentType, ContextType, RequireFields<Types.QueryGetInterestsArgs, 'pubKey'>>;
  getLatestRelease?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['IntegrationReleaseInfo']>>>, ParentType, ContextType, Partial<Types.QueryGetLatestReleaseArgs>>;
  getPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<Types.QueryGetPostArgs, 'id'>>;
  getPostsByAuthor?: Resolver<Types.Maybe<ResolversTypes['NewPostsResult']>, ParentType, ContextType, RequireFields<Types.QueryGetPostsByAuthorArgs, 'author'>>;
  getPostsByTag?: Resolver<Types.Maybe<ResolversTypes['NewPostsResult']>, ParentType, ContextType, RequireFields<Types.QueryGetPostsByTagArgs, 'tag'>>;
  getProfile?: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType, RequireFields<Types.QueryGetProfileArgs, 'ethAddress'>>;
  getReplies?: Resolver<Types.Maybe<ResolversTypes['CommentsResult']>, ParentType, ContextType, RequireFields<Types.QueryGetRepliesArgs, 'commentID' | 'postID'>>;
  getTag?: Resolver<Types.Maybe<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<Types.QueryGetTagArgs, 'name'>>;
  globalSearch?: Resolver<Types.Maybe<ResolversTypes['GlobalSearchResult']>, ParentType, ContextType, RequireFields<Types.QueryGlobalSearchArgs, 'keyword'>>;
  isFollowing?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<Types.QueryIsFollowingArgs, 'follower' | 'following'>>;
  isUserNameAvailable?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<Types.QueryIsUserNameAvailableArgs, 'userName'>>;
  posts?: Resolver<Types.Maybe<ResolversTypes['PostsResult']>, ParentType, ContextType, Partial<Types.QueryPostsArgs>>;
  resolveProfile?: Resolver<ResolversTypes['UserProfile'], ParentType, ContextType, RequireFields<Types.QueryResolveProfileArgs, 'pubKey'>>;
  searchProfiles?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['UserProfile']>>>, ParentType, ContextType, RequireFields<Types.QuerySearchProfilesArgs, 'name'>>;
  searchTags?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['SearchTagsResult']>>>, ParentType, ContextType, RequireFields<Types.QuerySearchTagsArgs, 'name'>>;
  tags?: Resolver<Types.Maybe<ResolversTypes['TagsResult']>, ParentType, ContextType, Partial<Types.QueryTagsArgs>>;
};

export type SearchTagsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['SearchTagsResult'] = ResolversParentTypes['SearchTagsResult']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalPosts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  comments?: Resolver<Types.Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  creationDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  posts?: Resolver<Types.Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  totalPosts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagsResultResolvers<ContextType = any, ParentType extends ResolversParentTypes['TagsResult'] = ResolversParentTypes['TagsResult']> = {
  nextIndex?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  results?: Resolver<Types.Maybe<Array<ResolversTypes['Tag']>>, ParentType, ContextType>;
  total?: Resolver<Types.Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserProfile'] = ResolversParentTypes['UserProfile']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  avatar?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  coverImage?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  creationDate?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  default?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['DataProvider']>>>, ParentType, ContextType>;
  description?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ethAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  providers?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['DataProvider']>>>, ParentType, ContextType>;
  pubKey?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalFollowers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalFollowing?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalInterests?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPosts?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  userName?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VideoPreviewResolvers<ContextType = any, ParentType extends ResolversParentTypes['VideoPreview'] = ResolversParentTypes['VideoPreview']> = {
  height?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  secureUrl?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  width?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Comment?: CommentResolvers<ContextType>;
  CommentsResult?: CommentsResultResolvers<ContextType>;
  DataProvider?: DataProviderResolvers<ContextType>;
  Decision?: DecisionResolvers<ContextType>;
  DecisionsCount?: DecisionsCountResolvers<ContextType>;
  GlobalSearchResult?: GlobalSearchResultResolvers<ContextType>;
  GlobalSearchResultItem?: GlobalSearchResultItemResolvers<ContextType>;
  GlobalSearchResultTagItem?: GlobalSearchResultTagItemResolvers<ContextType>;
  InfoLink?: InfoLinkResolvers<ContextType>;
  IntegrationInfo?: IntegrationInfoResolvers<ContextType>;
  IntegrationReleaseInfo?: IntegrationReleaseInfoResolvers<ContextType>;
  LinkPreview?: LinkPreviewResolvers<ContextType>;
  ManifestInfo?: ManifestInfoResolvers<ContextType>;
  Moderator?: ModeratorResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  NewPostsResult?: NewPostsResultResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostsResult?: PostsResultResolvers<ContextType>;
  ProfilesResult?: ProfilesResultResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SearchTagsResult?: SearchTagsResultResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  TagsResult?: TagsResultResolvers<ContextType>;
  UserProfile?: UserProfileResolvers<ContextType>;
  VideoPreview?: VideoPreviewResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  cacheControl?: CacheControlDirectiveResolver<any, any, ContextType>;
};
