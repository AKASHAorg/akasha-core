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
  AkashaAppInterface: ( Types.AkashaApp );
  AkashaAppReleaseInterface: ( Types.AkashaAppRelease );
  AkashaBeamInterface: ( Types.AkashaBeam );
  AkashaContentBlockInterface: ( Types.AkashaBlockStorage ) | ( Types.AkashaContentBlock );
  AkashaFollowInterface: ( Types.AkashaFollow );
  AkashaIndexStreamInterface: ( Types.AkashaAppsStream ) | ( Types.AkashaBeamStream ) | ( Types.AkashaContentBlockStream ) | ( Types.AkashaIndexedStream ) | ( Types.AkashaInterestsStream ) | ( Types.AkashaProfileStream ) | ( Types.AkashaReflectStream );
  AkashaProfileInterestsInterface: ( Types.AkashaProfileInterests );
  AkashaProfileInterface: ( Types.AkashaProfile );
  AkashaReflectInterface: ( Types.AkashaReflect );
  Node: ( Types.AkashaApp ) | ( Types.AkashaAppRelease ) | ( Types.AkashaAppsStream ) | ( Types.AkashaBeam ) | ( Types.AkashaBeamStream ) | ( Types.AkashaBlockStorage ) | ( Types.AkashaContentBlock ) | ( Types.AkashaContentBlockStream ) | ( Types.AkashaFollow ) | ( Types.AkashaIndexedStream ) | ( Types.AkashaInterestsStream ) | ( Types.AkashaProfile ) | ( Types.AkashaProfileInterests ) | ( Types.AkashaProfileStream ) | ( Types.AkashaReflect ) | ( Types.AkashaReflectStream ) | ( Types.CeramicAccount );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AkashaApp: ResolverTypeWrapper<Types.AkashaApp>;
  String: ResolverTypeWrapper<Types.Scalars['String']['output']>;
  ID: ResolverTypeWrapper<Types.Scalars['ID']['output']>;
  Boolean: ResolverTypeWrapper<Types.Scalars['Boolean']['output']>;
  Int: ResolverTypeWrapper<Types.Scalars['Int']['output']>;
  AkashaAppApplicationType: Types.AkashaAppApplicationType;
  AkashaAppApplicationTypeValueFilterInput: Types.AkashaAppApplicationTypeValueFilterInput;
  AkashaAppConnection: ResolverTypeWrapper<Types.AkashaAppConnection>;
  AkashaAppEdge: ResolverTypeWrapper<Types.AkashaAppEdge>;
  AkashaAppFiltersInput: Types.AkashaAppFiltersInput;
  AkashaAppInput: Types.AkashaAppInput;
  AkashaAppInterface: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AkashaAppInterface']>;
  AkashaAppInterfaceConnection: ResolverTypeWrapper<Types.AkashaAppInterfaceConnection>;
  AkashaAppInterfaceEdge: ResolverTypeWrapper<Types.AkashaAppInterfaceEdge>;
  AkashaAppInterfaceFiltersInput: Types.AkashaAppInterfaceFiltersInput;
  AkashaAppInterfaceObjectFilterInput: Types.AkashaAppInterfaceObjectFilterInput;
  AkashaAppInterfaceSortingInput: Types.AkashaAppInterfaceSortingInput;
  AkashaAppObjectFilterInput: Types.AkashaAppObjectFilterInput;
  AkashaAppRelease: ResolverTypeWrapper<Types.AkashaAppRelease>;
  AkashaAppReleaseConnection: ResolverTypeWrapper<Types.AkashaAppReleaseConnection>;
  AkashaAppReleaseEdge: ResolverTypeWrapper<Types.AkashaAppReleaseEdge>;
  AkashaAppReleaseFiltersInput: Types.AkashaAppReleaseFiltersInput;
  AkashaAppReleaseInput: Types.AkashaAppReleaseInput;
  AkashaAppReleaseInterface: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AkashaAppReleaseInterface']>;
  AkashaAppReleaseInterfaceConnection: ResolverTypeWrapper<Types.AkashaAppReleaseInterfaceConnection>;
  AkashaAppReleaseInterfaceEdge: ResolverTypeWrapper<Types.AkashaAppReleaseInterfaceEdge>;
  AkashaAppReleaseInterfaceFiltersInput: Types.AkashaAppReleaseInterfaceFiltersInput;
  AkashaAppReleaseInterfaceObjectFilterInput: Types.AkashaAppReleaseInterfaceObjectFilterInput;
  AkashaAppReleaseInterfaceSortingInput: Types.AkashaAppReleaseInterfaceSortingInput;
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
  AkashaBeamConnection: ResolverTypeWrapper<Types.AkashaBeamConnection>;
  AkashaBeamEdge: ResolverTypeWrapper<Types.AkashaBeamEdge>;
  AkashaBeamFiltersInput: Types.AkashaBeamFiltersInput;
  AkashaBeamInput: Types.AkashaBeamInput;
  AkashaBeamInterface: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AkashaBeamInterface']>;
  AkashaBeamInterfaceConnection: ResolverTypeWrapper<Types.AkashaBeamInterfaceConnection>;
  AkashaBeamInterfaceEdge: ResolverTypeWrapper<Types.AkashaBeamInterfaceEdge>;
  AkashaBeamInterfaceFiltersInput: Types.AkashaBeamInterfaceFiltersInput;
  AkashaBeamInterfaceObjectFilterInput: Types.AkashaBeamInterfaceObjectFilterInput;
  AkashaBeamInterfaceSortingInput: Types.AkashaBeamInterfaceSortingInput;
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
  AkashaBlockStorageBlockDef: Types.AkashaBlockStorageBlockDef;
  AkashaBlockStorageBlockDefValueFilterInput: Types.AkashaBlockStorageBlockDefValueFilterInput;
  AkashaBlockStorageConnection: ResolverTypeWrapper<Types.AkashaBlockStorageConnection>;
  AkashaBlockStorageEdge: ResolverTypeWrapper<Types.AkashaBlockStorageEdge>;
  AkashaBlockStorageFiltersInput: Types.AkashaBlockStorageFiltersInput;
  AkashaBlockStorageInput: Types.AkashaBlockStorageInput;
  AkashaBlockStorageObjectFilterInput: Types.AkashaBlockStorageObjectFilterInput;
  AkashaBlockStorageSortingInput: Types.AkashaBlockStorageSortingInput;
  AkashaContentBlock: ResolverTypeWrapper<Types.AkashaContentBlock>;
  AkashaContentBlockBlockDef: Types.AkashaContentBlockBlockDef;
  AkashaContentBlockBlockDefValueFilterInput: Types.AkashaContentBlockBlockDefValueFilterInput;
  AkashaContentBlockConnection: ResolverTypeWrapper<Types.AkashaContentBlockConnection>;
  AkashaContentBlockEdge: ResolverTypeWrapper<Types.AkashaContentBlockEdge>;
  AkashaContentBlockFiltersInput: Types.AkashaContentBlockFiltersInput;
  AkashaContentBlockInput: Types.AkashaContentBlockInput;
  AkashaContentBlockInterface: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AkashaContentBlockInterface']>;
  AkashaContentBlockInterfaceConnection: ResolverTypeWrapper<Types.AkashaContentBlockInterfaceConnection>;
  AkashaContentBlockInterfaceEdge: ResolverTypeWrapper<Types.AkashaContentBlockInterfaceEdge>;
  AkashaContentBlockInterfaceFiltersInput: Types.AkashaContentBlockInterfaceFiltersInput;
  AkashaContentBlockInterfaceObjectFilterInput: Types.AkashaContentBlockInterfaceObjectFilterInput;
  AkashaContentBlockInterfaceSortingInput: Types.AkashaContentBlockInterfaceSortingInput;
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
  AkashaFollowInterface: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AkashaFollowInterface']>;
  AkashaFollowInterfaceConnection: ResolverTypeWrapper<Types.AkashaFollowInterfaceConnection>;
  AkashaFollowInterfaceEdge: ResolverTypeWrapper<Types.AkashaFollowInterfaceEdge>;
  AkashaFollowInterfaceFiltersInput: Types.AkashaFollowInterfaceFiltersInput;
  AkashaFollowInterfaceObjectFilterInput: Types.AkashaFollowInterfaceObjectFilterInput;
  AkashaFollowInterfaceSortingInput: Types.AkashaFollowInterfaceSortingInput;
  AkashaFollowObjectFilterInput: Types.AkashaFollowObjectFilterInput;
  AkashaFollowSortingInput: Types.AkashaFollowSortingInput;
  AkashaIndexStreamInterface: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AkashaIndexStreamInterface']>;
  AkashaIndexStreamInterfaceConnection: ResolverTypeWrapper<Types.AkashaIndexStreamInterfaceConnection>;
  AkashaIndexStreamInterfaceEdge: ResolverTypeWrapper<Types.AkashaIndexStreamInterfaceEdge>;
  AkashaIndexStreamInterfaceFiltersInput: Types.AkashaIndexStreamInterfaceFiltersInput;
  AkashaIndexStreamInterfaceObjectFilterInput: Types.AkashaIndexStreamInterfaceObjectFilterInput;
  AkashaIndexStreamInterfaceSortingInput: Types.AkashaIndexStreamInterfaceSortingInput;
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
  AkashaProfileInput: Types.AkashaProfileInput;
  AkashaProfileInterests: ResolverTypeWrapper<Types.AkashaProfileInterests>;
  AkashaProfileInterestsConnection: ResolverTypeWrapper<Types.AkashaProfileInterestsConnection>;
  AkashaProfileInterestsEdge: ResolverTypeWrapper<Types.AkashaProfileInterestsEdge>;
  AkashaProfileInterestsInput: Types.AkashaProfileInterestsInput;
  AkashaProfileInterestsInterface: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AkashaProfileInterestsInterface']>;
  AkashaProfileInterestsInterfaceConnection: ResolverTypeWrapper<Types.AkashaProfileInterestsInterfaceConnection>;
  AkashaProfileInterestsInterfaceEdge: ResolverTypeWrapper<Types.AkashaProfileInterestsInterfaceEdge>;
  AkashaProfileInterface: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AkashaProfileInterface']>;
  AkashaProfileInterfaceConnection: ResolverTypeWrapper<Types.AkashaProfileInterfaceConnection>;
  AkashaProfileInterfaceEdge: ResolverTypeWrapper<Types.AkashaProfileInterfaceEdge>;
  AkashaProfileInterfaceFiltersInput: Types.AkashaProfileInterfaceFiltersInput;
  AkashaProfileInterfaceObjectFilterInput: Types.AkashaProfileInterfaceObjectFilterInput;
  AkashaProfileInterfaceSortingInput: Types.AkashaProfileInterfaceSortingInput;
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
  AkashaReflectInterface: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AkashaReflectInterface']>;
  AkashaReflectInterfaceConnection: ResolverTypeWrapper<Types.AkashaReflectInterfaceConnection>;
  AkashaReflectInterfaceEdge: ResolverTypeWrapper<Types.AkashaReflectInterfaceEdge>;
  AkashaReflectInterfaceFiltersInput: Types.AkashaReflectInterfaceFiltersInput;
  AkashaReflectInterfaceObjectFilterInput: Types.AkashaReflectInterfaceObjectFilterInput;
  AkashaReflectInterfaceSortingInput: Types.AkashaReflectInterfaceSortingInput;
  AkashaReflectObjectFilterInput: Types.AkashaReflectObjectFilterInput;
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
  AppImageSource: ResolverTypeWrapper<Types.AppImageSource>;
  AppImageSourceInput: Types.AppImageSourceInput;
  AppLinkSource: ResolverTypeWrapper<Types.AppLinkSource>;
  AppLinkSourceInput: Types.AppLinkSourceInput;
  AppProviderValue: ResolverTypeWrapper<Types.AppProviderValue>;
  AppProviderValueInput: Types.AppProviderValueInput;
  BeamBlockRecord: ResolverTypeWrapper<Types.BeamBlockRecord>;
  BeamBlockRecordInput: Types.BeamBlockRecordInput;
  BeamEmbeddedType: ResolverTypeWrapper<Types.BeamEmbeddedType>;
  BeamEmbeddedTypeInput: Types.BeamEmbeddedTypeInput;
  BeamLabeled: ResolverTypeWrapper<Types.BeamLabeled>;
  BeamLabeledInput: Types.BeamLabeledInput;
  BlockLabeledValue: ResolverTypeWrapper<Types.BlockLabeledValue>;
  BlockLabeledValueInput: Types.BlockLabeledValueInput;
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
  CreateAkashaBeamInput: Types.CreateAkashaBeamInput;
  CreateAkashaBeamPayload: ResolverTypeWrapper<Types.CreateAkashaBeamPayload>;
  CreateAkashaContentBlockInput: Types.CreateAkashaContentBlockInput;
  CreateAkashaContentBlockPayload: ResolverTypeWrapper<Types.CreateAkashaContentBlockPayload>;
  CreateAkashaProfileInput: Types.CreateAkashaProfileInput;
  CreateAkashaProfileInterestsInput: Types.CreateAkashaProfileInterestsInput;
  CreateAkashaProfileInterestsPayload: ResolverTypeWrapper<Types.CreateAkashaProfileInterestsPayload>;
  CreateAkashaProfilePayload: ResolverTypeWrapper<Types.CreateAkashaProfilePayload>;
  CreateAkashaReflectInput: Types.CreateAkashaReflectInput;
  CreateAkashaReflectPayload: ResolverTypeWrapper<Types.CreateAkashaReflectPayload>;
  CreateOptionsInput: Types.CreateOptionsInput;
  DID: ResolverTypeWrapper<Types.Scalars['DID']['output']>;
  DID_JWS: Types.Did_Jws;
  DateTime: ResolverTypeWrapper<Types.Scalars['DateTime']['output']>;
  EnableIndexingAkashaAppInput: Types.EnableIndexingAkashaAppInput;
  EnableIndexingAkashaAppPayload: ResolverTypeWrapper<Types.EnableIndexingAkashaAppPayload>;
  EnableIndexingAkashaAppReleaseInput: Types.EnableIndexingAkashaAppReleaseInput;
  EnableIndexingAkashaAppReleasePayload: ResolverTypeWrapper<Types.EnableIndexingAkashaAppReleasePayload>;
  EnableIndexingAkashaAppsStreamInput: Types.EnableIndexingAkashaAppsStreamInput;
  EnableIndexingAkashaAppsStreamPayload: ResolverTypeWrapper<Types.EnableIndexingAkashaAppsStreamPayload>;
  EnableIndexingAkashaBeamInput: Types.EnableIndexingAkashaBeamInput;
  EnableIndexingAkashaBeamPayload: ResolverTypeWrapper<Types.EnableIndexingAkashaBeamPayload>;
  EnableIndexingAkashaBeamStreamInput: Types.EnableIndexingAkashaBeamStreamInput;
  EnableIndexingAkashaBeamStreamPayload: ResolverTypeWrapper<Types.EnableIndexingAkashaBeamStreamPayload>;
  EnableIndexingAkashaBlockStorageInput: Types.EnableIndexingAkashaBlockStorageInput;
  EnableIndexingAkashaBlockStoragePayload: ResolverTypeWrapper<Types.EnableIndexingAkashaBlockStoragePayload>;
  EnableIndexingAkashaContentBlockInput: Types.EnableIndexingAkashaContentBlockInput;
  EnableIndexingAkashaContentBlockPayload: ResolverTypeWrapper<Types.EnableIndexingAkashaContentBlockPayload>;
  EnableIndexingAkashaContentBlockStreamInput: Types.EnableIndexingAkashaContentBlockStreamInput;
  EnableIndexingAkashaContentBlockStreamPayload: ResolverTypeWrapper<Types.EnableIndexingAkashaContentBlockStreamPayload>;
  EnableIndexingAkashaFollowInput: Types.EnableIndexingAkashaFollowInput;
  EnableIndexingAkashaFollowPayload: ResolverTypeWrapper<Types.EnableIndexingAkashaFollowPayload>;
  EnableIndexingAkashaIndexedStreamInput: Types.EnableIndexingAkashaIndexedStreamInput;
  EnableIndexingAkashaIndexedStreamPayload: ResolverTypeWrapper<Types.EnableIndexingAkashaIndexedStreamPayload>;
  EnableIndexingAkashaInterestsStreamInput: Types.EnableIndexingAkashaInterestsStreamInput;
  EnableIndexingAkashaInterestsStreamPayload: ResolverTypeWrapper<Types.EnableIndexingAkashaInterestsStreamPayload>;
  EnableIndexingAkashaProfileInput: Types.EnableIndexingAkashaProfileInput;
  EnableIndexingAkashaProfileInterestsInput: Types.EnableIndexingAkashaProfileInterestsInput;
  EnableIndexingAkashaProfileInterestsPayload: ResolverTypeWrapper<Types.EnableIndexingAkashaProfileInterestsPayload>;
  EnableIndexingAkashaProfilePayload: ResolverTypeWrapper<Types.EnableIndexingAkashaProfilePayload>;
  EnableIndexingAkashaProfileStreamInput: Types.EnableIndexingAkashaProfileStreamInput;
  EnableIndexingAkashaProfileStreamPayload: ResolverTypeWrapper<Types.EnableIndexingAkashaProfileStreamPayload>;
  EnableIndexingAkashaReflectInput: Types.EnableIndexingAkashaReflectInput;
  EnableIndexingAkashaReflectPayload: ResolverTypeWrapper<Types.EnableIndexingAkashaReflectPayload>;
  EnableIndexingAkashaReflectStreamInput: Types.EnableIndexingAkashaReflectStreamInput;
  EnableIndexingAkashaReflectStreamPayload: ResolverTypeWrapper<Types.EnableIndexingAkashaReflectStreamPayload>;
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
  ProfileImageSource: ResolverTypeWrapper<Types.ProfileImageSource>;
  ProfileImageSourceInput: Types.ProfileImageSourceInput;
  ProfileImageVersions: ResolverTypeWrapper<Types.ProfileImageVersions>;
  ProfileImageVersionsInput: Types.ProfileImageVersionsInput;
  ProfileLabeled: ResolverTypeWrapper<Types.ProfileLabeled>;
  ProfileLabeledInput: Types.ProfileLabeledInput;
  ProfileLinkSource: ResolverTypeWrapper<Types.ProfileLinkSource>;
  ProfileLinkSourceInput: Types.ProfileLinkSourceInput;
  Query: ResolverTypeWrapper<{}>;
  ReflectProviderValue: ResolverTypeWrapper<Types.ReflectProviderValue>;
  ReflectProviderValueInput: Types.ReflectProviderValueInput;
  SetAkashaAppInput: Types.SetAkashaAppInput;
  SetAkashaAppPayload: ResolverTypeWrapper<Types.SetAkashaAppPayload>;
  SetAkashaAppReleaseInput: Types.SetAkashaAppReleaseInput;
  SetAkashaAppReleasePayload: ResolverTypeWrapper<Types.SetAkashaAppReleasePayload>;
  SetAkashaAppsStreamInput: Types.SetAkashaAppsStreamInput;
  SetAkashaAppsStreamPayload: ResolverTypeWrapper<Types.SetAkashaAppsStreamPayload>;
  SetAkashaBeamStreamInput: Types.SetAkashaBeamStreamInput;
  SetAkashaBeamStreamPayload: ResolverTypeWrapper<Types.SetAkashaBeamStreamPayload>;
  SetAkashaBlockStorageInput: Types.SetAkashaBlockStorageInput;
  SetAkashaBlockStoragePayload: ResolverTypeWrapper<Types.SetAkashaBlockStoragePayload>;
  SetAkashaContentBlockStreamInput: Types.SetAkashaContentBlockStreamInput;
  SetAkashaContentBlockStreamPayload: ResolverTypeWrapper<Types.SetAkashaContentBlockStreamPayload>;
  SetAkashaFollowInput: Types.SetAkashaFollowInput;
  SetAkashaFollowPayload: ResolverTypeWrapper<Types.SetAkashaFollowPayload>;
  SetAkashaIndexedStreamInput: Types.SetAkashaIndexedStreamInput;
  SetAkashaIndexedStreamPayload: ResolverTypeWrapper<Types.SetAkashaIndexedStreamPayload>;
  SetAkashaInterestsStreamInput: Types.SetAkashaInterestsStreamInput;
  SetAkashaInterestsStreamPayload: ResolverTypeWrapper<Types.SetAkashaInterestsStreamPayload>;
  SetAkashaProfileInput: Types.SetAkashaProfileInput;
  SetAkashaProfileInterestsInput: Types.SetAkashaProfileInterestsInput;
  SetAkashaProfileInterestsPayload: ResolverTypeWrapper<Types.SetAkashaProfileInterestsPayload>;
  SetAkashaProfilePayload: ResolverTypeWrapper<Types.SetAkashaProfilePayload>;
  SetAkashaProfileStreamInput: Types.SetAkashaProfileStreamInput;
  SetAkashaProfileStreamPayload: ResolverTypeWrapper<Types.SetAkashaProfileStreamPayload>;
  SetAkashaReflectStreamInput: Types.SetAkashaReflectStreamInput;
  SetAkashaReflectStreamPayload: ResolverTypeWrapper<Types.SetAkashaReflectStreamPayload>;
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
  WithAkashaAppInput: Types.WithAkashaAppInput;
  WithAkashaAppReleaseInput: Types.WithAkashaAppReleaseInput;
  WithAkashaAppsStreamInput: Types.WithAkashaAppsStreamInput;
  WithAkashaBeamStreamInput: Types.WithAkashaBeamStreamInput;
  WithAkashaBlockStorageInput: Types.WithAkashaBlockStorageInput;
  WithAkashaContentBlockStreamInput: Types.WithAkashaContentBlockStreamInput;
  WithAkashaFollowInput: Types.WithAkashaFollowInput;
  WithAkashaIndexedStreamInput: Types.WithAkashaIndexedStreamInput;
  WithAkashaInterestsStreamInput: Types.WithAkashaInterestsStreamInput;
  WithAkashaProfileStreamInput: Types.WithAkashaProfileStreamInput;
  WithAkashaReflectStreamInput: Types.WithAkashaReflectStreamInput;
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
  Boolean: Types.Scalars['Boolean']['output'];
  Int: Types.Scalars['Int']['output'];
  AkashaAppApplicationTypeValueFilterInput: Types.AkashaAppApplicationTypeValueFilterInput;
  AkashaAppConnection: Types.AkashaAppConnection;
  AkashaAppEdge: Types.AkashaAppEdge;
  AkashaAppFiltersInput: Types.AkashaAppFiltersInput;
  AkashaAppInput: Types.AkashaAppInput;
  AkashaAppInterface: ResolversInterfaceTypes<ResolversParentTypes>['AkashaAppInterface'];
  AkashaAppInterfaceConnection: Types.AkashaAppInterfaceConnection;
  AkashaAppInterfaceEdge: Types.AkashaAppInterfaceEdge;
  AkashaAppInterfaceFiltersInput: Types.AkashaAppInterfaceFiltersInput;
  AkashaAppInterfaceObjectFilterInput: Types.AkashaAppInterfaceObjectFilterInput;
  AkashaAppInterfaceSortingInput: Types.AkashaAppInterfaceSortingInput;
  AkashaAppObjectFilterInput: Types.AkashaAppObjectFilterInput;
  AkashaAppRelease: Types.AkashaAppRelease;
  AkashaAppReleaseConnection: Types.AkashaAppReleaseConnection;
  AkashaAppReleaseEdge: Types.AkashaAppReleaseEdge;
  AkashaAppReleaseFiltersInput: Types.AkashaAppReleaseFiltersInput;
  AkashaAppReleaseInput: Types.AkashaAppReleaseInput;
  AkashaAppReleaseInterface: ResolversInterfaceTypes<ResolversParentTypes>['AkashaAppReleaseInterface'];
  AkashaAppReleaseInterfaceConnection: Types.AkashaAppReleaseInterfaceConnection;
  AkashaAppReleaseInterfaceEdge: Types.AkashaAppReleaseInterfaceEdge;
  AkashaAppReleaseInterfaceFiltersInput: Types.AkashaAppReleaseInterfaceFiltersInput;
  AkashaAppReleaseInterfaceObjectFilterInput: Types.AkashaAppReleaseInterfaceObjectFilterInput;
  AkashaAppReleaseInterfaceSortingInput: Types.AkashaAppReleaseInterfaceSortingInput;
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
  AkashaBeamConnection: Types.AkashaBeamConnection;
  AkashaBeamEdge: Types.AkashaBeamEdge;
  AkashaBeamFiltersInput: Types.AkashaBeamFiltersInput;
  AkashaBeamInput: Types.AkashaBeamInput;
  AkashaBeamInterface: ResolversInterfaceTypes<ResolversParentTypes>['AkashaBeamInterface'];
  AkashaBeamInterfaceConnection: Types.AkashaBeamInterfaceConnection;
  AkashaBeamInterfaceEdge: Types.AkashaBeamInterfaceEdge;
  AkashaBeamInterfaceFiltersInput: Types.AkashaBeamInterfaceFiltersInput;
  AkashaBeamInterfaceObjectFilterInput: Types.AkashaBeamInterfaceObjectFilterInput;
  AkashaBeamInterfaceSortingInput: Types.AkashaBeamInterfaceSortingInput;
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
  AkashaBlockStorageBlockDefValueFilterInput: Types.AkashaBlockStorageBlockDefValueFilterInput;
  AkashaBlockStorageConnection: Types.AkashaBlockStorageConnection;
  AkashaBlockStorageEdge: Types.AkashaBlockStorageEdge;
  AkashaBlockStorageFiltersInput: Types.AkashaBlockStorageFiltersInput;
  AkashaBlockStorageInput: Types.AkashaBlockStorageInput;
  AkashaBlockStorageObjectFilterInput: Types.AkashaBlockStorageObjectFilterInput;
  AkashaBlockStorageSortingInput: Types.AkashaBlockStorageSortingInput;
  AkashaContentBlock: Types.AkashaContentBlock;
  AkashaContentBlockBlockDefValueFilterInput: Types.AkashaContentBlockBlockDefValueFilterInput;
  AkashaContentBlockConnection: Types.AkashaContentBlockConnection;
  AkashaContentBlockEdge: Types.AkashaContentBlockEdge;
  AkashaContentBlockFiltersInput: Types.AkashaContentBlockFiltersInput;
  AkashaContentBlockInput: Types.AkashaContentBlockInput;
  AkashaContentBlockInterface: ResolversInterfaceTypes<ResolversParentTypes>['AkashaContentBlockInterface'];
  AkashaContentBlockInterfaceConnection: Types.AkashaContentBlockInterfaceConnection;
  AkashaContentBlockInterfaceEdge: Types.AkashaContentBlockInterfaceEdge;
  AkashaContentBlockInterfaceFiltersInput: Types.AkashaContentBlockInterfaceFiltersInput;
  AkashaContentBlockInterfaceObjectFilterInput: Types.AkashaContentBlockInterfaceObjectFilterInput;
  AkashaContentBlockInterfaceSortingInput: Types.AkashaContentBlockInterfaceSortingInput;
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
  AkashaFollowInterface: ResolversInterfaceTypes<ResolversParentTypes>['AkashaFollowInterface'];
  AkashaFollowInterfaceConnection: Types.AkashaFollowInterfaceConnection;
  AkashaFollowInterfaceEdge: Types.AkashaFollowInterfaceEdge;
  AkashaFollowInterfaceFiltersInput: Types.AkashaFollowInterfaceFiltersInput;
  AkashaFollowInterfaceObjectFilterInput: Types.AkashaFollowInterfaceObjectFilterInput;
  AkashaFollowInterfaceSortingInput: Types.AkashaFollowInterfaceSortingInput;
  AkashaFollowObjectFilterInput: Types.AkashaFollowObjectFilterInput;
  AkashaFollowSortingInput: Types.AkashaFollowSortingInput;
  AkashaIndexStreamInterface: ResolversInterfaceTypes<ResolversParentTypes>['AkashaIndexStreamInterface'];
  AkashaIndexStreamInterfaceConnection: Types.AkashaIndexStreamInterfaceConnection;
  AkashaIndexStreamInterfaceEdge: Types.AkashaIndexStreamInterfaceEdge;
  AkashaIndexStreamInterfaceFiltersInput: Types.AkashaIndexStreamInterfaceFiltersInput;
  AkashaIndexStreamInterfaceObjectFilterInput: Types.AkashaIndexStreamInterfaceObjectFilterInput;
  AkashaIndexStreamInterfaceSortingInput: Types.AkashaIndexStreamInterfaceSortingInput;
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
  AkashaProfileInput: Types.AkashaProfileInput;
  AkashaProfileInterests: Types.AkashaProfileInterests;
  AkashaProfileInterestsConnection: Types.AkashaProfileInterestsConnection;
  AkashaProfileInterestsEdge: Types.AkashaProfileInterestsEdge;
  AkashaProfileInterestsInput: Types.AkashaProfileInterestsInput;
  AkashaProfileInterestsInterface: ResolversInterfaceTypes<ResolversParentTypes>['AkashaProfileInterestsInterface'];
  AkashaProfileInterestsInterfaceConnection: Types.AkashaProfileInterestsInterfaceConnection;
  AkashaProfileInterestsInterfaceEdge: Types.AkashaProfileInterestsInterfaceEdge;
  AkashaProfileInterface: ResolversInterfaceTypes<ResolversParentTypes>['AkashaProfileInterface'];
  AkashaProfileInterfaceConnection: Types.AkashaProfileInterfaceConnection;
  AkashaProfileInterfaceEdge: Types.AkashaProfileInterfaceEdge;
  AkashaProfileInterfaceFiltersInput: Types.AkashaProfileInterfaceFiltersInput;
  AkashaProfileInterfaceObjectFilterInput: Types.AkashaProfileInterfaceObjectFilterInput;
  AkashaProfileInterfaceSortingInput: Types.AkashaProfileInterfaceSortingInput;
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
  AkashaReflectInterface: ResolversInterfaceTypes<ResolversParentTypes>['AkashaReflectInterface'];
  AkashaReflectInterfaceConnection: Types.AkashaReflectInterfaceConnection;
  AkashaReflectInterfaceEdge: Types.AkashaReflectInterfaceEdge;
  AkashaReflectInterfaceFiltersInput: Types.AkashaReflectInterfaceFiltersInput;
  AkashaReflectInterfaceObjectFilterInput: Types.AkashaReflectInterfaceObjectFilterInput;
  AkashaReflectInterfaceSortingInput: Types.AkashaReflectInterfaceSortingInput;
  AkashaReflectObjectFilterInput: Types.AkashaReflectObjectFilterInput;
  AkashaReflectSortingInput: Types.AkashaReflectSortingInput;
  AkashaReflectStream: Types.AkashaReflectStream;
  AkashaReflectStreamConnection: Types.AkashaReflectStreamConnection;
  AkashaReflectStreamEdge: Types.AkashaReflectStreamEdge;
  AkashaReflectStreamFiltersInput: Types.AkashaReflectStreamFiltersInput;
  AkashaReflectStreamInput: Types.AkashaReflectStreamInput;
  AkashaReflectStreamModerationStatusValueFilterInput: Types.AkashaReflectStreamModerationStatusValueFilterInput;
  AkashaReflectStreamObjectFilterInput: Types.AkashaReflectStreamObjectFilterInput;
  AkashaReflectStreamSortingInput: Types.AkashaReflectStreamSortingInput;
  AppImageSource: Types.AppImageSource;
  AppImageSourceInput: Types.AppImageSourceInput;
  AppLinkSource: Types.AppLinkSource;
  AppLinkSourceInput: Types.AppLinkSourceInput;
  AppProviderValue: Types.AppProviderValue;
  AppProviderValueInput: Types.AppProviderValueInput;
  BeamBlockRecord: Types.BeamBlockRecord;
  BeamBlockRecordInput: Types.BeamBlockRecordInput;
  BeamEmbeddedType: Types.BeamEmbeddedType;
  BeamEmbeddedTypeInput: Types.BeamEmbeddedTypeInput;
  BeamLabeled: Types.BeamLabeled;
  BeamLabeledInput: Types.BeamLabeledInput;
  BlockLabeledValue: Types.BlockLabeledValue;
  BlockLabeledValueInput: Types.BlockLabeledValueInput;
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
  CreateAkashaBeamInput: Types.CreateAkashaBeamInput;
  CreateAkashaBeamPayload: Types.CreateAkashaBeamPayload;
  CreateAkashaContentBlockInput: Types.CreateAkashaContentBlockInput;
  CreateAkashaContentBlockPayload: Types.CreateAkashaContentBlockPayload;
  CreateAkashaProfileInput: Types.CreateAkashaProfileInput;
  CreateAkashaProfileInterestsInput: Types.CreateAkashaProfileInterestsInput;
  CreateAkashaProfileInterestsPayload: Types.CreateAkashaProfileInterestsPayload;
  CreateAkashaProfilePayload: Types.CreateAkashaProfilePayload;
  CreateAkashaReflectInput: Types.CreateAkashaReflectInput;
  CreateAkashaReflectPayload: Types.CreateAkashaReflectPayload;
  CreateOptionsInput: Types.CreateOptionsInput;
  DID: Types.Scalars['DID']['output'];
  DID_JWS: Types.Did_Jws;
  DateTime: Types.Scalars['DateTime']['output'];
  EnableIndexingAkashaAppInput: Types.EnableIndexingAkashaAppInput;
  EnableIndexingAkashaAppPayload: Types.EnableIndexingAkashaAppPayload;
  EnableIndexingAkashaAppReleaseInput: Types.EnableIndexingAkashaAppReleaseInput;
  EnableIndexingAkashaAppReleasePayload: Types.EnableIndexingAkashaAppReleasePayload;
  EnableIndexingAkashaAppsStreamInput: Types.EnableIndexingAkashaAppsStreamInput;
  EnableIndexingAkashaAppsStreamPayload: Types.EnableIndexingAkashaAppsStreamPayload;
  EnableIndexingAkashaBeamInput: Types.EnableIndexingAkashaBeamInput;
  EnableIndexingAkashaBeamPayload: Types.EnableIndexingAkashaBeamPayload;
  EnableIndexingAkashaBeamStreamInput: Types.EnableIndexingAkashaBeamStreamInput;
  EnableIndexingAkashaBeamStreamPayload: Types.EnableIndexingAkashaBeamStreamPayload;
  EnableIndexingAkashaBlockStorageInput: Types.EnableIndexingAkashaBlockStorageInput;
  EnableIndexingAkashaBlockStoragePayload: Types.EnableIndexingAkashaBlockStoragePayload;
  EnableIndexingAkashaContentBlockInput: Types.EnableIndexingAkashaContentBlockInput;
  EnableIndexingAkashaContentBlockPayload: Types.EnableIndexingAkashaContentBlockPayload;
  EnableIndexingAkashaContentBlockStreamInput: Types.EnableIndexingAkashaContentBlockStreamInput;
  EnableIndexingAkashaContentBlockStreamPayload: Types.EnableIndexingAkashaContentBlockStreamPayload;
  EnableIndexingAkashaFollowInput: Types.EnableIndexingAkashaFollowInput;
  EnableIndexingAkashaFollowPayload: Types.EnableIndexingAkashaFollowPayload;
  EnableIndexingAkashaIndexedStreamInput: Types.EnableIndexingAkashaIndexedStreamInput;
  EnableIndexingAkashaIndexedStreamPayload: Types.EnableIndexingAkashaIndexedStreamPayload;
  EnableIndexingAkashaInterestsStreamInput: Types.EnableIndexingAkashaInterestsStreamInput;
  EnableIndexingAkashaInterestsStreamPayload: Types.EnableIndexingAkashaInterestsStreamPayload;
  EnableIndexingAkashaProfileInput: Types.EnableIndexingAkashaProfileInput;
  EnableIndexingAkashaProfileInterestsInput: Types.EnableIndexingAkashaProfileInterestsInput;
  EnableIndexingAkashaProfileInterestsPayload: Types.EnableIndexingAkashaProfileInterestsPayload;
  EnableIndexingAkashaProfilePayload: Types.EnableIndexingAkashaProfilePayload;
  EnableIndexingAkashaProfileStreamInput: Types.EnableIndexingAkashaProfileStreamInput;
  EnableIndexingAkashaProfileStreamPayload: Types.EnableIndexingAkashaProfileStreamPayload;
  EnableIndexingAkashaReflectInput: Types.EnableIndexingAkashaReflectInput;
  EnableIndexingAkashaReflectPayload: Types.EnableIndexingAkashaReflectPayload;
  EnableIndexingAkashaReflectStreamInput: Types.EnableIndexingAkashaReflectStreamInput;
  EnableIndexingAkashaReflectStreamPayload: Types.EnableIndexingAkashaReflectStreamPayload;
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
  ProfileImageSource: Types.ProfileImageSource;
  ProfileImageSourceInput: Types.ProfileImageSourceInput;
  ProfileImageVersions: Types.ProfileImageVersions;
  ProfileImageVersionsInput: Types.ProfileImageVersionsInput;
  ProfileLabeled: Types.ProfileLabeled;
  ProfileLabeledInput: Types.ProfileLabeledInput;
  ProfileLinkSource: Types.ProfileLinkSource;
  ProfileLinkSourceInput: Types.ProfileLinkSourceInput;
  Query: {};
  ReflectProviderValue: Types.ReflectProviderValue;
  ReflectProviderValueInput: Types.ReflectProviderValueInput;
  SetAkashaAppInput: Types.SetAkashaAppInput;
  SetAkashaAppPayload: Types.SetAkashaAppPayload;
  SetAkashaAppReleaseInput: Types.SetAkashaAppReleaseInput;
  SetAkashaAppReleasePayload: Types.SetAkashaAppReleasePayload;
  SetAkashaAppsStreamInput: Types.SetAkashaAppsStreamInput;
  SetAkashaAppsStreamPayload: Types.SetAkashaAppsStreamPayload;
  SetAkashaBeamStreamInput: Types.SetAkashaBeamStreamInput;
  SetAkashaBeamStreamPayload: Types.SetAkashaBeamStreamPayload;
  SetAkashaBlockStorageInput: Types.SetAkashaBlockStorageInput;
  SetAkashaBlockStoragePayload: Types.SetAkashaBlockStoragePayload;
  SetAkashaContentBlockStreamInput: Types.SetAkashaContentBlockStreamInput;
  SetAkashaContentBlockStreamPayload: Types.SetAkashaContentBlockStreamPayload;
  SetAkashaFollowInput: Types.SetAkashaFollowInput;
  SetAkashaFollowPayload: Types.SetAkashaFollowPayload;
  SetAkashaIndexedStreamInput: Types.SetAkashaIndexedStreamInput;
  SetAkashaIndexedStreamPayload: Types.SetAkashaIndexedStreamPayload;
  SetAkashaInterestsStreamInput: Types.SetAkashaInterestsStreamInput;
  SetAkashaInterestsStreamPayload: Types.SetAkashaInterestsStreamPayload;
  SetAkashaProfileInput: Types.SetAkashaProfileInput;
  SetAkashaProfileInterestsInput: Types.SetAkashaProfileInterestsInput;
  SetAkashaProfileInterestsPayload: Types.SetAkashaProfileInterestsPayload;
  SetAkashaProfilePayload: Types.SetAkashaProfilePayload;
  SetAkashaProfileStreamInput: Types.SetAkashaProfileStreamInput;
  SetAkashaProfileStreamPayload: Types.SetAkashaProfileStreamPayload;
  SetAkashaReflectStreamInput: Types.SetAkashaReflectStreamInput;
  SetAkashaReflectStreamPayload: Types.SetAkashaReflectStreamPayload;
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
  WithAkashaAppInput: Types.WithAkashaAppInput;
  WithAkashaAppReleaseInput: Types.WithAkashaAppReleaseInput;
  WithAkashaAppsStreamInput: Types.WithAkashaAppsStreamInput;
  WithAkashaBeamStreamInput: Types.WithAkashaBeamStreamInput;
  WithAkashaBlockStorageInput: Types.WithAkashaBlockStorageInput;
  WithAkashaContentBlockStreamInput: Types.WithAkashaContentBlockStreamInput;
  WithAkashaFollowInput: Types.WithAkashaFollowInput;
  WithAkashaIndexedStreamInput: Types.WithAkashaIndexedStreamInput;
  WithAkashaInterestsStreamInput: Types.WithAkashaInterestsStreamInput;
  WithAkashaProfileStreamInput: Types.WithAkashaProfileStreamInput;
  WithAkashaReflectStreamInput: Types.WithAkashaReflectStreamInput;
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
  coverImage?: Resolver<Types.Maybe<ResolversTypes['AppImageSource']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gallery?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AppImageSource']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  keywords?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  license?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  links?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AppLinkSource']>>>, ParentType, ContextType>;
  logoImage?: Resolver<Types.Maybe<ResolversTypes['AppImageSource']>, ParentType, ContextType>;
  meta?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AppProviderValue']>>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nsfw?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  releases?: Resolver<ResolversTypes['AkashaAppReleaseInterfaceConnection'], ParentType, ContextType, Partial<Types.AkashaAppReleasesArgs>>;
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

export type AkashaAppInterfaceResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaAppInterface'] = ResolversParentTypes['AkashaAppInterface']> = {
  __resolveType: TypeResolveFn<'AkashaApp', ParentType, ContextType>;
  author?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  contributors?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['CeramicAccount']>>>, ParentType, ContextType>;
  coverImage?: Resolver<Types.Maybe<ResolversTypes['AppImageSource']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  displayName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  gallery?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AppImageSource']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  keywords?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  license?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  links?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AppLinkSource']>>>, ParentType, ContextType>;
  logoImage?: Resolver<Types.Maybe<ResolversTypes['AppImageSource']>, ParentType, ContextType>;
  meta?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AppProviderValue']>>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nsfw?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  version?: Resolver<ResolversTypes['CeramicCommitID'], ParentType, ContextType>;
};

export type AkashaAppInterfaceConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaAppInterfaceConnection'] = ResolversParentTypes['AkashaAppInterfaceConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaAppInterfaceEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaAppInterfaceEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaAppInterfaceEdge'] = ResolversParentTypes['AkashaAppInterfaceEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaAppInterface']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaAppReleaseResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaAppRelease'] = ResolversParentTypes['AkashaAppRelease']> = {
  application?: Resolver<Types.Maybe<ResolversTypes['AkashaAppInterface']>, ParentType, ContextType>;
  applicationID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  meta?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AppProviderValue']>>>, ParentType, ContextType>;
  source?: Resolver<ResolversTypes['URI'], ParentType, ContextType>;
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

export type AkashaAppReleaseInterfaceResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaAppReleaseInterface'] = ResolversParentTypes['AkashaAppReleaseInterface']> = {
  __resolveType: TypeResolveFn<'AkashaAppRelease', ParentType, ContextType>;
  application?: Resolver<Types.Maybe<ResolversTypes['AkashaAppInterface']>, ParentType, ContextType>;
  applicationID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  meta?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AppProviderValue']>>>, ParentType, ContextType>;
  source?: Resolver<ResolversTypes['URI'], ParentType, ContextType>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type AkashaAppReleaseInterfaceConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaAppReleaseInterfaceConnection'] = ResolversParentTypes['AkashaAppReleaseInterfaceConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaAppReleaseInterfaceEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaAppReleaseInterfaceEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaAppReleaseInterfaceEdge'] = ResolversParentTypes['AkashaAppReleaseInterfaceEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaAppReleaseInterface']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaAppsStreamResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaAppsStream'] = ResolversParentTypes['AkashaAppsStream']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  application?: Resolver<Types.Maybe<ResolversTypes['AkashaAppInterface']>, ParentType, ContextType>;
  applicationID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  moderation?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
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
  app?: Resolver<Types.Maybe<ResolversTypes['AkashaAppInterface']>, ParentType, ContextType>;
  appID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  appVersion?: Resolver<Types.Maybe<ResolversTypes['AkashaAppReleaseInterface']>, ParentType, ContextType>;
  appVersionID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  content?: Resolver<Array<ResolversTypes['BeamBlockRecord']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  embeddedStream?: Resolver<Types.Maybe<ResolversTypes['BeamEmbeddedType']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  mentions?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['CeramicAccount']>>>, ParentType, ContextType>;
  nsfw?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  reflections?: Resolver<ResolversTypes['AkashaReflectInterfaceConnection'], ParentType, ContextType, Partial<Types.AkashaBeamReflectionsArgs>>;
  reflectionsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.AkashaBeamReflectionsCountArgs>>;
  tags?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['BeamLabeled']>>>, ParentType, ContextType>;
  version?: Resolver<ResolversTypes['CeramicCommitID'], ParentType, ContextType>;
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

export type AkashaBeamInterfaceResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaBeamInterface'] = ResolversParentTypes['AkashaBeamInterface']> = {
  __resolveType: TypeResolveFn<'AkashaBeam', ParentType, ContextType>;
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  app?: Resolver<Types.Maybe<ResolversTypes['AkashaAppInterface']>, ParentType, ContextType>;
  appID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  appVersion?: Resolver<Types.Maybe<ResolversTypes['AkashaAppReleaseInterface']>, ParentType, ContextType>;
  appVersionID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  content?: Resolver<Array<ResolversTypes['BeamBlockRecord']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  embeddedStream?: Resolver<Types.Maybe<ResolversTypes['BeamEmbeddedType']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  mentions?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['CeramicAccount']>>>, ParentType, ContextType>;
  nsfw?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  tags?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['BeamLabeled']>>>, ParentType, ContextType>;
  version?: Resolver<ResolversTypes['CeramicCommitID'], ParentType, ContextType>;
};

export type AkashaBeamInterfaceConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaBeamInterfaceConnection'] = ResolversParentTypes['AkashaBeamInterfaceConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaBeamInterfaceEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaBeamInterfaceEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaBeamInterfaceEdge'] = ResolversParentTypes['AkashaBeamInterfaceEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaBeamInterface']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaBeamStreamResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaBeamStream'] = ResolversParentTypes['AkashaBeamStream']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  appID?: Resolver<Types.Maybe<ResolversTypes['CeramicStreamID']>, ParentType, ContextType>;
  beam?: Resolver<Types.Maybe<ResolversTypes['AkashaBeamInterface']>, ParentType, ContextType>;
  beamID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  moderation?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
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
  appVersion?: Resolver<Types.Maybe<ResolversTypes['AkashaAppReleaseInterface']>, ParentType, ContextType>;
  appVersionID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  block?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlock']>, ParentType, ContextType>;
  blockID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  content?: Resolver<Array<ResolversTypes['BlockLabeledValue']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  kind?: Resolver<Types.Maybe<ResolversTypes['AkashaBlockStorageBlockDef']>, ParentType, ContextType>;
  nsfw?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
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

export type AkashaContentBlockResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaContentBlock'] = ResolversParentTypes['AkashaContentBlock']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  appVersion?: Resolver<Types.Maybe<ResolversTypes['AkashaAppReleaseInterface']>, ParentType, ContextType>;
  appVersionID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  content?: Resolver<Array<ResolversTypes['BlockLabeledValue']>, ParentType, ContextType>;
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

export type AkashaContentBlockInterfaceResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaContentBlockInterface'] = ResolversParentTypes['AkashaContentBlockInterface']> = {
  __resolveType: TypeResolveFn<'AkashaBlockStorage' | 'AkashaContentBlock', ParentType, ContextType>;
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  appVersion?: Resolver<Types.Maybe<ResolversTypes['AkashaAppReleaseInterface']>, ParentType, ContextType>;
  appVersionID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  content?: Resolver<Array<ResolversTypes['BlockLabeledValue']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  nsfw?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  version?: Resolver<ResolversTypes['CeramicCommitID'], ParentType, ContextType>;
};

export type AkashaContentBlockInterfaceConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaContentBlockInterfaceConnection'] = ResolversParentTypes['AkashaContentBlockInterfaceConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaContentBlockInterfaceEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaContentBlockInterfaceEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaContentBlockInterfaceEdge'] = ResolversParentTypes['AkashaContentBlockInterfaceEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlockInterface']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaContentBlockStreamResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaContentBlockStream'] = ResolversParentTypes['AkashaContentBlockStream']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  block?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlockInterface']>, ParentType, ContextType>;
  blockID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  moderation?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
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
  profile?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileInterface']>, ParentType, ContextType>;
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

export type AkashaFollowInterfaceResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaFollowInterface'] = ResolversParentTypes['AkashaFollowInterface']> = {
  __resolveType: TypeResolveFn<'AkashaFollow', ParentType, ContextType>;
  did?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isFollowing?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  profile?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileInterface']>, ParentType, ContextType>;
  profileID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
};

export type AkashaFollowInterfaceConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaFollowInterfaceConnection'] = ResolversParentTypes['AkashaFollowInterfaceConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaFollowInterfaceEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaFollowInterfaceEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaFollowInterfaceEdge'] = ResolversParentTypes['AkashaFollowInterfaceEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaFollowInterface']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaIndexStreamInterfaceResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaIndexStreamInterface'] = ResolversParentTypes['AkashaIndexStreamInterface']> = {
  __resolveType: TypeResolveFn<'AkashaAppsStream' | 'AkashaBeamStream' | 'AkashaContentBlockStream' | 'AkashaIndexedStream' | 'AkashaInterestsStream' | 'AkashaProfileStream' | 'AkashaReflectStream', ParentType, ContextType>;
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  moderation?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  moderationID?: Resolver<Types.Maybe<ResolversTypes['CeramicStreamID']>, ParentType, ContextType>;
};

export type AkashaIndexStreamInterfaceConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaIndexStreamInterfaceConnection'] = ResolversParentTypes['AkashaIndexStreamInterfaceConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaIndexStreamInterfaceEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaIndexStreamInterfaceEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaIndexStreamInterfaceEdge'] = ResolversParentTypes['AkashaIndexStreamInterfaceEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaIndexStreamInterface']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaIndexedStreamResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaIndexedStream'] = ResolversParentTypes['AkashaIndexedStream']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  indexType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  indexValue?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  moderation?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  moderationID?: Resolver<Types.Maybe<ResolversTypes['CeramicStreamID']>, ParentType, ContextType>;
  status?: Resolver<Types.Maybe<ResolversTypes['AkashaIndexedStreamModerationStatus']>, ParentType, ContextType>;
  stream?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  streamType?: Resolver<Types.Maybe<ResolversTypes['AkashaIndexedStreamStreamType']>, ParentType, ContextType>;
  streamView?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
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
  moderation?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
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
  app?: Resolver<Types.Maybe<ResolversTypes['AkashaAppInterface']>, ParentType, ContextType>;
  appID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  appVersion?: Resolver<Types.Maybe<ResolversTypes['AkashaAppReleaseInterface']>, ParentType, ContextType>;
  appVersionID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  avatar?: Resolver<Types.Maybe<ResolversTypes['ProfileImageVersions']>, ParentType, ContextType>;
  background?: Resolver<Types.Maybe<ResolversTypes['ProfileImageVersions']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  did?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  followers?: Resolver<ResolversTypes['AkashaFollowInterfaceConnection'], ParentType, ContextType, Partial<Types.AkashaProfileFollowersArgs>>;
  followersCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.AkashaProfileFollowersCountArgs>>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  links?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['ProfileLinkSource']>>>, ParentType, ContextType>;
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

export type AkashaProfileInterestsResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfileInterests'] = ResolversParentTypes['AkashaProfileInterests']> = {
  did?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  topics?: Resolver<Array<ResolversTypes['ProfileLabeled']>, ParentType, ContextType>;
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

export type AkashaProfileInterestsInterfaceResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfileInterestsInterface'] = ResolversParentTypes['AkashaProfileInterestsInterface']> = {
  __resolveType: TypeResolveFn<'AkashaProfileInterests', ParentType, ContextType>;
  did?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  topics?: Resolver<Array<ResolversTypes['ProfileLabeled']>, ParentType, ContextType>;
};

export type AkashaProfileInterestsInterfaceConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfileInterestsInterfaceConnection'] = ResolversParentTypes['AkashaProfileInterestsInterfaceConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaProfileInterestsInterfaceEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaProfileInterestsInterfaceEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfileInterestsInterfaceEdge'] = ResolversParentTypes['AkashaProfileInterestsInterfaceEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileInterestsInterface']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaProfileInterfaceResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfileInterface'] = ResolversParentTypes['AkashaProfileInterface']> = {
  __resolveType: TypeResolveFn<'AkashaProfile', ParentType, ContextType>;
  app?: Resolver<Types.Maybe<ResolversTypes['AkashaAppInterface']>, ParentType, ContextType>;
  appID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  appVersion?: Resolver<Types.Maybe<ResolversTypes['AkashaAppReleaseInterface']>, ParentType, ContextType>;
  appVersionID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  avatar?: Resolver<Types.Maybe<ResolversTypes['ProfileImageVersions']>, ParentType, ContextType>;
  background?: Resolver<Types.Maybe<ResolversTypes['ProfileImageVersions']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  did?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  links?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['ProfileLinkSource']>>>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  nsfw?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
};

export type AkashaProfileInterfaceConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfileInterfaceConnection'] = ResolversParentTypes['AkashaProfileInterfaceConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaProfileInterfaceEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaProfileInterfaceEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfileInterfaceEdge'] = ResolversParentTypes['AkashaProfileInterfaceEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileInterface']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaProfileStreamResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaProfileStream'] = ResolversParentTypes['AkashaProfileStream']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  appID?: Resolver<Types.Maybe<ResolversTypes['CeramicStreamID']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  moderation?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  moderationID?: Resolver<Types.Maybe<ResolversTypes['CeramicStreamID']>, ParentType, ContextType>;
  profile?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileInterface']>, ParentType, ContextType>;
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
  beam?: Resolver<Types.Maybe<ResolversTypes['AkashaBeamInterface']>, ParentType, ContextType>;
  beamID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  content?: Resolver<Array<ResolversTypes['ReflectProviderValue']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isReply?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  mentions?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['CeramicStreamID']>>>, ParentType, ContextType>;
  nsfw?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  reflection?: Resolver<Types.Maybe<ResolversTypes['CeramicStreamID']>, ParentType, ContextType>;
  reflectionView?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
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

export type AkashaReflectInterfaceResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaReflectInterface'] = ResolversParentTypes['AkashaReflectInterface']> = {
  __resolveType: TypeResolveFn<'AkashaReflect', ParentType, ContextType>;
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  author?: Resolver<ResolversTypes['CeramicAccount'], ParentType, ContextType>;
  beam?: Resolver<Types.Maybe<ResolversTypes['AkashaBeamInterface']>, ParentType, ContextType>;
  beamID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  content?: Resolver<Array<ResolversTypes['ReflectProviderValue']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isReply?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  mentions?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['CeramicStreamID']>>>, ParentType, ContextType>;
  nsfw?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  reflection?: Resolver<Types.Maybe<ResolversTypes['CeramicStreamID']>, ParentType, ContextType>;
  reflectionView?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  tags?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  version?: Resolver<ResolversTypes['CeramicCommitID'], ParentType, ContextType>;
};

export type AkashaReflectInterfaceConnectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaReflectInterfaceConnection'] = ResolversParentTypes['AkashaReflectInterfaceConnection']> = {
  edges?: Resolver<Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaReflectInterfaceEdge']>>>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaReflectInterfaceEdgeResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaReflectInterfaceEdge'] = ResolversParentTypes['AkashaReflectInterfaceEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['AkashaReflectInterface']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AkashaReflectStreamResolvers<ContextType = any, ParentType extends ResolversParentTypes['AkashaReflectStream'] = ResolversParentTypes['AkashaReflectStream']> = {
  active?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  beamID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isReply?: Resolver<Types.Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  moderation?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType>;
  moderationID?: Resolver<Types.Maybe<ResolversTypes['CeramicStreamID']>, ParentType, ContextType>;
  reflection?: Resolver<Types.Maybe<ResolversTypes['AkashaReflectInterface']>, ParentType, ContextType>;
  reflectionID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  replyTo?: Resolver<Types.Maybe<ResolversTypes['CeramicStreamID']>, ParentType, ContextType>;
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

export type AppImageSourceResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppImageSource'] = ResolversParentTypes['AppImageSource']> = {
  height?: Resolver<Types.Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  src?: Resolver<ResolversTypes['URI'], ParentType, ContextType>;
  width?: Resolver<Types.Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppLinkSourceResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppLinkSource'] = ResolversParentTypes['AppLinkSource']> = {
  href?: Resolver<ResolversTypes['URI'], ParentType, ContextType>;
  label?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AppProviderValueResolvers<ContextType = any, ParentType extends ResolversParentTypes['AppProviderValue'] = ResolversParentTypes['AppProviderValue']> = {
  property?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  provider?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BeamBlockRecordResolvers<ContextType = any, ParentType extends ResolversParentTypes['BeamBlockRecord'] = ResolversParentTypes['BeamBlockRecord']> = {
  blockID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BeamEmbeddedTypeResolvers<ContextType = any, ParentType extends ResolversParentTypes['BeamEmbeddedType'] = ResolversParentTypes['BeamEmbeddedType']> = {
  embeddedID?: Resolver<ResolversTypes['CeramicStreamID'], ParentType, ContextType>;
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BeamLabeledResolvers<ContextType = any, ParentType extends ResolversParentTypes['BeamLabeled'] = ResolversParentTypes['BeamLabeled']> = {
  labelType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BlockLabeledValueResolvers<ContextType = any, ParentType extends ResolversParentTypes['BlockLabeledValue'] = ResolversParentTypes['BlockLabeledValue']> = {
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  propertyType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface CacaoHeaderTScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['CacaoHeaderT'], any> {
  name: 'CacaoHeaderT';
}

export interface CacaoSignatureTScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['CacaoSignatureT'], any> {
  name: 'CacaoSignatureT';
}

export type CeramicAccountResolvers<ContextType = any, ParentType extends ResolversParentTypes['CeramicAccount'] = ResolversParentTypes['CeramicAccount']> = {
  akashaApp?: Resolver<Types.Maybe<ResolversTypes['AkashaApp']>, ParentType, ContextType, RequireFields<Types.CeramicAccountAkashaAppArgs, 'with'>>;
  akashaAppInterfaceList?: Resolver<Types.Maybe<ResolversTypes['AkashaAppInterfaceConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaAppInterfaceListArgs>>;
  akashaAppInterfaceListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaAppInterfaceListCountArgs>>;
  akashaAppList?: Resolver<Types.Maybe<ResolversTypes['AkashaAppConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaAppListArgs>>;
  akashaAppListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaAppListCountArgs>>;
  akashaAppRelease?: Resolver<Types.Maybe<ResolversTypes['AkashaAppRelease']>, ParentType, ContextType, RequireFields<Types.CeramicAccountAkashaAppReleaseArgs, 'with'>>;
  akashaAppReleaseInterfaceList?: Resolver<Types.Maybe<ResolversTypes['AkashaAppReleaseInterfaceConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaAppReleaseInterfaceListArgs>>;
  akashaAppReleaseInterfaceListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaAppReleaseInterfaceListCountArgs>>;
  akashaAppReleaseList?: Resolver<Types.Maybe<ResolversTypes['AkashaAppReleaseConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaAppReleaseListArgs>>;
  akashaAppReleaseListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaAppReleaseListCountArgs>>;
  akashaAppsStream?: Resolver<Types.Maybe<ResolversTypes['AkashaAppsStream']>, ParentType, ContextType, RequireFields<Types.CeramicAccountAkashaAppsStreamArgs, 'with'>>;
  akashaAppsStreamList?: Resolver<Types.Maybe<ResolversTypes['AkashaAppsStreamConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaAppsStreamListArgs>>;
  akashaAppsStreamListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaAppsStreamListCountArgs>>;
  akashaBeamInterfaceList?: Resolver<Types.Maybe<ResolversTypes['AkashaBeamInterfaceConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaBeamInterfaceListArgs>>;
  akashaBeamInterfaceListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaBeamInterfaceListCountArgs>>;
  akashaBeamList?: Resolver<Types.Maybe<ResolversTypes['AkashaBeamConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaBeamListArgs>>;
  akashaBeamListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaBeamListCountArgs>>;
  akashaBeamStream?: Resolver<Types.Maybe<ResolversTypes['AkashaBeamStream']>, ParentType, ContextType, RequireFields<Types.CeramicAccountAkashaBeamStreamArgs, 'with'>>;
  akashaBeamStreamList?: Resolver<Types.Maybe<ResolversTypes['AkashaBeamStreamConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaBeamStreamListArgs>>;
  akashaBeamStreamListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaBeamStreamListCountArgs>>;
  akashaBlockStorage?: Resolver<Types.Maybe<ResolversTypes['AkashaBlockStorage']>, ParentType, ContextType, RequireFields<Types.CeramicAccountAkashaBlockStorageArgs, 'with'>>;
  akashaBlockStorageList?: Resolver<Types.Maybe<ResolversTypes['AkashaBlockStorageConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaBlockStorageListArgs>>;
  akashaBlockStorageListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaBlockStorageListCountArgs>>;
  akashaContentBlockInterfaceList?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlockInterfaceConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaContentBlockInterfaceListArgs>>;
  akashaContentBlockInterfaceListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaContentBlockInterfaceListCountArgs>>;
  akashaContentBlockList?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlockConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaContentBlockListArgs>>;
  akashaContentBlockListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaContentBlockListCountArgs>>;
  akashaContentBlockStream?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlockStream']>, ParentType, ContextType, RequireFields<Types.CeramicAccountAkashaContentBlockStreamArgs, 'with'>>;
  akashaContentBlockStreamList?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlockStreamConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaContentBlockStreamListArgs>>;
  akashaContentBlockStreamListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaContentBlockStreamListCountArgs>>;
  akashaFollow?: Resolver<Types.Maybe<ResolversTypes['AkashaFollow']>, ParentType, ContextType, RequireFields<Types.CeramicAccountAkashaFollowArgs, 'with'>>;
  akashaFollowInterfaceList?: Resolver<Types.Maybe<ResolversTypes['AkashaFollowInterfaceConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaFollowInterfaceListArgs>>;
  akashaFollowInterfaceListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaFollowInterfaceListCountArgs>>;
  akashaFollowList?: Resolver<Types.Maybe<ResolversTypes['AkashaFollowConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaFollowListArgs>>;
  akashaFollowListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaFollowListCountArgs>>;
  akashaIndexStreamInterfaceList?: Resolver<Types.Maybe<ResolversTypes['AkashaIndexStreamInterfaceConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaIndexStreamInterfaceListArgs>>;
  akashaIndexStreamInterfaceListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaIndexStreamInterfaceListCountArgs>>;
  akashaIndexedStream?: Resolver<Types.Maybe<ResolversTypes['AkashaIndexedStream']>, ParentType, ContextType, RequireFields<Types.CeramicAccountAkashaIndexedStreamArgs, 'with'>>;
  akashaIndexedStreamList?: Resolver<Types.Maybe<ResolversTypes['AkashaIndexedStreamConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaIndexedStreamListArgs>>;
  akashaIndexedStreamListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaIndexedStreamListCountArgs>>;
  akashaInterestsStream?: Resolver<Types.Maybe<ResolversTypes['AkashaInterestsStream']>, ParentType, ContextType, RequireFields<Types.CeramicAccountAkashaInterestsStreamArgs, 'with'>>;
  akashaInterestsStreamList?: Resolver<Types.Maybe<ResolversTypes['AkashaInterestsStreamConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaInterestsStreamListArgs>>;
  akashaInterestsStreamListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaInterestsStreamListCountArgs>>;
  akashaProfile?: Resolver<Types.Maybe<ResolversTypes['AkashaProfile']>, ParentType, ContextType>;
  akashaProfileInterests?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileInterests']>, ParentType, ContextType>;
  akashaProfileInterestsInterfaceList?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileInterestsInterfaceConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaProfileInterestsInterfaceListArgs>>;
  akashaProfileInterestsInterfaceListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  akashaProfileInterfaceList?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileInterfaceConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaProfileInterfaceListArgs>>;
  akashaProfileInterfaceListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaProfileInterfaceListCountArgs>>;
  akashaProfileStream?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileStream']>, ParentType, ContextType, RequireFields<Types.CeramicAccountAkashaProfileStreamArgs, 'with'>>;
  akashaProfileStreamList?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileStreamConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaProfileStreamListArgs>>;
  akashaProfileStreamListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaProfileStreamListCountArgs>>;
  akashaReflectInterfaceList?: Resolver<Types.Maybe<ResolversTypes['AkashaReflectInterfaceConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaReflectInterfaceListArgs>>;
  akashaReflectInterfaceListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaReflectInterfaceListCountArgs>>;
  akashaReflectList?: Resolver<Types.Maybe<ResolversTypes['AkashaReflectConnection']>, ParentType, ContextType, Partial<Types.CeramicAccountAkashaReflectListArgs>>;
  akashaReflectListCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.CeramicAccountAkashaReflectListCountArgs>>;
  akashaReflectStream?: Resolver<Types.Maybe<ResolversTypes['AkashaReflectStream']>, ParentType, ContextType, RequireFields<Types.CeramicAccountAkashaReflectStreamArgs, 'with'>>;
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

export type CreateAkashaBeamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAkashaBeamPayload'] = ResolversParentTypes['CreateAkashaBeamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaBeam'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateAkashaBeamPayloadNodeArgs, 'id'>>;
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

export type CreateAkashaReflectPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['CreateAkashaReflectPayload'] = ResolversParentTypes['CreateAkashaReflectPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaReflect'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.CreateAkashaReflectPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DID'], any> {
  name: 'DID';
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type EnableIndexingAkashaAppPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnableIndexingAkashaAppPayload'] = ResolversParentTypes['EnableIndexingAkashaAppPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<Types.Maybe<ResolversTypes['AkashaApp']>, ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.EnableIndexingAkashaAppPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnableIndexingAkashaAppReleasePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnableIndexingAkashaAppReleasePayload'] = ResolversParentTypes['EnableIndexingAkashaAppReleasePayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<Types.Maybe<ResolversTypes['AkashaAppRelease']>, ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.EnableIndexingAkashaAppReleasePayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnableIndexingAkashaAppsStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnableIndexingAkashaAppsStreamPayload'] = ResolversParentTypes['EnableIndexingAkashaAppsStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<Types.Maybe<ResolversTypes['AkashaAppsStream']>, ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.EnableIndexingAkashaAppsStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnableIndexingAkashaBeamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnableIndexingAkashaBeamPayload'] = ResolversParentTypes['EnableIndexingAkashaBeamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<Types.Maybe<ResolversTypes['AkashaBeam']>, ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.EnableIndexingAkashaBeamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnableIndexingAkashaBeamStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnableIndexingAkashaBeamStreamPayload'] = ResolversParentTypes['EnableIndexingAkashaBeamStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<Types.Maybe<ResolversTypes['AkashaBeamStream']>, ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.EnableIndexingAkashaBeamStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnableIndexingAkashaBlockStoragePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnableIndexingAkashaBlockStoragePayload'] = ResolversParentTypes['EnableIndexingAkashaBlockStoragePayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<Types.Maybe<ResolversTypes['AkashaBlockStorage']>, ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.EnableIndexingAkashaBlockStoragePayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnableIndexingAkashaContentBlockPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnableIndexingAkashaContentBlockPayload'] = ResolversParentTypes['EnableIndexingAkashaContentBlockPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlock']>, ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.EnableIndexingAkashaContentBlockPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnableIndexingAkashaContentBlockStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnableIndexingAkashaContentBlockStreamPayload'] = ResolversParentTypes['EnableIndexingAkashaContentBlockStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlockStream']>, ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.EnableIndexingAkashaContentBlockStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnableIndexingAkashaFollowPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnableIndexingAkashaFollowPayload'] = ResolversParentTypes['EnableIndexingAkashaFollowPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<Types.Maybe<ResolversTypes['AkashaFollow']>, ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.EnableIndexingAkashaFollowPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnableIndexingAkashaIndexedStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnableIndexingAkashaIndexedStreamPayload'] = ResolversParentTypes['EnableIndexingAkashaIndexedStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<Types.Maybe<ResolversTypes['AkashaIndexedStream']>, ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.EnableIndexingAkashaIndexedStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnableIndexingAkashaInterestsStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnableIndexingAkashaInterestsStreamPayload'] = ResolversParentTypes['EnableIndexingAkashaInterestsStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<Types.Maybe<ResolversTypes['AkashaInterestsStream']>, ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.EnableIndexingAkashaInterestsStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnableIndexingAkashaProfileInterestsPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnableIndexingAkashaProfileInterestsPayload'] = ResolversParentTypes['EnableIndexingAkashaProfileInterestsPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileInterests']>, ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.EnableIndexingAkashaProfileInterestsPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnableIndexingAkashaProfilePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnableIndexingAkashaProfilePayload'] = ResolversParentTypes['EnableIndexingAkashaProfilePayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<Types.Maybe<ResolversTypes['AkashaProfile']>, ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.EnableIndexingAkashaProfilePayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnableIndexingAkashaProfileStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnableIndexingAkashaProfileStreamPayload'] = ResolversParentTypes['EnableIndexingAkashaProfileStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileStream']>, ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.EnableIndexingAkashaProfileStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnableIndexingAkashaReflectPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnableIndexingAkashaReflectPayload'] = ResolversParentTypes['EnableIndexingAkashaReflectPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<Types.Maybe<ResolversTypes['AkashaReflect']>, ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.EnableIndexingAkashaReflectPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EnableIndexingAkashaReflectStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['EnableIndexingAkashaReflectStreamPayload'] = ResolversParentTypes['EnableIndexingAkashaReflectStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<Types.Maybe<ResolversTypes['AkashaReflectStream']>, ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.EnableIndexingAkashaReflectStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

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

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createAkashaBeam?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaBeamPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaBeamArgs, 'input'>>;
  createAkashaContentBlock?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaContentBlockPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaContentBlockArgs, 'input'>>;
  createAkashaProfile?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaProfilePayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaProfileArgs, 'input'>>;
  createAkashaProfileInterests?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaProfileInterestsPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaProfileInterestsArgs, 'input'>>;
  createAkashaReflect?: Resolver<Types.Maybe<ResolversTypes['CreateAkashaReflectPayload']>, ParentType, ContextType, RequireFields<Types.MutationCreateAkashaReflectArgs, 'input'>>;
  enableIndexingAkashaApp?: Resolver<Types.Maybe<ResolversTypes['EnableIndexingAkashaAppPayload']>, ParentType, ContextType, RequireFields<Types.MutationEnableIndexingAkashaAppArgs, 'input'>>;
  enableIndexingAkashaAppRelease?: Resolver<Types.Maybe<ResolversTypes['EnableIndexingAkashaAppReleasePayload']>, ParentType, ContextType, RequireFields<Types.MutationEnableIndexingAkashaAppReleaseArgs, 'input'>>;
  enableIndexingAkashaAppsStream?: Resolver<Types.Maybe<ResolversTypes['EnableIndexingAkashaAppsStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationEnableIndexingAkashaAppsStreamArgs, 'input'>>;
  enableIndexingAkashaBeam?: Resolver<Types.Maybe<ResolversTypes['EnableIndexingAkashaBeamPayload']>, ParentType, ContextType, RequireFields<Types.MutationEnableIndexingAkashaBeamArgs, 'input'>>;
  enableIndexingAkashaBeamStream?: Resolver<Types.Maybe<ResolversTypes['EnableIndexingAkashaBeamStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationEnableIndexingAkashaBeamStreamArgs, 'input'>>;
  enableIndexingAkashaBlockStorage?: Resolver<Types.Maybe<ResolversTypes['EnableIndexingAkashaBlockStoragePayload']>, ParentType, ContextType, RequireFields<Types.MutationEnableIndexingAkashaBlockStorageArgs, 'input'>>;
  enableIndexingAkashaContentBlock?: Resolver<Types.Maybe<ResolversTypes['EnableIndexingAkashaContentBlockPayload']>, ParentType, ContextType, RequireFields<Types.MutationEnableIndexingAkashaContentBlockArgs, 'input'>>;
  enableIndexingAkashaContentBlockStream?: Resolver<Types.Maybe<ResolversTypes['EnableIndexingAkashaContentBlockStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationEnableIndexingAkashaContentBlockStreamArgs, 'input'>>;
  enableIndexingAkashaFollow?: Resolver<Types.Maybe<ResolversTypes['EnableIndexingAkashaFollowPayload']>, ParentType, ContextType, RequireFields<Types.MutationEnableIndexingAkashaFollowArgs, 'input'>>;
  enableIndexingAkashaIndexedStream?: Resolver<Types.Maybe<ResolversTypes['EnableIndexingAkashaIndexedStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationEnableIndexingAkashaIndexedStreamArgs, 'input'>>;
  enableIndexingAkashaInterestsStream?: Resolver<Types.Maybe<ResolversTypes['EnableIndexingAkashaInterestsStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationEnableIndexingAkashaInterestsStreamArgs, 'input'>>;
  enableIndexingAkashaProfile?: Resolver<Types.Maybe<ResolversTypes['EnableIndexingAkashaProfilePayload']>, ParentType, ContextType, RequireFields<Types.MutationEnableIndexingAkashaProfileArgs, 'input'>>;
  enableIndexingAkashaProfileInterests?: Resolver<Types.Maybe<ResolversTypes['EnableIndexingAkashaProfileInterestsPayload']>, ParentType, ContextType, RequireFields<Types.MutationEnableIndexingAkashaProfileInterestsArgs, 'input'>>;
  enableIndexingAkashaProfileStream?: Resolver<Types.Maybe<ResolversTypes['EnableIndexingAkashaProfileStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationEnableIndexingAkashaProfileStreamArgs, 'input'>>;
  enableIndexingAkashaReflect?: Resolver<Types.Maybe<ResolversTypes['EnableIndexingAkashaReflectPayload']>, ParentType, ContextType, RequireFields<Types.MutationEnableIndexingAkashaReflectArgs, 'input'>>;
  enableIndexingAkashaReflectStream?: Resolver<Types.Maybe<ResolversTypes['EnableIndexingAkashaReflectStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationEnableIndexingAkashaReflectStreamArgs, 'input'>>;
  indexApp?: Resolver<Types.Maybe<ResolversTypes['IndexAppPayload']>, ParentType, ContextType, Partial<Types.MutationIndexAppArgs>>;
  indexBeam?: Resolver<Types.Maybe<ResolversTypes['IndexBeamPayload']>, ParentType, ContextType, Partial<Types.MutationIndexBeamArgs>>;
  indexContentBlock?: Resolver<Types.Maybe<ResolversTypes['IndexContentBlockPayload']>, ParentType, ContextType, Partial<Types.MutationIndexContentBlockArgs>>;
  indexInterest?: Resolver<Types.Maybe<ResolversTypes['IndexInterestPayload']>, ParentType, ContextType, Partial<Types.MutationIndexInterestArgs>>;
  indexProfile?: Resolver<Types.Maybe<ResolversTypes['IndexProfilePayload']>, ParentType, ContextType, Partial<Types.MutationIndexProfileArgs>>;
  indexReflection?: Resolver<Types.Maybe<ResolversTypes['IndexReflectPayload']>, ParentType, ContextType, Partial<Types.MutationIndexReflectionArgs>>;
  setAkashaApp?: Resolver<Types.Maybe<ResolversTypes['SetAkashaAppPayload']>, ParentType, ContextType, RequireFields<Types.MutationSetAkashaAppArgs, 'input'>>;
  setAkashaAppRelease?: Resolver<Types.Maybe<ResolversTypes['SetAkashaAppReleasePayload']>, ParentType, ContextType, RequireFields<Types.MutationSetAkashaAppReleaseArgs, 'input'>>;
  setAkashaAppsStream?: Resolver<Types.Maybe<ResolversTypes['SetAkashaAppsStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationSetAkashaAppsStreamArgs, 'input'>>;
  setAkashaBeamStream?: Resolver<Types.Maybe<ResolversTypes['SetAkashaBeamStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationSetAkashaBeamStreamArgs, 'input'>>;
  setAkashaBlockStorage?: Resolver<Types.Maybe<ResolversTypes['SetAkashaBlockStoragePayload']>, ParentType, ContextType, RequireFields<Types.MutationSetAkashaBlockStorageArgs, 'input'>>;
  setAkashaContentBlockStream?: Resolver<Types.Maybe<ResolversTypes['SetAkashaContentBlockStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationSetAkashaContentBlockStreamArgs, 'input'>>;
  setAkashaFollow?: Resolver<Types.Maybe<ResolversTypes['SetAkashaFollowPayload']>, ParentType, ContextType, RequireFields<Types.MutationSetAkashaFollowArgs, 'input'>>;
  setAkashaIndexedStream?: Resolver<Types.Maybe<ResolversTypes['SetAkashaIndexedStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationSetAkashaIndexedStreamArgs, 'input'>>;
  setAkashaInterestsStream?: Resolver<Types.Maybe<ResolversTypes['SetAkashaInterestsStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationSetAkashaInterestsStreamArgs, 'input'>>;
  setAkashaProfile?: Resolver<Types.Maybe<ResolversTypes['SetAkashaProfilePayload']>, ParentType, ContextType, RequireFields<Types.MutationSetAkashaProfileArgs, 'input'>>;
  setAkashaProfileInterests?: Resolver<Types.Maybe<ResolversTypes['SetAkashaProfileInterestsPayload']>, ParentType, ContextType, RequireFields<Types.MutationSetAkashaProfileInterestsArgs, 'input'>>;
  setAkashaProfileStream?: Resolver<Types.Maybe<ResolversTypes['SetAkashaProfileStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationSetAkashaProfileStreamArgs, 'input'>>;
  setAkashaReflectStream?: Resolver<Types.Maybe<ResolversTypes['SetAkashaReflectStreamPayload']>, ParentType, ContextType, RequireFields<Types.MutationSetAkashaReflectStreamArgs, 'input'>>;
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

export type ProfileLabeledResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProfileLabeled'] = ResolversParentTypes['ProfileLabeled']> = {
  labelType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProfileLinkSourceResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProfileLinkSource'] = ResolversParentTypes['ProfileLinkSource']> = {
  href?: Resolver<ResolversTypes['URI'], ParentType, ContextType>;
  label?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  akashaAppCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaAppCountArgs>>;
  akashaAppIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaAppConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaAppIndexArgs>>;
  akashaAppInterfaceCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaAppInterfaceCountArgs>>;
  akashaAppInterfaceIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaAppInterfaceConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaAppInterfaceIndexArgs>>;
  akashaAppReleaseCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaAppReleaseCountArgs>>;
  akashaAppReleaseIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaAppReleaseConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaAppReleaseIndexArgs>>;
  akashaAppReleaseInterfaceCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaAppReleaseInterfaceCountArgs>>;
  akashaAppReleaseInterfaceIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaAppReleaseInterfaceConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaAppReleaseInterfaceIndexArgs>>;
  akashaAppsStreamCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaAppsStreamCountArgs>>;
  akashaAppsStreamIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaAppsStreamConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaAppsStreamIndexArgs>>;
  akashaBeamCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaBeamCountArgs>>;
  akashaBeamIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaBeamConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaBeamIndexArgs>>;
  akashaBeamInterfaceCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaBeamInterfaceCountArgs>>;
  akashaBeamInterfaceIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaBeamInterfaceConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaBeamInterfaceIndexArgs>>;
  akashaBeamStreamCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaBeamStreamCountArgs>>;
  akashaBeamStreamIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaBeamStreamConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaBeamStreamIndexArgs>>;
  akashaBlockStorageCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaBlockStorageCountArgs>>;
  akashaBlockStorageIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaBlockStorageConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaBlockStorageIndexArgs>>;
  akashaContentBlockCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaContentBlockCountArgs>>;
  akashaContentBlockIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlockConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaContentBlockIndexArgs>>;
  akashaContentBlockInterfaceCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaContentBlockInterfaceCountArgs>>;
  akashaContentBlockInterfaceIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlockInterfaceConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaContentBlockInterfaceIndexArgs>>;
  akashaContentBlockStreamCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaContentBlockStreamCountArgs>>;
  akashaContentBlockStreamIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaContentBlockStreamConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaContentBlockStreamIndexArgs>>;
  akashaFollowCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaFollowCountArgs>>;
  akashaFollowIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaFollowConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaFollowIndexArgs>>;
  akashaFollowInterfaceCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaFollowInterfaceCountArgs>>;
  akashaFollowInterfaceIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaFollowInterfaceConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaFollowInterfaceIndexArgs>>;
  akashaIndexStreamInterfaceCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaIndexStreamInterfaceCountArgs>>;
  akashaIndexStreamInterfaceIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaIndexStreamInterfaceConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaIndexStreamInterfaceIndexArgs>>;
  akashaIndexedStreamCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaIndexedStreamCountArgs>>;
  akashaIndexedStreamIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaIndexedStreamConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaIndexedStreamIndexArgs>>;
  akashaInterestsStreamCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaInterestsStreamCountArgs>>;
  akashaInterestsStreamIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaInterestsStreamConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaInterestsStreamIndexArgs>>;
  akashaProfileCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaProfileCountArgs>>;
  akashaProfileIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaProfileIndexArgs>>;
  akashaProfileInterestsCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  akashaProfileInterestsIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileInterestsConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaProfileInterestsIndexArgs>>;
  akashaProfileInterestsInterfaceCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  akashaProfileInterestsInterfaceIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileInterestsInterfaceConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaProfileInterestsInterfaceIndexArgs>>;
  akashaProfileInterfaceCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaProfileInterfaceCountArgs>>;
  akashaProfileInterfaceIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileInterfaceConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaProfileInterfaceIndexArgs>>;
  akashaProfileStreamCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaProfileStreamCountArgs>>;
  akashaProfileStreamIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaProfileStreamConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaProfileStreamIndexArgs>>;
  akashaReflectCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaReflectCountArgs>>;
  akashaReflectIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaReflectConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaReflectIndexArgs>>;
  akashaReflectInterfaceCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaReflectInterfaceCountArgs>>;
  akashaReflectInterfaceIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaReflectInterfaceConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaReflectInterfaceIndexArgs>>;
  akashaReflectStreamCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType, Partial<Types.QueryAkashaReflectStreamCountArgs>>;
  akashaReflectStreamIndex?: Resolver<Types.Maybe<ResolversTypes['AkashaReflectStreamConnection']>, ParentType, ContextType, Partial<Types.QueryAkashaReflectStreamIndexArgs>>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.QueryNodeArgs, 'id'>>;
  nodes?: Resolver<Array<Types.Maybe<ResolversTypes['Node']>>, ParentType, ContextType, RequireFields<Types.QueryNodesArgs, 'ids'>>;
  serviceStatus?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
};

export type ReflectProviderValueResolvers<ContextType = any, ParentType extends ResolversParentTypes['ReflectProviderValue'] = ResolversParentTypes['ReflectProviderValue']> = {
  label?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  propertyType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetAkashaAppPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetAkashaAppPayload'] = ResolversParentTypes['SetAkashaAppPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaApp'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.SetAkashaAppPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetAkashaAppReleasePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetAkashaAppReleasePayload'] = ResolversParentTypes['SetAkashaAppReleasePayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaAppRelease'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.SetAkashaAppReleasePayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetAkashaAppsStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetAkashaAppsStreamPayload'] = ResolversParentTypes['SetAkashaAppsStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaAppsStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.SetAkashaAppsStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetAkashaBeamStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetAkashaBeamStreamPayload'] = ResolversParentTypes['SetAkashaBeamStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaBeamStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.SetAkashaBeamStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetAkashaBlockStoragePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetAkashaBlockStoragePayload'] = ResolversParentTypes['SetAkashaBlockStoragePayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaBlockStorage'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.SetAkashaBlockStoragePayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetAkashaContentBlockStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetAkashaContentBlockStreamPayload'] = ResolversParentTypes['SetAkashaContentBlockStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaContentBlockStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.SetAkashaContentBlockStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetAkashaFollowPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetAkashaFollowPayload'] = ResolversParentTypes['SetAkashaFollowPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaFollow'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.SetAkashaFollowPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetAkashaIndexedStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetAkashaIndexedStreamPayload'] = ResolversParentTypes['SetAkashaIndexedStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaIndexedStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.SetAkashaIndexedStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetAkashaInterestsStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetAkashaInterestsStreamPayload'] = ResolversParentTypes['SetAkashaInterestsStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaInterestsStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.SetAkashaInterestsStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetAkashaProfileInterestsPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetAkashaProfileInterestsPayload'] = ResolversParentTypes['SetAkashaProfileInterestsPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaProfileInterests'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.SetAkashaProfileInterestsPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetAkashaProfilePayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetAkashaProfilePayload'] = ResolversParentTypes['SetAkashaProfilePayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaProfile'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.SetAkashaProfilePayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetAkashaProfileStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetAkashaProfileStreamPayload'] = ResolversParentTypes['SetAkashaProfileStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaProfileStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.SetAkashaProfileStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SetAkashaReflectStreamPayloadResolvers<ContextType = any, ParentType extends ResolversParentTypes['SetAkashaReflectStreamPayload'] = ResolversParentTypes['SetAkashaReflectStreamPayload']> = {
  clientMutationId?: Resolver<Types.Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  document?: Resolver<ResolversTypes['AkashaReflectStream'], ParentType, ContextType>;
  node?: Resolver<Types.Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<Types.SetAkashaReflectStreamPayloadNodeArgs, 'id'>>;
  viewer?: Resolver<Types.Maybe<ResolversTypes['CeramicAccount']>, ParentType, ContextType>;
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
  AkashaAppInterface?: AkashaAppInterfaceResolvers<ContextType>;
  AkashaAppInterfaceConnection?: AkashaAppInterfaceConnectionResolvers<ContextType>;
  AkashaAppInterfaceEdge?: AkashaAppInterfaceEdgeResolvers<ContextType>;
  AkashaAppRelease?: AkashaAppReleaseResolvers<ContextType>;
  AkashaAppReleaseConnection?: AkashaAppReleaseConnectionResolvers<ContextType>;
  AkashaAppReleaseEdge?: AkashaAppReleaseEdgeResolvers<ContextType>;
  AkashaAppReleaseInterface?: AkashaAppReleaseInterfaceResolvers<ContextType>;
  AkashaAppReleaseInterfaceConnection?: AkashaAppReleaseInterfaceConnectionResolvers<ContextType>;
  AkashaAppReleaseInterfaceEdge?: AkashaAppReleaseInterfaceEdgeResolvers<ContextType>;
  AkashaAppsStream?: AkashaAppsStreamResolvers<ContextType>;
  AkashaAppsStreamConnection?: AkashaAppsStreamConnectionResolvers<ContextType>;
  AkashaAppsStreamEdge?: AkashaAppsStreamEdgeResolvers<ContextType>;
  AkashaBeam?: AkashaBeamResolvers<ContextType>;
  AkashaBeamConnection?: AkashaBeamConnectionResolvers<ContextType>;
  AkashaBeamEdge?: AkashaBeamEdgeResolvers<ContextType>;
  AkashaBeamInterface?: AkashaBeamInterfaceResolvers<ContextType>;
  AkashaBeamInterfaceConnection?: AkashaBeamInterfaceConnectionResolvers<ContextType>;
  AkashaBeamInterfaceEdge?: AkashaBeamInterfaceEdgeResolvers<ContextType>;
  AkashaBeamStream?: AkashaBeamStreamResolvers<ContextType>;
  AkashaBeamStreamConnection?: AkashaBeamStreamConnectionResolvers<ContextType>;
  AkashaBeamStreamEdge?: AkashaBeamStreamEdgeResolvers<ContextType>;
  AkashaBlockStorage?: AkashaBlockStorageResolvers<ContextType>;
  AkashaBlockStorageConnection?: AkashaBlockStorageConnectionResolvers<ContextType>;
  AkashaBlockStorageEdge?: AkashaBlockStorageEdgeResolvers<ContextType>;
  AkashaContentBlock?: AkashaContentBlockResolvers<ContextType>;
  AkashaContentBlockConnection?: AkashaContentBlockConnectionResolvers<ContextType>;
  AkashaContentBlockEdge?: AkashaContentBlockEdgeResolvers<ContextType>;
  AkashaContentBlockInterface?: AkashaContentBlockInterfaceResolvers<ContextType>;
  AkashaContentBlockInterfaceConnection?: AkashaContentBlockInterfaceConnectionResolvers<ContextType>;
  AkashaContentBlockInterfaceEdge?: AkashaContentBlockInterfaceEdgeResolvers<ContextType>;
  AkashaContentBlockStream?: AkashaContentBlockStreamResolvers<ContextType>;
  AkashaContentBlockStreamConnection?: AkashaContentBlockStreamConnectionResolvers<ContextType>;
  AkashaContentBlockStreamEdge?: AkashaContentBlockStreamEdgeResolvers<ContextType>;
  AkashaFollow?: AkashaFollowResolvers<ContextType>;
  AkashaFollowConnection?: AkashaFollowConnectionResolvers<ContextType>;
  AkashaFollowEdge?: AkashaFollowEdgeResolvers<ContextType>;
  AkashaFollowInterface?: AkashaFollowInterfaceResolvers<ContextType>;
  AkashaFollowInterfaceConnection?: AkashaFollowInterfaceConnectionResolvers<ContextType>;
  AkashaFollowInterfaceEdge?: AkashaFollowInterfaceEdgeResolvers<ContextType>;
  AkashaIndexStreamInterface?: AkashaIndexStreamInterfaceResolvers<ContextType>;
  AkashaIndexStreamInterfaceConnection?: AkashaIndexStreamInterfaceConnectionResolvers<ContextType>;
  AkashaIndexStreamInterfaceEdge?: AkashaIndexStreamInterfaceEdgeResolvers<ContextType>;
  AkashaIndexedStream?: AkashaIndexedStreamResolvers<ContextType>;
  AkashaIndexedStreamConnection?: AkashaIndexedStreamConnectionResolvers<ContextType>;
  AkashaIndexedStreamEdge?: AkashaIndexedStreamEdgeResolvers<ContextType>;
  AkashaInterestsStream?: AkashaInterestsStreamResolvers<ContextType>;
  AkashaInterestsStreamConnection?: AkashaInterestsStreamConnectionResolvers<ContextType>;
  AkashaInterestsStreamEdge?: AkashaInterestsStreamEdgeResolvers<ContextType>;
  AkashaProfile?: AkashaProfileResolvers<ContextType>;
  AkashaProfileConnection?: AkashaProfileConnectionResolvers<ContextType>;
  AkashaProfileEdge?: AkashaProfileEdgeResolvers<ContextType>;
  AkashaProfileInterests?: AkashaProfileInterestsResolvers<ContextType>;
  AkashaProfileInterestsConnection?: AkashaProfileInterestsConnectionResolvers<ContextType>;
  AkashaProfileInterestsEdge?: AkashaProfileInterestsEdgeResolvers<ContextType>;
  AkashaProfileInterestsInterface?: AkashaProfileInterestsInterfaceResolvers<ContextType>;
  AkashaProfileInterestsInterfaceConnection?: AkashaProfileInterestsInterfaceConnectionResolvers<ContextType>;
  AkashaProfileInterestsInterfaceEdge?: AkashaProfileInterestsInterfaceEdgeResolvers<ContextType>;
  AkashaProfileInterface?: AkashaProfileInterfaceResolvers<ContextType>;
  AkashaProfileInterfaceConnection?: AkashaProfileInterfaceConnectionResolvers<ContextType>;
  AkashaProfileInterfaceEdge?: AkashaProfileInterfaceEdgeResolvers<ContextType>;
  AkashaProfileStream?: AkashaProfileStreamResolvers<ContextType>;
  AkashaProfileStreamConnection?: AkashaProfileStreamConnectionResolvers<ContextType>;
  AkashaProfileStreamEdge?: AkashaProfileStreamEdgeResolvers<ContextType>;
  AkashaReflect?: AkashaReflectResolvers<ContextType>;
  AkashaReflectConnection?: AkashaReflectConnectionResolvers<ContextType>;
  AkashaReflectEdge?: AkashaReflectEdgeResolvers<ContextType>;
  AkashaReflectInterface?: AkashaReflectInterfaceResolvers<ContextType>;
  AkashaReflectInterfaceConnection?: AkashaReflectInterfaceConnectionResolvers<ContextType>;
  AkashaReflectInterfaceEdge?: AkashaReflectInterfaceEdgeResolvers<ContextType>;
  AkashaReflectStream?: AkashaReflectStreamResolvers<ContextType>;
  AkashaReflectStreamConnection?: AkashaReflectStreamConnectionResolvers<ContextType>;
  AkashaReflectStreamEdge?: AkashaReflectStreamEdgeResolvers<ContextType>;
  AppImageSource?: AppImageSourceResolvers<ContextType>;
  AppLinkSource?: AppLinkSourceResolvers<ContextType>;
  AppProviderValue?: AppProviderValueResolvers<ContextType>;
  BeamBlockRecord?: BeamBlockRecordResolvers<ContextType>;
  BeamEmbeddedType?: BeamEmbeddedTypeResolvers<ContextType>;
  BeamLabeled?: BeamLabeledResolvers<ContextType>;
  BlockLabeledValue?: BlockLabeledValueResolvers<ContextType>;
  CacaoHeaderT?: GraphQLScalarType;
  CacaoSignatureT?: GraphQLScalarType;
  CeramicAccount?: CeramicAccountResolvers<ContextType>;
  CeramicCommitID?: GraphQLScalarType;
  CeramicStreamID?: GraphQLScalarType;
  CreateAkashaBeamPayload?: CreateAkashaBeamPayloadResolvers<ContextType>;
  CreateAkashaContentBlockPayload?: CreateAkashaContentBlockPayloadResolvers<ContextType>;
  CreateAkashaProfileInterestsPayload?: CreateAkashaProfileInterestsPayloadResolvers<ContextType>;
  CreateAkashaProfilePayload?: CreateAkashaProfilePayloadResolvers<ContextType>;
  CreateAkashaReflectPayload?: CreateAkashaReflectPayloadResolvers<ContextType>;
  DID?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  EnableIndexingAkashaAppPayload?: EnableIndexingAkashaAppPayloadResolvers<ContextType>;
  EnableIndexingAkashaAppReleasePayload?: EnableIndexingAkashaAppReleasePayloadResolvers<ContextType>;
  EnableIndexingAkashaAppsStreamPayload?: EnableIndexingAkashaAppsStreamPayloadResolvers<ContextType>;
  EnableIndexingAkashaBeamPayload?: EnableIndexingAkashaBeamPayloadResolvers<ContextType>;
  EnableIndexingAkashaBeamStreamPayload?: EnableIndexingAkashaBeamStreamPayloadResolvers<ContextType>;
  EnableIndexingAkashaBlockStoragePayload?: EnableIndexingAkashaBlockStoragePayloadResolvers<ContextType>;
  EnableIndexingAkashaContentBlockPayload?: EnableIndexingAkashaContentBlockPayloadResolvers<ContextType>;
  EnableIndexingAkashaContentBlockStreamPayload?: EnableIndexingAkashaContentBlockStreamPayloadResolvers<ContextType>;
  EnableIndexingAkashaFollowPayload?: EnableIndexingAkashaFollowPayloadResolvers<ContextType>;
  EnableIndexingAkashaIndexedStreamPayload?: EnableIndexingAkashaIndexedStreamPayloadResolvers<ContextType>;
  EnableIndexingAkashaInterestsStreamPayload?: EnableIndexingAkashaInterestsStreamPayloadResolvers<ContextType>;
  EnableIndexingAkashaProfileInterestsPayload?: EnableIndexingAkashaProfileInterestsPayloadResolvers<ContextType>;
  EnableIndexingAkashaProfilePayload?: EnableIndexingAkashaProfilePayloadResolvers<ContextType>;
  EnableIndexingAkashaProfileStreamPayload?: EnableIndexingAkashaProfileStreamPayloadResolvers<ContextType>;
  EnableIndexingAkashaReflectPayload?: EnableIndexingAkashaReflectPayloadResolvers<ContextType>;
  EnableIndexingAkashaReflectStreamPayload?: EnableIndexingAkashaReflectStreamPayloadResolvers<ContextType>;
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
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  ProfileImageSource?: ProfileImageSourceResolvers<ContextType>;
  ProfileImageVersions?: ProfileImageVersionsResolvers<ContextType>;
  ProfileLabeled?: ProfileLabeledResolvers<ContextType>;
  ProfileLinkSource?: ProfileLinkSourceResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ReflectProviderValue?: ReflectProviderValueResolvers<ContextType>;
  SetAkashaAppPayload?: SetAkashaAppPayloadResolvers<ContextType>;
  SetAkashaAppReleasePayload?: SetAkashaAppReleasePayloadResolvers<ContextType>;
  SetAkashaAppsStreamPayload?: SetAkashaAppsStreamPayloadResolvers<ContextType>;
  SetAkashaBeamStreamPayload?: SetAkashaBeamStreamPayloadResolvers<ContextType>;
  SetAkashaBlockStoragePayload?: SetAkashaBlockStoragePayloadResolvers<ContextType>;
  SetAkashaContentBlockStreamPayload?: SetAkashaContentBlockStreamPayloadResolvers<ContextType>;
  SetAkashaFollowPayload?: SetAkashaFollowPayloadResolvers<ContextType>;
  SetAkashaIndexedStreamPayload?: SetAkashaIndexedStreamPayloadResolvers<ContextType>;
  SetAkashaInterestsStreamPayload?: SetAkashaInterestsStreamPayloadResolvers<ContextType>;
  SetAkashaProfileInterestsPayload?: SetAkashaProfileInterestsPayloadResolvers<ContextType>;
  SetAkashaProfilePayload?: SetAkashaProfilePayloadResolvers<ContextType>;
  SetAkashaProfileStreamPayload?: SetAkashaProfileStreamPayloadResolvers<ContextType>;
  SetAkashaReflectStreamPayload?: SetAkashaReflectStreamPayloadResolvers<ContextType>;
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
