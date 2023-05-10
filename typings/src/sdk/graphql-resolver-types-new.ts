import type * as Types from './graphql-types-new';

import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
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
  AkashaApp: ResolverTypeWrapper<Types.AkashaApp>;
  String: ResolverTypeWrapper<Types.Scalars['String']>;
  ID: ResolverTypeWrapper<Types.Scalars['ID']>;
  Int: ResolverTypeWrapper<Types.Scalars['Int']>;
  AkashaAppApplicationType: Types.AkashaAppApplicationType;
  AkashaAppConnection: ResolverTypeWrapper<Types.AkashaAppConnection>;
  AkashaAppEdge: ResolverTypeWrapper<Types.AkashaAppEdge>;
  AkashaAppInput: Types.AkashaAppInput;
  AppRelease: ResolverTypeWrapper<Types.AppRelease>;
  AppReleaseConnection: ResolverTypeWrapper<Types.AppReleaseConnection>;
  AppReleaseEdge: ResolverTypeWrapper<Types.AppReleaseEdge>;
  AppReleaseInput: Types.AppReleaseInput;
  Beam: ResolverTypeWrapper<Types.Beam>;
  Boolean: ResolverTypeWrapper<Types.Scalars['Boolean']>;
  BeamConnection: ResolverTypeWrapper<Types.BeamConnection>;
  BeamEdge: ResolverTypeWrapper<Types.BeamEdge>;
  BeamInput: Types.BeamInput;
  BeamProviderValue: ResolverTypeWrapper<Types.BeamProviderValue>;
  BeamProviderValueInput: Types.BeamProviderValueInput;
  CeramicAccount: ResolverTypeWrapper<Types.CeramicAccount>;
  CeramicCommitID: ResolverTypeWrapper<Types.Scalars['CeramicCommitID']>;
  CeramicStreamID: ResolverTypeWrapper<Types.Scalars['CeramicStreamID']>;
  CreateAkashaAppInput: Types.CreateAkashaAppInput;
  CreateAkashaAppPayload: ResolverTypeWrapper<Types.CreateAkashaAppPayload>;
  CreateAppReleaseInput: Types.CreateAppReleaseInput;
  CreateAppReleasePayload: ResolverTypeWrapper<Types.CreateAppReleasePayload>;
  CreateBeamInput: Types.CreateBeamInput;
  CreateBeamPayload: ResolverTypeWrapper<Types.CreateBeamPayload>;
  CreateFollowInput: Types.CreateFollowInput;
  CreateFollowPayload: ResolverTypeWrapper<Types.CreateFollowPayload>;
  CreateInterestsInput: Types.CreateInterestsInput;
  CreateInterestsPayload: ResolverTypeWrapper<Types.CreateInterestsPayload>;
  CreateProfileInput: Types.CreateProfileInput;
  CreateProfileMentionInput: Types.CreateProfileMentionInput;
  CreateProfileMentionPayload: ResolverTypeWrapper<Types.CreateProfileMentionPayload>;
  CreateProfilePayload: ResolverTypeWrapper<Types.CreateProfilePayload>;
  CreateRebeamInput: Types.CreateRebeamInput;
  CreateRebeamPayload: ResolverTypeWrapper<Types.CreateRebeamPayload>;
  CreateReflectInput: Types.CreateReflectInput;
  CreateReflectPayload: ResolverTypeWrapper<Types.CreateReflectPayload>;
  CreateReflectionInput: Types.CreateReflectionInput;
  CreateReflectionPayload: ResolverTypeWrapper<Types.CreateReflectionPayload>;
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
  Node: ResolversTypes['AkashaApp'] | ResolversTypes['AppRelease'] | ResolversTypes['Beam'] | ResolversTypes['CeramicAccount'] | ResolversTypes['Follow'] | ResolversTypes['Interests'] | ResolversTypes['Profile'] | ResolversTypes['ProfileMention'] | ResolversTypes['Rebeam'] | ResolversTypes['Reflect'] | ResolversTypes['Reflection'];
  PageInfo: ResolverTypeWrapper<Types.PageInfo>;
  PartialAkashaAppInput: Types.PartialAkashaAppInput;
  PartialAppReleaseInput: Types.PartialAppReleaseInput;
  PartialBeamInput: Types.PartialBeamInput;
  PartialFollowInput: Types.PartialFollowInput;
  PartialInterestsInput: Types.PartialInterestsInput;
  PartialProfileInput: Types.PartialProfileInput;
  PartialProfileMentionInput: Types.PartialProfileMentionInput;
  PartialRebeamInput: Types.PartialRebeamInput;
  PartialReflectInput: Types.PartialReflectInput;
  PartialReflectionInput: Types.PartialReflectionInput;
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
  Rebeam: ResolverTypeWrapper<Types.Rebeam>;
  RebeamConnection: ResolverTypeWrapper<Types.RebeamConnection>;
  RebeamEdge: ResolverTypeWrapper<Types.RebeamEdge>;
  RebeamInput: Types.RebeamInput;
  Reflect: ResolverTypeWrapper<Types.Reflect>;
  ReflectConnection: ResolverTypeWrapper<Types.ReflectConnection>;
  ReflectEdge: ResolverTypeWrapper<Types.ReflectEdge>;
  ReflectInput: Types.ReflectInput;
  ReflectProviderValue: ResolverTypeWrapper<Types.ReflectProviderValue>;
  ReflectProviderValueInput: Types.ReflectProviderValueInput;
  Reflection: ResolverTypeWrapper<Types.Reflection>;
  ReflectionConnection: ResolverTypeWrapper<Types.ReflectionConnection>;
  ReflectionEdge: ResolverTypeWrapper<Types.ReflectionEdge>;
  ReflectionInput: Types.ReflectionInput;
  URI: ResolverTypeWrapper<Types.Scalars['URI']>;
  UpdateAkashaAppInput: Types.UpdateAkashaAppInput;
  UpdateAkashaAppPayload: ResolverTypeWrapper<Types.UpdateAkashaAppPayload>;
  UpdateAppReleaseInput: Types.UpdateAppReleaseInput;
  UpdateAppReleasePayload: ResolverTypeWrapper<Types.UpdateAppReleasePayload>;
  UpdateBeamInput: Types.UpdateBeamInput;
  UpdateBeamPayload: ResolverTypeWrapper<Types.UpdateBeamPayload>;
  UpdateFollowInput: Types.UpdateFollowInput;
  UpdateFollowPayload: ResolverTypeWrapper<Types.UpdateFollowPayload>;
  UpdateInterestsInput: Types.UpdateInterestsInput;
  UpdateInterestsPayload: ResolverTypeWrapper<Types.UpdateInterestsPayload>;
  UpdateOptionsInput: Types.UpdateOptionsInput;
  UpdateProfileInput: Types.UpdateProfileInput;
  UpdateProfileMentionInput: Types.UpdateProfileMentionInput;
  UpdateProfileMentionPayload: ResolverTypeWrapper<Types.UpdateProfileMentionPayload>;
  UpdateProfilePayload: ResolverTypeWrapper<Types.UpdateProfilePayload>;
  UpdateRebeamInput: Types.UpdateRebeamInput;
  UpdateRebeamPayload: ResolverTypeWrapper<Types.UpdateRebeamPayload>;
  UpdateReflectInput: Types.UpdateReflectInput;
  UpdateReflectPayload: ResolverTypeWrapper<Types.UpdateReflectPayload>;
  UpdateReflectionInput: Types.UpdateReflectionInput;
  UpdateReflectionPayload: ResolverTypeWrapper<Types.UpdateReflectionPayload>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AkashaApp: Types.AkashaApp;
  String: Types.Scalars['String'];
  ID: Types.Scalars['ID'];
  Int: Types.Scalars['Int'];
  AkashaAppConnection: Types.AkashaAppConnection;
  AkashaAppEdge: Types.AkashaAppEdge;
  AkashaAppInput: Types.AkashaAppInput;
  AppRelease: Types.AppRelease;
  AppReleaseConnection: Types.AppReleaseConnection;
  AppReleaseEdge: Types.AppReleaseEdge;
  AppReleaseInput: Types.AppReleaseInput;
  Beam: Types.Beam;
  Boolean: Types.Scalars['Boolean'];
  BeamConnection: Types.BeamConnection;
  BeamEdge: Types.BeamEdge;
  BeamInput: Types.BeamInput;
  BeamProviderValue: Types.BeamProviderValue;
  BeamProviderValueInput: Types.BeamProviderValueInput;
  CeramicAccount: Types.CeramicAccount;
  CeramicCommitID: Types.Scalars['CeramicCommitID'];
  CeramicStreamID: Types.Scalars['CeramicStreamID'];
  CreateAkashaAppInput: Types.CreateAkashaAppInput;
  CreateAkashaAppPayload: Types.CreateAkashaAppPayload;
  CreateAppReleaseInput: Types.CreateAppReleaseInput;
  CreateAppReleasePayload: Types.CreateAppReleasePayload;
  CreateBeamInput: Types.CreateBeamInput;
  CreateBeamPayload: Types.CreateBeamPayload;
  CreateFollowInput: Types.CreateFollowInput;
  CreateFollowPayload: Types.CreateFollowPayload;
  CreateInterestsInput: Types.CreateInterestsInput;
  CreateInterestsPayload: Types.CreateInterestsPayload;
  CreateProfileInput: Types.CreateProfileInput;
  CreateProfileMentionInput: Types.CreateProfileMentionInput;
  CreateProfileMentionPayload: Types.CreateProfileMentionPayload;
  CreateProfilePayload: Types.CreateProfilePayload;
  CreateRebeamInput: Types.CreateRebeamInput;
  CreateRebeamPayload: Types.CreateRebeamPayload;
  CreateReflectInput: Types.CreateReflectInput;
  CreateReflectPayload: Types.CreateReflectPayload;
  CreateReflectionInput: Types.CreateReflectionInput;
  CreateReflectionPayload: Types.CreateReflectionPayload;
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
  Node: ResolversParentTypes['AkashaApp'] | ResolversParentTypes['AppRelease'] | ResolversParentTypes['Beam'] | ResolversParentTypes['CeramicAccount'] | ResolversParentTypes['Follow'] | ResolversParentTypes['Interests'] | ResolversParentTypes['Profile'] | ResolversParentTypes['ProfileMention'] | ResolversParentTypes['Rebeam'] | ResolversParentTypes['Reflect'] | ResolversParentTypes['Reflection'];
  PageInfo: Types.PageInfo;
  PartialAkashaAppInput: Types.PartialAkashaAppInput;
  PartialAppReleaseInput: Types.PartialAppReleaseInput;
  PartialBeamInput: Types.PartialBeamInput;
  PartialFollowInput: Types.PartialFollowInput;
  PartialInterestsInput: Types.PartialInterestsInput;
  PartialProfileInput: Types.PartialProfileInput;
  PartialProfileMentionInput: Types.PartialProfileMentionInput;
  PartialRebeamInput: Types.PartialRebeamInput;
  PartialReflectInput: Types.PartialReflectInput;
  PartialReflectionInput: Types.PartialReflectionInput;
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
  Rebeam: Types.Rebeam;
  RebeamConnection: Types.RebeamConnection;
  RebeamEdge: Types.RebeamEdge;
  RebeamInput: Types.RebeamInput;
  Reflect: Types.Reflect;
  ReflectConnection: Types.ReflectConnection;
  ReflectEdge: Types.ReflectEdge;
  ReflectInput: Types.ReflectInput;
  ReflectProviderValue: Types.ReflectProviderValue;
  ReflectProviderValueInput: Types.ReflectProviderValueInput;
  Reflection: Types.Reflection;
  ReflectionConnection: Types.ReflectionConnection;
  ReflectionEdge: Types.ReflectionEdge;
  ReflectionInput: Types.ReflectionInput;
  URI: Types.Scalars['URI'];
  UpdateAkashaAppInput: Types.UpdateAkashaAppInput;
  UpdateAkashaAppPayload: Types.UpdateAkashaAppPayload;
  UpdateAppReleaseInput: Types.UpdateAppReleaseInput;
  UpdateAppReleasePayload: Types.UpdateAppReleasePayload;
  UpdateBeamInput: Types.UpdateBeamInput;
  UpdateBeamPayload: Types.UpdateBeamPayload;
  UpdateFollowInput: Types.UpdateFollowInput;
  UpdateFollowPayload: Types.UpdateFollowPayload;
  UpdateInterestsInput: Types.UpdateInterestsInput;
  UpdateInterestsPayload: Types.UpdateInterestsPayload;
  UpdateOptionsInput: Types.UpdateOptionsInput;
  UpdateProfileInput: Types.UpdateProfileInput;
  UpdateProfileMentionInput: Types.UpdateProfileMentionInput;
  UpdateProfileMentionPayload: Types.UpdateProfileMentionPayload;
  UpdateProfilePayload: Types.UpdateProfilePayload;
  UpdateRebeamInput: Types.UpdateRebeamInput;
  UpdateRebeamPayload: Types.UpdateRebeamPayload;
  UpdateReflectInput: Types.UpdateReflectInput;
  UpdateReflectPayload: Types.UpdateReflectPayload;
  UpdateReflectionInput: Types.UpdateReflectionInput;
  UpdateReflectionPayload: Types.UpdateReflectionPayload;
};

export type AkashaAppResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaApp'] = ResolversParentTypes['AkashaApp']> = {
  applicationType?: Resolver<Types.Maybe<ResolversTypes['AkashaAppApplicationType']>, ParentType, ContextType>;
  author?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  contributors?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['CeramicAccount']>>>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  keywords?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  licence?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  releases?: Resolver<ResolversTypes['AppReleaseConnection'], ParentType, ContextType, Partial<Types.AkashaAppReleasesArgs>>;
  releasessCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.AkashaAppReleasessCountArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaAppConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaAppConnection'] = ResolversParentTypes['AkashaAppConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaAppEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaAppEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaAppEdge'] = ResolversParentTypes['AkashaAppEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaApp']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppReleaseResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppRelease'] = ResolversParentTypes['AppRelease']> = {
  application?: Resolver<Types.Maybe<ResolversTypes['AkashaApp']>, ParentType, ContextType>;
  applicationID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
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

export type BeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['Beam'] = ResolversParentTypes['Beam']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  content?: Resolver<Array<ResolversTypes['BeamProviderValue']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  mentions?: Resolver<ResolversTypes['ProfileMentionConnection'], ParentType, ContextType, Partial<Types.BeamMentionsArgs>>;
  rebeams?: Resolver<ResolversTypes['RebeamConnection'], ParentType, ContextType, Partial<Types.BeamRebeamsArgs>>;
  rebeamsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.BeamRebeamsCountArgs>>;
  reflections?: Resolver<ResolversTypes['ReflectConnection'], ParentType, ContextType, Partial<Types.BeamReflectionsArgs>>;
  reflectionsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.BeamReflectionsCountArgs>>;
  tags?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  version?: Resolver<ResolversTypes['CeramicCommitID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BeamConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['BeamConnection'] = ResolversParentTypes['BeamConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['BeamEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BeamEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['BeamEdge'] = ResolversParentTypes['BeamEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Beam']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BeamProviderValueResolvers<ContextType = any, ParentType extends ResolversParentTypes['BeamProviderValue'] = ResolversParentTypes['BeamProviderValue']> = {
  property?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  provider?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CeramicAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['CeramicAccount'] = ResolversParentTypes['CeramicAccount']> = {
  akashaAppList?: Resolver<Types.Maybe<ResolversTypes['AkashaAppConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaAppListArgs>>;
  appReleaseList?: Resolver<Types.Maybe<ResolversTypes['AppReleaseConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAppReleaseListArgs>>;
  beamList?: Resolver<Types.Maybe<ResolversTypes['BeamConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountBeamListArgs>>;
  followList?: Resolver<Types.Maybe<ResolversTypes['FollowConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountFollowListArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  interests?: Resolver<Types.Maybe<ResolversTypes['Interests']>, ParentType, ContextType>;
  isViewer?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  profile?: Resolver<Types.Maybe<ResolversTypes['Profile']>, ParentType, ContextType>;
  profileMentionList?: Resolver<Types.Maybe<ResolversTypes['ProfileMentionConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountProfileMentionListArgs>>;
  rebeamList?: Resolver<Types.Maybe<ResolversTypes['RebeamConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountRebeamListArgs>>;
  reflectList?: Resolver<Types.Maybe<ResolversTypes['ReflectConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountReflectListArgs>>;
  reflectionList?: Resolver<Types.Maybe<ResolversTypes['ReflectionConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountReflectionListArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface CeramicCommitIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['CeramicCommitID'], any> {
  name: 'CeramicCommitID';
}

export interface CeramicStreamIdScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['CeramicStreamID'], any> {
  name: 'CeramicStreamID';
}

export type CreateAkashaAppPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAkashaAppPayload'] = ResolversParentTypes['CreateAkashaAppPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaApp'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateAkashaAppPayloadNodeArgs, 'id'>>;
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

export type CreateBeamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateBeamPayload'] = ResolversParentTypes['CreateBeamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Beam'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateBeamPayloadNodeArgs, 'id'>>;
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

export type CreateRebeamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateRebeamPayload'] = ResolversParentTypes['CreateRebeamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Rebeam'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateRebeamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateReflectPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateReflectPayload'] = ResolversParentTypes['CreateReflectPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Reflect'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateReflectPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateReflectionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateReflectionPayload'] = ResolversParentTypes['CreateReflectionPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Reflection'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateReflectionPayloadNodeArgs, 'id'>>;
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
  createAkashaApp?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaAppPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaAppArgs, 'input'>>;
  createAppRelease?: Resolver<Types.Maybe<ResolversTypes['CreateAppReleasePayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAppReleaseArgs, 'input'>>;
  createBeam?: Resolver<Types.Maybe<ResolversTypes['CreateBeamPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateBeamArgs, 'input'>>;
  createFollow?: Resolver<Types.Maybe<ResolversTypes['CreateFollowPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateFollowArgs, 'input'>>;
  createInterests?: Resolver<Types.Maybe<ResolversTypes['CreateInterestsPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateInterestsArgs, 'input'>>;
  createProfile?: Resolver<Types.Maybe<ResolversTypes['CreateProfilePayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateProfileArgs, 'input'>>;
  createProfileMention?: Resolver<Types.Maybe<ResolversTypes['CreateProfileMentionPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateProfileMentionArgs, 'input'>>;
  createRebeam?: Resolver<Types.Maybe<ResolversTypes['CreateRebeamPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateRebeamArgs, 'input'>>;
  createReflect?: Resolver<Types.Maybe<ResolversTypes['CreateReflectPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateReflectArgs, 'input'>>;
  createReflection?: Resolver<Types.Maybe<ResolversTypes['CreateReflectionPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateReflectionArgs, 'input'>>;
  updateAkashaApp?: Resolver<Types.Maybe<ResolversTypes['UpdateAkashaAppPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateAkashaAppArgs, 'input'>>;
  updateAppRelease?: Resolver<Types.Maybe<ResolversTypes['UpdateAppReleasePayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateAppReleaseArgs, 'input'>>;
  updateBeam?: Resolver<Types.Maybe<ResolversTypes['UpdateBeamPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateBeamArgs, 'input'>>;
  updateFollow?: Resolver<Types.Maybe<ResolversTypes['UpdateFollowPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateFollowArgs, 'input'>>;
  updateInterests?: Resolver<Types.Maybe<ResolversTypes['UpdateInterestsPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateInterestsArgs, 'input'>>;
  updateProfile?: Resolver<Types.Maybe<ResolversTypes['UpdateProfilePayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateProfileArgs, 'input'>>;
  updateProfileMention?: Resolver<Types.Maybe<ResolversTypes['UpdateProfileMentionPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateProfileMentionArgs, 'input'>>;
  updateRebeam?: Resolver<Types.Maybe<ResolversTypes['UpdateRebeamPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateRebeamArgs, 'input'>>;
  updateReflect?: Resolver<Types.Maybe<ResolversTypes['UpdateReflectPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateReflectArgs, 'input'>>;
  updateReflection?: Resolver<Types.Maybe<ResolversTypes['UpdateReflectionPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateReflectionArgs, 'input'>>;
};

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'AkashaApp' | 'AppRelease' | 'Beam' | 'CeramicAccount' | 'Follow' | 'Interests' | 'Profile' | 'ProfileMention' | 'Rebeam' | 'Reflect' | 'Reflection', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']> = {
  avatar?: Resolver<Types.Maybe<ResolversTypes['ProfileImageVersions']>, ParentType, ContextType>;
  background?: Resolver<Types.Maybe<ResolversTypes['ProfileImageVersions']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  did?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  followers?: Resolver<ResolversTypes['FollowConnection'], ParentType, ContextType, Partial<Types.ProfileFollowersArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  links?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['ProfileLinkSource']>>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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
  beam?: Resolver<Types.Maybe<ResolversTypes['Beam']>, ParentType, ContextType>;
  beamID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
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
  akashaAppIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaAppConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaAppIndexArgs>>;
  appReleaseIndex?: Resolver<Types.Maybe<ResolversTypes['AppReleaseConnection']>, ParentType, ContextType, Partial<Types.QueryAppReleaseIndexArgs>>;
  beamIndex?: Resolver<Types.Maybe<ResolversTypes['BeamConnection']>, ParentType, ContextType, Partial<Types.QueryBeamIndexArgs>>;
  followIndex?: Resolver<Types.Maybe<ResolversTypes['FollowConnection']>, ParentType, ContextType, Partial<Types.QueryFollowIndexArgs>>;
  interestsIndex?: Resolver<Types.Maybe<ResolversTypes['InterestsConnection']>, ParentType, ContextType, Partial<Types.QueryInterestsIndexArgs>>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.QueryNodeArgs, 'id'>>;
  profileIndex?: Resolver<Types.Maybe<ResolversTypes['ProfileConnection']>, ParentType, ContextType, Partial<Types.QueryProfileIndexArgs>>;
  profileMentionIndex?: Resolver<Types.Maybe<ResolversTypes['ProfileMentionConnection']>, ParentType, ContextType, Partial<Types.QueryProfileMentionIndexArgs>>;
  rebeamIndex?: Resolver<Types.Maybe<ResolversTypes['RebeamConnection']>, ParentType, ContextType, Partial<Types.QueryRebeamIndexArgs>>;
  reflectIndex?: Resolver<Types.Maybe<ResolversTypes['ReflectConnection']>, ParentType, ContextType, Partial<Types.QueryReflectIndexArgs>>;
  reflectionIndex?: Resolver<Types.Maybe<ResolversTypes['ReflectionConnection']>, ParentType, ContextType, Partial<Types.QueryReflectionIndexArgs>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
};

export type RebeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['Rebeam'] = ResolversParentTypes['Rebeam']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  beam?: Resolver<Types.Maybe<ResolversTypes['Beam']>, ParentType, ContextType>;
  beamID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  quotedBeam?: Resolver<Types.Maybe<ResolversTypes['Beam']>, ParentType, ContextType>;
  quotedBeamID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RebeamConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['RebeamConnection'] = ResolversParentTypes['RebeamConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['RebeamEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RebeamEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['RebeamEdge'] = ResolversParentTypes['RebeamEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Rebeam']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReflectResolvers<ContextType = any, ParentType extends ResolversParentTypes['Reflect'] = ResolversParentTypes['Reflect']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  beam?: Resolver<Types.Maybe<ResolversTypes['Beam']>, ParentType, ContextType>;
  beamID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  content?: Resolver<Array<ResolversTypes['ReflectProviderValue']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isReply?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  reflections?: Resolver<ResolversTypes['ReflectionConnection'], ParentType, ContextType, Partial<Types.ReflectReflectionsArgs>>;
  reflectionsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.ReflectReflectionsCountArgs>>;
  version?: Resolver<ResolversTypes['CeramicCommitID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReflectConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReflectConnection'] = ResolversParentTypes['ReflectConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['ReflectEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReflectEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReflectEdge'] = ResolversParentTypes['ReflectEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Reflect']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReflectProviderValueResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReflectProviderValue'] = ResolversParentTypes['ReflectProviderValue']> = {
  property?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  provider?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReflectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Reflection'] = ResolversParentTypes['Reflection']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  reflect?: Resolver<Types.Maybe<ResolversTypes['Reflect']>, ParentType, ContextType>;
  reflectID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  reflection?: Resolver<Types.Maybe<ResolversTypes['Reflect']>, ParentType, ContextType>;
  reflectionID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReflectionConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReflectionConnection'] = ResolversParentTypes['ReflectionConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['ReflectionEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReflectionEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReflectionEdge'] = ResolversParentTypes['ReflectionEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Reflection']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UriScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['URI'], any> {
  name: 'URI';
}

export type UpdateAkashaAppPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAkashaAppPayload'] = ResolversParentTypes['UpdateAkashaAppPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaApp'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateAkashaAppPayloadNodeArgs, 'id'>>;
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

export type UpdateBeamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateBeamPayload'] = ResolversParentTypes['UpdateBeamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Beam'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateBeamPayloadNodeArgs, 'id'>>;
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

export type UpdateRebeamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateRebeamPayload'] = ResolversParentTypes['UpdateRebeamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Rebeam'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateRebeamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateReflectPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateReflectPayload'] = ResolversParentTypes['UpdateReflectPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Reflect'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateReflectPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateReflectionPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateReflectionPayload'] = ResolversParentTypes['UpdateReflectionPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['Reflection'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateReflectionPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AkashaApp?: AkashaAppResolvers<ContextType>;
  AkashaAppConnection?: AkashaAppConnectionResolvers<ContextType>;
  AkashaAppEdge?: AkashaAppEdgeResolvers<ContextType>;
  AppRelease?: AppReleaseResolvers<ContextType>;
  AppReleaseConnection?: AppReleaseConnectionResolvers<ContextType>;
  AppReleaseEdge?: AppReleaseEdgeResolvers<ContextType>;
  Beam?: BeamResolvers<ContextType>;
  BeamConnection?: BeamConnectionResolvers<ContextType>;
  BeamEdge?: BeamEdgeResolvers<ContextType>;
  BeamProviderValue?: BeamProviderValueResolvers<ContextType>;
  CeramicAccount?: CeramicAccountResolvers<ContextType>;
  CeramicCommitID?: GraphQLScalarType;
  CeramicStreamID?: GraphQLScalarType;
  CreateAkashaAppPayload?: CreateAkashaAppPayloadResolvers<ContextType>;
  CreateAppReleasePayload?: CreateAppReleasePayloadResolvers<ContextType>;
  CreateBeamPayload?: CreateBeamPayloadResolvers<ContextType>;
  CreateFollowPayload?: CreateFollowPayloadResolvers<ContextType>;
  CreateInterestsPayload?: CreateInterestsPayloadResolvers<ContextType>;
  CreateProfileMentionPayload?: CreateProfileMentionPayloadResolvers<ContextType>;
  CreateProfilePayload?: CreateProfilePayloadResolvers<ContextType>;
  CreateRebeamPayload?: CreateRebeamPayloadResolvers<ContextType>;
  CreateReflectPayload?: CreateReflectPayloadResolvers<ContextType>;
  CreateReflectionPayload?: CreateReflectionPayloadResolvers<ContextType>;
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
  Rebeam?: RebeamResolvers<ContextType>;
  RebeamConnection?: RebeamConnectionResolvers<ContextType>;
  RebeamEdge?: RebeamEdgeResolvers<ContextType>;
  Reflect?: ReflectResolvers<ContextType>;
  ReflectConnection?: ReflectConnectionResolvers<ContextType>;
  ReflectEdge?: ReflectEdgeResolvers<ContextType>;
  ReflectProviderValue?: ReflectProviderValueResolvers<ContextType>;
  Reflection?: ReflectionResolvers<ContextType>;
  ReflectionConnection?: ReflectionConnectionResolvers<ContextType>;
  ReflectionEdge?: ReflectionEdgeResolvers<ContextType>;
  URI?: GraphQLScalarType;
  UpdateAkashaAppPayload?: UpdateAkashaAppPayloadResolvers<ContextType>;
  UpdateAppReleasePayload?: UpdateAppReleasePayloadResolvers<ContextType>;
  UpdateBeamPayload?: UpdateBeamPayloadResolvers<ContextType>;
  UpdateFollowPayload?: UpdateFollowPayloadResolvers<ContextType>;
  UpdateInterestsPayload?: UpdateInterestsPayloadResolvers<ContextType>;
  UpdateProfileMentionPayload?: UpdateProfileMentionPayloadResolvers<ContextType>;
  UpdateProfilePayload?: UpdateProfilePayloadResolvers<ContextType>;
  UpdateRebeamPayload?: UpdateRebeamPayloadResolvers<ContextType>;
  UpdateReflectPayload?: UpdateReflectPayloadResolvers<ContextType>;
  UpdateReflectionPayload?: UpdateReflectionPayloadResolvers<ContextType>;
};

