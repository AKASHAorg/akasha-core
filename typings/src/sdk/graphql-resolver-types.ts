import * as Types from './graphql-types';

import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
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
  AppIntegration: ResolverTypeWrapper<Types.AppIntegration>;
  String: ResolverTypeWrapper<Types.Scalars['String']>;
  ID: ResolverTypeWrapper<Types.Scalars['ID']>;
  Int: ResolverTypeWrapper<Types.Scalars['Int']>;
  AppIntegrationConnection: ResolverTypeWrapper<Types.AppIntegrationConnection>;
  AppIntegrationEdge: ResolverTypeWrapper<Types.AppIntegrationEdge>;
  AppIntegrationInput: Types.AppIntegrationInput;
  AppIntegrationIntegrationType: Types.AppIntegrationIntegrationType;
  AppRelease: ResolverTypeWrapper<Types.AppRelease>;
  AppReleaseConnection: ResolverTypeWrapper<Types.AppReleaseConnection>;
  AppReleaseEdge: ResolverTypeWrapper<Types.AppReleaseEdge>;
  AppReleaseInput: Types.AppReleaseInput;
  CeramicAccount: ResolverTypeWrapper<Types.CeramicAccount>;
  Boolean: ResolverTypeWrapper<Types.Scalars['Boolean']>;
  CeramicCommitID: ResolverTypeWrapper<Types.Scalars['CeramicCommitID']>;
  CeramicStreamID: ResolverTypeWrapper<Types.Scalars['CeramicStreamID']>;
  Comment: ResolverTypeWrapper<Types.Comment>;
  CommentConnection: ResolverTypeWrapper<Types.CommentConnection>;
  CommentEdge: ResolverTypeWrapper<Types.CommentEdge>;
  CommentInput: Types.CommentInput;
  CommentProviderValue: ResolverTypeWrapper<Types.CommentProviderValue>;
  CommentProviderValueInput: Types.CommentProviderValueInput;
  CommentReply: ResolverTypeWrapper<Types.CommentReply>;
  CommentReplyConnection: ResolverTypeWrapper<Types.CommentReplyConnection>;
  CommentReplyEdge: ResolverTypeWrapper<Types.CommentReplyEdge>;
  CommentReplyInput: Types.CommentReplyInput;
  CreateAppIntegrationInput: Types.CreateAppIntegrationInput;
  CreateAppIntegrationPayload: ResolverTypeWrapper<Types.CreateAppIntegrationPayload>;
  CreateAppReleaseInput: Types.CreateAppReleaseInput;
  CreateAppReleasePayload: ResolverTypeWrapper<Types.CreateAppReleasePayload>;
  CreateCommentInput: Types.CreateCommentInput;
  CreateCommentPayload: ResolverTypeWrapper<Types.CreateCommentPayload>;
  CreateCommentReplyInput: Types.CreateCommentReplyInput;
  CreateCommentReplyPayload: ResolverTypeWrapper<Types.CreateCommentReplyPayload>;
  CreateFollowInput: Types.CreateFollowInput;
  CreateFollowPayload: ResolverTypeWrapper<Types.CreateFollowPayload>;
  CreateInterestsInput: Types.CreateInterestsInput;
  CreateInterestsPayload: ResolverTypeWrapper<Types.CreateInterestsPayload>;
  CreatePostInput: Types.CreatePostInput;
  CreatePostPayload: ResolverTypeWrapper<Types.CreatePostPayload>;
  CreatePostQuoteInput: Types.CreatePostQuoteInput;
  CreatePostQuotePayload: ResolverTypeWrapper<Types.CreatePostQuotePayload>;
  CreateProfileInput: Types.CreateProfileInput;
  CreateProfileMentionInput: Types.CreateProfileMentionInput;
  CreateProfileMentionPayload: ResolverTypeWrapper<Types.CreateProfileMentionPayload>;
  CreateProfilePayload: ResolverTypeWrapper<Types.CreateProfilePayload>;
  DID: ResolverTypeWrapper<Types.Scalars['DID']>;
  DateTime: ResolverTypeWrapper<Types.Scalars['DateTime']>;
  Follow: ResolverTypeWrapper<Types.Follow>;
  FollowConnection: ResolverTypeWrapper<Types.FollowConnection>;
  FollowEdge: ResolverTypeWrapper<Types.FollowEdge>;
  FollowInput: Types.FollowInput;
  InterPlanetaryCID: ResolverTypeWrapper<Types.Scalars['InterPlanetaryCID']>;
  Interests: ResolverTypeWrapper<Types.Interests>;
  InterestsConnection: ResolverTypeWrapper<Types.InterestsConnection>;
  InterestsEdge: ResolverTypeWrapper<Types.InterestsEdge>;
  InterestsInput: Types.InterestsInput;
  InterestsLabeled: ResolverTypeWrapper<Types.InterestsLabeled>;
  InterestsLabeledInput: Types.InterestsLabeledInput;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolversTypes['AppIntegration'] | ResolversTypes['AppRelease'] | ResolversTypes['CeramicAccount'] | ResolversTypes['Comment'] | ResolversTypes['CommentReply'] | ResolversTypes['Follow'] | ResolversTypes['Interests'] | ResolversTypes['Post'] | ResolversTypes['PostQuote'] | ResolversTypes['Profile'] | ResolversTypes['ProfileMention'];
  PageInfo: ResolverTypeWrapper<Types.PageInfo>;
  PartialAppIntegrationInput: Types.PartialAppIntegrationInput;
  PartialAppReleaseInput: Types.PartialAppReleaseInput;
  PartialCommentInput: Types.PartialCommentInput;
  PartialCommentReplyInput: Types.PartialCommentReplyInput;
  PartialFollowInput: Types.PartialFollowInput;
  PartialInterestsInput: Types.PartialInterestsInput;
  PartialPostInput: Types.PartialPostInput;
  PartialPostQuoteInput: Types.PartialPostQuoteInput;
  PartialProfileInput: Types.PartialProfileInput;
  PartialProfileMentionInput: Types.PartialProfileMentionInput;
  Post: ResolverTypeWrapper<Types.Post>;
  PostConnection: ResolverTypeWrapper<Types.PostConnection>;
  PostEdge: ResolverTypeWrapper<Types.PostEdge>;
  PostInput: Types.PostInput;
  PostProviderValue: ResolverTypeWrapper<Types.PostProviderValue>;
  PostProviderValueInput: Types.PostProviderValueInput;
  PostQuote: ResolverTypeWrapper<Types.PostQuote>;
  PostQuoteConnection: ResolverTypeWrapper<Types.PostQuoteConnection>;
  PostQuoteEdge: ResolverTypeWrapper<Types.PostQuoteEdge>;
  PostQuoteInput: Types.PostQuoteInput;
  Profile: ResolverTypeWrapper<Types.Profile>;
  ProfileConnection: ResolverTypeWrapper<Types.ProfileConnection>;
  ProfileEdge: ResolverTypeWrapper<Types.ProfileEdge>;
  ProfileImageSource: ResolverTypeWrapper<Types.ProfileImageSource>;
  ProfileImageSourceInput: Types.ProfileImageSourceInput;
  ProfileImageVersions: ResolverTypeWrapper<Types.ProfileImageVersions>;
  ProfileImageVersionsInput: Types.ProfileImageVersionsInput;
  ProfileInput: Types.ProfileInput;
  ProfileLinkSource: ResolverTypeWrapper<Types.ProfileLinkSource>;
  ProfileLinkSourceInput: Types.ProfileLinkSourceInput;
  ProfileMention: ResolverTypeWrapper<Types.ProfileMention>;
  ProfileMentionConnection: ResolverTypeWrapper<Types.ProfileMentionConnection>;
  ProfileMentionEdge: ResolverTypeWrapper<Types.ProfileMentionEdge>;
  ProfileMentionInput: Types.ProfileMentionInput;
  Query: ResolverTypeWrapper<{}>;
  URI: ResolverTypeWrapper<Types.Scalars['URI']>;
  UpdateAppIntegrationInput: Types.UpdateAppIntegrationInput;
  UpdateAppIntegrationPayload: ResolverTypeWrapper<Types.UpdateAppIntegrationPayload>;
  UpdateAppReleaseInput: Types.UpdateAppReleaseInput;
  UpdateAppReleasePayload: ResolverTypeWrapper<Types.UpdateAppReleasePayload>;
  UpdateCommentInput: Types.UpdateCommentInput;
  UpdateCommentPayload: ResolverTypeWrapper<Types.UpdateCommentPayload>;
  UpdateCommentReplyInput: Types.UpdateCommentReplyInput;
  UpdateCommentReplyPayload: ResolverTypeWrapper<Types.UpdateCommentReplyPayload>;
  UpdateFollowInput: Types.UpdateFollowInput;
  UpdateFollowPayload: ResolverTypeWrapper<Types.UpdateFollowPayload>;
  UpdateInterestsInput: Types.UpdateInterestsInput;
  UpdateInterestsPayload: ResolverTypeWrapper<Types.UpdateInterestsPayload>;
  UpdateOptionsInput: Types.UpdateOptionsInput;
  UpdatePostInput: Types.UpdatePostInput;
  UpdatePostPayload: ResolverTypeWrapper<Types.UpdatePostPayload>;
  UpdatePostQuoteInput: Types.UpdatePostQuoteInput;
  UpdatePostQuotePayload: ResolverTypeWrapper<Types.UpdatePostQuotePayload>;
  UpdateProfileInput: Types.UpdateProfileInput;
  UpdateProfileMentionInput: Types.UpdateProfileMentionInput;
  UpdateProfileMentionPayload: ResolverTypeWrapper<Types.UpdateProfileMentionPayload>;
  UpdateProfilePayload: ResolverTypeWrapper<Types.UpdateProfilePayload>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AppIntegration: Types.AppIntegration;
  String: Types.Scalars['String'];
  ID: Types.Scalars['ID'];
  Int: Types.Scalars['Int'];
  AppIntegrationConnection: Types.AppIntegrationConnection;
  AppIntegrationEdge: Types.AppIntegrationEdge;
  AppIntegrationInput: Types.AppIntegrationInput;
  AppRelease: Types.AppRelease;
  AppReleaseConnection: Types.AppReleaseConnection;
  AppReleaseEdge: Types.AppReleaseEdge;
  AppReleaseInput: Types.AppReleaseInput;
  CeramicAccount: Types.CeramicAccount;
  Boolean: Types.Scalars['Boolean'];
  CeramicCommitID: Types.Scalars['CeramicCommitID'];
  CeramicStreamID: Types.Scalars['CeramicStreamID'];
  Comment: Types.Comment;
  CommentConnection: Types.CommentConnection;
  CommentEdge: Types.CommentEdge;
  CommentInput: Types.CommentInput;
  CommentProviderValue: Types.CommentProviderValue;
  CommentProviderValueInput: Types.CommentProviderValueInput;
  CommentReply: Types.CommentReply;
  CommentReplyConnection: Types.CommentReplyConnection;
  CommentReplyEdge: Types.CommentReplyEdge;
  CommentReplyInput: Types.CommentReplyInput;
  CreateAppIntegrationInput: Types.CreateAppIntegrationInput;
  CreateAppIntegrationPayload: Types.CreateAppIntegrationPayload;
  CreateAppReleaseInput: Types.CreateAppReleaseInput;
  CreateAppReleasePayload: Types.CreateAppReleasePayload;
  CreateCommentInput: Types.CreateCommentInput;
  CreateCommentPayload: Types.CreateCommentPayload;
  CreateCommentReplyInput: Types.CreateCommentReplyInput;
  CreateCommentReplyPayload: Types.CreateCommentReplyPayload;
  CreateFollowInput: Types.CreateFollowInput;
  CreateFollowPayload: Types.CreateFollowPayload;
  CreateInterestsInput: Types.CreateInterestsInput;
  CreateInterestsPayload: Types.CreateInterestsPayload;
  CreatePostInput: Types.CreatePostInput;
  CreatePostPayload: Types.CreatePostPayload;
  CreatePostQuoteInput: Types.CreatePostQuoteInput;
  CreatePostQuotePayload: Types.CreatePostQuotePayload;
  CreateProfileInput: Types.CreateProfileInput;
  CreateProfileMentionInput: Types.CreateProfileMentionInput;
  CreateProfileMentionPayload: Types.CreateProfileMentionPayload;
  CreateProfilePayload: Types.CreateProfilePayload;
  DID: Types.Scalars['DID'];
  DateTime: Types.Scalars['DateTime'];
  Follow: Types.Follow;
  FollowConnection: Types.FollowConnection;
  FollowEdge: Types.FollowEdge;
  FollowInput: Types.FollowInput;
  InterPlanetaryCID: Types.Scalars['InterPlanetaryCID'];
  Interests: Types.Interests;
  InterestsConnection: Types.InterestsConnection;
  InterestsEdge: Types.InterestsEdge;
  InterestsInput: Types.InterestsInput;
  InterestsLabeled: Types.InterestsLabeled;
  InterestsLabeledInput: Types.InterestsLabeledInput;
  Mutation: {};
  Node: ResolversParentTypes['AppIntegration'] | ResolversParentTypes['AppRelease'] | ResolversParentTypes['CeramicAccount'] | ResolversParentTypes['Comment'] | ResolversParentTypes['CommentReply'] | ResolversParentTypes['Follow'] | ResolversParentTypes['Interests'] | ResolversParentTypes['Post'] | ResolversParentTypes['PostQuote'] | ResolversParentTypes['Profile'] | ResolversParentTypes['ProfileMention'];
  PageInfo: Types.PageInfo;
  PartialAppIntegrationInput: Types.PartialAppIntegrationInput;
  PartialAppReleaseInput: Types.PartialAppReleaseInput;
  PartialCommentInput: Types.PartialCommentInput;
  PartialCommentReplyInput: Types.PartialCommentReplyInput;
  PartialFollowInput: Types.PartialFollowInput;
  PartialInterestsInput: Types.PartialInterestsInput;
  PartialPostInput: Types.PartialPostInput;
  PartialPostQuoteInput: Types.PartialPostQuoteInput;
  PartialProfileInput: Types.PartialProfileInput;
  PartialProfileMentionInput: Types.PartialProfileMentionInput;
  Post: Types.Post;
  PostConnection: Types.PostConnection;
  PostEdge: Types.PostEdge;
  PostInput: Types.PostInput;
  PostProviderValue: Types.PostProviderValue;
  PostProviderValueInput: Types.PostProviderValueInput;
  PostQuote: Types.PostQuote;
  PostQuoteConnection: Types.PostQuoteConnection;
  PostQuoteEdge: Types.PostQuoteEdge;
  PostQuoteInput: Types.PostQuoteInput;
  Profile: Types.Profile;
  ProfileConnection: Types.ProfileConnection;
  ProfileEdge: Types.ProfileEdge;
  ProfileImageSource: Types.ProfileImageSource;
  ProfileImageSourceInput: Types.ProfileImageSourceInput;
  ProfileImageVersions: Types.ProfileImageVersions;
  ProfileImageVersionsInput: Types.ProfileImageVersionsInput;
  ProfileInput: Types.ProfileInput;
  ProfileLinkSource: Types.ProfileLinkSource;
  ProfileLinkSourceInput: Types.ProfileLinkSourceInput;
  ProfileMention: Types.ProfileMention;
  ProfileMentionConnection: Types.ProfileMentionConnection;
  ProfileMentionEdge: Types.ProfileMentionEdge;
  ProfileMentionInput: Types.ProfileMentionInput;
  Query: {};
  URI: Types.Scalars['URI'];
  UpdateAppIntegrationInput: Types.UpdateAppIntegrationInput;
  UpdateAppIntegrationPayload: Types.UpdateAppIntegrationPayload;
  UpdateAppReleaseInput: Types.UpdateAppReleaseInput;
  UpdateAppReleasePayload: Types.UpdateAppReleasePayload;
  UpdateCommentInput: Types.UpdateCommentInput;
  UpdateCommentPayload: Types.UpdateCommentPayload;
  UpdateCommentReplyInput: Types.UpdateCommentReplyInput;
  UpdateCommentReplyPayload: Types.UpdateCommentReplyPayload;
  UpdateFollowInput: Types.UpdateFollowInput;
  UpdateFollowPayload: Types.UpdateFollowPayload;
  UpdateInterestsInput: Types.UpdateInterestsInput;
  UpdateInterestsPayload: Types.UpdateInterestsPayload;
  UpdateOptionsInput: Types.UpdateOptionsInput;
  UpdatePostInput: Types.UpdatePostInput;
  UpdatePostPayload: Types.UpdatePostPayload;
  UpdatePostQuoteInput: Types.UpdatePostQuoteInput;
  UpdatePostQuotePayload: Types.UpdatePostQuotePayload;
  UpdateProfileInput: Types.UpdateProfileInput;
  UpdateProfileMentionInput: Types.UpdateProfileMentionInput;
  UpdateProfileMentionPayload: Types.UpdateProfileMentionPayload;
  UpdateProfilePayload: Types.UpdateProfilePayload;
};

export type AppIntegrationResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppIntegration'] = ResolversParentTypes['AppIntegration']> = {
  author?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  contributors?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['CeramicAccount']>>>, ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  integrationType?: Resolver<Types.Maybe<ResolversTypes['AppIntegrationIntegrationType']>, ParentType, ContextType>;
  keywords?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  licence?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  releases?: Resolver<ResolversTypes['AppReleaseConnection'], ParentType, ContextType, Partial<Types.AppIntegrationReleasesArgs>>;
  releasessCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.AppIntegrationReleasessCountArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppIntegrationConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppIntegrationConnection'] = ResolversParentTypes['AppIntegrationConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AppIntegrationEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppIntegrationEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppIntegrationEdge'] = ResolversParentTypes['AppIntegrationEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AppIntegration']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppReleaseResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppRelease'] = ResolversParentTypes['AppRelease']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  integration?: Resolver<Types.Maybe<ResolversTypes['AppIntegration']>, ParentType, ContextType>;
  integrationID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  source?: Resolver<ResolversTypes['InterPlanetaryCID'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppReleaseConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppReleaseConnection'] = ResolversParentTypes['AppReleaseConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AppReleaseEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppReleaseEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppReleaseEdge'] = ResolversParentTypes['AppReleaseEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AppRelease']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CeramicAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['CeramicAccount'] = ResolversParentTypes['CeramicAccount']> = {
  appIntegrationList?: Resolver<Types.Maybe<ResolversTypes['AppIntegrationConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAppIntegrationListArgs>>;
  appReleaseList?: Resolver<Types.Maybe<ResolversTypes['AppReleaseConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAppReleaseListArgs>>;
  commentList?: Resolver<Types.Maybe<ResolversTypes['CommentConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountCommentListArgs>>;
  commentReplyList?: Resolver<Types.Maybe<ResolversTypes['CommentReplyConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountCommentReplyListArgs>>;
  followList?: Resolver<Types.Maybe<ResolversTypes['FollowConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountFollowListArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  interests?: Resolver<Types.Maybe<ResolversTypes['Interests']>, ParentType, ContextType>;
  isViewer?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  postList?: Resolver<Types.Maybe<ResolversTypes['PostConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountPostListArgs>>;
  postQuoteList?: Resolver<Types.Maybe<ResolversTypes['PostQuoteConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountPostQuoteListArgs>>;
  profile?: Resolver<Types.Maybe<ResolversTypes['Profile']>, ParentType, ContextType>;
  profileMentionList?: Resolver<Types.Maybe<ResolversTypes['ProfileMentionConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountProfileMentionListArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface CeramicCommitIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['CeramicCommitID'], any> {
  name: 'CeramicCommitID';
}

export interface CeramicStreamIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['CeramicStreamID'], any> {
  name: 'CeramicStreamID';
}

export type CommentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  content?: Resolver<Array<ResolversTypes['CommentProviderValue']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isReply?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  post?: Resolver<Types.Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
  postID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  replies?: Resolver<ResolversTypes['CommentReplyConnection'], ParentType, ContextType, Partial<Types.CommentRepliesArgs>>;
  repliesCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CommentRepliesCountArgs>>;
  version?: Resolver<ResolversTypes['CeramicCommitID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CommentConnection'] = ResolversParentTypes['CommentConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['CommentEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CommentEdge'] = ResolversParentTypes['CommentEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Comment']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentProviderValueResolvers<ContextType = any, ParentType extends ResolversParentTypes['CommentProviderValue'] = ResolversParentTypes['CommentProviderValue']> = {
  property?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  provider?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentReplyResolvers<ContextType = any, ParentType extends ResolversParentTypes['CommentReply'] = ResolversParentTypes['CommentReply']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  comment?: Resolver<Types.Maybe<ResolversTypes['Comment']>, ParentType, ContextType>;
  commentID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  reply?: Resolver<Types.Maybe<ResolversTypes['Comment']>, ParentType, ContextType>;
  replyID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentReplyConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['CommentReplyConnection'] = ResolversParentTypes['CommentReplyConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['CommentReplyEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentReplyEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['CommentReplyEdge'] = ResolversParentTypes['CommentReplyEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['CommentReply']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateAppIntegrationPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAppIntegrationPayload'] = ResolversParentTypes['CreateAppIntegrationPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AppIntegration'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateAppIntegrationPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateAppReleasePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAppReleasePayload'] = ResolversParentTypes['CreateAppReleasePayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AppRelease'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateAppReleasePayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateCommentPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateCommentPayload'] = ResolversParentTypes['CreateCommentPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Comment'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateCommentPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateCommentReplyPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateCommentReplyPayload'] = ResolversParentTypes['CreateCommentReplyPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['CommentReply'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateCommentReplyPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateFollowPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateFollowPayload'] = ResolversParentTypes['CreateFollowPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Follow'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateFollowPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateInterestsPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateInterestsPayload'] = ResolversParentTypes['CreateInterestsPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Interests'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateInterestsPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreatePostPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreatePostPayload'] = ResolversParentTypes['CreatePostPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreatePostPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreatePostQuotePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreatePostQuotePayload'] = ResolversParentTypes['CreatePostQuotePayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['PostQuote'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreatePostQuotePayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateProfileMentionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateProfileMentionPayload'] = ResolversParentTypes['CreateProfileMentionPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['ProfileMention'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateProfileMentionPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateProfilePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateProfilePayload'] = ResolversParentTypes['CreateProfilePayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateProfilePayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DID'], any> {
  name: 'DID';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type FollowResolvers<ContextType = any, ParentType extends ResolversParentTypes['Follow'] = ResolversParentTypes['Follow']> = {
  did?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isFollowing?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  profile?: Resolver<Types.Maybe<ResolversTypes['Profile']>, ParentType, ContextType>;
  profileID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FollowConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['FollowConnection'] = ResolversParentTypes['FollowConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['FollowEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FollowEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['FollowEdge'] = ResolversParentTypes['FollowEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Follow']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface InterPlanetaryCidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['InterPlanetaryCID'], any> {
  name: 'InterPlanetaryCID';
}

export type InterestsResolvers<ContextType = any, ParentType extends ResolversParentTypes['Interests'] = ResolversParentTypes['Interests']> = {
  did?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  topics?: Resolver<Array<ResolversTypes['InterestsLabeled']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InterestsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['InterestsConnection'] = ResolversParentTypes['InterestsConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['InterestsEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InterestsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['InterestsEdge'] = ResolversParentTypes['InterestsEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Interests']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InterestsLabeledResolvers<ContextType = any, ParentType extends ResolversParentTypes['InterestsLabeled'] = ResolversParentTypes['InterestsLabeled']> = {
  labelType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAppIntegration?: Resolver<Types.Maybe<ResolversTypes['CreateAppIntegrationPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAppIntegrationArgs, 'input'>>;
  createAppRelease?: Resolver<Types.Maybe<ResolversTypes['CreateAppReleasePayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAppReleaseArgs, 'input'>>;
  createComment?: Resolver<Types.Maybe<ResolversTypes['CreateCommentPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateCommentArgs, 'input'>>;
  createCommentReply?: Resolver<Types.Maybe<ResolversTypes['CreateCommentReplyPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateCommentReplyArgs, 'input'>>;
  createFollow?: Resolver<Types.Maybe<ResolversTypes['CreateFollowPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateFollowArgs, 'input'>>;
  createInterests?: Resolver<Types.Maybe<ResolversTypes['CreateInterestsPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateInterestsArgs, 'input'>>;
  createPost?: Resolver<Types.Maybe<ResolversTypes['CreatePostPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreatePostArgs, 'input'>>;
  createPostQuote?: Resolver<Types.Maybe<ResolversTypes['CreatePostQuotePayload']>, ParentType, ContextType, RequireFields<Types.MutationCreatePostQuoteArgs, 'input'>>;
  createProfile?: Resolver<Types.Maybe<ResolversTypes['CreateProfilePayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateProfileArgs, 'input'>>;
  createProfileMention?: Resolver<Types.Maybe<ResolversTypes['CreateProfileMentionPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateProfileMentionArgs, 'input'>>;
  updateAppIntegration?: Resolver<Types.Maybe<ResolversTypes['UpdateAppIntegrationPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateAppIntegrationArgs, 'input'>>;
  updateAppRelease?: Resolver<Types.Maybe<ResolversTypes['UpdateAppReleasePayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateAppReleaseArgs, 'input'>>;
  updateComment?: Resolver<Types.Maybe<ResolversTypes['UpdateCommentPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateCommentArgs, 'input'>>;
  updateCommentReply?: Resolver<Types.Maybe<ResolversTypes['UpdateCommentReplyPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateCommentReplyArgs, 'input'>>;
  updateFollow?: Resolver<Types.Maybe<ResolversTypes['UpdateFollowPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateFollowArgs, 'input'>>;
  updateInterests?: Resolver<Types.Maybe<ResolversTypes['UpdateInterestsPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateInterestsArgs, 'input'>>;
  updatePost?: Resolver<Types.Maybe<ResolversTypes['UpdatePostPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdatePostArgs, 'input'>>;
  updatePostQuote?: Resolver<Types.Maybe<ResolversTypes['UpdatePostQuotePayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdatePostQuoteArgs, 'input'>>;
  updateProfile?: Resolver<Types.Maybe<ResolversTypes['UpdateProfilePayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateProfileArgs, 'input'>>;
  updateProfileMention?: Resolver<Types.Maybe<ResolversTypes['UpdateProfileMentionPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateProfileMentionArgs, 'input'>>;
};

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'AppIntegration' | 'AppRelease' | 'CeramicAccount' | 'Comment' | 'CommentReply' | 'Follow' | 'Interests' | 'Post' | 'PostQuote' | 'Profile' | 'ProfileMention', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  comments?: Resolver<ResolversTypes['CommentConnection'], ParentType, ContextType, Partial<Types.PostCommentsArgs>>;
  commentsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.PostCommentsCountArgs>>;
  content?: Resolver<Array<ResolversTypes['PostProviderValue']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  mentions?: Resolver<ResolversTypes['ProfileMentionConnection'], ParentType, ContextType, Partial<Types.PostMentionsArgs>>;
  quotes?: Resolver<ResolversTypes['PostQuoteConnection'], ParentType, ContextType, Partial<Types.PostQuotesArgs>>;
  quotesCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.PostQuotesCountArgs>>;
  tags?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  version?: Resolver<ResolversTypes['CeramicCommitID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['PostConnection'] = ResolversParentTypes['PostConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['PostEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['PostEdge'] = ResolversParentTypes['PostEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostProviderValueResolvers<ContextType = any, ParentType extends ResolversParentTypes['PostProviderValue'] = ResolversParentTypes['PostProviderValue']> = {
  property?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  provider?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostQuoteResolvers<ContextType = any, ParentType extends ResolversParentTypes['PostQuote'] = ResolversParentTypes['PostQuote']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  post?: Resolver<Types.Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
  postID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  quotedPost?: Resolver<Types.Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
  quotedPostID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostQuoteConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['PostQuoteConnection'] = ResolversParentTypes['PostQuoteConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['PostQuoteEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostQuoteEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['PostQuoteEdge'] = ResolversParentTypes['PostQuoteEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['PostQuote']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']> = {
  avatar?: Resolver<Types.Maybe<ResolversTypes['ProfileImageVersions']>, ParentType, ContextType>;
  background?: Resolver<Types.Maybe<ResolversTypes['ProfileImageVersions']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  did?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  followers?: Resolver<ResolversTypes['FollowConnection'], ParentType, ContextType, Partial<Types.ProfileFollowersArgs>>;
  following?: Resolver<ResolversTypes['FollowConnection'], ParentType, ContextType, Partial<Types.ProfileFollowingArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  links?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['ProfileLinkSource']>>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalFollowers?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.ProfileTotalFollowersArgs>>;
  totalFollowing?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.ProfileTotalFollowingArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfileConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProfileConnection'] = ResolversParentTypes['ProfileConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['ProfileEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfileEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProfileEdge'] = ResolversParentTypes['ProfileEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Profile']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfileImageSourceResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProfileImageSource'] = ResolversParentTypes['ProfileImageSource']> = {
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  src?: Resolver<ResolversTypes['URI'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfileImageVersionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProfileImageVersions'] = ResolversParentTypes['ProfileImageVersions']> = {
  alternatives?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['ProfileImageSource']>>>, ParentType, ContextType>;
  default?: Resolver<ResolversTypes['ProfileImageSource'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfileLinkSourceResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProfileLinkSource'] = ResolversParentTypes['ProfileLinkSource']> = {
  href?: Resolver<ResolversTypes['URI'], ParentType, ContextType>;
  label?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfileMentionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProfileMention'] = ResolversParentTypes['ProfileMention']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  post?: Resolver<Types.Maybe<ResolversTypes['Post']>, ParentType, ContextType>;
  postID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  profile?: Resolver<Types.Maybe<ResolversTypes['Profile']>, ParentType, ContextType>;
  profileID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfileMentionConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProfileMentionConnection'] = ResolversParentTypes['ProfileMentionConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['ProfileMentionEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfileMentionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProfileMentionEdge'] = ResolversParentTypes['ProfileMentionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['ProfileMention']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  appIntegrationIndex?: Resolver<Types.Maybe<ResolversTypes['AppIntegrationConnection']>, ParentType, ContextType, Partial<Types.QueryAppIntegrationIndexArgs>>;
  appReleaseIndex?: Resolver<Types.Maybe<ResolversTypes['AppReleaseConnection']>, ParentType, ContextType, Partial<Types.QueryAppReleaseIndexArgs>>;
  commentIndex?: Resolver<Types.Maybe<ResolversTypes['CommentConnection']>, ParentType, ContextType, Partial<Types.QueryCommentIndexArgs>>;
  commentReplyIndex?: Resolver<Types.Maybe<ResolversTypes['CommentReplyConnection']>, ParentType, ContextType, Partial<Types.QueryCommentReplyIndexArgs>>;
  followIndex?: Resolver<Types.Maybe<ResolversTypes['FollowConnection']>, ParentType, ContextType, Partial<Types.QueryFollowIndexArgs>>;
  interestsIndex?: Resolver<Types.Maybe<ResolversTypes['InterestsConnection']>, ParentType, ContextType, Partial<Types.QueryInterestsIndexArgs>>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.QueryNodeArgs, 'id'>>;
  postIndex?: Resolver<Types.Maybe<ResolversTypes['PostConnection']>, ParentType, ContextType, Partial<Types.QueryPostIndexArgs>>;
  postQuoteIndex?: Resolver<Types.Maybe<ResolversTypes['PostQuoteConnection']>, ParentType, ContextType, Partial<Types.QueryPostQuoteIndexArgs>>;
  profileIndex?: Resolver<Types.Maybe<ResolversTypes['ProfileConnection']>, ParentType, ContextType, Partial<Types.QueryProfileIndexArgs>>;
  profileMentionIndex?: Resolver<Types.Maybe<ResolversTypes['ProfileMentionConnection']>, ParentType, ContextType, Partial<Types.QueryProfileMentionIndexArgs>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
};

export interface UriScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['URI'], any> {
  name: 'URI';
}

export type UpdateAppIntegrationPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAppIntegrationPayload'] = ResolversParentTypes['UpdateAppIntegrationPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AppIntegration'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateAppIntegrationPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateAppReleasePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAppReleasePayload'] = ResolversParentTypes['UpdateAppReleasePayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AppRelease'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateAppReleasePayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateCommentPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateCommentPayload'] = ResolversParentTypes['UpdateCommentPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Comment'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateCommentPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateCommentReplyPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateCommentReplyPayload'] = ResolversParentTypes['UpdateCommentReplyPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['CommentReply'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateCommentReplyPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateFollowPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateFollowPayload'] = ResolversParentTypes['UpdateFollowPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Follow'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateFollowPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateInterestsPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateInterestsPayload'] = ResolversParentTypes['UpdateInterestsPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Interests'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateInterestsPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdatePostPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdatePostPayload'] = ResolversParentTypes['UpdatePostPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdatePostPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdatePostQuotePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdatePostQuotePayload'] = ResolversParentTypes['UpdatePostQuotePayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['PostQuote'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdatePostQuotePayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateProfileMentionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateProfileMentionPayload'] = ResolversParentTypes['UpdateProfileMentionPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['ProfileMention'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateProfileMentionPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateProfilePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateProfilePayload'] = ResolversParentTypes['UpdateProfilePayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Profile'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateProfilePayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AppIntegration?: AppIntegrationResolvers<ContextType>;
  AppIntegrationConnection?: AppIntegrationConnectionResolvers<ContextType>;
  AppIntegrationEdge?: AppIntegrationEdgeResolvers<ContextType>;
  AppRelease?: AppReleaseResolvers<ContextType>;
  AppReleaseConnection?: AppReleaseConnectionResolvers<ContextType>;
  AppReleaseEdge?: AppReleaseEdgeResolvers<ContextType>;
  CeramicAccount?: CeramicAccountResolvers<ContextType>;
  CeramicCommitID?: GraphQLScalarType;
  CeramicStreamID?: GraphQLScalarType;
  Comment?: CommentResolvers<ContextType>;
  CommentConnection?: CommentConnectionResolvers<ContextType>;
  CommentEdge?: CommentEdgeResolvers<ContextType>;
  CommentProviderValue?: CommentProviderValueResolvers<ContextType>;
  CommentReply?: CommentReplyResolvers<ContextType>;
  CommentReplyConnection?: CommentReplyConnectionResolvers<ContextType>;
  CommentReplyEdge?: CommentReplyEdgeResolvers<ContextType>;
  CreateAppIntegrationPayload?: CreateAppIntegrationPayloadResolvers<ContextType>;
  CreateAppReleasePayload?: CreateAppReleasePayloadResolvers<ContextType>;
  CreateCommentPayload?: CreateCommentPayloadResolvers<ContextType>;
  CreateCommentReplyPayload?: CreateCommentReplyPayloadResolvers<ContextType>;
  CreateFollowPayload?: CreateFollowPayloadResolvers<ContextType>;
  CreateInterestsPayload?: CreateInterestsPayloadResolvers<ContextType>;
  CreatePostPayload?: CreatePostPayloadResolvers<ContextType>;
  CreatePostQuotePayload?: CreatePostQuotePayloadResolvers<ContextType>;
  CreateProfileMentionPayload?: CreateProfileMentionPayloadResolvers<ContextType>;
  CreateProfilePayload?: CreateProfilePayloadResolvers<ContextType>;
  DID?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  Follow?: FollowResolvers<ContextType>;
  FollowConnection?: FollowConnectionResolvers<ContextType>;
  FollowEdge?: FollowEdgeResolvers<ContextType>;
  InterPlanetaryCID?: GraphQLScalarType;
  Interests?: InterestsResolvers<ContextType>;
  InterestsConnection?: InterestsConnectionResolvers<ContextType>;
  InterestsEdge?: InterestsEdgeResolvers<ContextType>;
  InterestsLabeled?: InterestsLabeledResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostConnection?: PostConnectionResolvers<ContextType>;
  PostEdge?: PostEdgeResolvers<ContextType>;
  PostProviderValue?: PostProviderValueResolvers<ContextType>;
  PostQuote?: PostQuoteResolvers<ContextType>;
  PostQuoteConnection?: PostQuoteConnectionResolvers<ContextType>;
  PostQuoteEdge?: PostQuoteEdgeResolvers<ContextType>;
  Profile?: ProfileResolvers<ContextType>;
  ProfileConnection?: ProfileConnectionResolvers<ContextType>;
  ProfileEdge?: ProfileEdgeResolvers<ContextType>;
  ProfileImageSource?: ProfileImageSourceResolvers<ContextType>;
  ProfileImageVersions?: ProfileImageVersionsResolvers<ContextType>;
  ProfileLinkSource?: ProfileLinkSourceResolvers<ContextType>;
  ProfileMention?: ProfileMentionResolvers<ContextType>;
  ProfileMentionConnection?: ProfileMentionConnectionResolvers<ContextType>;
  ProfileMentionEdge?: ProfileMentionEdgeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  URI?: GraphQLScalarType;
  UpdateAppIntegrationPayload?: UpdateAppIntegrationPayloadResolvers<ContextType>;
  UpdateAppReleasePayload?: UpdateAppReleasePayloadResolvers<ContextType>;
  UpdateCommentPayload?: UpdateCommentPayloadResolvers<ContextType>;
  UpdateCommentReplyPayload?: UpdateCommentReplyPayloadResolvers<ContextType>;
  UpdateFollowPayload?: UpdateFollowPayloadResolvers<ContextType>;
  UpdateInterestsPayload?: UpdateInterestsPayloadResolvers<ContextType>;
  UpdatePostPayload?: UpdatePostPayloadResolvers<ContextType>;
  UpdatePostQuotePayload?: UpdatePostQuotePayloadResolvers<ContextType>;
  UpdateProfileMentionPayload?: UpdateProfileMentionPayloadResolvers<ContextType>;
  UpdateProfilePayload?: UpdateProfilePayloadResolvers<ContextType>;
};

