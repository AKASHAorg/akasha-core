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


/** Mapping of interface types */
export type ResolversInterfaceTypes<RefType extends Record<string, unknown>> = {
  Node: ( Types.AkashaApp ) | ( Types.AkashaAppRelease ) | ( Types.AkashaAppsStream ) | ( Types.AkashaBeam ) | ( Types.AkashaBeamStream ) | ( Types.AkashaBlockStorage ) | ( Types.AkashaContentBlock ) | ( Types.AkashaContentBlockStream ) | ( Types.AkashaFollow ) | ( Types.AkashaIndexedStream ) | ( Types.AkashaInterestsStream ) | ( Types.AkashaProfile ) | ( Types.AkashaProfileInterests ) | ( Types.AkashaProfileStream ) | ( Types.AkashaReflect ) | ( Types.AkashaReflectStream ) | ( Types.CeramicAccount );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AkashaApp: ResolverTypeWrapper<Types.AkashaApp>;
  String: ResolverTypeWrapper<Types.Scalars['String']['output']>;
  ID: ResolverTypeWrapper<Types.Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Types.Scalars['Int']['output']>;
  AkashaAppApplicationType: Types.AkashaAppApplicationType;
  AkashaAppApplicationTypeValueFilterInput: Types.AkashaAppApplicationTypeValueFilterInput;
  Boolean: ResolverTypeWrapper<Types.Scalars['Boolean']['output']>;
  AkashaAppConnection: ResolverTypeWrapper<Types.AkashaAppConnection>;
  AkashaAppEdge: ResolverTypeWrapper<Types.AkashaAppEdge>;
  AkashaAppFiltersInput: Types.AkashaAppFiltersInput;
  AkashaAppInput: Types.AkashaAppInput;
  AkashaAppObjectFilterInput: Types.AkashaAppObjectFilterInput;
  AkashaAppRelease: ResolverTypeWrapper<Types.AkashaAppRelease>;
  AkashaAppReleaseConnection: ResolverTypeWrapper<Types.AkashaAppReleaseConnection>;
  AkashaAppReleaseEdge: ResolverTypeWrapper<Types.AkashaAppReleaseEdge>;
  AkashaAppReleaseFiltersInput: Types.AkashaAppReleaseFiltersInput;
  AkashaAppReleaseInput: Types.AkashaAppReleaseInput;
  AkashaAppReleaseObjectFilterInput: Types.AkashaAppReleaseObjectFilterInput;
  AkashaAppReleaseSortingInput: Types.AkashaAppReleaseSortingInput;
  AkashaAppSortingInput: Types.AkashaAppSortingInput;
  AkashaAppsStream: ResolverTypeWrapper<Types.AkashaAppsStream>;
  AkashaAppsStreamConnection: ResolverTypeWrapper<Types.AkashaAppsStreamConnection>;
  AkashaAppsStreamEdge: ResolverTypeWrapper<Types.AkashaAppsStreamEdge>;
  AkashaAppsStreamFiltersInput: Types.AkashaAppsStreamFiltersInput;
  AkashaAppsStreamInput: Types.AkashaAppsStreamInput;
  AkashaAppsStreamModerationStatus: Types.AkashaAppsStreamModerationStatus;
  AkashaAppsStreamModerationStatusValueFilterInput: Types.AkashaAppsStreamModerationStatusValueFilterInput;
  AkashaAppsStreamObjectFilterInput: Types.AkashaAppsStreamObjectFilterInput;
  AkashaAppsStreamSortingInput: Types.AkashaAppsStreamSortingInput;
  AkashaBeam: ResolverTypeWrapper<Types.AkashaBeam>;
  AkashaBeamBlockRecord: ResolverTypeWrapper<Types.AkashaBeamBlockRecord>;
  AkashaBeamBlockRecordInput: Types.AkashaBeamBlockRecordInput;
  AkashaBeamConnection: ResolverTypeWrapper<Types.AkashaBeamConnection>;
  AkashaBeamEdge: ResolverTypeWrapper<Types.AkashaBeamEdge>;
  AkashaBeamEmbeddedType: ResolverTypeWrapper<Types.AkashaBeamEmbeddedType>;
  AkashaBeamEmbeddedTypeInput: Types.AkashaBeamEmbeddedTypeInput;
  AkashaBeamFiltersInput: Types.AkashaBeamFiltersInput;
  AkashaBeamInput: Types.AkashaBeamInput;
  AkashaBeamLabeled: ResolverTypeWrapper<Types.AkashaBeamLabeled>;
  AkashaBeamLabeledInput: Types.AkashaBeamLabeledInput;
  AkashaBeamObjectFilterInput: Types.AkashaBeamObjectFilterInput;
  AkashaBeamSortingInput: Types.AkashaBeamSortingInput;
  AkashaBeamStream: ResolverTypeWrapper<Types.AkashaBeamStream>;
  AkashaBeamStreamConnection: ResolverTypeWrapper<Types.AkashaBeamStreamConnection>;
  AkashaBeamStreamEdge: ResolverTypeWrapper<Types.AkashaBeamStreamEdge>;
  AkashaBeamStreamFiltersInput: Types.AkashaBeamStreamFiltersInput;
  AkashaBeamStreamInput: Types.AkashaBeamStreamInput;
  AkashaBeamStreamModerationStatus: Types.AkashaBeamStreamModerationStatus;
  AkashaBeamStreamModerationStatusValueFilterInput: Types.AkashaBeamStreamModerationStatusValueFilterInput;
  AkashaBeamStreamObjectFilterInput: Types.AkashaBeamStreamObjectFilterInput;
  AkashaBeamStreamSortingInput: Types.AkashaBeamStreamSortingInput;
  AkashaBlockStorage: ResolverTypeWrapper<Types.AkashaBlockStorage>;
  AkashaBlockStorageBlockStorageDef: Types.AkashaBlockStorageBlockStorageDef;
  AkashaBlockStorageBlockStorageDefValueFilterInput: Types.AkashaBlockStorageBlockStorageDefValueFilterInput;
  AkashaBlockStorageConnection: ResolverTypeWrapper<Types.AkashaBlockStorageConnection>;
  AkashaBlockStorageEdge: ResolverTypeWrapper<Types.AkashaBlockStorageEdge>;
  AkashaBlockStorageFiltersInput: Types.AkashaBlockStorageFiltersInput;
  AkashaBlockStorageInput: Types.AkashaBlockStorageInput;
  AkashaBlockStorageLabeledValue: ResolverTypeWrapper<Types.AkashaBlockStorageLabeledValue>;
  AkashaBlockStorageLabeledValueInput: Types.AkashaBlockStorageLabeledValueInput;
  AkashaBlockStorageObjectFilterInput: Types.AkashaBlockStorageObjectFilterInput;
  AkashaBlockStorageSortingInput: Types.AkashaBlockStorageSortingInput;
  AkashaContentBlock: ResolverTypeWrapper<Types.AkashaContentBlock>;
  AkashaContentBlockBlockDef: Types.AkashaContentBlockBlockDef;
  AkashaContentBlockBlockDefValueFilterInput: Types.AkashaContentBlockBlockDefValueFilterInput;
  AkashaContentBlockConnection: ResolverTypeWrapper<Types.AkashaContentBlockConnection>;
  AkashaContentBlockEdge: ResolverTypeWrapper<Types.AkashaContentBlockEdge>;
  AkashaContentBlockFiltersInput: Types.AkashaContentBlockFiltersInput;
  AkashaContentBlockInput: Types.AkashaContentBlockInput;
  AkashaContentBlockLabeledValue: ResolverTypeWrapper<Types.AkashaContentBlockLabeledValue>;
  AkashaContentBlockLabeledValueInput: Types.AkashaContentBlockLabeledValueInput;
  AkashaContentBlockObjectFilterInput: Types.AkashaContentBlockObjectFilterInput;
  AkashaContentBlockSortingInput: Types.AkashaContentBlockSortingInput;
  AkashaContentBlockStream: ResolverTypeWrapper<Types.AkashaContentBlockStream>;
  AkashaContentBlockStreamConnection: ResolverTypeWrapper<Types.AkashaContentBlockStreamConnection>;
  AkashaContentBlockStreamEdge: ResolverTypeWrapper<Types.AkashaContentBlockStreamEdge>;
  AkashaContentBlockStreamFiltersInput: Types.AkashaContentBlockStreamFiltersInput;
  AkashaContentBlockStreamInput: Types.AkashaContentBlockStreamInput;
  AkashaContentBlockStreamModerationStatus: Types.AkashaContentBlockStreamModerationStatus;
  AkashaContentBlockStreamModerationStatusValueFilterInput: Types.AkashaContentBlockStreamModerationStatusValueFilterInput;
  AkashaContentBlockStreamObjectFilterInput: Types.AkashaContentBlockStreamObjectFilterInput;
  AkashaContentBlockStreamSortingInput: Types.AkashaContentBlockStreamSortingInput;
  AkashaFollow: ResolverTypeWrapper<Types.AkashaFollow>;
  AkashaFollowConnection: ResolverTypeWrapper<Types.AkashaFollowConnection>;
  AkashaFollowEdge: ResolverTypeWrapper<Types.AkashaFollowEdge>;
  AkashaFollowFiltersInput: Types.AkashaFollowFiltersInput;
  AkashaFollowInput: Types.AkashaFollowInput;
  AkashaFollowObjectFilterInput: Types.AkashaFollowObjectFilterInput;
  AkashaFollowSortingInput: Types.AkashaFollowSortingInput;
  AkashaIndexedStream: ResolverTypeWrapper<Types.AkashaIndexedStream>;
  AkashaIndexedStreamConnection: ResolverTypeWrapper<Types.AkashaIndexedStreamConnection>;
  AkashaIndexedStreamEdge: ResolverTypeWrapper<Types.AkashaIndexedStreamEdge>;
  AkashaIndexedStreamFiltersInput: Types.AkashaIndexedStreamFiltersInput;
  AkashaIndexedStreamInput: Types.AkashaIndexedStreamInput;
  AkashaIndexedStreamModerationStatus: Types.AkashaIndexedStreamModerationStatus;
  AkashaIndexedStreamModerationStatusValueFilterInput: Types.AkashaIndexedStreamModerationStatusValueFilterInput;
  AkashaIndexedStreamObjectFilterInput: Types.AkashaIndexedStreamObjectFilterInput;
  AkashaIndexedStreamSortingInput: Types.AkashaIndexedStreamSortingInput;
  AkashaIndexedStreamStreamType: Types.AkashaIndexedStreamStreamType;
  AkashaIndexedStreamStreamTypeValueFilterInput: Types.AkashaIndexedStreamStreamTypeValueFilterInput;
  AkashaInterestsStream: ResolverTypeWrapper<Types.AkashaInterestsStream>;
  AkashaInterestsStreamConnection: ResolverTypeWrapper<Types.AkashaInterestsStreamConnection>;
  AkashaInterestsStreamEdge: ResolverTypeWrapper<Types.AkashaInterestsStreamEdge>;
  AkashaInterestsStreamFiltersInput: Types.AkashaInterestsStreamFiltersInput;
  AkashaInterestsStreamInput: Types.AkashaInterestsStreamInput;
  AkashaInterestsStreamModerationStatus: Types.AkashaInterestsStreamModerationStatus;
  AkashaInterestsStreamModerationStatusValueFilterInput: Types.AkashaInterestsStreamModerationStatusValueFilterInput;
  AkashaInterestsStreamObjectFilterInput: Types.AkashaInterestsStreamObjectFilterInput;
  AkashaInterestsStreamSortingInput: Types.AkashaInterestsStreamSortingInput;
  AkashaProfile: ResolverTypeWrapper<Types.AkashaProfile>;
  AkashaProfileConnection: ResolverTypeWrapper<Types.AkashaProfileConnection>;
  AkashaProfileEdge: ResolverTypeWrapper<Types.AkashaProfileEdge>;
  AkashaProfileFiltersInput: Types.AkashaProfileFiltersInput;
  AkashaProfileImageSource: ResolverTypeWrapper<Types.AkashaProfileImageSource>;
  AkashaProfileImageSourceInput: Types.AkashaProfileImageSourceInput;
  AkashaProfileImageVersions: ResolverTypeWrapper<Types.AkashaProfileImageVersions>;
  AkashaProfileImageVersionsInput: Types.AkashaProfileImageVersionsInput;
  AkashaProfileInput: Types.AkashaProfileInput;
  AkashaProfileInterests: ResolverTypeWrapper<Types.AkashaProfileInterests>;
  AkashaProfileInterestsConnection: ResolverTypeWrapper<Types.AkashaProfileInterestsConnection>;
  AkashaProfileInterestsEdge: ResolverTypeWrapper<Types.AkashaProfileInterestsEdge>;
  AkashaProfileInterestsInput: Types.AkashaProfileInterestsInput;
  AkashaProfileInterestsLabeled: ResolverTypeWrapper<Types.AkashaProfileInterestsLabeled>;
  AkashaProfileInterestsLabeledInput: Types.AkashaProfileInterestsLabeledInput;
  AkashaProfileLinkSource: ResolverTypeWrapper<Types.AkashaProfileLinkSource>;
  AkashaProfileLinkSourceInput: Types.AkashaProfileLinkSourceInput;
  AkashaProfileObjectFilterInput: Types.AkashaProfileObjectFilterInput;
  AkashaProfileSortingInput: Types.AkashaProfileSortingInput;
  AkashaProfileStream: ResolverTypeWrapper<Types.AkashaProfileStream>;
  AkashaProfileStreamConnection: ResolverTypeWrapper<Types.AkashaProfileStreamConnection>;
  AkashaProfileStreamEdge: ResolverTypeWrapper<Types.AkashaProfileStreamEdge>;
  AkashaProfileStreamFiltersInput: Types.AkashaProfileStreamFiltersInput;
  AkashaProfileStreamInput: Types.AkashaProfileStreamInput;
  AkashaProfileStreamModerationStatus: Types.AkashaProfileStreamModerationStatus;
  AkashaProfileStreamModerationStatusValueFilterInput: Types.AkashaProfileStreamModerationStatusValueFilterInput;
  AkashaProfileStreamObjectFilterInput: Types.AkashaProfileStreamObjectFilterInput;
  AkashaProfileStreamSortingInput: Types.AkashaProfileStreamSortingInput;
  AkashaReflect: ResolverTypeWrapper<Types.AkashaReflect>;
  AkashaReflectConnection: ResolverTypeWrapper<Types.AkashaReflectConnection>;
  AkashaReflectEdge: ResolverTypeWrapper<Types.AkashaReflectEdge>;
  AkashaReflectFiltersInput: Types.AkashaReflectFiltersInput;
  AkashaReflectInput: Types.AkashaReflectInput;
  AkashaReflectObjectFilterInput: Types.AkashaReflectObjectFilterInput;
  AkashaReflectProviderValue: ResolverTypeWrapper<Types.AkashaReflectProviderValue>;
  AkashaReflectProviderValueInput: Types.AkashaReflectProviderValueInput;
  AkashaReflectSortingInput: Types.AkashaReflectSortingInput;
  AkashaReflectStream: ResolverTypeWrapper<Types.AkashaReflectStream>;
  AkashaReflectStreamConnection: ResolverTypeWrapper<Types.AkashaReflectStreamConnection>;
  AkashaReflectStreamEdge: ResolverTypeWrapper<Types.AkashaReflectStreamEdge>;
  AkashaReflectStreamFiltersInput: Types.AkashaReflectStreamFiltersInput;
  AkashaReflectStreamInput: Types.AkashaReflectStreamInput;
  AkashaReflectStreamModerationStatus: Types.AkashaReflectStreamModerationStatus;
  AkashaReflectStreamModerationStatusValueFilterInput: Types.AkashaReflectStreamModerationStatusValueFilterInput;
  AkashaReflectStreamObjectFilterInput: Types.AkashaReflectStreamObjectFilterInput;
  AkashaReflectStreamSortingInput: Types.AkashaReflectStreamSortingInput;
  BooleanValueFilterInput: Types.BooleanValueFilterInput;
  CACAO_CAPABILITY: Types.Cacao_Capability;
  CacaoHeader: Types.CacaoHeader;
  CacaoHeaderT: ResolverTypeWrapper<Types.Scalars['CacaoHeaderT']['output']>;
  CacaoPayload: Types.CacaoPayload;
  CacaoSignature: Types.CacaoSignature;
  CacaoSignatureT: ResolverTypeWrapper<Types.Scalars['CacaoSignatureT']['output']>;
  CeramicAccount: ResolverTypeWrapper<Types.CeramicAccount>;
  CeramicCommitID: ResolverTypeWrapper<Types.Scalars['CeramicCommitID']['output']>;
  CeramicStreamID: ResolverTypeWrapper<Types.Scalars['CeramicStreamID']['output']>;
  CreateAkashaAppInput: Types.CreateAkashaAppInput;
  CreateAkashaAppPayload: ResolverTypeWrapper<Types.CreateAkashaAppPayload>;
  CreateAkashaAppReleaseInput: Types.CreateAkashaAppReleaseInput;
  CreateAkashaAppReleasePayload: ResolverTypeWrapper<Types.CreateAkashaAppReleasePayload>;
  CreateAkashaAppsStreamInput: Types.CreateAkashaAppsStreamInput;
  CreateAkashaAppsStreamPayload: ResolverTypeWrapper<Types.CreateAkashaAppsStreamPayload>;
  CreateAkashaBeamInput: Types.CreateAkashaBeamInput;
  CreateAkashaBeamPayload: ResolverTypeWrapper<Types.CreateAkashaBeamPayload>;
  CreateAkashaBeamStreamInput: Types.CreateAkashaBeamStreamInput;
  CreateAkashaBeamStreamPayload: ResolverTypeWrapper<Types.CreateAkashaBeamStreamPayload>;
  CreateAkashaBlockStorageInput: Types.CreateAkashaBlockStorageInput;
  CreateAkashaBlockStoragePayload: ResolverTypeWrapper<Types.CreateAkashaBlockStoragePayload>;
  CreateAkashaContentBlockInput: Types.CreateAkashaContentBlockInput;
  CreateAkashaContentBlockPayload: ResolverTypeWrapper<Types.CreateAkashaContentBlockPayload>;
  CreateAkashaContentBlockStreamInput: Types.CreateAkashaContentBlockStreamInput;
  CreateAkashaContentBlockStreamPayload: ResolverTypeWrapper<Types.CreateAkashaContentBlockStreamPayload>;
  CreateAkashaFollowInput: Types.CreateAkashaFollowInput;
  CreateAkashaFollowPayload: ResolverTypeWrapper<Types.CreateAkashaFollowPayload>;
  CreateAkashaIndexedStreamInput: Types.CreateAkashaIndexedStreamInput;
  CreateAkashaIndexedStreamPayload: ResolverTypeWrapper<Types.CreateAkashaIndexedStreamPayload>;
  CreateAkashaInterestsStreamInput: Types.CreateAkashaInterestsStreamInput;
  CreateAkashaInterestsStreamPayload: ResolverTypeWrapper<Types.CreateAkashaInterestsStreamPayload>;
  CreateAkashaProfileInput: Types.CreateAkashaProfileInput;
  CreateAkashaProfileInterestsInput: Types.CreateAkashaProfileInterestsInput;
  CreateAkashaProfileInterestsPayload: ResolverTypeWrapper<Types.CreateAkashaProfileInterestsPayload>;
  CreateAkashaProfilePayload: ResolverTypeWrapper<Types.CreateAkashaProfilePayload>;
  CreateAkashaProfileStreamInput: Types.CreateAkashaProfileStreamInput;
  CreateAkashaProfileStreamPayload: ResolverTypeWrapper<Types.CreateAkashaProfileStreamPayload>;
  CreateAkashaReflectInput: Types.CreateAkashaReflectInput;
  CreateAkashaReflectPayload: ResolverTypeWrapper<Types.CreateAkashaReflectPayload>;
  CreateAkashaReflectStreamInput: Types.CreateAkashaReflectStreamInput;
  CreateAkashaReflectStreamPayload: ResolverTypeWrapper<Types.CreateAkashaReflectStreamPayload>;
  DID: ResolverTypeWrapper<Types.Scalars['DID']['output']>;
  DID_JWS: Types.Did_Jws;
  DateTime: ResolverTypeWrapper<Types.Scalars['DateTime']['output']>;
  IndexAppPayload: ResolverTypeWrapper<Types.IndexAppPayload>;
  IndexAppPayloadDocument: ResolverTypeWrapper<Types.IndexAppPayloadDocument>;
  IndexBeamPayload: ResolverTypeWrapper<Types.IndexBeamPayload>;
  IndexBeamPayloadDocument: ResolverTypeWrapper<Types.IndexBeamPayloadDocument>;
  IndexContentBlockPayload: ResolverTypeWrapper<Types.IndexContentBlockPayload>;
  IndexContentBlockPayloadDocument: ResolverTypeWrapper<Types.IndexContentBlockPayloadDocument>;
  IndexInterestPayload: ResolverTypeWrapper<Types.IndexInterestPayload>;
  IndexInterestPayloadDocument: ResolverTypeWrapper<Types.IndexInterestPayloadDocument>;
  IndexProfilePayload: ResolverTypeWrapper<Types.IndexProfilePayload>;
  IndexProfilePayloadDocument: ResolverTypeWrapper<Types.IndexProfilePayloadDocument>;
  IndexReflectPayload: ResolverTypeWrapper<Types.IndexReflectPayload>;
  IndexReflectPayloadDocument: ResolverTypeWrapper<Types.IndexReflectPayloadDocument>;
  InterPlanetaryCID: ResolverTypeWrapper<Types.Scalars['InterPlanetaryCID']['output']>;
  JWS_Signature: Types.Jws_Signature;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Node']>;
  PageInfo: ResolverTypeWrapper<Types.PageInfo>;
  PartialAkashaAppInput: Types.PartialAkashaAppInput;
  PartialAkashaAppReleaseInput: Types.PartialAkashaAppReleaseInput;
  PartialAkashaAppsStreamInput: Types.PartialAkashaAppsStreamInput;
  PartialAkashaBeamInput: Types.PartialAkashaBeamInput;
  PartialAkashaBeamStreamInput: Types.PartialAkashaBeamStreamInput;
  PartialAkashaBlockStorageInput: Types.PartialAkashaBlockStorageInput;
  PartialAkashaContentBlockInput: Types.PartialAkashaContentBlockInput;
  PartialAkashaContentBlockStreamInput: Types.PartialAkashaContentBlockStreamInput;
  PartialAkashaFollowInput: Types.PartialAkashaFollowInput;
  PartialAkashaIndexedStreamInput: Types.PartialAkashaIndexedStreamInput;
  PartialAkashaInterestsStreamInput: Types.PartialAkashaInterestsStreamInput;
  PartialAkashaProfileInput: Types.PartialAkashaProfileInput;
  PartialAkashaProfileInterestsInput: Types.PartialAkashaProfileInterestsInput;
  PartialAkashaProfileStreamInput: Types.PartialAkashaProfileStreamInput;
  PartialAkashaReflectInput: Types.PartialAkashaReflectInput;
  PartialAkashaReflectStreamInput: Types.PartialAkashaReflectStreamInput;
  Query: ResolverTypeWrapper<{}>;
  SetOptionsInput: Types.SetOptionsInput;
  SortOrder: Types.SortOrder;
  StringValueFilterInput: Types.StringValueFilterInput;
  URI: ResolverTypeWrapper<Types.Scalars['URI']['output']>;
  UpdateAkashaAppInput: Types.UpdateAkashaAppInput;
  UpdateAkashaAppPayload: ResolverTypeWrapper<Types.UpdateAkashaAppPayload>;
  UpdateAkashaAppReleaseInput: Types.UpdateAkashaAppReleaseInput;
  UpdateAkashaAppReleasePayload: ResolverTypeWrapper<Types.UpdateAkashaAppReleasePayload>;
  UpdateAkashaAppsStreamInput: Types.UpdateAkashaAppsStreamInput;
  UpdateAkashaAppsStreamPayload: ResolverTypeWrapper<Types.UpdateAkashaAppsStreamPayload>;
  UpdateAkashaBeamInput: Types.UpdateAkashaBeamInput;
  UpdateAkashaBeamPayload: ResolverTypeWrapper<Types.UpdateAkashaBeamPayload>;
  UpdateAkashaBeamStreamInput: Types.UpdateAkashaBeamStreamInput;
  UpdateAkashaBeamStreamPayload: ResolverTypeWrapper<Types.UpdateAkashaBeamStreamPayload>;
  UpdateAkashaBlockStorageInput: Types.UpdateAkashaBlockStorageInput;
  UpdateAkashaBlockStoragePayload: ResolverTypeWrapper<Types.UpdateAkashaBlockStoragePayload>;
  UpdateAkashaContentBlockInput: Types.UpdateAkashaContentBlockInput;
  UpdateAkashaContentBlockPayload: ResolverTypeWrapper<Types.UpdateAkashaContentBlockPayload>;
  UpdateAkashaContentBlockStreamInput: Types.UpdateAkashaContentBlockStreamInput;
  UpdateAkashaContentBlockStreamPayload: ResolverTypeWrapper<Types.UpdateAkashaContentBlockStreamPayload>;
  UpdateAkashaFollowInput: Types.UpdateAkashaFollowInput;
  UpdateAkashaFollowPayload: ResolverTypeWrapper<Types.UpdateAkashaFollowPayload>;
  UpdateAkashaIndexedStreamInput: Types.UpdateAkashaIndexedStreamInput;
  UpdateAkashaIndexedStreamPayload: ResolverTypeWrapper<Types.UpdateAkashaIndexedStreamPayload>;
  UpdateAkashaInterestsStreamInput: Types.UpdateAkashaInterestsStreamInput;
  UpdateAkashaInterestsStreamPayload: ResolverTypeWrapper<Types.UpdateAkashaInterestsStreamPayload>;
  UpdateAkashaProfileInput: Types.UpdateAkashaProfileInput;
  UpdateAkashaProfileInterestsInput: Types.UpdateAkashaProfileInterestsInput;
  UpdateAkashaProfileInterestsPayload: ResolverTypeWrapper<Types.UpdateAkashaProfileInterestsPayload>;
  UpdateAkashaProfilePayload: ResolverTypeWrapper<Types.UpdateAkashaProfilePayload>;
  UpdateAkashaProfileStreamInput: Types.UpdateAkashaProfileStreamInput;
  UpdateAkashaProfileStreamPayload: ResolverTypeWrapper<Types.UpdateAkashaProfileStreamPayload>;
  UpdateAkashaReflectInput: Types.UpdateAkashaReflectInput;
  UpdateAkashaReflectPayload: ResolverTypeWrapper<Types.UpdateAkashaReflectPayload>;
  UpdateAkashaReflectStreamInput: Types.UpdateAkashaReflectStreamInput;
  UpdateAkashaReflectStreamPayload: ResolverTypeWrapper<Types.UpdateAkashaReflectStreamPayload>;
  UpdateOptionsInput: Types.UpdateOptionsInput;
  join__FieldSet: ResolverTypeWrapper<Types.Scalars['join__FieldSet']['output']>;
  join__Graph: Types.Join__Graph;
  link__Import: ResolverTypeWrapper<Types.Scalars['link__Import']['output']>;
  link__Purpose: Types.Link__Purpose;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AkashaApp: Types.AkashaApp;
  String: Types.Scalars['String']['output'];
  ID: Types.Scalars['ID']['output'];
  Int: Types.Scalars['Int']['output'];
  AkashaAppApplicationTypeValueFilterInput: Types.AkashaAppApplicationTypeValueFilterInput;
  Boolean: Types.Scalars['Boolean']['output'];
  AkashaAppConnection: Types.AkashaAppConnection;
  AkashaAppEdge: Types.AkashaAppEdge;
  AkashaAppFiltersInput: Types.AkashaAppFiltersInput;
  AkashaAppInput: Types.AkashaAppInput;
  AkashaAppObjectFilterInput: Types.AkashaAppObjectFilterInput;
  AkashaAppRelease: Types.AkashaAppRelease;
  AkashaAppReleaseConnection: Types.AkashaAppReleaseConnection;
  AkashaAppReleaseEdge: Types.AkashaAppReleaseEdge;
  AkashaAppReleaseFiltersInput: Types.AkashaAppReleaseFiltersInput;
  AkashaAppReleaseInput: Types.AkashaAppReleaseInput;
  AkashaAppReleaseObjectFilterInput: Types.AkashaAppReleaseObjectFilterInput;
  AkashaAppReleaseSortingInput: Types.AkashaAppReleaseSortingInput;
  AkashaAppSortingInput: Types.AkashaAppSortingInput;
  AkashaAppsStream: Types.AkashaAppsStream;
  AkashaAppsStreamConnection: Types.AkashaAppsStreamConnection;
  AkashaAppsStreamEdge: Types.AkashaAppsStreamEdge;
  AkashaAppsStreamFiltersInput: Types.AkashaAppsStreamFiltersInput;
  AkashaAppsStreamInput: Types.AkashaAppsStreamInput;
  AkashaAppsStreamModerationStatusValueFilterInput: Types.AkashaAppsStreamModerationStatusValueFilterInput;
  AkashaAppsStreamObjectFilterInput: Types.AkashaAppsStreamObjectFilterInput;
  AkashaAppsStreamSortingInput: Types.AkashaAppsStreamSortingInput;
  AkashaBeam: Types.AkashaBeam;
  AkashaBeamBlockRecord: Types.AkashaBeamBlockRecord;
  AkashaBeamBlockRecordInput: Types.AkashaBeamBlockRecordInput;
  AkashaBeamConnection: Types.AkashaBeamConnection;
  AkashaBeamEdge: Types.AkashaBeamEdge;
  AkashaBeamEmbeddedType: Types.AkashaBeamEmbeddedType;
  AkashaBeamEmbeddedTypeInput: Types.AkashaBeamEmbeddedTypeInput;
  AkashaBeamFiltersInput: Types.AkashaBeamFiltersInput;
  AkashaBeamInput: Types.AkashaBeamInput;
  AkashaBeamLabeled: Types.AkashaBeamLabeled;
  AkashaBeamLabeledInput: Types.AkashaBeamLabeledInput;
  AkashaBeamObjectFilterInput: Types.AkashaBeamObjectFilterInput;
  AkashaBeamSortingInput: Types.AkashaBeamSortingInput;
  AkashaBeamStream: Types.AkashaBeamStream;
  AkashaBeamStreamConnection: Types.AkashaBeamStreamConnection;
  AkashaBeamStreamEdge: Types.AkashaBeamStreamEdge;
  AkashaBeamStreamFiltersInput: Types.AkashaBeamStreamFiltersInput;
  AkashaBeamStreamInput: Types.AkashaBeamStreamInput;
  AkashaBeamStreamModerationStatusValueFilterInput: Types.AkashaBeamStreamModerationStatusValueFilterInput;
  AkashaBeamStreamObjectFilterInput: Types.AkashaBeamStreamObjectFilterInput;
  AkashaBeamStreamSortingInput: Types.AkashaBeamStreamSortingInput;
  AkashaBlockStorage: Types.AkashaBlockStorage;
  AkashaBlockStorageBlockStorageDefValueFilterInput: Types.AkashaBlockStorageBlockStorageDefValueFilterInput;
  AkashaBlockStorageConnection: Types.AkashaBlockStorageConnection;
  AkashaBlockStorageEdge: Types.AkashaBlockStorageEdge;
  AkashaBlockStorageFiltersInput: Types.AkashaBlockStorageFiltersInput;
  AkashaBlockStorageInput: Types.AkashaBlockStorageInput;
  AkashaBlockStorageLabeledValue: Types.AkashaBlockStorageLabeledValue;
  AkashaBlockStorageLabeledValueInput: Types.AkashaBlockStorageLabeledValueInput;
  AkashaBlockStorageObjectFilterInput: Types.AkashaBlockStorageObjectFilterInput;
  AkashaBlockStorageSortingInput: Types.AkashaBlockStorageSortingInput;
  AkashaContentBlock: Types.AkashaContentBlock;
  AkashaContentBlockBlockDefValueFilterInput: Types.AkashaContentBlockBlockDefValueFilterInput;
  AkashaContentBlockConnection: Types.AkashaContentBlockConnection;
  AkashaContentBlockEdge: Types.AkashaContentBlockEdge;
  AkashaContentBlockFiltersInput: Types.AkashaContentBlockFiltersInput;
  AkashaContentBlockInput: Types.AkashaContentBlockInput;
  AkashaContentBlockLabeledValue: Types.AkashaContentBlockLabeledValue;
  AkashaContentBlockLabeledValueInput: Types.AkashaContentBlockLabeledValueInput;
  AkashaContentBlockObjectFilterInput: Types.AkashaContentBlockObjectFilterInput;
  AkashaContentBlockSortingInput: Types.AkashaContentBlockSortingInput;
  AkashaContentBlockStream: Types.AkashaContentBlockStream;
  AkashaContentBlockStreamConnection: Types.AkashaContentBlockStreamConnection;
  AkashaContentBlockStreamEdge: Types.AkashaContentBlockStreamEdge;
  AkashaContentBlockStreamFiltersInput: Types.AkashaContentBlockStreamFiltersInput;
  AkashaContentBlockStreamInput: Types.AkashaContentBlockStreamInput;
  AkashaContentBlockStreamModerationStatusValueFilterInput: Types.AkashaContentBlockStreamModerationStatusValueFilterInput;
  AkashaContentBlockStreamObjectFilterInput: Types.AkashaContentBlockStreamObjectFilterInput;
  AkashaContentBlockStreamSortingInput: Types.AkashaContentBlockStreamSortingInput;
  AkashaFollow: Types.AkashaFollow;
  AkashaFollowConnection: Types.AkashaFollowConnection;
  AkashaFollowEdge: Types.AkashaFollowEdge;
  AkashaFollowFiltersInput: Types.AkashaFollowFiltersInput;
  AkashaFollowInput: Types.AkashaFollowInput;
  AkashaFollowObjectFilterInput: Types.AkashaFollowObjectFilterInput;
  AkashaFollowSortingInput: Types.AkashaFollowSortingInput;
  AkashaIndexedStream: Types.AkashaIndexedStream;
  AkashaIndexedStreamConnection: Types.AkashaIndexedStreamConnection;
  AkashaIndexedStreamEdge: Types.AkashaIndexedStreamEdge;
  AkashaIndexedStreamFiltersInput: Types.AkashaIndexedStreamFiltersInput;
  AkashaIndexedStreamInput: Types.AkashaIndexedStreamInput;
  AkashaIndexedStreamModerationStatusValueFilterInput: Types.AkashaIndexedStreamModerationStatusValueFilterInput;
  AkashaIndexedStreamObjectFilterInput: Types.AkashaIndexedStreamObjectFilterInput;
  AkashaIndexedStreamSortingInput: Types.AkashaIndexedStreamSortingInput;
  AkashaIndexedStreamStreamTypeValueFilterInput: Types.AkashaIndexedStreamStreamTypeValueFilterInput;
  AkashaInterestsStream: Types.AkashaInterestsStream;
  AkashaInterestsStreamConnection: Types.AkashaInterestsStreamConnection;
  AkashaInterestsStreamEdge: Types.AkashaInterestsStreamEdge;
  AkashaInterestsStreamFiltersInput: Types.AkashaInterestsStreamFiltersInput;
  AkashaInterestsStreamInput: Types.AkashaInterestsStreamInput;
  AkashaInterestsStreamModerationStatusValueFilterInput: Types.AkashaInterestsStreamModerationStatusValueFilterInput;
  AkashaInterestsStreamObjectFilterInput: Types.AkashaInterestsStreamObjectFilterInput;
  AkashaInterestsStreamSortingInput: Types.AkashaInterestsStreamSortingInput;
  AkashaProfile: Types.AkashaProfile;
  AkashaProfileConnection: Types.AkashaProfileConnection;
  AkashaProfileEdge: Types.AkashaProfileEdge;
  AkashaProfileFiltersInput: Types.AkashaProfileFiltersInput;
  AkashaProfileImageSource: Types.AkashaProfileImageSource;
  AkashaProfileImageSourceInput: Types.AkashaProfileImageSourceInput;
  AkashaProfileImageVersions: Types.AkashaProfileImageVersions;
  AkashaProfileImageVersionsInput: Types.AkashaProfileImageVersionsInput;
  AkashaProfileInput: Types.AkashaProfileInput;
  AkashaProfileInterests: Types.AkashaProfileInterests;
  AkashaProfileInterestsConnection: Types.AkashaProfileInterestsConnection;
  AkashaProfileInterestsEdge: Types.AkashaProfileInterestsEdge;
  AkashaProfileInterestsInput: Types.AkashaProfileInterestsInput;
  AkashaProfileInterestsLabeled: Types.AkashaProfileInterestsLabeled;
  AkashaProfileInterestsLabeledInput: Types.AkashaProfileInterestsLabeledInput;
  AkashaProfileLinkSource: Types.AkashaProfileLinkSource;
  AkashaProfileLinkSourceInput: Types.AkashaProfileLinkSourceInput;
  AkashaProfileObjectFilterInput: Types.AkashaProfileObjectFilterInput;
  AkashaProfileSortingInput: Types.AkashaProfileSortingInput;
  AkashaProfileStream: Types.AkashaProfileStream;
  AkashaProfileStreamConnection: Types.AkashaProfileStreamConnection;
  AkashaProfileStreamEdge: Types.AkashaProfileStreamEdge;
  AkashaProfileStreamFiltersInput: Types.AkashaProfileStreamFiltersInput;
  AkashaProfileStreamInput: Types.AkashaProfileStreamInput;
  AkashaProfileStreamModerationStatusValueFilterInput: Types.AkashaProfileStreamModerationStatusValueFilterInput;
  AkashaProfileStreamObjectFilterInput: Types.AkashaProfileStreamObjectFilterInput;
  AkashaProfileStreamSortingInput: Types.AkashaProfileStreamSortingInput;
  AkashaReflect: Types.AkashaReflect;
  AkashaReflectConnection: Types.AkashaReflectConnection;
  AkashaReflectEdge: Types.AkashaReflectEdge;
  AkashaReflectFiltersInput: Types.AkashaReflectFiltersInput;
  AkashaReflectInput: Types.AkashaReflectInput;
  AkashaReflectObjectFilterInput: Types.AkashaReflectObjectFilterInput;
  AkashaReflectProviderValue: Types.AkashaReflectProviderValue;
  AkashaReflectProviderValueInput: Types.AkashaReflectProviderValueInput;
  AkashaReflectSortingInput: Types.AkashaReflectSortingInput;
  AkashaReflectStream: Types.AkashaReflectStream;
  AkashaReflectStreamConnection: Types.AkashaReflectStreamConnection;
  AkashaReflectStreamEdge: Types.AkashaReflectStreamEdge;
  AkashaReflectStreamFiltersInput: Types.AkashaReflectStreamFiltersInput;
  AkashaReflectStreamInput: Types.AkashaReflectStreamInput;
  AkashaReflectStreamModerationStatusValueFilterInput: Types.AkashaReflectStreamModerationStatusValueFilterInput;
  AkashaReflectStreamObjectFilterInput: Types.AkashaReflectStreamObjectFilterInput;
  AkashaReflectStreamSortingInput: Types.AkashaReflectStreamSortingInput;
  BooleanValueFilterInput: Types.BooleanValueFilterInput;
  CACAO_CAPABILITY: Types.Cacao_Capability;
  CacaoHeader: Types.CacaoHeader;
  CacaoHeaderT: Types.Scalars['CacaoHeaderT']['output'];
  CacaoPayload: Types.CacaoPayload;
  CacaoSignature: Types.CacaoSignature;
  CacaoSignatureT: Types.Scalars['CacaoSignatureT']['output'];
  CeramicAccount: Types.CeramicAccount;
  CeramicCommitID: Types.Scalars['CeramicCommitID']['output'];
  CeramicStreamID: Types.Scalars['CeramicStreamID']['output'];
  CreateAkashaAppInput: Types.CreateAkashaAppInput;
  CreateAkashaAppPayload: Types.CreateAkashaAppPayload;
  CreateAkashaAppReleaseInput: Types.CreateAkashaAppReleaseInput;
  CreateAkashaAppReleasePayload: Types.CreateAkashaAppReleasePayload;
  CreateAkashaAppsStreamInput: Types.CreateAkashaAppsStreamInput;
  CreateAkashaAppsStreamPayload: Types.CreateAkashaAppsStreamPayload;
  CreateAkashaBeamInput: Types.CreateAkashaBeamInput;
  CreateAkashaBeamPayload: Types.CreateAkashaBeamPayload;
  CreateAkashaBeamStreamInput: Types.CreateAkashaBeamStreamInput;
  CreateAkashaBeamStreamPayload: Types.CreateAkashaBeamStreamPayload;
  CreateAkashaBlockStorageInput: Types.CreateAkashaBlockStorageInput;
  CreateAkashaBlockStoragePayload: Types.CreateAkashaBlockStoragePayload;
  CreateAkashaContentBlockInput: Types.CreateAkashaContentBlockInput;
  CreateAkashaContentBlockPayload: Types.CreateAkashaContentBlockPayload;
  CreateAkashaContentBlockStreamInput: Types.CreateAkashaContentBlockStreamInput;
  CreateAkashaContentBlockStreamPayload: Types.CreateAkashaContentBlockStreamPayload;
  CreateAkashaFollowInput: Types.CreateAkashaFollowInput;
  CreateAkashaFollowPayload: Types.CreateAkashaFollowPayload;
  CreateAkashaIndexedStreamInput: Types.CreateAkashaIndexedStreamInput;
  CreateAkashaIndexedStreamPayload: Types.CreateAkashaIndexedStreamPayload;
  CreateAkashaInterestsStreamInput: Types.CreateAkashaInterestsStreamInput;
  CreateAkashaInterestsStreamPayload: Types.CreateAkashaInterestsStreamPayload;
  CreateAkashaProfileInput: Types.CreateAkashaProfileInput;
  CreateAkashaProfileInterestsInput: Types.CreateAkashaProfileInterestsInput;
  CreateAkashaProfileInterestsPayload: Types.CreateAkashaProfileInterestsPayload;
  CreateAkashaProfilePayload: Types.CreateAkashaProfilePayload;
  CreateAkashaProfileStreamInput: Types.CreateAkashaProfileStreamInput;
  CreateAkashaProfileStreamPayload: Types.CreateAkashaProfileStreamPayload;
  CreateAkashaReflectInput: Types.CreateAkashaReflectInput;
  CreateAkashaReflectPayload: Types.CreateAkashaReflectPayload;
  CreateAkashaReflectStreamInput: Types.CreateAkashaReflectStreamInput;
  CreateAkashaReflectStreamPayload: Types.CreateAkashaReflectStreamPayload;
  DID: Types.Scalars['DID']['output'];
  DID_JWS: Types.Did_Jws;
  DateTime: Types.Scalars['DateTime']['output'];
  IndexAppPayload: Types.IndexAppPayload;
  IndexAppPayloadDocument: Types.IndexAppPayloadDocument;
  IndexBeamPayload: Types.IndexBeamPayload;
  IndexBeamPayloadDocument: Types.IndexBeamPayloadDocument;
  IndexContentBlockPayload: Types.IndexContentBlockPayload;
  IndexContentBlockPayloadDocument: Types.IndexContentBlockPayloadDocument;
  IndexInterestPayload: Types.IndexInterestPayload;
  IndexInterestPayloadDocument: Types.IndexInterestPayloadDocument;
  IndexProfilePayload: Types.IndexProfilePayload;
  IndexProfilePayloadDocument: Types.IndexProfilePayloadDocument;
  IndexReflectPayload: Types.IndexReflectPayload;
  IndexReflectPayloadDocument: Types.IndexReflectPayloadDocument;
  InterPlanetaryCID: Types.Scalars['InterPlanetaryCID']['output'];
  JWS_Signature: Types.Jws_Signature;
  Mutation: {};
  Node: ResolversInterfaceTypes<ResolversParentTypes>['Node'];
  PageInfo: Types.PageInfo;
  PartialAkashaAppInput: Types.PartialAkashaAppInput;
  PartialAkashaAppReleaseInput: Types.PartialAkashaAppReleaseInput;
  PartialAkashaAppsStreamInput: Types.PartialAkashaAppsStreamInput;
  PartialAkashaBeamInput: Types.PartialAkashaBeamInput;
  PartialAkashaBeamStreamInput: Types.PartialAkashaBeamStreamInput;
  PartialAkashaBlockStorageInput: Types.PartialAkashaBlockStorageInput;
  PartialAkashaContentBlockInput: Types.PartialAkashaContentBlockInput;
  PartialAkashaContentBlockStreamInput: Types.PartialAkashaContentBlockStreamInput;
  PartialAkashaFollowInput: Types.PartialAkashaFollowInput;
  PartialAkashaIndexedStreamInput: Types.PartialAkashaIndexedStreamInput;
  PartialAkashaInterestsStreamInput: Types.PartialAkashaInterestsStreamInput;
  PartialAkashaProfileInput: Types.PartialAkashaProfileInput;
  PartialAkashaProfileInterestsInput: Types.PartialAkashaProfileInterestsInput;
  PartialAkashaProfileStreamInput: Types.PartialAkashaProfileStreamInput;
  PartialAkashaReflectInput: Types.PartialAkashaReflectInput;
  PartialAkashaReflectStreamInput: Types.PartialAkashaReflectStreamInput;
  Query: {};
  SetOptionsInput: Types.SetOptionsInput;
  StringValueFilterInput: Types.StringValueFilterInput;
  URI: Types.Scalars['URI']['output'];
  UpdateAkashaAppInput: Types.UpdateAkashaAppInput;
  UpdateAkashaAppPayload: Types.UpdateAkashaAppPayload;
  UpdateAkashaAppReleaseInput: Types.UpdateAkashaAppReleaseInput;
  UpdateAkashaAppReleasePayload: Types.UpdateAkashaAppReleasePayload;
  UpdateAkashaAppsStreamInput: Types.UpdateAkashaAppsStreamInput;
  UpdateAkashaAppsStreamPayload: Types.UpdateAkashaAppsStreamPayload;
  UpdateAkashaBeamInput: Types.UpdateAkashaBeamInput;
  UpdateAkashaBeamPayload: Types.UpdateAkashaBeamPayload;
  UpdateAkashaBeamStreamInput: Types.UpdateAkashaBeamStreamInput;
  UpdateAkashaBeamStreamPayload: Types.UpdateAkashaBeamStreamPayload;
  UpdateAkashaBlockStorageInput: Types.UpdateAkashaBlockStorageInput;
  UpdateAkashaBlockStoragePayload: Types.UpdateAkashaBlockStoragePayload;
  UpdateAkashaContentBlockInput: Types.UpdateAkashaContentBlockInput;
  UpdateAkashaContentBlockPayload: Types.UpdateAkashaContentBlockPayload;
  UpdateAkashaContentBlockStreamInput: Types.UpdateAkashaContentBlockStreamInput;
  UpdateAkashaContentBlockStreamPayload: Types.UpdateAkashaContentBlockStreamPayload;
  UpdateAkashaFollowInput: Types.UpdateAkashaFollowInput;
  UpdateAkashaFollowPayload: Types.UpdateAkashaFollowPayload;
  UpdateAkashaIndexedStreamInput: Types.UpdateAkashaIndexedStreamInput;
  UpdateAkashaIndexedStreamPayload: Types.UpdateAkashaIndexedStreamPayload;
  UpdateAkashaInterestsStreamInput: Types.UpdateAkashaInterestsStreamInput;
  UpdateAkashaInterestsStreamPayload: Types.UpdateAkashaInterestsStreamPayload;
  UpdateAkashaProfileInput: Types.UpdateAkashaProfileInput;
  UpdateAkashaProfileInterestsInput: Types.UpdateAkashaProfileInterestsInput;
  UpdateAkashaProfileInterestsPayload: Types.UpdateAkashaProfileInterestsPayload;
  UpdateAkashaProfilePayload: Types.UpdateAkashaProfilePayload;
  UpdateAkashaProfileStreamInput: Types.UpdateAkashaProfileStreamInput;
  UpdateAkashaProfileStreamPayload: Types.UpdateAkashaProfileStreamPayload;
  UpdateAkashaReflectInput: Types.UpdateAkashaReflectInput;
  UpdateAkashaReflectPayload: Types.UpdateAkashaReflectPayload;
  UpdateAkashaReflectStreamInput: Types.UpdateAkashaReflectStreamInput;
  UpdateAkashaReflectStreamPayload: Types.UpdateAkashaReflectStreamPayload;
  UpdateOptionsInput: Types.UpdateOptionsInput;
  join__FieldSet: Types.Scalars['join__FieldSet']['output'];
  link__Import: Types.Scalars['link__Import']['output'];
};

export type Join__EnumValueDirectiveArgs = {
  graph: Types.Join__Graph;
};

export type Join__EnumValueDirectiveResolver<Result, Parent, ContextType = any, Args = Join__EnumValueDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Join__FieldDirectiveArgs = {
  external?: Types.Maybe<Types.Scalars['Boolean']['input']>;
  graph?: Types.Maybe<Types.Join__Graph>;
  override?: Types.Maybe<Types.Scalars['String']['input']>;
  provides?: Types.Maybe<Types.Scalars['join__FieldSet']['input']>;
  requires?: Types.Maybe<Types.Scalars['join__FieldSet']['input']>;
  type?: Types.Maybe<Types.Scalars['String']['input']>;
  usedOverridden?: Types.Maybe<Types.Scalars['Boolean']['input']>;
};

export type Join__FieldDirectiveResolver<Result, Parent, ContextType = any, Args = Join__FieldDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Join__GraphDirectiveArgs = {
  name: Types.Scalars['String']['input'];
  url: Types.Scalars['String']['input'];
};

export type Join__GraphDirectiveResolver<Result, Parent, ContextType = any, Args = Join__GraphDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Join__ImplementsDirectiveArgs = {
  graph: Types.Join__Graph;
  interface: Types.Scalars['String']['input'];
};

export type Join__ImplementsDirectiveResolver<Result, Parent, ContextType = any, Args = Join__ImplementsDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Join__TypeDirectiveArgs = {
  extension?: Types.Scalars['Boolean']['input'];
  graph: Types.Join__Graph;
  isInterfaceObject?: Types.Scalars['Boolean']['input'];
  key?: Types.Maybe<Types.Scalars['join__FieldSet']['input']>;
  resolvable?: Types.Scalars['Boolean']['input'];
};

export type Join__TypeDirectiveResolver<Result, Parent, ContextType = any, Args = Join__TypeDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type Join__UnionMemberDirectiveArgs = {
  graph: Types.Join__Graph;
  member: Types.Scalars['String']['input'];
};

export type Join__UnionMemberDirectiveResolver<Result, Parent, ContextType = any, Args = Join__UnionMemberDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveArgs = {
  as?: Types.Maybe<Types.Scalars['String']['input']>;
  for?: Types.Maybe<Types.Link__Purpose>;
  import?: Types.Maybe<Array<Types.Maybe<Types.Scalars['link__Import']['input']>>>;
  url?: Types.Maybe<Types.Scalars['String']['input']>;
};

export type LinkDirectiveResolver<Result, Parent, ContextType = any, Args = LinkDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

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
  releases?: Resolver<ResolversTypes['AkashaAppReleaseConnection'], ParentType, ContextType, Partial<Types.AkashaAppReleasesArgs>>;
  releasesCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.AkashaAppReleasesCountArgs>>;
  version?: Resolver<ResolversTypes['CeramicCommitID'], ParentType, ContextType>;
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

export type AkashaAppReleaseResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaAppRelease'] = ResolversParentTypes['AkashaAppRelease']> = {
  application?: Resolver<Types.Maybe<ResolversTypes['AkashaApp']>, ParentType, ContextType>;
  applicationID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  source?: Resolver<ResolversTypes['InterPlanetaryCID'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaAppReleaseConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaAppReleaseConnection'] = ResolversParentTypes['AkashaAppReleaseConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaAppReleaseEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaAppReleaseEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaAppReleaseEdge'] = ResolversParentTypes['AkashaAppReleaseEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaAppRelease']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaAppsStreamResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaAppsStream'] = ResolversParentTypes['AkashaAppsStream']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  application?: Resolver<Types.Maybe<ResolversTypes['AkashaApp']>, ParentType, ContextType>;
  applicationID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  moderationID?: Resolver<Types.Maybe<ResolversTypes['CeramicStreamID']>, ParentType, ContextType>;
  status?: Resolver<Types.Maybe<ResolversTypes['AkashaAppsStreamModerationStatus']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaAppsStreamConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaAppsStreamConnection'] = ResolversParentTypes['AkashaAppsStreamConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaAppsStreamEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaAppsStreamEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaAppsStreamEdge'] = ResolversParentTypes['AkashaAppsStreamEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaAppsStream']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaBeamResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaBeam'] = ResolversParentTypes['AkashaBeam']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  content?: Resolver<Array<ResolversTypes['AkashaBeamBlockRecord']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  embeddedStream?: Resolver<Types.Maybe<ResolversTypes['AkashaBeamEmbeddedType']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  mentions?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['CeramicAccount']>>>, ParentType, ContextType>;
  nsfw?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  reflections?: Resolver<ResolversTypes['AkashaReflectConnection'], ParentType, ContextType, Partial<Types.AkashaBeamReflectionsArgs>>;
  reflectionsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.AkashaBeamReflectionsCountArgs>>;
  tags?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaBeamLabeled']>>>, ParentType, ContextType>;
  version?: Resolver<ResolversTypes['CeramicCommitID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaBeamBlockRecordResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaBeamBlockRecord'] = ResolversParentTypes['AkashaBeamBlockRecord']> = {
  blockID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaBeamConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaBeamConnection'] = ResolversParentTypes['AkashaBeamConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaBeamEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaBeamEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaBeamEdge'] = ResolversParentTypes['AkashaBeamEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaBeam']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaBeamEmbeddedTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaBeamEmbeddedType'] = ResolversParentTypes['AkashaBeamEmbeddedType']> = {
  embeddedID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaBeamLabeledResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaBeamLabeled'] = ResolversParentTypes['AkashaBeamLabeled']> = {
  labelType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaBeamStreamResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaBeamStream'] = ResolversParentTypes['AkashaBeamStream']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  beam?: Resolver<Types.Maybe<ResolversTypes['AkashaBeam']>, ParentType, ContextType>;
  beamID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  moderationID?: Resolver<Types.Maybe<ResolversTypes['CeramicStreamID']>, ParentType, ContextType>;
  status?: Resolver<Types.Maybe<ResolversTypes['AkashaBeamStreamModerationStatus']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaBeamStreamConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaBeamStreamConnection'] = ResolversParentTypes['AkashaBeamStreamConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaBeamStreamEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaBeamStreamEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaBeamStreamEdge'] = ResolversParentTypes['AkashaBeamStreamEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaBeamStream']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaBlockStorageResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaBlockStorage'] = ResolversParentTypes['AkashaBlockStorage']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  appVersion?: Resolver<Types.Maybe<ResolversTypes['AkashaAppRelease']>, ParentType, ContextType>;
  appVersionID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  block?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlock']>, ParentType, ContextType>;
  blockID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  content?: Resolver<Array<ResolversTypes['AkashaBlockStorageLabeledValue']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kind?: Resolver<Types.Maybe<ResolversTypes['AkashaBlockStorageBlockStorageDef']>, ParentType, ContextType>;
  version?: Resolver<ResolversTypes['CeramicCommitID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaBlockStorageConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaBlockStorageConnection'] = ResolversParentTypes['AkashaBlockStorageConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaBlockStorageEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaBlockStorageEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaBlockStorageEdge'] = ResolversParentTypes['AkashaBlockStorageEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaBlockStorage']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaBlockStorageLabeledValueResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaBlockStorageLabeledValue'] = ResolversParentTypes['AkashaBlockStorageLabeledValue']> = {
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  propertyType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaContentBlockResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaContentBlock'] = ResolversParentTypes['AkashaContentBlock']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  appVersion?: Resolver<Types.Maybe<ResolversTypes['AkashaAppRelease']>, ParentType, ContextType>;
  appVersionID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  content?: Resolver<Array<ResolversTypes['AkashaContentBlockLabeledValue']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kind?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlockBlockDef']>, ParentType, ContextType>;
  nsfw?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  version?: Resolver<ResolversTypes['CeramicCommitID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaContentBlockConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaContentBlockConnection'] = ResolversParentTypes['AkashaContentBlockConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaContentBlockEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaContentBlockEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaContentBlockEdge'] = ResolversParentTypes['AkashaContentBlockEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlock']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaContentBlockLabeledValueResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaContentBlockLabeledValue'] = ResolversParentTypes['AkashaContentBlockLabeledValue']> = {
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  propertyType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaContentBlockStreamResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaContentBlockStream'] = ResolversParentTypes['AkashaContentBlockStream']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  block?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlock']>, ParentType, ContextType>;
  blockID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  moderationID?: Resolver<Types.Maybe<ResolversTypes['CeramicStreamID']>, ParentType, ContextType>;
  status?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlockStreamModerationStatus']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaContentBlockStreamConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaContentBlockStreamConnection'] = ResolversParentTypes['AkashaContentBlockStreamConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaContentBlockStreamEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaContentBlockStreamEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaContentBlockStreamEdge'] = ResolversParentTypes['AkashaContentBlockStreamEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlockStream']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaFollowResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaFollow'] = ResolversParentTypes['AkashaFollow']> = {
  did?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isFollowing?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  profile?: Resolver<Types.Maybe<ResolversTypes['AkashaProfile']>, ParentType, ContextType>;
  profileID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaFollowConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaFollowConnection'] = ResolversParentTypes['AkashaFollowConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaFollowEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaFollowEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaFollowEdge'] = ResolversParentTypes['AkashaFollowEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaFollow']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaIndexedStreamResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaIndexedStream'] = ResolversParentTypes['AkashaIndexedStream']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  indexType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  indexValue?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  moderationID?: Resolver<Types.Maybe<ResolversTypes['CeramicStreamID']>, ParentType, ContextType>;
  status?: Resolver<Types.Maybe<ResolversTypes['AkashaIndexedStreamModerationStatus']>, ParentType, ContextType>;
  stream?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  streamType?: Resolver<Types.Maybe<ResolversTypes['AkashaIndexedStreamStreamType']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaIndexedStreamConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaIndexedStreamConnection'] = ResolversParentTypes['AkashaIndexedStreamConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaIndexedStreamEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaIndexedStreamEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaIndexedStreamEdge'] = ResolversParentTypes['AkashaIndexedStreamEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaIndexedStream']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaInterestsStreamResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaInterestsStream'] = ResolversParentTypes['AkashaInterestsStream']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  labelType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  moderationID?: Resolver<Types.Maybe<ResolversTypes['CeramicStreamID']>, ParentType, ContextType>;
  status?: Resolver<Types.Maybe<ResolversTypes['AkashaInterestsStreamModerationStatus']>, ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaInterestsStreamConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaInterestsStreamConnection'] = ResolversParentTypes['AkashaInterestsStreamConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaInterestsStreamEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaInterestsStreamEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaInterestsStreamEdge'] = ResolversParentTypes['AkashaInterestsStreamEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaInterestsStream']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaProfileResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfile'] = ResolversParentTypes['AkashaProfile']> = {
  avatar?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileImageVersions']>, ParentType, ContextType>;
  background?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileImageVersions']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  did?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  followers?: Resolver<ResolversTypes['AkashaFollowConnection'], ParentType, ContextType, Partial<Types.AkashaProfileFollowersArgs>>;
  followersCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.AkashaProfileFollowersCountArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  links?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaProfileLinkSource']>>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nsfw?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaProfileConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfileConnection'] = ResolversParentTypes['AkashaProfileConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaProfileEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaProfileEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfileEdge'] = ResolversParentTypes['AkashaProfileEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaProfile']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaProfileImageSourceResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfileImageSource'] = ResolversParentTypes['AkashaProfileImageSource']> = {
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  src?: Resolver<ResolversTypes['URI'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaProfileImageVersionsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfileImageVersions'] = ResolversParentTypes['AkashaProfileImageVersions']> = {
  alternatives?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaProfileImageSource']>>>, ParentType, ContextType>;
  default?: Resolver<ResolversTypes['AkashaProfileImageSource'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaProfileInterestsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfileInterests'] = ResolversParentTypes['AkashaProfileInterests']> = {
  did?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  topics?: Resolver<Array<ResolversTypes['AkashaProfileInterestsLabeled']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaProfileInterestsConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfileInterestsConnection'] = ResolversParentTypes['AkashaProfileInterestsConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaProfileInterestsEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaProfileInterestsEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfileInterestsEdge'] = ResolversParentTypes['AkashaProfileInterestsEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileInterests']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaProfileInterestsLabeledResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfileInterestsLabeled'] = ResolversParentTypes['AkashaProfileInterestsLabeled']> = {
  labelType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaProfileLinkSourceResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfileLinkSource'] = ResolversParentTypes['AkashaProfileLinkSource']> = {
  href?: Resolver<ResolversTypes['URI'], ParentType, ContextType>;
  label?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaProfileStreamResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfileStream'] = ResolversParentTypes['AkashaProfileStream']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  moderationID?: Resolver<Types.Maybe<ResolversTypes['CeramicStreamID']>, ParentType, ContextType>;
  profile?: Resolver<Types.Maybe<ResolversTypes['AkashaProfile']>, ParentType, ContextType>;
  profileID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  status?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileStreamModerationStatus']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaProfileStreamConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfileStreamConnection'] = ResolversParentTypes['AkashaProfileStreamConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaProfileStreamEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaProfileStreamEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfileStreamEdge'] = ResolversParentTypes['AkashaProfileStreamEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileStream']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaReflectResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaReflect'] = ResolversParentTypes['AkashaReflect']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  beam?: Resolver<Types.Maybe<ResolversTypes['AkashaBeam']>, ParentType, ContextType>;
  beamID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  content?: Resolver<Array<ResolversTypes['AkashaReflectProviderValue']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isReply?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  mentions?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['CeramicStreamID']>>>, ParentType, ContextType>;
  nsfw?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  reflection?: Resolver<Types.Maybe<ResolversTypes['CeramicStreamID']>, ParentType, ContextType>;
  tags?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  version?: Resolver<ResolversTypes['CeramicCommitID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaReflectConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaReflectConnection'] = ResolversParentTypes['AkashaReflectConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaReflectEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaReflectEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaReflectEdge'] = ResolversParentTypes['AkashaReflectEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaReflect']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaReflectProviderValueResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaReflectProviderValue'] = ResolversParentTypes['AkashaReflectProviderValue']> = {
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  propertyType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaReflectStreamResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaReflectStream'] = ResolversParentTypes['AkashaReflectStream']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  beamID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  moderationID?: Resolver<Types.Maybe<ResolversTypes['CeramicStreamID']>, ParentType, ContextType>;
  reflection?: Resolver<Types.Maybe<ResolversTypes['AkashaReflect']>, ParentType, ContextType>;
  reflectionID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  status?: Resolver<Types.Maybe<ResolversTypes['AkashaReflectStreamModerationStatus']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaReflectStreamConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaReflectStreamConnection'] = ResolversParentTypes['AkashaReflectStreamConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaReflectStreamEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaReflectStreamEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaReflectStreamEdge'] = ResolversParentTypes['AkashaReflectStreamEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaReflectStream']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface CacaoHeaderTScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['CacaoHeaderT'], any> {
  name: 'CacaoHeaderT';
}

export interface CacaoSignatureTScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['CacaoSignatureT'], any> {
  name: 'CacaoSignatureT';
}

export type CeramicAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['CeramicAccount'] = ResolversParentTypes['CeramicAccount']> = {
  akashaAppList?: Resolver<Types.Maybe<ResolversTypes['AkashaAppConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaAppListArgs>>;
  akashaAppListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaAppListCountArgs>>;
  akashaAppReleaseList?: Resolver<Types.Maybe<ResolversTypes['AkashaAppReleaseConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaAppReleaseListArgs>>;
  akashaAppReleaseListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaAppReleaseListCountArgs>>;
  akashaAppsStreamList?: Resolver<Types.Maybe<ResolversTypes['AkashaAppsStreamConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaAppsStreamListArgs>>;
  akashaAppsStreamListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaAppsStreamListCountArgs>>;
  akashaBeamList?: Resolver<Types.Maybe<ResolversTypes['AkashaBeamConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaBeamListArgs>>;
  akashaBeamListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaBeamListCountArgs>>;
  akashaBeamStreamList?: Resolver<Types.Maybe<ResolversTypes['AkashaBeamStreamConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaBeamStreamListArgs>>;
  akashaBeamStreamListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaBeamStreamListCountArgs>>;
  akashaBlockStorageList?: Resolver<Types.Maybe<ResolversTypes['AkashaBlockStorageConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaBlockStorageListArgs>>;
  akashaBlockStorageListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaBlockStorageListCountArgs>>;
  akashaContentBlockList?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlockConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaContentBlockListArgs>>;
  akashaContentBlockListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaContentBlockListCountArgs>>;
  akashaContentBlockStreamList?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlockStreamConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaContentBlockStreamListArgs>>;
  akashaContentBlockStreamListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaContentBlockStreamListCountArgs>>;
  akashaFollowList?: Resolver<Types.Maybe<ResolversTypes['AkashaFollowConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaFollowListArgs>>;
  akashaFollowListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaFollowListCountArgs>>;
  akashaIndexedStreamList?: Resolver<Types.Maybe<ResolversTypes['AkashaIndexedStreamConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaIndexedStreamListArgs>>;
  akashaIndexedStreamListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaIndexedStreamListCountArgs>>;
  akashaInterestsStreamList?: Resolver<Types.Maybe<ResolversTypes['AkashaInterestsStreamConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaInterestsStreamListArgs>>;
  akashaInterestsStreamListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaInterestsStreamListCountArgs>>;
  akashaProfile?: Resolver<Types.Maybe<ResolversTypes['AkashaProfile']>, ParentType, ContextType>;
  akashaProfileInterests?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileInterests']>, ParentType, ContextType>;
  akashaProfileStreamList?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileStreamConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaProfileStreamListArgs>>;
  akashaProfileStreamListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaProfileStreamListCountArgs>>;
  akashaReflectList?: Resolver<Types.Maybe<ResolversTypes['AkashaReflectConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaReflectListArgs>>;
  akashaReflectListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaReflectListCountArgs>>;
  akashaReflectStreamList?: Resolver<Types.Maybe<ResolversTypes['AkashaReflectStreamConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaReflectStreamListArgs>>;
  akashaReflectStreamListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaReflectStreamListCountArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isViewer?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
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

export type CreateAkashaAppReleasePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAkashaAppReleasePayload'] = ResolversParentTypes['CreateAkashaAppReleasePayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaAppRelease'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateAkashaAppReleasePayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateAkashaAppsStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAkashaAppsStreamPayload'] = ResolversParentTypes['CreateAkashaAppsStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaAppsStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateAkashaAppsStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateAkashaBeamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAkashaBeamPayload'] = ResolversParentTypes['CreateAkashaBeamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaBeam'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateAkashaBeamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateAkashaBeamStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAkashaBeamStreamPayload'] = ResolversParentTypes['CreateAkashaBeamStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaBeamStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateAkashaBeamStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateAkashaBlockStoragePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAkashaBlockStoragePayload'] = ResolversParentTypes['CreateAkashaBlockStoragePayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaBlockStorage'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateAkashaBlockStoragePayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateAkashaContentBlockPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAkashaContentBlockPayload'] = ResolversParentTypes['CreateAkashaContentBlockPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaContentBlock'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateAkashaContentBlockPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateAkashaContentBlockStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAkashaContentBlockStreamPayload'] = ResolversParentTypes['CreateAkashaContentBlockStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaContentBlockStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateAkashaContentBlockStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateAkashaFollowPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAkashaFollowPayload'] = ResolversParentTypes['CreateAkashaFollowPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaFollow'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateAkashaFollowPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateAkashaIndexedStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAkashaIndexedStreamPayload'] = ResolversParentTypes['CreateAkashaIndexedStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaIndexedStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateAkashaIndexedStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateAkashaInterestsStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAkashaInterestsStreamPayload'] = ResolversParentTypes['CreateAkashaInterestsStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaInterestsStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateAkashaInterestsStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateAkashaProfileInterestsPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAkashaProfileInterestsPayload'] = ResolversParentTypes['CreateAkashaProfileInterestsPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaProfileInterests'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateAkashaProfileInterestsPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateAkashaProfilePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAkashaProfilePayload'] = ResolversParentTypes['CreateAkashaProfilePayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaProfile'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateAkashaProfilePayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateAkashaProfileStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAkashaProfileStreamPayload'] = ResolversParentTypes['CreateAkashaProfileStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaProfileStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateAkashaProfileStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateAkashaReflectPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAkashaReflectPayload'] = ResolversParentTypes['CreateAkashaReflectPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaReflect'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateAkashaReflectPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateAkashaReflectStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAkashaReflectStreamPayload'] = ResolversParentTypes['CreateAkashaReflectStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaReflectStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateAkashaReflectStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DID'], any> {
  name: 'DID';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type IndexAppPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['IndexAppPayload'] = ResolversParentTypes['IndexAppPayload']> = {
  document?: Resolver<Types.Maybe<ResolversTypes['IndexAppPayloadDocument']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IndexAppPayloadDocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['IndexAppPayloadDocument'] = ResolversParentTypes['IndexAppPayloadDocument']> = {
  applicationID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IndexBeamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['IndexBeamPayload'] = ResolversParentTypes['IndexBeamPayload']> = {
  document?: Resolver<Types.Maybe<ResolversTypes['IndexBeamPayloadDocument']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IndexBeamPayloadDocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['IndexBeamPayloadDocument'] = ResolversParentTypes['IndexBeamPayloadDocument']> = {
  beamID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IndexContentBlockPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['IndexContentBlockPayload'] = ResolversParentTypes['IndexContentBlockPayload']> = {
  document?: Resolver<Types.Maybe<ResolversTypes['IndexContentBlockPayloadDocument']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IndexContentBlockPayloadDocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['IndexContentBlockPayloadDocument'] = ResolversParentTypes['IndexContentBlockPayloadDocument']> = {
  blockID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IndexInterestPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['IndexInterestPayload'] = ResolversParentTypes['IndexInterestPayload']> = {
  document?: Resolver<Types.Maybe<ResolversTypes['IndexInterestPayloadDocument']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IndexInterestPayloadDocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['IndexInterestPayloadDocument'] = ResolversParentTypes['IndexInterestPayloadDocument']> = {
  labelType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IndexProfilePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['IndexProfilePayload'] = ResolversParentTypes['IndexProfilePayload']> = {
  document?: Resolver<Types.Maybe<ResolversTypes['IndexProfilePayloadDocument']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IndexProfilePayloadDocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['IndexProfilePayloadDocument'] = ResolversParentTypes['IndexProfilePayloadDocument']> = {
  profileID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IndexReflectPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['IndexReflectPayload'] = ResolversParentTypes['IndexReflectPayload']> = {
  document?: Resolver<Types.Maybe<ResolversTypes['IndexReflectPayloadDocument']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type IndexReflectPayloadDocumentResolvers<ContextType = any, ParentType extends ResolversParentTypes['IndexReflectPayloadDocument'] = ResolversParentTypes['IndexReflectPayloadDocument']> = {
  reflectionID?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface InterPlanetaryCidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['InterPlanetaryCID'], any> {
  name: 'InterPlanetaryCID';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAkashaApp?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaAppPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaAppArgs, 'input'>>;
  createAkashaAppRelease?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaAppReleasePayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaAppReleaseArgs, 'input'>>;
  createAkashaAppsStream?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaAppsStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaAppsStreamArgs, 'input'>>;
  createAkashaBeam?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaBeamPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaBeamArgs, 'input'>>;
  createAkashaBeamStream?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaBeamStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaBeamStreamArgs, 'input'>>;
  createAkashaBlockStorage?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaBlockStoragePayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaBlockStorageArgs, 'input'>>;
  createAkashaContentBlock?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaContentBlockPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaContentBlockArgs, 'input'>>;
  createAkashaContentBlockStream?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaContentBlockStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaContentBlockStreamArgs, 'input'>>;
  createAkashaFollow?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaFollowPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaFollowArgs, 'input'>>;
  createAkashaIndexedStream?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaIndexedStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaIndexedStreamArgs, 'input'>>;
  createAkashaInterestsStream?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaInterestsStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaInterestsStreamArgs, 'input'>>;
  createAkashaProfile?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaProfilePayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaProfileArgs, 'input'>>;
  createAkashaProfileInterests?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaProfileInterestsPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaProfileInterestsArgs, 'input'>>;
  createAkashaProfileStream?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaProfileStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaProfileStreamArgs, 'input'>>;
  createAkashaReflect?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaReflectPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaReflectArgs, 'input'>>;
  createAkashaReflectStream?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaReflectStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaReflectStreamArgs, 'input'>>;
  indexApp?: Resolver<Types.Maybe<ResolversTypes['IndexAppPayload']>, ParentType, ContextType, Partial<Types.MutationIndexAppArgs>>;
  indexBeam?: Resolver<Types.Maybe<ResolversTypes['IndexBeamPayload']>, ParentType, ContextType, Partial<Types.MutationIndexBeamArgs>>;
  indexContentBlock?: Resolver<Types.Maybe<ResolversTypes['IndexContentBlockPayload']>, ParentType, ContextType, Partial<Types.MutationIndexContentBlockArgs>>;
  indexInterest?: Resolver<Types.Maybe<ResolversTypes['IndexInterestPayload']>, ParentType, ContextType, Partial<Types.MutationIndexInterestArgs>>;
  indexProfile?: Resolver<Types.Maybe<ResolversTypes['IndexProfilePayload']>, ParentType, ContextType, Partial<Types.MutationIndexProfileArgs>>;
  indexReflection?: Resolver<Types.Maybe<ResolversTypes['IndexReflectPayload']>, ParentType, ContextType, Partial<Types.MutationIndexReflectionArgs>>;
  updateAkashaApp?: Resolver<Types.Maybe<ResolversTypes['UpdateAkashaAppPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateAkashaAppArgs, 'input'>>;
  updateAkashaAppRelease?: Resolver<Types.Maybe<ResolversTypes['UpdateAkashaAppReleasePayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateAkashaAppReleaseArgs, 'input'>>;
  updateAkashaAppsStream?: Resolver<Types.Maybe<ResolversTypes['UpdateAkashaAppsStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateAkashaAppsStreamArgs, 'input'>>;
  updateAkashaBeam?: Resolver<Types.Maybe<ResolversTypes['UpdateAkashaBeamPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateAkashaBeamArgs, 'input'>>;
  updateAkashaBeamStream?: Resolver<Types.Maybe<ResolversTypes['UpdateAkashaBeamStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateAkashaBeamStreamArgs, 'input'>>;
  updateAkashaBlockStorage?: Resolver<Types.Maybe<ResolversTypes['UpdateAkashaBlockStoragePayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateAkashaBlockStorageArgs, 'input'>>;
  updateAkashaContentBlock?: Resolver<Types.Maybe<ResolversTypes['UpdateAkashaContentBlockPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateAkashaContentBlockArgs, 'input'>>;
  updateAkashaContentBlockStream?: Resolver<Types.Maybe<ResolversTypes['UpdateAkashaContentBlockStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateAkashaContentBlockStreamArgs, 'input'>>;
  updateAkashaFollow?: Resolver<Types.Maybe<ResolversTypes['UpdateAkashaFollowPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateAkashaFollowArgs, 'input'>>;
  updateAkashaIndexedStream?: Resolver<Types.Maybe<ResolversTypes['UpdateAkashaIndexedStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateAkashaIndexedStreamArgs, 'input'>>;
  updateAkashaInterestsStream?: Resolver<Types.Maybe<ResolversTypes['UpdateAkashaInterestsStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateAkashaInterestsStreamArgs, 'input'>>;
  updateAkashaProfile?: Resolver<Types.Maybe<ResolversTypes['UpdateAkashaProfilePayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateAkashaProfileArgs, 'input'>>;
  updateAkashaProfileInterests?: Resolver<Types.Maybe<ResolversTypes['UpdateAkashaProfileInterestsPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateAkashaProfileInterestsArgs, 'input'>>;
  updateAkashaProfileStream?: Resolver<Types.Maybe<ResolversTypes['UpdateAkashaProfileStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateAkashaProfileStreamArgs, 'input'>>;
  updateAkashaReflect?: Resolver<Types.Maybe<ResolversTypes['UpdateAkashaReflectPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateAkashaReflectArgs, 'input'>>;
  updateAkashaReflectStream?: Resolver<Types.Maybe<ResolversTypes['UpdateAkashaReflectStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationUpdateAkashaReflectStreamArgs, 'input'>>;
};

export type NodeResolvers<ContextType = any, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType: TypeResolveFn<'AkashaApp' | 'AkashaAppRelease' | 'AkashaAppsStream' | 'AkashaBeam' | 'AkashaBeamStream' | 'AkashaBlockStorage' | 'AkashaContentBlock' | 'AkashaContentBlockStream' | 'AkashaFollow' | 'AkashaIndexedStream' | 'AkashaInterestsStream' | 'AkashaProfile' | 'AkashaProfileInterests' | 'AkashaProfileStream' | 'AkashaReflect' | 'AkashaReflectStream' | 'CeramicAccount', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  akashaAppCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaAppCountArgs>>;
  akashaAppIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaAppConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaAppIndexArgs>>;
  akashaAppReleaseCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaAppReleaseCountArgs>>;
  akashaAppReleaseIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaAppReleaseConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaAppReleaseIndexArgs>>;
  akashaAppsStreamCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaAppsStreamCountArgs>>;
  akashaAppsStreamIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaAppsStreamConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaAppsStreamIndexArgs>>;
  akashaBeamCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaBeamCountArgs>>;
  akashaBeamIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaBeamConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaBeamIndexArgs>>;
  akashaBeamStreamCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaBeamStreamCountArgs>>;
  akashaBeamStreamIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaBeamStreamConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaBeamStreamIndexArgs>>;
  akashaBlockStorageCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaBlockStorageCountArgs>>;
  akashaBlockStorageIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaBlockStorageConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaBlockStorageIndexArgs>>;
  akashaContentBlockCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaContentBlockCountArgs>>;
  akashaContentBlockIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlockConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaContentBlockIndexArgs>>;
  akashaContentBlockStreamCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaContentBlockStreamCountArgs>>;
  akashaContentBlockStreamIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlockStreamConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaContentBlockStreamIndexArgs>>;
  akashaFollowCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaFollowCountArgs>>;
  akashaFollowIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaFollowConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaFollowIndexArgs>>;
  akashaIndexedStreamCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaIndexedStreamCountArgs>>;
  akashaIndexedStreamIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaIndexedStreamConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaIndexedStreamIndexArgs>>;
  akashaInterestsStreamCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaInterestsStreamCountArgs>>;
  akashaInterestsStreamIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaInterestsStreamConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaInterestsStreamIndexArgs>>;
  akashaProfileCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaProfileCountArgs>>;
  akashaProfileIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaProfileIndexArgs>>;
  akashaProfileInterestsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  akashaProfileInterestsIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileInterestsConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaProfileInterestsIndexArgs>>;
  akashaProfileStreamCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaProfileStreamCountArgs>>;
  akashaProfileStreamIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileStreamConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaProfileStreamIndexArgs>>;
  akashaReflectCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaReflectCountArgs>>;
  akashaReflectIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaReflectConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaReflectIndexArgs>>;
  akashaReflectStreamCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaReflectStreamCountArgs>>;
  akashaReflectStreamIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaReflectStreamConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaReflectStreamIndexArgs>>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.QueryNodeArgs, 'id'>>;
  nodes?: Resolver<Array<Types.Maybe<ResolversTypes['Node']>>, ParentType, ContextType, RequireFields<Types.QueryNodesArgs, 'ids'>>;
  serviceStatus?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
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

export type UpdateAkashaAppReleasePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAkashaAppReleasePayload'] = ResolversParentTypes['UpdateAkashaAppReleasePayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaAppRelease'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateAkashaAppReleasePayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateAkashaAppsStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAkashaAppsStreamPayload'] = ResolversParentTypes['UpdateAkashaAppsStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaAppsStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateAkashaAppsStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateAkashaBeamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAkashaBeamPayload'] = ResolversParentTypes['UpdateAkashaBeamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaBeam'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateAkashaBeamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateAkashaBeamStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAkashaBeamStreamPayload'] = ResolversParentTypes['UpdateAkashaBeamStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaBeamStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateAkashaBeamStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateAkashaBlockStoragePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAkashaBlockStoragePayload'] = ResolversParentTypes['UpdateAkashaBlockStoragePayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaBlockStorage'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateAkashaBlockStoragePayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateAkashaContentBlockPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAkashaContentBlockPayload'] = ResolversParentTypes['UpdateAkashaContentBlockPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaContentBlock'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateAkashaContentBlockPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateAkashaContentBlockStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAkashaContentBlockStreamPayload'] = ResolversParentTypes['UpdateAkashaContentBlockStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaContentBlockStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateAkashaContentBlockStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateAkashaFollowPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAkashaFollowPayload'] = ResolversParentTypes['UpdateAkashaFollowPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaFollow'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateAkashaFollowPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateAkashaIndexedStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAkashaIndexedStreamPayload'] = ResolversParentTypes['UpdateAkashaIndexedStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaIndexedStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateAkashaIndexedStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateAkashaInterestsStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAkashaInterestsStreamPayload'] = ResolversParentTypes['UpdateAkashaInterestsStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaInterestsStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateAkashaInterestsStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateAkashaProfileInterestsPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAkashaProfileInterestsPayload'] = ResolversParentTypes['UpdateAkashaProfileInterestsPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaProfileInterests'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateAkashaProfileInterestsPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateAkashaProfilePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAkashaProfilePayload'] = ResolversParentTypes['UpdateAkashaProfilePayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaProfile'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateAkashaProfilePayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateAkashaProfileStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAkashaProfileStreamPayload'] = ResolversParentTypes['UpdateAkashaProfileStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaProfileStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateAkashaProfileStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateAkashaReflectPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAkashaReflectPayload'] = ResolversParentTypes['UpdateAkashaReflectPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaReflect'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateAkashaReflectPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateAkashaReflectStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['UpdateAkashaReflectStreamPayload'] = ResolversParentTypes['UpdateAkashaReflectStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaReflectStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.UpdateAkashaReflectStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface Join__FieldSetScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['join__FieldSet'], any> {
  name: 'join__FieldSet';
}

export interface Link__ImportScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['link__Import'], any> {
  name: 'link__Import';
}

export type Resolvers<ContextType = any> = {
  AkashaApp?: AkashaAppResolvers<ContextType>;
  AkashaAppConnection?: AkashaAppConnectionResolvers<ContextType>;
  AkashaAppEdge?: AkashaAppEdgeResolvers<ContextType>;
  AkashaAppRelease?: AkashaAppReleaseResolvers<ContextType>;
  AkashaAppReleaseConnection?: AkashaAppReleaseConnectionResolvers<ContextType>;
  AkashaAppReleaseEdge?: AkashaAppReleaseEdgeResolvers<ContextType>;
  AkashaAppsStream?: AkashaAppsStreamResolvers<ContextType>;
  AkashaAppsStreamConnection?: AkashaAppsStreamConnectionResolvers<ContextType>;
  AkashaAppsStreamEdge?: AkashaAppsStreamEdgeResolvers<ContextType>;
  AkashaBeam?: AkashaBeamResolvers<ContextType>;
  AkashaBeamBlockRecord?: AkashaBeamBlockRecordResolvers<ContextType>;
  AkashaBeamConnection?: AkashaBeamConnectionResolvers<ContextType>;
  AkashaBeamEdge?: AkashaBeamEdgeResolvers<ContextType>;
  AkashaBeamEmbeddedType?: AkashaBeamEmbeddedTypeResolvers<ContextType>;
  AkashaBeamLabeled?: AkashaBeamLabeledResolvers<ContextType>;
  AkashaBeamStream?: AkashaBeamStreamResolvers<ContextType>;
  AkashaBeamStreamConnection?: AkashaBeamStreamConnectionResolvers<ContextType>;
  AkashaBeamStreamEdge?: AkashaBeamStreamEdgeResolvers<ContextType>;
  AkashaBlockStorage?: AkashaBlockStorageResolvers<ContextType>;
  AkashaBlockStorageConnection?: AkashaBlockStorageConnectionResolvers<ContextType>;
  AkashaBlockStorageEdge?: AkashaBlockStorageEdgeResolvers<ContextType>;
  AkashaBlockStorageLabeledValue?: AkashaBlockStorageLabeledValueResolvers<ContextType>;
  AkashaContentBlock?: AkashaContentBlockResolvers<ContextType>;
  AkashaContentBlockConnection?: AkashaContentBlockConnectionResolvers<ContextType>;
  AkashaContentBlockEdge?: AkashaContentBlockEdgeResolvers<ContextType>;
  AkashaContentBlockLabeledValue?: AkashaContentBlockLabeledValueResolvers<ContextType>;
  AkashaContentBlockStream?: AkashaContentBlockStreamResolvers<ContextType>;
  AkashaContentBlockStreamConnection?: AkashaContentBlockStreamConnectionResolvers<ContextType>;
  AkashaContentBlockStreamEdge?: AkashaContentBlockStreamEdgeResolvers<ContextType>;
  AkashaFollow?: AkashaFollowResolvers<ContextType>;
  AkashaFollowConnection?: AkashaFollowConnectionResolvers<ContextType>;
  AkashaFollowEdge?: AkashaFollowEdgeResolvers<ContextType>;
  AkashaIndexedStream?: AkashaIndexedStreamResolvers<ContextType>;
  AkashaIndexedStreamConnection?: AkashaIndexedStreamConnectionResolvers<ContextType>;
  AkashaIndexedStreamEdge?: AkashaIndexedStreamEdgeResolvers<ContextType>;
  AkashaInterestsStream?: AkashaInterestsStreamResolvers<ContextType>;
  AkashaInterestsStreamConnection?: AkashaInterestsStreamConnectionResolvers<ContextType>;
  AkashaInterestsStreamEdge?: AkashaInterestsStreamEdgeResolvers<ContextType>;
  AkashaProfile?: AkashaProfileResolvers<ContextType>;
  AkashaProfileConnection?: AkashaProfileConnectionResolvers<ContextType>;
  AkashaProfileEdge?: AkashaProfileEdgeResolvers<ContextType>;
  AkashaProfileImageSource?: AkashaProfileImageSourceResolvers<ContextType>;
  AkashaProfileImageVersions?: AkashaProfileImageVersionsResolvers<ContextType>;
  AkashaProfileInterests?: AkashaProfileInterestsResolvers<ContextType>;
  AkashaProfileInterestsConnection?: AkashaProfileInterestsConnectionResolvers<ContextType>;
  AkashaProfileInterestsEdge?: AkashaProfileInterestsEdgeResolvers<ContextType>;
  AkashaProfileInterestsLabeled?: AkashaProfileInterestsLabeledResolvers<ContextType>;
  AkashaProfileLinkSource?: AkashaProfileLinkSourceResolvers<ContextType>;
  AkashaProfileStream?: AkashaProfileStreamResolvers<ContextType>;
  AkashaProfileStreamConnection?: AkashaProfileStreamConnectionResolvers<ContextType>;
  AkashaProfileStreamEdge?: AkashaProfileStreamEdgeResolvers<ContextType>;
  AkashaReflect?: AkashaReflectResolvers<ContextType>;
  AkashaReflectConnection?: AkashaReflectConnectionResolvers<ContextType>;
  AkashaReflectEdge?: AkashaReflectEdgeResolvers<ContextType>;
  AkashaReflectProviderValue?: AkashaReflectProviderValueResolvers<ContextType>;
  AkashaReflectStream?: AkashaReflectStreamResolvers<ContextType>;
  AkashaReflectStreamConnection?: AkashaReflectStreamConnectionResolvers<ContextType>;
  AkashaReflectStreamEdge?: AkashaReflectStreamEdgeResolvers<ContextType>;
  CacaoHeaderT?: GraphQLScalarType;
  CacaoSignatureT?: GraphQLScalarType;
  CeramicAccount?: CeramicAccountResolvers<ContextType>;
  CeramicCommitID?: GraphQLScalarType;
  CeramicStreamID?: GraphQLScalarType;
  CreateAkashaAppPayload?: CreateAkashaAppPayloadResolvers<ContextType>;
  CreateAkashaAppReleasePayload?: CreateAkashaAppReleasePayloadResolvers<ContextType>;
  CreateAkashaAppsStreamPayload?: CreateAkashaAppsStreamPayloadResolvers<ContextType>;
  CreateAkashaBeamPayload?: CreateAkashaBeamPayloadResolvers<ContextType>;
  CreateAkashaBeamStreamPayload?: CreateAkashaBeamStreamPayloadResolvers<ContextType>;
  CreateAkashaBlockStoragePayload?: CreateAkashaBlockStoragePayloadResolvers<ContextType>;
  CreateAkashaContentBlockPayload?: CreateAkashaContentBlockPayloadResolvers<ContextType>;
  CreateAkashaContentBlockStreamPayload?: CreateAkashaContentBlockStreamPayloadResolvers<ContextType>;
  CreateAkashaFollowPayload?: CreateAkashaFollowPayloadResolvers<ContextType>;
  CreateAkashaIndexedStreamPayload?: CreateAkashaIndexedStreamPayloadResolvers<ContextType>;
  CreateAkashaInterestsStreamPayload?: CreateAkashaInterestsStreamPayloadResolvers<ContextType>;
  CreateAkashaProfileInterestsPayload?: CreateAkashaProfileInterestsPayloadResolvers<ContextType>;
  CreateAkashaProfilePayload?: CreateAkashaProfilePayloadResolvers<ContextType>;
  CreateAkashaProfileStreamPayload?: CreateAkashaProfileStreamPayloadResolvers<ContextType>;
  CreateAkashaReflectPayload?: CreateAkashaReflectPayloadResolvers<ContextType>;
  CreateAkashaReflectStreamPayload?: CreateAkashaReflectStreamPayloadResolvers<ContextType>;
  DID?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  IndexAppPayload?: IndexAppPayloadResolvers<ContextType>;
  IndexAppPayloadDocument?: IndexAppPayloadDocumentResolvers<ContextType>;
  IndexBeamPayload?: IndexBeamPayloadResolvers<ContextType>;
  IndexBeamPayloadDocument?: IndexBeamPayloadDocumentResolvers<ContextType>;
  IndexContentBlockPayload?: IndexContentBlockPayloadResolvers<ContextType>;
  IndexContentBlockPayloadDocument?: IndexContentBlockPayloadDocumentResolvers<ContextType>;
  IndexInterestPayload?: IndexInterestPayloadResolvers<ContextType>;
  IndexInterestPayloadDocument?: IndexInterestPayloadDocumentResolvers<ContextType>;
  IndexProfilePayload?: IndexProfilePayloadResolvers<ContextType>;
  IndexProfilePayloadDocument?: IndexProfilePayloadDocumentResolvers<ContextType>;
  IndexReflectPayload?: IndexReflectPayloadResolvers<ContextType>;
  IndexReflectPayloadDocument?: IndexReflectPayloadDocumentResolvers<ContextType>;
  InterPlanetaryCID?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  URI?: GraphQLScalarType;
  UpdateAkashaAppPayload?: UpdateAkashaAppPayloadResolvers<ContextType>;
  UpdateAkashaAppReleasePayload?: UpdateAkashaAppReleasePayloadResolvers<ContextType>;
  UpdateAkashaAppsStreamPayload?: UpdateAkashaAppsStreamPayloadResolvers<ContextType>;
  UpdateAkashaBeamPayload?: UpdateAkashaBeamPayloadResolvers<ContextType>;
  UpdateAkashaBeamStreamPayload?: UpdateAkashaBeamStreamPayloadResolvers<ContextType>;
  UpdateAkashaBlockStoragePayload?: UpdateAkashaBlockStoragePayloadResolvers<ContextType>;
  UpdateAkashaContentBlockPayload?: UpdateAkashaContentBlockPayloadResolvers<ContextType>;
  UpdateAkashaContentBlockStreamPayload?: UpdateAkashaContentBlockStreamPayloadResolvers<ContextType>;
  UpdateAkashaFollowPayload?: UpdateAkashaFollowPayloadResolvers<ContextType>;
  UpdateAkashaIndexedStreamPayload?: UpdateAkashaIndexedStreamPayloadResolvers<ContextType>;
  UpdateAkashaInterestsStreamPayload?: UpdateAkashaInterestsStreamPayloadResolvers<ContextType>;
  UpdateAkashaProfileInterestsPayload?: UpdateAkashaProfileInterestsPayloadResolvers<ContextType>;
  UpdateAkashaProfilePayload?: UpdateAkashaProfilePayloadResolvers<ContextType>;
  UpdateAkashaProfileStreamPayload?: UpdateAkashaProfileStreamPayloadResolvers<ContextType>;
  UpdateAkashaReflectPayload?: UpdateAkashaReflectPayloadResolvers<ContextType>;
  UpdateAkashaReflectStreamPayload?: UpdateAkashaReflectStreamPayloadResolvers<ContextType>;
  join__FieldSet?: GraphQLScalarType;
  link__Import?: GraphQLScalarType;
};

export type DirectiveResolvers<ContextType = any> = {
  join__enumValue?: Join__EnumValueDirectiveResolver<any, any, ContextType>;
  join__field?: Join__FieldDirectiveResolver<any, any, ContextType>;
  join__graph?: Join__GraphDirectiveResolver<any, any, ContextType>;
  join__implements?: Join__ImplementsDirectiveResolver<any, any, ContextType>;
  join__type?: Join__TypeDirectiveResolver<any, any, ContextType>;
  join__unionMember?: Join__UnionMemberDirectiveResolver<any, any, ContextType>;
  link?: LinkDirectiveResolver<any, any, ContextType>;
};
