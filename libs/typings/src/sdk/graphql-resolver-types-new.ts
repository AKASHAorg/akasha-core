import type * as Types from './graphql-types-new';

import type { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
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
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  AkashaAppInterface: ( Omit<Types.AkashaApp, 'author' | 'contributors' | 'coverImage' | 'gallery' | 'logoImage' | 'releases'> & { author: _RefType['CeramicAccount'], contributors?: Types.Maybe<Array<Types.Maybe<_RefType['CeramicAccount']>>>, coverImage?: Types.Maybe<_RefType['AppImageSource']>, gallery?: Types.Maybe<Array<Types.Maybe<_RefType['AppImageSource']>>>, logoImage?: Types.Maybe<_RefType['AppImageSource']>, releases: _RefType['AkashaAppReleaseInterfaceConnection'] } );
  AkashaAppReleaseInterface: ( Omit<Types.AkashaAppRelease, 'application'> & { application?: Types.Maybe<_RefType['AkashaAppInterface']> } );
  AkashaBeamInterface: ( Omit<Types.AkashaBeam, 'app' | 'appVersion' | 'author' | 'mentions' | 'reflections'> & { app?: Types.Maybe<_RefType['AkashaAppInterface']>, appVersion?: Types.Maybe<_RefType['AkashaAppReleaseInterface']>, author: _RefType['CeramicAccount'], mentions?: Types.Maybe<Array<Types.Maybe<_RefType['CeramicAccount']>>>, reflections: _RefType['AkashaReflectInterfaceConnection'] } );
  AkashaContentBlockInterface: ( Omit<Types.AkashaBlockStorage, 'appVersion' | 'author' | 'block'> & { appVersion?: Types.Maybe<_RefType['AkashaAppReleaseInterface']>, author: _RefType['CeramicAccount'], block?: Types.Maybe<_RefType['AkashaContentBlock']> } ) | ( Omit<Types.AkashaContentBlock, 'appVersion' | 'author'> & { appVersion?: Types.Maybe<_RefType['AkashaAppReleaseInterface']>, author: _RefType['CeramicAccount'] } );
  AkashaFollowInterface: ( Omit<Types.AkashaFollow, 'did' | 'profile'> & { did: _RefType['CeramicAccount'], profile?: Types.Maybe<_RefType['AkashaProfileInterface']> } );
  AkashaIndexStreamInterface: ( Omit<Types.AkashaAppsStream, 'application' | 'moderation'> & { application?: Types.Maybe<_RefType['AkashaAppInterface']>, moderation?: Types.Maybe<_RefType['Node']> } ) | ( Omit<Types.AkashaBeamStream, 'beam' | 'moderation'> & { beam?: Types.Maybe<_RefType['AkashaBeamInterface']>, moderation?: Types.Maybe<_RefType['Node']> } ) | ( Omit<Types.AkashaContentBlockStream, 'block' | 'moderation'> & { block?: Types.Maybe<_RefType['AkashaContentBlockInterface']>, moderation?: Types.Maybe<_RefType['Node']> } ) | ( Omit<Types.AkashaIndexedStream, 'moderation' | 'streamView'> & { moderation?: Types.Maybe<_RefType['Node']>, streamView?: Types.Maybe<_RefType['Node']> } ) | ( Omit<Types.AkashaInterestsStream, 'moderation'> & { moderation?: Types.Maybe<_RefType['Node']> } ) | ( Omit<Types.AkashaProfileStream, 'moderation' | 'profile'> & { moderation?: Types.Maybe<_RefType['Node']>, profile?: Types.Maybe<_RefType['AkashaProfileInterface']> } ) | ( Omit<Types.AkashaReflectStream, 'moderation' | 'reflection'> & { moderation?: Types.Maybe<_RefType['Node']>, reflection?: Types.Maybe<_RefType['AkashaReflectInterface']> } );
  AkashaProfileInterestsInterface: ( Omit<Types.AkashaProfileInterests, 'did'> & { did: _RefType['CeramicAccount'] } );
  AkashaProfileInterface: ( Omit<Types.AkashaProfile, 'app' | 'appVersion' | 'did' | 'followers'> & { app?: Types.Maybe<_RefType['AkashaAppInterface']>, appVersion?: Types.Maybe<_RefType['AkashaAppReleaseInterface']>, did: _RefType['CeramicAccount'], followers: _RefType['AkashaFollowInterfaceConnection'] } );
  AkashaReflectInterface: ( Omit<Types.AkashaReflect, 'author' | 'beam' | 'reflectionView'> & { author: _RefType['CeramicAccount'], beam?: Types.Maybe<_RefType['AkashaBeamInterface']>, reflectionView?: Types.Maybe<_RefType['Node']> } );
  Node: ( Omit<Types.AkashaApp, 'author' | 'contributors' | 'coverImage' | 'gallery' | 'logoImage' | 'releases'> & { author: _RefType['CeramicAccount'], contributors?: Types.Maybe<Array<Types.Maybe<_RefType['CeramicAccount']>>>, coverImage?: Types.Maybe<_RefType['AppImageSource']>, gallery?: Types.Maybe<Array<Types.Maybe<_RefType['AppImageSource']>>>, logoImage?: Types.Maybe<_RefType['AppImageSource']>, releases: _RefType['AkashaAppReleaseInterfaceConnection'] } ) | ( Omit<Types.AkashaAppRelease, 'application'> & { application?: Types.Maybe<_RefType['AkashaAppInterface']> } ) | ( Omit<Types.AkashaAppsStream, 'application' | 'moderation'> & { application?: Types.Maybe<_RefType['AkashaAppInterface']>, moderation?: Types.Maybe<_RefType['Node']> } ) | ( Omit<Types.AkashaBeam, 'app' | 'appVersion' | 'author' | 'mentions' | 'reflections'> & { app?: Types.Maybe<_RefType['AkashaAppInterface']>, appVersion?: Types.Maybe<_RefType['AkashaAppReleaseInterface']>, author: _RefType['CeramicAccount'], mentions?: Types.Maybe<Array<Types.Maybe<_RefType['CeramicAccount']>>>, reflections: _RefType['AkashaReflectInterfaceConnection'] } ) | ( Omit<Types.AkashaBeamStream, 'beam' | 'moderation'> & { beam?: Types.Maybe<_RefType['AkashaBeamInterface']>, moderation?: Types.Maybe<_RefType['Node']> } ) | ( Omit<Types.AkashaBlockStorage, 'appVersion' | 'author' | 'block'> & { appVersion?: Types.Maybe<_RefType['AkashaAppReleaseInterface']>, author: _RefType['CeramicAccount'], block?: Types.Maybe<_RefType['AkashaContentBlock']> } ) | ( Omit<Types.AkashaContentBlock, 'appVersion' | 'author'> & { appVersion?: Types.Maybe<_RefType['AkashaAppReleaseInterface']>, author: _RefType['CeramicAccount'] } ) | ( Omit<Types.AkashaContentBlockStream, 'block' | 'moderation'> & { block?: Types.Maybe<_RefType['AkashaContentBlockInterface']>, moderation?: Types.Maybe<_RefType['Node']> } ) | ( Omit<Types.AkashaFollow, 'did' | 'profile'> & { did: _RefType['CeramicAccount'], profile?: Types.Maybe<_RefType['AkashaProfileInterface']> } ) | ( Omit<Types.AkashaIndexedStream, 'moderation' | 'streamView'> & { moderation?: Types.Maybe<_RefType['Node']>, streamView?: Types.Maybe<_RefType['Node']> } ) | ( Omit<Types.AkashaInterestsStream, 'moderation'> & { moderation?: Types.Maybe<_RefType['Node']> } ) | ( Omit<Types.AkashaProfile, 'app' | 'appVersion' | 'did' | 'followers'> & { app?: Types.Maybe<_RefType['AkashaAppInterface']>, appVersion?: Types.Maybe<_RefType['AkashaAppReleaseInterface']>, did: _RefType['CeramicAccount'], followers: _RefType['AkashaFollowInterfaceConnection'] } ) | ( Omit<Types.AkashaProfileInterests, 'did'> & { did: _RefType['CeramicAccount'] } ) | ( Omit<Types.AkashaProfileStream, 'moderation' | 'profile'> & { moderation?: Types.Maybe<_RefType['Node']>, profile?: Types.Maybe<_RefType['AkashaProfileInterface']> } ) | ( Omit<Types.AkashaReflect, 'author' | 'beam' | 'reflectionView'> & { author: _RefType['CeramicAccount'], beam?: Types.Maybe<_RefType['AkashaBeamInterface']>, reflectionView?: Types.Maybe<_RefType['Node']> } ) | ( Omit<Types.AkashaReflectStream, 'moderation' | 'reflection'> & { moderation?: Types.Maybe<_RefType['Node']>, reflection?: Types.Maybe<_RefType['AkashaReflectInterface']> } ) | ( Omit<Types.CeramicAccount, 'akashaApp' | 'akashaAppInterfaceList' | 'akashaAppList' | 'akashaAppRelease' | 'akashaAppReleaseInterfaceList' | 'akashaAppReleaseList' | 'akashaAppsStream' | 'akashaAppsStreamList' | 'akashaBeamInterfaceList' | 'akashaBeamList' | 'akashaBeamStream' | 'akashaBeamStreamList' | 'akashaBlockStorage' | 'akashaBlockStorageList' | 'akashaContentBlockInterfaceList' | 'akashaContentBlockList' | 'akashaContentBlockStream' | 'akashaContentBlockStreamList' | 'akashaFollow' | 'akashaFollowInterfaceList' | 'akashaFollowList' | 'akashaIndexStreamInterfaceList' | 'akashaIndexedStream' | 'akashaIndexedStreamList' | 'akashaInterestsStream' | 'akashaInterestsStreamList' | 'akashaProfile' | 'akashaProfileInterests' | 'akashaProfileInterestsInterfaceList' | 'akashaProfileInterfaceList' | 'akashaProfileStream' | 'akashaProfileStreamList' | 'akashaReflectInterfaceList' | 'akashaReflectList' | 'akashaReflectStream' | 'akashaReflectStreamList'> & { akashaApp?: Types.Maybe<_RefType['AkashaApp']>, akashaAppInterfaceList?: Types.Maybe<_RefType['AkashaAppInterfaceConnection']>, akashaAppList?: Types.Maybe<_RefType['AkashaAppConnection']>, akashaAppRelease?: Types.Maybe<_RefType['AkashaAppRelease']>, akashaAppReleaseInterfaceList?: Types.Maybe<_RefType['AkashaAppReleaseInterfaceConnection']>, akashaAppReleaseList?: Types.Maybe<_RefType['AkashaAppReleaseConnection']>, akashaAppsStream?: Types.Maybe<_RefType['AkashaAppsStream']>, akashaAppsStreamList?: Types.Maybe<_RefType['AkashaAppsStreamConnection']>, akashaBeamInterfaceList?: Types.Maybe<_RefType['AkashaBeamInterfaceConnection']>, akashaBeamList?: Types.Maybe<_RefType['AkashaBeamConnection']>, akashaBeamStream?: Types.Maybe<_RefType['AkashaBeamStream']>, akashaBeamStreamList?: Types.Maybe<_RefType['AkashaBeamStreamConnection']>, akashaBlockStorage?: Types.Maybe<_RefType['AkashaBlockStorage']>, akashaBlockStorageList?: Types.Maybe<_RefType['AkashaBlockStorageConnection']>, akashaContentBlockInterfaceList?: Types.Maybe<_RefType['AkashaContentBlockInterfaceConnection']>, akashaContentBlockList?: Types.Maybe<_RefType['AkashaContentBlockConnection']>, akashaContentBlockStream?: Types.Maybe<_RefType['AkashaContentBlockStream']>, akashaContentBlockStreamList?: Types.Maybe<_RefType['AkashaContentBlockStreamConnection']>, akashaFollow?: Types.Maybe<_RefType['AkashaFollow']>, akashaFollowInterfaceList?: Types.Maybe<_RefType['AkashaFollowInterfaceConnection']>, akashaFollowList?: Types.Maybe<_RefType['AkashaFollowConnection']>, akashaIndexStreamInterfaceList?: Types.Maybe<_RefType['AkashaIndexStreamInterfaceConnection']>, akashaIndexedStream?: Types.Maybe<_RefType['AkashaIndexedStream']>, akashaIndexedStreamList?: Types.Maybe<_RefType['AkashaIndexedStreamConnection']>, akashaInterestsStream?: Types.Maybe<_RefType['AkashaInterestsStream']>, akashaInterestsStreamList?: Types.Maybe<_RefType['AkashaInterestsStreamConnection']>, akashaProfile?: Types.Maybe<_RefType['AkashaProfile']>, akashaProfileInterests?: Types.Maybe<_RefType['AkashaProfileInterests']>, akashaProfileInterestsInterfaceList?: Types.Maybe<_RefType['AkashaProfileInterestsInterfaceConnection']>, akashaProfileInterfaceList?: Types.Maybe<_RefType['AkashaProfileInterfaceConnection']>, akashaProfileStream?: Types.Maybe<_RefType['AkashaProfileStream']>, akashaProfileStreamList?: Types.Maybe<_RefType['AkashaProfileStreamConnection']>, akashaReflectInterfaceList?: Types.Maybe<_RefType['AkashaReflectInterfaceConnection']>, akashaReflectList?: Types.Maybe<_RefType['AkashaReflectConnection']>, akashaReflectStream?: Types.Maybe<_RefType['AkashaReflectStream']>, akashaReflectStreamList?: Types.Maybe<_RefType['AkashaReflectStreamConnection']> } );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AkashaApp: ResolverTypeWrapper<Omit<Types.AkashaApp, 'author' | 'contributors' | 'coverImage' | 'gallery' | 'logoImage' | 'releases'> & { author: ResolversTypes['CeramicAccount'], contributors?: Types.Maybe<Array<Types.Maybe<ResolversTypes['CeramicAccount']>>>, coverImage?: Types.Maybe<ResolversTypes['AppImageSource']>, gallery?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AppImageSource']>>>, logoImage?: Types.Maybe<ResolversTypes['AppImageSource']>, releases: ResolversTypes['AkashaAppReleaseInterfaceConnection'] }>;
  String: ResolverTypeWrapper<Types.Scalars['String']['output']>;
  ID: ResolverTypeWrapper<Types.Scalars['ID']['output']>;
  Boolean: ResolverTypeWrapper<Types.Scalars['Boolean']['output']>;
  Int: ResolverTypeWrapper<Types.Scalars['Int']['output']>;
  AkashaAppApplicationType: Types.AkashaAppApplicationType;
  AkashaAppApplicationTypeValueFilterInput: Types.AkashaAppApplicationTypeValueFilterInput;
  AkashaAppConnection: ResolverTypeWrapper<Omit<Types.AkashaAppConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaAppEdge']>>> }>;
  AkashaAppEdge: ResolverTypeWrapper<Omit<Types.AkashaAppEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaApp']> }>;
  AkashaAppFiltersInput: Types.AkashaAppFiltersInput;
  AkashaAppInput: Types.AkashaAppInput;
  AkashaAppInterface: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AkashaAppInterface']>;
  AkashaAppInterfaceConnection: ResolverTypeWrapper<Omit<Types.AkashaAppInterfaceConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaAppInterfaceEdge']>>> }>;
  AkashaAppInterfaceEdge: ResolverTypeWrapper<Omit<Types.AkashaAppInterfaceEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaAppInterface']> }>;
  AkashaAppInterfaceFiltersInput: Types.AkashaAppInterfaceFiltersInput;
  AkashaAppInterfaceObjectFilterInput: Types.AkashaAppInterfaceObjectFilterInput;
  AkashaAppInterfaceSortingInput: Types.AkashaAppInterfaceSortingInput;
  AkashaAppObjectFilterInput: Types.AkashaAppObjectFilterInput;
  AkashaAppRelease: ResolverTypeWrapper<Omit<Types.AkashaAppRelease, 'application'> & { application?: Types.Maybe<ResolversTypes['AkashaAppInterface']> }>;
  AkashaAppReleaseConnection: ResolverTypeWrapper<Omit<Types.AkashaAppReleaseConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaAppReleaseEdge']>>> }>;
  AkashaAppReleaseEdge: ResolverTypeWrapper<Omit<Types.AkashaAppReleaseEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaAppRelease']> }>;
  AkashaAppReleaseFiltersInput: Types.AkashaAppReleaseFiltersInput;
  AkashaAppReleaseInput: Types.AkashaAppReleaseInput;
  AkashaAppReleaseInterface: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AkashaAppReleaseInterface']>;
  AkashaAppReleaseInterfaceConnection: ResolverTypeWrapper<Omit<Types.AkashaAppReleaseInterfaceConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaAppReleaseInterfaceEdge']>>> }>;
  AkashaAppReleaseInterfaceEdge: ResolverTypeWrapper<Omit<Types.AkashaAppReleaseInterfaceEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaAppReleaseInterface']> }>;
  AkashaAppReleaseInterfaceFiltersInput: Types.AkashaAppReleaseInterfaceFiltersInput;
  AkashaAppReleaseInterfaceObjectFilterInput: Types.AkashaAppReleaseInterfaceObjectFilterInput;
  AkashaAppReleaseInterfaceSortingInput: Types.AkashaAppReleaseInterfaceSortingInput;
  AkashaAppReleaseObjectFilterInput: Types.AkashaAppReleaseObjectFilterInput;
  AkashaAppReleaseSortingInput: Types.AkashaAppReleaseSortingInput;
  AkashaAppSortingInput: Types.AkashaAppSortingInput;
  AkashaAppsStream: ResolverTypeWrapper<Omit<Types.AkashaAppsStream, 'application' | 'moderation'> & { application?: Types.Maybe<ResolversTypes['AkashaAppInterface']>, moderation?: Types.Maybe<ResolversTypes['Node']> }>;
  AkashaAppsStreamConnection: ResolverTypeWrapper<Omit<Types.AkashaAppsStreamConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaAppsStreamEdge']>>> }>;
  AkashaAppsStreamEdge: ResolverTypeWrapper<Omit<Types.AkashaAppsStreamEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaAppsStream']> }>;
  AkashaAppsStreamFiltersInput: Types.AkashaAppsStreamFiltersInput;
  AkashaAppsStreamInput: Types.AkashaAppsStreamInput;
  AkashaAppsStreamModerationStatus: Types.AkashaAppsStreamModerationStatus;
  AkashaAppsStreamModerationStatusValueFilterInput: Types.AkashaAppsStreamModerationStatusValueFilterInput;
  AkashaAppsStreamObjectFilterInput: Types.AkashaAppsStreamObjectFilterInput;
  AkashaAppsStreamSortingInput: Types.AkashaAppsStreamSortingInput;
  AkashaBeam: ResolverTypeWrapper<Omit<Types.AkashaBeam, 'app' | 'appVersion' | 'author' | 'mentions' | 'reflections'> & { app?: Types.Maybe<ResolversTypes['AkashaAppInterface']>, appVersion?: Types.Maybe<ResolversTypes['AkashaAppReleaseInterface']>, author: ResolversTypes['CeramicAccount'], mentions?: Types.Maybe<Array<Types.Maybe<ResolversTypes['CeramicAccount']>>>, reflections: ResolversTypes['AkashaReflectInterfaceConnection'] }>;
  AkashaBeamConnection: ResolverTypeWrapper<Omit<Types.AkashaBeamConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaBeamEdge']>>> }>;
  AkashaBeamEdge: ResolverTypeWrapper<Omit<Types.AkashaBeamEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaBeam']> }>;
  AkashaBeamFiltersInput: Types.AkashaBeamFiltersInput;
  AkashaBeamInput: Types.AkashaBeamInput;
  AkashaBeamInterface: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AkashaBeamInterface']>;
  AkashaBeamInterfaceConnection: ResolverTypeWrapper<Omit<Types.AkashaBeamInterfaceConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaBeamInterfaceEdge']>>> }>;
  AkashaBeamInterfaceEdge: ResolverTypeWrapper<Omit<Types.AkashaBeamInterfaceEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaBeamInterface']> }>;
  AkashaBeamInterfaceFiltersInput: Types.AkashaBeamInterfaceFiltersInput;
  AkashaBeamInterfaceObjectFilterInput: Types.AkashaBeamInterfaceObjectFilterInput;
  AkashaBeamInterfaceSortingInput: Types.AkashaBeamInterfaceSortingInput;
  AkashaBeamObjectFilterInput: Types.AkashaBeamObjectFilterInput;
  AkashaBeamSortingInput: Types.AkashaBeamSortingInput;
  AkashaBeamStream: ResolverTypeWrapper<Omit<Types.AkashaBeamStream, 'beam' | 'moderation'> & { beam?: Types.Maybe<ResolversTypes['AkashaBeamInterface']>, moderation?: Types.Maybe<ResolversTypes['Node']> }>;
  AkashaBeamStreamConnection: ResolverTypeWrapper<Omit<Types.AkashaBeamStreamConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaBeamStreamEdge']>>> }>;
  AkashaBeamStreamEdge: ResolverTypeWrapper<Omit<Types.AkashaBeamStreamEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaBeamStream']> }>;
  AkashaBeamStreamFiltersInput: Types.AkashaBeamStreamFiltersInput;
  AkashaBeamStreamInput: Types.AkashaBeamStreamInput;
  AkashaBeamStreamModerationStatus: Types.AkashaBeamStreamModerationStatus;
  AkashaBeamStreamModerationStatusValueFilterInput: Types.AkashaBeamStreamModerationStatusValueFilterInput;
  AkashaBeamStreamObjectFilterInput: Types.AkashaBeamStreamObjectFilterInput;
  AkashaBeamStreamSortingInput: Types.AkashaBeamStreamSortingInput;
  AkashaBlockStorage: ResolverTypeWrapper<Omit<Types.AkashaBlockStorage, 'appVersion' | 'author' | 'block'> & { appVersion?: Types.Maybe<ResolversTypes['AkashaAppReleaseInterface']>, author: ResolversTypes['CeramicAccount'], block?: Types.Maybe<ResolversTypes['AkashaContentBlock']> }>;
  AkashaBlockStorageBlockDef: Types.AkashaBlockStorageBlockDef;
  AkashaBlockStorageBlockDefValueFilterInput: Types.AkashaBlockStorageBlockDefValueFilterInput;
  AkashaBlockStorageConnection: ResolverTypeWrapper<Omit<Types.AkashaBlockStorageConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaBlockStorageEdge']>>> }>;
  AkashaBlockStorageEdge: ResolverTypeWrapper<Omit<Types.AkashaBlockStorageEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaBlockStorage']> }>;
  AkashaBlockStorageFiltersInput: Types.AkashaBlockStorageFiltersInput;
  AkashaBlockStorageInput: Types.AkashaBlockStorageInput;
  AkashaBlockStorageObjectFilterInput: Types.AkashaBlockStorageObjectFilterInput;
  AkashaBlockStorageSortingInput: Types.AkashaBlockStorageSortingInput;
  AkashaContentBlock: ResolverTypeWrapper<Omit<Types.AkashaContentBlock, 'appVersion' | 'author'> & { appVersion?: Types.Maybe<ResolversTypes['AkashaAppReleaseInterface']>, author: ResolversTypes['CeramicAccount'] }>;
  AkashaContentBlockBlockDef: Types.AkashaContentBlockBlockDef;
  AkashaContentBlockBlockDefValueFilterInput: Types.AkashaContentBlockBlockDefValueFilterInput;
  AkashaContentBlockConnection: ResolverTypeWrapper<Omit<Types.AkashaContentBlockConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaContentBlockEdge']>>> }>;
  AkashaContentBlockEdge: ResolverTypeWrapper<Omit<Types.AkashaContentBlockEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaContentBlock']> }>;
  AkashaContentBlockFiltersInput: Types.AkashaContentBlockFiltersInput;
  AkashaContentBlockInput: Types.AkashaContentBlockInput;
  AkashaContentBlockInterface: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AkashaContentBlockInterface']>;
  AkashaContentBlockInterfaceConnection: ResolverTypeWrapper<Omit<Types.AkashaContentBlockInterfaceConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaContentBlockInterfaceEdge']>>> }>;
  AkashaContentBlockInterfaceEdge: ResolverTypeWrapper<Omit<Types.AkashaContentBlockInterfaceEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaContentBlockInterface']> }>;
  AkashaContentBlockInterfaceFiltersInput: Types.AkashaContentBlockInterfaceFiltersInput;
  AkashaContentBlockInterfaceObjectFilterInput: Types.AkashaContentBlockInterfaceObjectFilterInput;
  AkashaContentBlockInterfaceSortingInput: Types.AkashaContentBlockInterfaceSortingInput;
  AkashaContentBlockObjectFilterInput: Types.AkashaContentBlockObjectFilterInput;
  AkashaContentBlockSortingInput: Types.AkashaContentBlockSortingInput;
  AkashaContentBlockStream: ResolverTypeWrapper<Omit<Types.AkashaContentBlockStream, 'block' | 'moderation'> & { block?: Types.Maybe<ResolversTypes['AkashaContentBlockInterface']>, moderation?: Types.Maybe<ResolversTypes['Node']> }>;
  AkashaContentBlockStreamConnection: ResolverTypeWrapper<Omit<Types.AkashaContentBlockStreamConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaContentBlockStreamEdge']>>> }>;
  AkashaContentBlockStreamEdge: ResolverTypeWrapper<Omit<Types.AkashaContentBlockStreamEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaContentBlockStream']> }>;
  AkashaContentBlockStreamFiltersInput: Types.AkashaContentBlockStreamFiltersInput;
  AkashaContentBlockStreamInput: Types.AkashaContentBlockStreamInput;
  AkashaContentBlockStreamModerationStatus: Types.AkashaContentBlockStreamModerationStatus;
  AkashaContentBlockStreamModerationStatusValueFilterInput: Types.AkashaContentBlockStreamModerationStatusValueFilterInput;
  AkashaContentBlockStreamObjectFilterInput: Types.AkashaContentBlockStreamObjectFilterInput;
  AkashaContentBlockStreamSortingInput: Types.AkashaContentBlockStreamSortingInput;
  AkashaFollow: ResolverTypeWrapper<Omit<Types.AkashaFollow, 'did' | 'profile'> & { did: ResolversTypes['CeramicAccount'], profile?: Types.Maybe<ResolversTypes['AkashaProfileInterface']> }>;
  AkashaFollowConnection: ResolverTypeWrapper<Omit<Types.AkashaFollowConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaFollowEdge']>>> }>;
  AkashaFollowEdge: ResolverTypeWrapper<Omit<Types.AkashaFollowEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaFollow']> }>;
  AkashaFollowFiltersInput: Types.AkashaFollowFiltersInput;
  AkashaFollowInput: Types.AkashaFollowInput;
  AkashaFollowInterface: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AkashaFollowInterface']>;
  AkashaFollowInterfaceConnection: ResolverTypeWrapper<Omit<Types.AkashaFollowInterfaceConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaFollowInterfaceEdge']>>> }>;
  AkashaFollowInterfaceEdge: ResolverTypeWrapper<Omit<Types.AkashaFollowInterfaceEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaFollowInterface']> }>;
  AkashaFollowInterfaceFiltersInput: Types.AkashaFollowInterfaceFiltersInput;
  AkashaFollowInterfaceObjectFilterInput: Types.AkashaFollowInterfaceObjectFilterInput;
  AkashaFollowInterfaceSortingInput: Types.AkashaFollowInterfaceSortingInput;
  AkashaFollowObjectFilterInput: Types.AkashaFollowObjectFilterInput;
  AkashaFollowSortingInput: Types.AkashaFollowSortingInput;
  AkashaIndexStreamInterface: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AkashaIndexStreamInterface']>;
  AkashaIndexStreamInterfaceConnection: ResolverTypeWrapper<Omit<Types.AkashaIndexStreamInterfaceConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaIndexStreamInterfaceEdge']>>> }>;
  AkashaIndexStreamInterfaceEdge: ResolverTypeWrapper<Omit<Types.AkashaIndexStreamInterfaceEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaIndexStreamInterface']> }>;
  AkashaIndexStreamInterfaceFiltersInput: Types.AkashaIndexStreamInterfaceFiltersInput;
  AkashaIndexStreamInterfaceObjectFilterInput: Types.AkashaIndexStreamInterfaceObjectFilterInput;
  AkashaIndexStreamInterfaceSortingInput: Types.AkashaIndexStreamInterfaceSortingInput;
  AkashaIndexedStream: ResolverTypeWrapper<Omit<Types.AkashaIndexedStream, 'moderation' | 'streamView'> & { moderation?: Types.Maybe<ResolversTypes['Node']>, streamView?: Types.Maybe<ResolversTypes['Node']> }>;
  AkashaIndexedStreamConnection: ResolverTypeWrapper<Omit<Types.AkashaIndexedStreamConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaIndexedStreamEdge']>>> }>;
  AkashaIndexedStreamEdge: ResolverTypeWrapper<Omit<Types.AkashaIndexedStreamEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaIndexedStream']> }>;
  AkashaIndexedStreamFiltersInput: Types.AkashaIndexedStreamFiltersInput;
  AkashaIndexedStreamInput: Types.AkashaIndexedStreamInput;
  AkashaIndexedStreamModerationStatus: Types.AkashaIndexedStreamModerationStatus;
  AkashaIndexedStreamModerationStatusValueFilterInput: Types.AkashaIndexedStreamModerationStatusValueFilterInput;
  AkashaIndexedStreamObjectFilterInput: Types.AkashaIndexedStreamObjectFilterInput;
  AkashaIndexedStreamSortingInput: Types.AkashaIndexedStreamSortingInput;
  AkashaIndexedStreamStreamType: Types.AkashaIndexedStreamStreamType;
  AkashaIndexedStreamStreamTypeValueFilterInput: Types.AkashaIndexedStreamStreamTypeValueFilterInput;
  AkashaInterestsStream: ResolverTypeWrapper<Omit<Types.AkashaInterestsStream, 'moderation'> & { moderation?: Types.Maybe<ResolversTypes['Node']> }>;
  AkashaInterestsStreamConnection: ResolverTypeWrapper<Omit<Types.AkashaInterestsStreamConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaInterestsStreamEdge']>>> }>;
  AkashaInterestsStreamEdge: ResolverTypeWrapper<Omit<Types.AkashaInterestsStreamEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaInterestsStream']> }>;
  AkashaInterestsStreamFiltersInput: Types.AkashaInterestsStreamFiltersInput;
  AkashaInterestsStreamInput: Types.AkashaInterestsStreamInput;
  AkashaInterestsStreamModerationStatus: Types.AkashaInterestsStreamModerationStatus;
  AkashaInterestsStreamModerationStatusValueFilterInput: Types.AkashaInterestsStreamModerationStatusValueFilterInput;
  AkashaInterestsStreamObjectFilterInput: Types.AkashaInterestsStreamObjectFilterInput;
  AkashaInterestsStreamSortingInput: Types.AkashaInterestsStreamSortingInput;
  AkashaProfile: ResolverTypeWrapper<Omit<Types.AkashaProfile, 'app' | 'appVersion' | 'did' | 'followers'> & { app?: Types.Maybe<ResolversTypes['AkashaAppInterface']>, appVersion?: Types.Maybe<ResolversTypes['AkashaAppReleaseInterface']>, did: ResolversTypes['CeramicAccount'], followers: ResolversTypes['AkashaFollowInterfaceConnection'] }>;
  AkashaProfileConnection: ResolverTypeWrapper<Omit<Types.AkashaProfileConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaProfileEdge']>>> }>;
  AkashaProfileEdge: ResolverTypeWrapper<Omit<Types.AkashaProfileEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaProfile']> }>;
  AkashaProfileFiltersInput: Types.AkashaProfileFiltersInput;
  AkashaProfileInput: Types.AkashaProfileInput;
  AkashaProfileInterests: ResolverTypeWrapper<Omit<Types.AkashaProfileInterests, 'did'> & { did: ResolversTypes['CeramicAccount'] }>;
  AkashaProfileInterestsConnection: ResolverTypeWrapper<Omit<Types.AkashaProfileInterestsConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaProfileInterestsEdge']>>> }>;
  AkashaProfileInterestsEdge: ResolverTypeWrapper<Omit<Types.AkashaProfileInterestsEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaProfileInterests']> }>;
  AkashaProfileInterestsInput: Types.AkashaProfileInterestsInput;
  AkashaProfileInterestsInterface: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AkashaProfileInterestsInterface']>;
  AkashaProfileInterestsInterfaceConnection: ResolverTypeWrapper<Omit<Types.AkashaProfileInterestsInterfaceConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaProfileInterestsInterfaceEdge']>>> }>;
  AkashaProfileInterestsInterfaceEdge: ResolverTypeWrapper<Omit<Types.AkashaProfileInterestsInterfaceEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaProfileInterestsInterface']> }>;
  AkashaProfileInterface: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AkashaProfileInterface']>;
  AkashaProfileInterfaceConnection: ResolverTypeWrapper<Omit<Types.AkashaProfileInterfaceConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaProfileInterfaceEdge']>>> }>;
  AkashaProfileInterfaceEdge: ResolverTypeWrapper<Omit<Types.AkashaProfileInterfaceEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaProfileInterface']> }>;
  AkashaProfileInterfaceFiltersInput: Types.AkashaProfileInterfaceFiltersInput;
  AkashaProfileInterfaceObjectFilterInput: Types.AkashaProfileInterfaceObjectFilterInput;
  AkashaProfileInterfaceSortingInput: Types.AkashaProfileInterfaceSortingInput;
  AkashaProfileObjectFilterInput: Types.AkashaProfileObjectFilterInput;
  AkashaProfileSortingInput: Types.AkashaProfileSortingInput;
  AkashaProfileStream: ResolverTypeWrapper<Omit<Types.AkashaProfileStream, 'moderation' | 'profile'> & { moderation?: Types.Maybe<ResolversTypes['Node']>, profile?: Types.Maybe<ResolversTypes['AkashaProfileInterface']> }>;
  AkashaProfileStreamConnection: ResolverTypeWrapper<Omit<Types.AkashaProfileStreamConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaProfileStreamEdge']>>> }>;
  AkashaProfileStreamEdge: ResolverTypeWrapper<Omit<Types.AkashaProfileStreamEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaProfileStream']> }>;
  AkashaProfileStreamFiltersInput: Types.AkashaProfileStreamFiltersInput;
  AkashaProfileStreamInput: Types.AkashaProfileStreamInput;
  AkashaProfileStreamModerationStatus: Types.AkashaProfileStreamModerationStatus;
  AkashaProfileStreamModerationStatusValueFilterInput: Types.AkashaProfileStreamModerationStatusValueFilterInput;
  AkashaProfileStreamObjectFilterInput: Types.AkashaProfileStreamObjectFilterInput;
  AkashaProfileStreamSortingInput: Types.AkashaProfileStreamSortingInput;
  AkashaReflect: ResolverTypeWrapper<Omit<Types.AkashaReflect, 'author' | 'beam' | 'reflectionView'> & { author: ResolversTypes['CeramicAccount'], beam?: Types.Maybe<ResolversTypes['AkashaBeamInterface']>, reflectionView?: Types.Maybe<ResolversTypes['Node']> }>;
  AkashaReflectConnection: ResolverTypeWrapper<Omit<Types.AkashaReflectConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaReflectEdge']>>> }>;
  AkashaReflectEdge: ResolverTypeWrapper<Omit<Types.AkashaReflectEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaReflect']> }>;
  AkashaReflectFiltersInput: Types.AkashaReflectFiltersInput;
  AkashaReflectInput: Types.AkashaReflectInput;
  AkashaReflectInterface: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['AkashaReflectInterface']>;
  AkashaReflectInterfaceConnection: ResolverTypeWrapper<Omit<Types.AkashaReflectInterfaceConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaReflectInterfaceEdge']>>> }>;
  AkashaReflectInterfaceEdge: ResolverTypeWrapper<Omit<Types.AkashaReflectInterfaceEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaReflectInterface']> }>;
  AkashaReflectInterfaceFiltersInput: Types.AkashaReflectInterfaceFiltersInput;
  AkashaReflectInterfaceObjectFilterInput: Types.AkashaReflectInterfaceObjectFilterInput;
  AkashaReflectInterfaceSortingInput: Types.AkashaReflectInterfaceSortingInput;
  AkashaReflectObjectFilterInput: Types.AkashaReflectObjectFilterInput;
  AkashaReflectSortingInput: Types.AkashaReflectSortingInput;
  AkashaReflectStream: ResolverTypeWrapper<Omit<Types.AkashaReflectStream, 'moderation' | 'reflection'> & { moderation?: Types.Maybe<ResolversTypes['Node']>, reflection?: Types.Maybe<ResolversTypes['AkashaReflectInterface']> }>;
  AkashaReflectStreamConnection: ResolverTypeWrapper<Omit<Types.AkashaReflectStreamConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversTypes['AkashaReflectStreamEdge']>>> }>;
  AkashaReflectStreamEdge: ResolverTypeWrapper<Omit<Types.AkashaReflectStreamEdge, 'node'> & { node?: Types.Maybe<ResolversTypes['AkashaReflectStream']> }>;
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
  CeramicAccount: ResolverTypeWrapper<Omit<Types.CeramicAccount, 'akashaApp' | 'akashaAppInterfaceList' | 'akashaAppList' | 'akashaAppRelease' | 'akashaAppReleaseInterfaceList' | 'akashaAppReleaseList' | 'akashaAppsStream' | 'akashaAppsStreamList' | 'akashaBeamInterfaceList' | 'akashaBeamList' | 'akashaBeamStream' | 'akashaBeamStreamList' | 'akashaBlockStorage' | 'akashaBlockStorageList' | 'akashaContentBlockInterfaceList' | 'akashaContentBlockList' | 'akashaContentBlockStream' | 'akashaContentBlockStreamList' | 'akashaFollow' | 'akashaFollowInterfaceList' | 'akashaFollowList' | 'akashaIndexStreamInterfaceList' | 'akashaIndexedStream' | 'akashaIndexedStreamList' | 'akashaInterestsStream' | 'akashaInterestsStreamList' | 'akashaProfile' | 'akashaProfileInterests' | 'akashaProfileInterestsInterfaceList' | 'akashaProfileInterfaceList' | 'akashaProfileStream' | 'akashaProfileStreamList' | 'akashaReflectInterfaceList' | 'akashaReflectList' | 'akashaReflectStream' | 'akashaReflectStreamList'> & { akashaApp?: Types.Maybe<ResolversTypes['AkashaApp']>, akashaAppInterfaceList?: Types.Maybe<ResolversTypes['AkashaAppInterfaceConnection']>, akashaAppList?: Types.Maybe<ResolversTypes['AkashaAppConnection']>, akashaAppRelease?: Types.Maybe<ResolversTypes['AkashaAppRelease']>, akashaAppReleaseInterfaceList?: Types.Maybe<ResolversTypes['AkashaAppReleaseInterfaceConnection']>, akashaAppReleaseList?: Types.Maybe<ResolversTypes['AkashaAppReleaseConnection']>, akashaAppsStream?: Types.Maybe<ResolversTypes['AkashaAppsStream']>, akashaAppsStreamList?: Types.Maybe<ResolversTypes['AkashaAppsStreamConnection']>, akashaBeamInterfaceList?: Types.Maybe<ResolversTypes['AkashaBeamInterfaceConnection']>, akashaBeamList?: Types.Maybe<ResolversTypes['AkashaBeamConnection']>, akashaBeamStream?: Types.Maybe<ResolversTypes['AkashaBeamStream']>, akashaBeamStreamList?: Types.Maybe<ResolversTypes['AkashaBeamStreamConnection']>, akashaBlockStorage?: Types.Maybe<ResolversTypes['AkashaBlockStorage']>, akashaBlockStorageList?: Types.Maybe<ResolversTypes['AkashaBlockStorageConnection']>, akashaContentBlockInterfaceList?: Types.Maybe<ResolversTypes['AkashaContentBlockInterfaceConnection']>, akashaContentBlockList?: Types.Maybe<ResolversTypes['AkashaContentBlockConnection']>, akashaContentBlockStream?: Types.Maybe<ResolversTypes['AkashaContentBlockStream']>, akashaContentBlockStreamList?: Types.Maybe<ResolversTypes['AkashaContentBlockStreamConnection']>, akashaFollow?: Types.Maybe<ResolversTypes['AkashaFollow']>, akashaFollowInterfaceList?: Types.Maybe<ResolversTypes['AkashaFollowInterfaceConnection']>, akashaFollowList?: Types.Maybe<ResolversTypes['AkashaFollowConnection']>, akashaIndexStreamInterfaceList?: Types.Maybe<ResolversTypes['AkashaIndexStreamInterfaceConnection']>, akashaIndexedStream?: Types.Maybe<ResolversTypes['AkashaIndexedStream']>, akashaIndexedStreamList?: Types.Maybe<ResolversTypes['AkashaIndexedStreamConnection']>, akashaInterestsStream?: Types.Maybe<ResolversTypes['AkashaInterestsStream']>, akashaInterestsStreamList?: Types.Maybe<ResolversTypes['AkashaInterestsStreamConnection']>, akashaProfile?: Types.Maybe<ResolversTypes['AkashaProfile']>, akashaProfileInterests?: Types.Maybe<ResolversTypes['AkashaProfileInterests']>, akashaProfileInterestsInterfaceList?: Types.Maybe<ResolversTypes['AkashaProfileInterestsInterfaceConnection']>, akashaProfileInterfaceList?: Types.Maybe<ResolversTypes['AkashaProfileInterfaceConnection']>, akashaProfileStream?: Types.Maybe<ResolversTypes['AkashaProfileStream']>, akashaProfileStreamList?: Types.Maybe<ResolversTypes['AkashaProfileStreamConnection']>, akashaReflectInterfaceList?: Types.Maybe<ResolversTypes['AkashaReflectInterfaceConnection']>, akashaReflectList?: Types.Maybe<ResolversTypes['AkashaReflectConnection']>, akashaReflectStream?: Types.Maybe<ResolversTypes['AkashaReflectStream']>, akashaReflectStreamList?: Types.Maybe<ResolversTypes['AkashaReflectStreamConnection']> }>;
  CeramicCommitID: ResolverTypeWrapper<Types.Scalars['CeramicCommitID']['output']>;
  CeramicStreamID: ResolverTypeWrapper<Types.Scalars['CeramicStreamID']['output']>;
  CreateAkashaBeamInput: Types.CreateAkashaBeamInput;
  CreateAkashaBeamPayload: ResolverTypeWrapper<Omit<Types.CreateAkashaBeamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaBeam'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  CreateAkashaContentBlockInput: Types.CreateAkashaContentBlockInput;
  CreateAkashaContentBlockPayload: ResolverTypeWrapper<Omit<Types.CreateAkashaContentBlockPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaContentBlock'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  CreateAkashaProfileInput: Types.CreateAkashaProfileInput;
  CreateAkashaProfileInterestsInput: Types.CreateAkashaProfileInterestsInput;
  CreateAkashaProfileInterestsPayload: ResolverTypeWrapper<Omit<Types.CreateAkashaProfileInterestsPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaProfileInterests'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  CreateAkashaProfilePayload: ResolverTypeWrapper<Omit<Types.CreateAkashaProfilePayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaProfile'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  CreateAkashaReflectInput: Types.CreateAkashaReflectInput;
  CreateAkashaReflectPayload: ResolverTypeWrapper<Omit<Types.CreateAkashaReflectPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaReflect'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  CreateOptionsInput: Types.CreateOptionsInput;
  DID: ResolverTypeWrapper<Types.Scalars['DID']['output']>;
  DID_JWS: Types.Did_Jws;
  DateTime: ResolverTypeWrapper<Types.Scalars['DateTime']['output']>;
  EnableIndexingAkashaAppInput: Types.EnableIndexingAkashaAppInput;
  EnableIndexingAkashaAppPayload: ResolverTypeWrapper<Omit<Types.EnableIndexingAkashaAppPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversTypes['AkashaApp']>, node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  EnableIndexingAkashaAppReleaseInput: Types.EnableIndexingAkashaAppReleaseInput;
  EnableIndexingAkashaAppReleasePayload: ResolverTypeWrapper<Omit<Types.EnableIndexingAkashaAppReleasePayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversTypes['AkashaAppRelease']>, node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  EnableIndexingAkashaAppsStreamInput: Types.EnableIndexingAkashaAppsStreamInput;
  EnableIndexingAkashaAppsStreamPayload: ResolverTypeWrapper<Omit<Types.EnableIndexingAkashaAppsStreamPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversTypes['AkashaAppsStream']>, node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  EnableIndexingAkashaBeamInput: Types.EnableIndexingAkashaBeamInput;
  EnableIndexingAkashaBeamPayload: ResolverTypeWrapper<Omit<Types.EnableIndexingAkashaBeamPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversTypes['AkashaBeam']>, node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  EnableIndexingAkashaBeamStreamInput: Types.EnableIndexingAkashaBeamStreamInput;
  EnableIndexingAkashaBeamStreamPayload: ResolverTypeWrapper<Omit<Types.EnableIndexingAkashaBeamStreamPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversTypes['AkashaBeamStream']>, node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  EnableIndexingAkashaBlockStorageInput: Types.EnableIndexingAkashaBlockStorageInput;
  EnableIndexingAkashaBlockStoragePayload: ResolverTypeWrapper<Omit<Types.EnableIndexingAkashaBlockStoragePayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversTypes['AkashaBlockStorage']>, node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  EnableIndexingAkashaContentBlockInput: Types.EnableIndexingAkashaContentBlockInput;
  EnableIndexingAkashaContentBlockPayload: ResolverTypeWrapper<Omit<Types.EnableIndexingAkashaContentBlockPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversTypes['AkashaContentBlock']>, node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  EnableIndexingAkashaContentBlockStreamInput: Types.EnableIndexingAkashaContentBlockStreamInput;
  EnableIndexingAkashaContentBlockStreamPayload: ResolverTypeWrapper<Omit<Types.EnableIndexingAkashaContentBlockStreamPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversTypes['AkashaContentBlockStream']>, node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  EnableIndexingAkashaFollowInput: Types.EnableIndexingAkashaFollowInput;
  EnableIndexingAkashaFollowPayload: ResolverTypeWrapper<Omit<Types.EnableIndexingAkashaFollowPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversTypes['AkashaFollow']>, node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  EnableIndexingAkashaIndexedStreamInput: Types.EnableIndexingAkashaIndexedStreamInput;
  EnableIndexingAkashaIndexedStreamPayload: ResolverTypeWrapper<Omit<Types.EnableIndexingAkashaIndexedStreamPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversTypes['AkashaIndexedStream']>, node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  EnableIndexingAkashaInterestsStreamInput: Types.EnableIndexingAkashaInterestsStreamInput;
  EnableIndexingAkashaInterestsStreamPayload: ResolverTypeWrapper<Omit<Types.EnableIndexingAkashaInterestsStreamPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversTypes['AkashaInterestsStream']>, node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  EnableIndexingAkashaProfileInput: Types.EnableIndexingAkashaProfileInput;
  EnableIndexingAkashaProfileInterestsInput: Types.EnableIndexingAkashaProfileInterestsInput;
  EnableIndexingAkashaProfileInterestsPayload: ResolverTypeWrapper<Omit<Types.EnableIndexingAkashaProfileInterestsPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversTypes['AkashaProfileInterests']>, node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  EnableIndexingAkashaProfilePayload: ResolverTypeWrapper<Omit<Types.EnableIndexingAkashaProfilePayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversTypes['AkashaProfile']>, node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  EnableIndexingAkashaProfileStreamInput: Types.EnableIndexingAkashaProfileStreamInput;
  EnableIndexingAkashaProfileStreamPayload: ResolverTypeWrapper<Omit<Types.EnableIndexingAkashaProfileStreamPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversTypes['AkashaProfileStream']>, node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  EnableIndexingAkashaReflectInput: Types.EnableIndexingAkashaReflectInput;
  EnableIndexingAkashaReflectPayload: ResolverTypeWrapper<Omit<Types.EnableIndexingAkashaReflectPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversTypes['AkashaReflect']>, node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  EnableIndexingAkashaReflectStreamInput: Types.EnableIndexingAkashaReflectStreamInput;
  EnableIndexingAkashaReflectStreamPayload: ResolverTypeWrapper<Omit<Types.EnableIndexingAkashaReflectStreamPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversTypes['AkashaReflectStream']>, node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
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
  SetAkashaAppPayload: ResolverTypeWrapper<Omit<Types.SetAkashaAppPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaApp'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  SetAkashaAppReleaseInput: Types.SetAkashaAppReleaseInput;
  SetAkashaAppReleasePayload: ResolverTypeWrapper<Omit<Types.SetAkashaAppReleasePayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaAppRelease'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  SetAkashaAppsStreamInput: Types.SetAkashaAppsStreamInput;
  SetAkashaAppsStreamPayload: ResolverTypeWrapper<Omit<Types.SetAkashaAppsStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaAppsStream'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  SetAkashaBeamStreamInput: Types.SetAkashaBeamStreamInput;
  SetAkashaBeamStreamPayload: ResolverTypeWrapper<Omit<Types.SetAkashaBeamStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaBeamStream'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  SetAkashaBlockStorageInput: Types.SetAkashaBlockStorageInput;
  SetAkashaBlockStoragePayload: ResolverTypeWrapper<Omit<Types.SetAkashaBlockStoragePayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaBlockStorage'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  SetAkashaContentBlockStreamInput: Types.SetAkashaContentBlockStreamInput;
  SetAkashaContentBlockStreamPayload: ResolverTypeWrapper<Omit<Types.SetAkashaContentBlockStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaContentBlockStream'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  SetAkashaFollowInput: Types.SetAkashaFollowInput;
  SetAkashaFollowPayload: ResolverTypeWrapper<Omit<Types.SetAkashaFollowPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaFollow'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  SetAkashaIndexedStreamInput: Types.SetAkashaIndexedStreamInput;
  SetAkashaIndexedStreamPayload: ResolverTypeWrapper<Omit<Types.SetAkashaIndexedStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaIndexedStream'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  SetAkashaInterestsStreamInput: Types.SetAkashaInterestsStreamInput;
  SetAkashaInterestsStreamPayload: ResolverTypeWrapper<Omit<Types.SetAkashaInterestsStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaInterestsStream'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  SetAkashaProfileInput: Types.SetAkashaProfileInput;
  SetAkashaProfileInterestsInput: Types.SetAkashaProfileInterestsInput;
  SetAkashaProfileInterestsPayload: ResolverTypeWrapper<Omit<Types.SetAkashaProfileInterestsPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaProfileInterests'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  SetAkashaProfilePayload: ResolverTypeWrapper<Omit<Types.SetAkashaProfilePayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaProfile'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  SetAkashaProfileStreamInput: Types.SetAkashaProfileStreamInput;
  SetAkashaProfileStreamPayload: ResolverTypeWrapper<Omit<Types.SetAkashaProfileStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaProfileStream'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  SetAkashaReflectStreamInput: Types.SetAkashaReflectStreamInput;
  SetAkashaReflectStreamPayload: ResolverTypeWrapper<Omit<Types.SetAkashaReflectStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaReflectStream'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  SetOptionsInput: Types.SetOptionsInput;
  SortOrder: Types.SortOrder;
  StringValueFilterInput: Types.StringValueFilterInput;
  URI: ResolverTypeWrapper<Types.Scalars['URI']['output']>;
  UpdateAkashaAppInput: Types.UpdateAkashaAppInput;
  UpdateAkashaAppPayload: ResolverTypeWrapper<Omit<Types.UpdateAkashaAppPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaApp'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  UpdateAkashaAppReleaseInput: Types.UpdateAkashaAppReleaseInput;
  UpdateAkashaAppReleasePayload: ResolverTypeWrapper<Omit<Types.UpdateAkashaAppReleasePayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaAppRelease'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  UpdateAkashaAppsStreamInput: Types.UpdateAkashaAppsStreamInput;
  UpdateAkashaAppsStreamPayload: ResolverTypeWrapper<Omit<Types.UpdateAkashaAppsStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaAppsStream'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  UpdateAkashaBeamInput: Types.UpdateAkashaBeamInput;
  UpdateAkashaBeamPayload: ResolverTypeWrapper<Omit<Types.UpdateAkashaBeamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaBeam'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  UpdateAkashaBeamStreamInput: Types.UpdateAkashaBeamStreamInput;
  UpdateAkashaBeamStreamPayload: ResolverTypeWrapper<Omit<Types.UpdateAkashaBeamStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaBeamStream'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  UpdateAkashaBlockStorageInput: Types.UpdateAkashaBlockStorageInput;
  UpdateAkashaBlockStoragePayload: ResolverTypeWrapper<Omit<Types.UpdateAkashaBlockStoragePayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaBlockStorage'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  UpdateAkashaContentBlockInput: Types.UpdateAkashaContentBlockInput;
  UpdateAkashaContentBlockPayload: ResolverTypeWrapper<Omit<Types.UpdateAkashaContentBlockPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaContentBlock'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  UpdateAkashaContentBlockStreamInput: Types.UpdateAkashaContentBlockStreamInput;
  UpdateAkashaContentBlockStreamPayload: ResolverTypeWrapper<Omit<Types.UpdateAkashaContentBlockStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaContentBlockStream'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  UpdateAkashaFollowInput: Types.UpdateAkashaFollowInput;
  UpdateAkashaFollowPayload: ResolverTypeWrapper<Omit<Types.UpdateAkashaFollowPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaFollow'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  UpdateAkashaIndexedStreamInput: Types.UpdateAkashaIndexedStreamInput;
  UpdateAkashaIndexedStreamPayload: ResolverTypeWrapper<Omit<Types.UpdateAkashaIndexedStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaIndexedStream'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  UpdateAkashaInterestsStreamInput: Types.UpdateAkashaInterestsStreamInput;
  UpdateAkashaInterestsStreamPayload: ResolverTypeWrapper<Omit<Types.UpdateAkashaInterestsStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaInterestsStream'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  UpdateAkashaProfileInput: Types.UpdateAkashaProfileInput;
  UpdateAkashaProfileInterestsInput: Types.UpdateAkashaProfileInterestsInput;
  UpdateAkashaProfileInterestsPayload: ResolverTypeWrapper<Omit<Types.UpdateAkashaProfileInterestsPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaProfileInterests'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  UpdateAkashaProfilePayload: ResolverTypeWrapper<Omit<Types.UpdateAkashaProfilePayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaProfile'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  UpdateAkashaProfileStreamInput: Types.UpdateAkashaProfileStreamInput;
  UpdateAkashaProfileStreamPayload: ResolverTypeWrapper<Omit<Types.UpdateAkashaProfileStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaProfileStream'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  UpdateAkashaReflectInput: Types.UpdateAkashaReflectInput;
  UpdateAkashaReflectPayload: ResolverTypeWrapper<Omit<Types.UpdateAkashaReflectPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaReflect'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
  UpdateAkashaReflectStreamInput: Types.UpdateAkashaReflectStreamInput;
  UpdateAkashaReflectStreamPayload: ResolverTypeWrapper<Omit<Types.UpdateAkashaReflectStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversTypes['AkashaReflectStream'], node?: Types.Maybe<ResolversTypes['Node']>, viewer?: Types.Maybe<ResolversTypes['CeramicAccount']> }>;
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
  AkashaApp: Omit<Types.AkashaApp, 'author' | 'contributors' | 'coverImage' | 'gallery' | 'logoImage' | 'releases'> & { author: ResolversParentTypes['CeramicAccount'], contributors?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['CeramicAccount']>>>, coverImage?: Types.Maybe<ResolversParentTypes['AppImageSource']>, gallery?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AppImageSource']>>>, logoImage?: Types.Maybe<ResolversParentTypes['AppImageSource']>, releases: ResolversParentTypes['AkashaAppReleaseInterfaceConnection'] };
  String: Types.Scalars['String']['output'];
  ID: Types.Scalars['ID']['output'];
  Boolean: Types.Scalars['Boolean']['output'];
  Int: Types.Scalars['Int']['output'];
  AkashaAppApplicationTypeValueFilterInput: Types.AkashaAppApplicationTypeValueFilterInput;
  AkashaAppConnection: Omit<Types.AkashaAppConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaAppEdge']>>> };
  AkashaAppEdge: Omit<Types.AkashaAppEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaApp']> };
  AkashaAppFiltersInput: Types.AkashaAppFiltersInput;
  AkashaAppInput: Types.AkashaAppInput;
  AkashaAppInterface: ResolversInterfaceTypes<ResolversParentTypes>['AkashaAppInterface'];
  AkashaAppInterfaceConnection: Omit<Types.AkashaAppInterfaceConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaAppInterfaceEdge']>>> };
  AkashaAppInterfaceEdge: Omit<Types.AkashaAppInterfaceEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaAppInterface']> };
  AkashaAppInterfaceFiltersInput: Types.AkashaAppInterfaceFiltersInput;
  AkashaAppInterfaceObjectFilterInput: Types.AkashaAppInterfaceObjectFilterInput;
  AkashaAppInterfaceSortingInput: Types.AkashaAppInterfaceSortingInput;
  AkashaAppObjectFilterInput: Types.AkashaAppObjectFilterInput;
  AkashaAppRelease: Omit<Types.AkashaAppRelease, 'application'> & { application?: Types.Maybe<ResolversParentTypes['AkashaAppInterface']> };
  AkashaAppReleaseConnection: Omit<Types.AkashaAppReleaseConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaAppReleaseEdge']>>> };
  AkashaAppReleaseEdge: Omit<Types.AkashaAppReleaseEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaAppRelease']> };
  AkashaAppReleaseFiltersInput: Types.AkashaAppReleaseFiltersInput;
  AkashaAppReleaseInput: Types.AkashaAppReleaseInput;
  AkashaAppReleaseInterface: ResolversInterfaceTypes<ResolversParentTypes>['AkashaAppReleaseInterface'];
  AkashaAppReleaseInterfaceConnection: Omit<Types.AkashaAppReleaseInterfaceConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaAppReleaseInterfaceEdge']>>> };
  AkashaAppReleaseInterfaceEdge: Omit<Types.AkashaAppReleaseInterfaceEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaAppReleaseInterface']> };
  AkashaAppReleaseInterfaceFiltersInput: Types.AkashaAppReleaseInterfaceFiltersInput;
  AkashaAppReleaseInterfaceObjectFilterInput: Types.AkashaAppReleaseInterfaceObjectFilterInput;
  AkashaAppReleaseInterfaceSortingInput: Types.AkashaAppReleaseInterfaceSortingInput;
  AkashaAppReleaseObjectFilterInput: Types.AkashaAppReleaseObjectFilterInput;
  AkashaAppReleaseSortingInput: Types.AkashaAppReleaseSortingInput;
  AkashaAppSortingInput: Types.AkashaAppSortingInput;
  AkashaAppsStream: Omit<Types.AkashaAppsStream, 'application' | 'moderation'> & { application?: Types.Maybe<ResolversParentTypes['AkashaAppInterface']>, moderation?: Types.Maybe<ResolversParentTypes['Node']> };
  AkashaAppsStreamConnection: Omit<Types.AkashaAppsStreamConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaAppsStreamEdge']>>> };
  AkashaAppsStreamEdge: Omit<Types.AkashaAppsStreamEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaAppsStream']> };
  AkashaAppsStreamFiltersInput: Types.AkashaAppsStreamFiltersInput;
  AkashaAppsStreamInput: Types.AkashaAppsStreamInput;
  AkashaAppsStreamModerationStatusValueFilterInput: Types.AkashaAppsStreamModerationStatusValueFilterInput;
  AkashaAppsStreamObjectFilterInput: Types.AkashaAppsStreamObjectFilterInput;
  AkashaAppsStreamSortingInput: Types.AkashaAppsStreamSortingInput;
  AkashaBeam: Omit<Types.AkashaBeam, 'app' | 'appVersion' | 'author' | 'mentions' | 'reflections'> & { app?: Types.Maybe<ResolversParentTypes['AkashaAppInterface']>, appVersion?: Types.Maybe<ResolversParentTypes['AkashaAppReleaseInterface']>, author: ResolversParentTypes['CeramicAccount'], mentions?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['CeramicAccount']>>>, reflections: ResolversParentTypes['AkashaReflectInterfaceConnection'] };
  AkashaBeamConnection: Omit<Types.AkashaBeamConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaBeamEdge']>>> };
  AkashaBeamEdge: Omit<Types.AkashaBeamEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaBeam']> };
  AkashaBeamFiltersInput: Types.AkashaBeamFiltersInput;
  AkashaBeamInput: Types.AkashaBeamInput;
  AkashaBeamInterface: ResolversInterfaceTypes<ResolversParentTypes>['AkashaBeamInterface'];
  AkashaBeamInterfaceConnection: Omit<Types.AkashaBeamInterfaceConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaBeamInterfaceEdge']>>> };
  AkashaBeamInterfaceEdge: Omit<Types.AkashaBeamInterfaceEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaBeamInterface']> };
  AkashaBeamInterfaceFiltersInput: Types.AkashaBeamInterfaceFiltersInput;
  AkashaBeamInterfaceObjectFilterInput: Types.AkashaBeamInterfaceObjectFilterInput;
  AkashaBeamInterfaceSortingInput: Types.AkashaBeamInterfaceSortingInput;
  AkashaBeamObjectFilterInput: Types.AkashaBeamObjectFilterInput;
  AkashaBeamSortingInput: Types.AkashaBeamSortingInput;
  AkashaBeamStream: Omit<Types.AkashaBeamStream, 'beam' | 'moderation'> & { beam?: Types.Maybe<ResolversParentTypes['AkashaBeamInterface']>, moderation?: Types.Maybe<ResolversParentTypes['Node']> };
  AkashaBeamStreamConnection: Omit<Types.AkashaBeamStreamConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaBeamStreamEdge']>>> };
  AkashaBeamStreamEdge: Omit<Types.AkashaBeamStreamEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaBeamStream']> };
  AkashaBeamStreamFiltersInput: Types.AkashaBeamStreamFiltersInput;
  AkashaBeamStreamInput: Types.AkashaBeamStreamInput;
  AkashaBeamStreamModerationStatusValueFilterInput: Types.AkashaBeamStreamModerationStatusValueFilterInput;
  AkashaBeamStreamObjectFilterInput: Types.AkashaBeamStreamObjectFilterInput;
  AkashaBeamStreamSortingInput: Types.AkashaBeamStreamSortingInput;
  AkashaBlockStorage: Omit<Types.AkashaBlockStorage, 'appVersion' | 'author' | 'block'> & { appVersion?: Types.Maybe<ResolversParentTypes['AkashaAppReleaseInterface']>, author: ResolversParentTypes['CeramicAccount'], block?: Types.Maybe<ResolversParentTypes['AkashaContentBlock']> };
  AkashaBlockStorageBlockDefValueFilterInput: Types.AkashaBlockStorageBlockDefValueFilterInput;
  AkashaBlockStorageConnection: Omit<Types.AkashaBlockStorageConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaBlockStorageEdge']>>> };
  AkashaBlockStorageEdge: Omit<Types.AkashaBlockStorageEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaBlockStorage']> };
  AkashaBlockStorageFiltersInput: Types.AkashaBlockStorageFiltersInput;
  AkashaBlockStorageInput: Types.AkashaBlockStorageInput;
  AkashaBlockStorageObjectFilterInput: Types.AkashaBlockStorageObjectFilterInput;
  AkashaBlockStorageSortingInput: Types.AkashaBlockStorageSortingInput;
  AkashaContentBlock: Omit<Types.AkashaContentBlock, 'appVersion' | 'author'> & { appVersion?: Types.Maybe<ResolversParentTypes['AkashaAppReleaseInterface']>, author: ResolversParentTypes['CeramicAccount'] };
  AkashaContentBlockBlockDefValueFilterInput: Types.AkashaContentBlockBlockDefValueFilterInput;
  AkashaContentBlockConnection: Omit<Types.AkashaContentBlockConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaContentBlockEdge']>>> };
  AkashaContentBlockEdge: Omit<Types.AkashaContentBlockEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaContentBlock']> };
  AkashaContentBlockFiltersInput: Types.AkashaContentBlockFiltersInput;
  AkashaContentBlockInput: Types.AkashaContentBlockInput;
  AkashaContentBlockInterface: ResolversInterfaceTypes<ResolversParentTypes>['AkashaContentBlockInterface'];
  AkashaContentBlockInterfaceConnection: Omit<Types.AkashaContentBlockInterfaceConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaContentBlockInterfaceEdge']>>> };
  AkashaContentBlockInterfaceEdge: Omit<Types.AkashaContentBlockInterfaceEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaContentBlockInterface']> };
  AkashaContentBlockInterfaceFiltersInput: Types.AkashaContentBlockInterfaceFiltersInput;
  AkashaContentBlockInterfaceObjectFilterInput: Types.AkashaContentBlockInterfaceObjectFilterInput;
  AkashaContentBlockInterfaceSortingInput: Types.AkashaContentBlockInterfaceSortingInput;
  AkashaContentBlockObjectFilterInput: Types.AkashaContentBlockObjectFilterInput;
  AkashaContentBlockSortingInput: Types.AkashaContentBlockSortingInput;
  AkashaContentBlockStream: Omit<Types.AkashaContentBlockStream, 'block' | 'moderation'> & { block?: Types.Maybe<ResolversParentTypes['AkashaContentBlockInterface']>, moderation?: Types.Maybe<ResolversParentTypes['Node']> };
  AkashaContentBlockStreamConnection: Omit<Types.AkashaContentBlockStreamConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaContentBlockStreamEdge']>>> };
  AkashaContentBlockStreamEdge: Omit<Types.AkashaContentBlockStreamEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaContentBlockStream']> };
  AkashaContentBlockStreamFiltersInput: Types.AkashaContentBlockStreamFiltersInput;
  AkashaContentBlockStreamInput: Types.AkashaContentBlockStreamInput;
  AkashaContentBlockStreamModerationStatusValueFilterInput: Types.AkashaContentBlockStreamModerationStatusValueFilterInput;
  AkashaContentBlockStreamObjectFilterInput: Types.AkashaContentBlockStreamObjectFilterInput;
  AkashaContentBlockStreamSortingInput: Types.AkashaContentBlockStreamSortingInput;
  AkashaFollow: Omit<Types.AkashaFollow, 'did' | 'profile'> & { did: ResolversParentTypes['CeramicAccount'], profile?: Types.Maybe<ResolversParentTypes['AkashaProfileInterface']> };
  AkashaFollowConnection: Omit<Types.AkashaFollowConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaFollowEdge']>>> };
  AkashaFollowEdge: Omit<Types.AkashaFollowEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaFollow']> };
  AkashaFollowFiltersInput: Types.AkashaFollowFiltersInput;
  AkashaFollowInput: Types.AkashaFollowInput;
  AkashaFollowInterface: ResolversInterfaceTypes<ResolversParentTypes>['AkashaFollowInterface'];
  AkashaFollowInterfaceConnection: Omit<Types.AkashaFollowInterfaceConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaFollowInterfaceEdge']>>> };
  AkashaFollowInterfaceEdge: Omit<Types.AkashaFollowInterfaceEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaFollowInterface']> };
  AkashaFollowInterfaceFiltersInput: Types.AkashaFollowInterfaceFiltersInput;
  AkashaFollowInterfaceObjectFilterInput: Types.AkashaFollowInterfaceObjectFilterInput;
  AkashaFollowInterfaceSortingInput: Types.AkashaFollowInterfaceSortingInput;
  AkashaFollowObjectFilterInput: Types.AkashaFollowObjectFilterInput;
  AkashaFollowSortingInput: Types.AkashaFollowSortingInput;
  AkashaIndexStreamInterface: ResolversInterfaceTypes<ResolversParentTypes>['AkashaIndexStreamInterface'];
  AkashaIndexStreamInterfaceConnection: Omit<Types.AkashaIndexStreamInterfaceConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaIndexStreamInterfaceEdge']>>> };
  AkashaIndexStreamInterfaceEdge: Omit<Types.AkashaIndexStreamInterfaceEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaIndexStreamInterface']> };
  AkashaIndexStreamInterfaceFiltersInput: Types.AkashaIndexStreamInterfaceFiltersInput;
  AkashaIndexStreamInterfaceObjectFilterInput: Types.AkashaIndexStreamInterfaceObjectFilterInput;
  AkashaIndexStreamInterfaceSortingInput: Types.AkashaIndexStreamInterfaceSortingInput;
  AkashaIndexedStream: Omit<Types.AkashaIndexedStream, 'moderation' | 'streamView'> & { moderation?: Types.Maybe<ResolversParentTypes['Node']>, streamView?: Types.Maybe<ResolversParentTypes['Node']> };
  AkashaIndexedStreamConnection: Omit<Types.AkashaIndexedStreamConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaIndexedStreamEdge']>>> };
  AkashaIndexedStreamEdge: Omit<Types.AkashaIndexedStreamEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaIndexedStream']> };
  AkashaIndexedStreamFiltersInput: Types.AkashaIndexedStreamFiltersInput;
  AkashaIndexedStreamInput: Types.AkashaIndexedStreamInput;
  AkashaIndexedStreamModerationStatusValueFilterInput: Types.AkashaIndexedStreamModerationStatusValueFilterInput;
  AkashaIndexedStreamObjectFilterInput: Types.AkashaIndexedStreamObjectFilterInput;
  AkashaIndexedStreamSortingInput: Types.AkashaIndexedStreamSortingInput;
  AkashaIndexedStreamStreamTypeValueFilterInput: Types.AkashaIndexedStreamStreamTypeValueFilterInput;
  AkashaInterestsStream: Omit<Types.AkashaInterestsStream, 'moderation'> & { moderation?: Types.Maybe<ResolversParentTypes['Node']> };
  AkashaInterestsStreamConnection: Omit<Types.AkashaInterestsStreamConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaInterestsStreamEdge']>>> };
  AkashaInterestsStreamEdge: Omit<Types.AkashaInterestsStreamEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaInterestsStream']> };
  AkashaInterestsStreamFiltersInput: Types.AkashaInterestsStreamFiltersInput;
  AkashaInterestsStreamInput: Types.AkashaInterestsStreamInput;
  AkashaInterestsStreamModerationStatusValueFilterInput: Types.AkashaInterestsStreamModerationStatusValueFilterInput;
  AkashaInterestsStreamObjectFilterInput: Types.AkashaInterestsStreamObjectFilterInput;
  AkashaInterestsStreamSortingInput: Types.AkashaInterestsStreamSortingInput;
  AkashaProfile: Omit<Types.AkashaProfile, 'app' | 'appVersion' | 'did' | 'followers'> & { app?: Types.Maybe<ResolversParentTypes['AkashaAppInterface']>, appVersion?: Types.Maybe<ResolversParentTypes['AkashaAppReleaseInterface']>, did: ResolversParentTypes['CeramicAccount'], followers: ResolversParentTypes['AkashaFollowInterfaceConnection'] };
  AkashaProfileConnection: Omit<Types.AkashaProfileConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaProfileEdge']>>> };
  AkashaProfileEdge: Omit<Types.AkashaProfileEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaProfile']> };
  AkashaProfileFiltersInput: Types.AkashaProfileFiltersInput;
  AkashaProfileInput: Types.AkashaProfileInput;
  AkashaProfileInterests: Omit<Types.AkashaProfileInterests, 'did'> & { did: ResolversParentTypes['CeramicAccount'] };
  AkashaProfileInterestsConnection: Omit<Types.AkashaProfileInterestsConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaProfileInterestsEdge']>>> };
  AkashaProfileInterestsEdge: Omit<Types.AkashaProfileInterestsEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaProfileInterests']> };
  AkashaProfileInterestsInput: Types.AkashaProfileInterestsInput;
  AkashaProfileInterestsInterface: ResolversInterfaceTypes<ResolversParentTypes>['AkashaProfileInterestsInterface'];
  AkashaProfileInterestsInterfaceConnection: Omit<Types.AkashaProfileInterestsInterfaceConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaProfileInterestsInterfaceEdge']>>> };
  AkashaProfileInterestsInterfaceEdge: Omit<Types.AkashaProfileInterestsInterfaceEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaProfileInterestsInterface']> };
  AkashaProfileInterface: ResolversInterfaceTypes<ResolversParentTypes>['AkashaProfileInterface'];
  AkashaProfileInterfaceConnection: Omit<Types.AkashaProfileInterfaceConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaProfileInterfaceEdge']>>> };
  AkashaProfileInterfaceEdge: Omit<Types.AkashaProfileInterfaceEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaProfileInterface']> };
  AkashaProfileInterfaceFiltersInput: Types.AkashaProfileInterfaceFiltersInput;
  AkashaProfileInterfaceObjectFilterInput: Types.AkashaProfileInterfaceObjectFilterInput;
  AkashaProfileInterfaceSortingInput: Types.AkashaProfileInterfaceSortingInput;
  AkashaProfileObjectFilterInput: Types.AkashaProfileObjectFilterInput;
  AkashaProfileSortingInput: Types.AkashaProfileSortingInput;
  AkashaProfileStream: Omit<Types.AkashaProfileStream, 'moderation' | 'profile'> & { moderation?: Types.Maybe<ResolversParentTypes['Node']>, profile?: Types.Maybe<ResolversParentTypes['AkashaProfileInterface']> };
  AkashaProfileStreamConnection: Omit<Types.AkashaProfileStreamConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaProfileStreamEdge']>>> };
  AkashaProfileStreamEdge: Omit<Types.AkashaProfileStreamEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaProfileStream']> };
  AkashaProfileStreamFiltersInput: Types.AkashaProfileStreamFiltersInput;
  AkashaProfileStreamInput: Types.AkashaProfileStreamInput;
  AkashaProfileStreamModerationStatusValueFilterInput: Types.AkashaProfileStreamModerationStatusValueFilterInput;
  AkashaProfileStreamObjectFilterInput: Types.AkashaProfileStreamObjectFilterInput;
  AkashaProfileStreamSortingInput: Types.AkashaProfileStreamSortingInput;
  AkashaReflect: Omit<Types.AkashaReflect, 'author' | 'beam' | 'reflectionView'> & { author: ResolversParentTypes['CeramicAccount'], beam?: Types.Maybe<ResolversParentTypes['AkashaBeamInterface']>, reflectionView?: Types.Maybe<ResolversParentTypes['Node']> };
  AkashaReflectConnection: Omit<Types.AkashaReflectConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaReflectEdge']>>> };
  AkashaReflectEdge: Omit<Types.AkashaReflectEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaReflect']> };
  AkashaReflectFiltersInput: Types.AkashaReflectFiltersInput;
  AkashaReflectInput: Types.AkashaReflectInput;
  AkashaReflectInterface: ResolversInterfaceTypes<ResolversParentTypes>['AkashaReflectInterface'];
  AkashaReflectInterfaceConnection: Omit<Types.AkashaReflectInterfaceConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaReflectInterfaceEdge']>>> };
  AkashaReflectInterfaceEdge: Omit<Types.AkashaReflectInterfaceEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaReflectInterface']> };
  AkashaReflectInterfaceFiltersInput: Types.AkashaReflectInterfaceFiltersInput;
  AkashaReflectInterfaceObjectFilterInput: Types.AkashaReflectInterfaceObjectFilterInput;
  AkashaReflectInterfaceSortingInput: Types.AkashaReflectInterfaceSortingInput;
  AkashaReflectObjectFilterInput: Types.AkashaReflectObjectFilterInput;
  AkashaReflectSortingInput: Types.AkashaReflectSortingInput;
  AkashaReflectStream: Omit<Types.AkashaReflectStream, 'moderation' | 'reflection'> & { moderation?: Types.Maybe<ResolversParentTypes['Node']>, reflection?: Types.Maybe<ResolversParentTypes['AkashaReflectInterface']> };
  AkashaReflectStreamConnection: Omit<Types.AkashaReflectStreamConnection, 'edges'> & { edges?: Types.Maybe<Array<Types.Maybe<ResolversParentTypes['AkashaReflectStreamEdge']>>> };
  AkashaReflectStreamEdge: Omit<Types.AkashaReflectStreamEdge, 'node'> & { node?: Types.Maybe<ResolversParentTypes['AkashaReflectStream']> };
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
  CeramicAccount: Omit<Types.CeramicAccount, 'akashaApp' | 'akashaAppInterfaceList' | 'akashaAppList' | 'akashaAppRelease' | 'akashaAppReleaseInterfaceList' | 'akashaAppReleaseList' | 'akashaAppsStream' | 'akashaAppsStreamList' | 'akashaBeamInterfaceList' | 'akashaBeamList' | 'akashaBeamStream' | 'akashaBeamStreamList' | 'akashaBlockStorage' | 'akashaBlockStorageList' | 'akashaContentBlockInterfaceList' | 'akashaContentBlockList' | 'akashaContentBlockStream' | 'akashaContentBlockStreamList' | 'akashaFollow' | 'akashaFollowInterfaceList' | 'akashaFollowList' | 'akashaIndexStreamInterfaceList' | 'akashaIndexedStream' | 'akashaIndexedStreamList' | 'akashaInterestsStream' | 'akashaInterestsStreamList' | 'akashaProfile' | 'akashaProfileInterests' | 'akashaProfileInterestsInterfaceList' | 'akashaProfileInterfaceList' | 'akashaProfileStream' | 'akashaProfileStreamList' | 'akashaReflectInterfaceList' | 'akashaReflectList' | 'akashaReflectStream' | 'akashaReflectStreamList'> & { akashaApp?: Types.Maybe<ResolversParentTypes['AkashaApp']>, akashaAppInterfaceList?: Types.Maybe<ResolversParentTypes['AkashaAppInterfaceConnection']>, akashaAppList?: Types.Maybe<ResolversParentTypes['AkashaAppConnection']>, akashaAppRelease?: Types.Maybe<ResolversParentTypes['AkashaAppRelease']>, akashaAppReleaseInterfaceList?: Types.Maybe<ResolversParentTypes['AkashaAppReleaseInterfaceConnection']>, akashaAppReleaseList?: Types.Maybe<ResolversParentTypes['AkashaAppReleaseConnection']>, akashaAppsStream?: Types.Maybe<ResolversParentTypes['AkashaAppsStream']>, akashaAppsStreamList?: Types.Maybe<ResolversParentTypes['AkashaAppsStreamConnection']>, akashaBeamInterfaceList?: Types.Maybe<ResolversParentTypes['AkashaBeamInterfaceConnection']>, akashaBeamList?: Types.Maybe<ResolversParentTypes['AkashaBeamConnection']>, akashaBeamStream?: Types.Maybe<ResolversParentTypes['AkashaBeamStream']>, akashaBeamStreamList?: Types.Maybe<ResolversParentTypes['AkashaBeamStreamConnection']>, akashaBlockStorage?: Types.Maybe<ResolversParentTypes['AkashaBlockStorage']>, akashaBlockStorageList?: Types.Maybe<ResolversParentTypes['AkashaBlockStorageConnection']>, akashaContentBlockInterfaceList?: Types.Maybe<ResolversParentTypes['AkashaContentBlockInterfaceConnection']>, akashaContentBlockList?: Types.Maybe<ResolversParentTypes['AkashaContentBlockConnection']>, akashaContentBlockStream?: Types.Maybe<ResolversParentTypes['AkashaContentBlockStream']>, akashaContentBlockStreamList?: Types.Maybe<ResolversParentTypes['AkashaContentBlockStreamConnection']>, akashaFollow?: Types.Maybe<ResolversParentTypes['AkashaFollow']>, akashaFollowInterfaceList?: Types.Maybe<ResolversParentTypes['AkashaFollowInterfaceConnection']>, akashaFollowList?: Types.Maybe<ResolversParentTypes['AkashaFollowConnection']>, akashaIndexStreamInterfaceList?: Types.Maybe<ResolversParentTypes['AkashaIndexStreamInterfaceConnection']>, akashaIndexedStream?: Types.Maybe<ResolversParentTypes['AkashaIndexedStream']>, akashaIndexedStreamList?: Types.Maybe<ResolversParentTypes['AkashaIndexedStreamConnection']>, akashaInterestsStream?: Types.Maybe<ResolversParentTypes['AkashaInterestsStream']>, akashaInterestsStreamList?: Types.Maybe<ResolversParentTypes['AkashaInterestsStreamConnection']>, akashaProfile?: Types.Maybe<ResolversParentTypes['AkashaProfile']>, akashaProfileInterests?: Types.Maybe<ResolversParentTypes['AkashaProfileInterests']>, akashaProfileInterestsInterfaceList?: Types.Maybe<ResolversParentTypes['AkashaProfileInterestsInterfaceConnection']>, akashaProfileInterfaceList?: Types.Maybe<ResolversParentTypes['AkashaProfileInterfaceConnection']>, akashaProfileStream?: Types.Maybe<ResolversParentTypes['AkashaProfileStream']>, akashaProfileStreamList?: Types.Maybe<ResolversParentTypes['AkashaProfileStreamConnection']>, akashaReflectInterfaceList?: Types.Maybe<ResolversParentTypes['AkashaReflectInterfaceConnection']>, akashaReflectList?: Types.Maybe<ResolversParentTypes['AkashaReflectConnection']>, akashaReflectStream?: Types.Maybe<ResolversParentTypes['AkashaReflectStream']>, akashaReflectStreamList?: Types.Maybe<ResolversParentTypes['AkashaReflectStreamConnection']> };
  CeramicCommitID: Types.Scalars['CeramicCommitID']['output'];
  CeramicStreamID: Types.Scalars['CeramicStreamID']['output'];
  CreateAkashaBeamInput: Types.CreateAkashaBeamInput;
  CreateAkashaBeamPayload: Omit<Types.CreateAkashaBeamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaBeam'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  CreateAkashaContentBlockInput: Types.CreateAkashaContentBlockInput;
  CreateAkashaContentBlockPayload: Omit<Types.CreateAkashaContentBlockPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaContentBlock'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  CreateAkashaProfileInput: Types.CreateAkashaProfileInput;
  CreateAkashaProfileInterestsInput: Types.CreateAkashaProfileInterestsInput;
  CreateAkashaProfileInterestsPayload: Omit<Types.CreateAkashaProfileInterestsPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaProfileInterests'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  CreateAkashaProfilePayload: Omit<Types.CreateAkashaProfilePayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaProfile'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  CreateAkashaReflectInput: Types.CreateAkashaReflectInput;
  CreateAkashaReflectPayload: Omit<Types.CreateAkashaReflectPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaReflect'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  CreateOptionsInput: Types.CreateOptionsInput;
  DID: Types.Scalars['DID']['output'];
  DID_JWS: Types.Did_Jws;
  DateTime: Types.Scalars['DateTime']['output'];
  EnableIndexingAkashaAppInput: Types.EnableIndexingAkashaAppInput;
  EnableIndexingAkashaAppPayload: Omit<Types.EnableIndexingAkashaAppPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversParentTypes['AkashaApp']>, node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  EnableIndexingAkashaAppReleaseInput: Types.EnableIndexingAkashaAppReleaseInput;
  EnableIndexingAkashaAppReleasePayload: Omit<Types.EnableIndexingAkashaAppReleasePayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversParentTypes['AkashaAppRelease']>, node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  EnableIndexingAkashaAppsStreamInput: Types.EnableIndexingAkashaAppsStreamInput;
  EnableIndexingAkashaAppsStreamPayload: Omit<Types.EnableIndexingAkashaAppsStreamPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversParentTypes['AkashaAppsStream']>, node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  EnableIndexingAkashaBeamInput: Types.EnableIndexingAkashaBeamInput;
  EnableIndexingAkashaBeamPayload: Omit<Types.EnableIndexingAkashaBeamPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversParentTypes['AkashaBeam']>, node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  EnableIndexingAkashaBeamStreamInput: Types.EnableIndexingAkashaBeamStreamInput;
  EnableIndexingAkashaBeamStreamPayload: Omit<Types.EnableIndexingAkashaBeamStreamPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversParentTypes['AkashaBeamStream']>, node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  EnableIndexingAkashaBlockStorageInput: Types.EnableIndexingAkashaBlockStorageInput;
  EnableIndexingAkashaBlockStoragePayload: Omit<Types.EnableIndexingAkashaBlockStoragePayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversParentTypes['AkashaBlockStorage']>, node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  EnableIndexingAkashaContentBlockInput: Types.EnableIndexingAkashaContentBlockInput;
  EnableIndexingAkashaContentBlockPayload: Omit<Types.EnableIndexingAkashaContentBlockPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversParentTypes['AkashaContentBlock']>, node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  EnableIndexingAkashaContentBlockStreamInput: Types.EnableIndexingAkashaContentBlockStreamInput;
  EnableIndexingAkashaContentBlockStreamPayload: Omit<Types.EnableIndexingAkashaContentBlockStreamPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversParentTypes['AkashaContentBlockStream']>, node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  EnableIndexingAkashaFollowInput: Types.EnableIndexingAkashaFollowInput;
  EnableIndexingAkashaFollowPayload: Omit<Types.EnableIndexingAkashaFollowPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversParentTypes['AkashaFollow']>, node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  EnableIndexingAkashaIndexedStreamInput: Types.EnableIndexingAkashaIndexedStreamInput;
  EnableIndexingAkashaIndexedStreamPayload: Omit<Types.EnableIndexingAkashaIndexedStreamPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversParentTypes['AkashaIndexedStream']>, node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  EnableIndexingAkashaInterestsStreamInput: Types.EnableIndexingAkashaInterestsStreamInput;
  EnableIndexingAkashaInterestsStreamPayload: Omit<Types.EnableIndexingAkashaInterestsStreamPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversParentTypes['AkashaInterestsStream']>, node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  EnableIndexingAkashaProfileInput: Types.EnableIndexingAkashaProfileInput;
  EnableIndexingAkashaProfileInterestsInput: Types.EnableIndexingAkashaProfileInterestsInput;
  EnableIndexingAkashaProfileInterestsPayload: Omit<Types.EnableIndexingAkashaProfileInterestsPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversParentTypes['AkashaProfileInterests']>, node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  EnableIndexingAkashaProfilePayload: Omit<Types.EnableIndexingAkashaProfilePayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversParentTypes['AkashaProfile']>, node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  EnableIndexingAkashaProfileStreamInput: Types.EnableIndexingAkashaProfileStreamInput;
  EnableIndexingAkashaProfileStreamPayload: Omit<Types.EnableIndexingAkashaProfileStreamPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversParentTypes['AkashaProfileStream']>, node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  EnableIndexingAkashaReflectInput: Types.EnableIndexingAkashaReflectInput;
  EnableIndexingAkashaReflectPayload: Omit<Types.EnableIndexingAkashaReflectPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversParentTypes['AkashaReflect']>, node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  EnableIndexingAkashaReflectStreamInput: Types.EnableIndexingAkashaReflectStreamInput;
  EnableIndexingAkashaReflectStreamPayload: Omit<Types.EnableIndexingAkashaReflectStreamPayload, 'document' | 'node' | 'viewer'> & { document?: Types.Maybe<ResolversParentTypes['AkashaReflectStream']>, node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
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
  SetAkashaAppPayload: Omit<Types.SetAkashaAppPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaApp'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  SetAkashaAppReleaseInput: Types.SetAkashaAppReleaseInput;
  SetAkashaAppReleasePayload: Omit<Types.SetAkashaAppReleasePayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaAppRelease'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  SetAkashaAppsStreamInput: Types.SetAkashaAppsStreamInput;
  SetAkashaAppsStreamPayload: Omit<Types.SetAkashaAppsStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaAppsStream'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  SetAkashaBeamStreamInput: Types.SetAkashaBeamStreamInput;
  SetAkashaBeamStreamPayload: Omit<Types.SetAkashaBeamStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaBeamStream'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  SetAkashaBlockStorageInput: Types.SetAkashaBlockStorageInput;
  SetAkashaBlockStoragePayload: Omit<Types.SetAkashaBlockStoragePayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaBlockStorage'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  SetAkashaContentBlockStreamInput: Types.SetAkashaContentBlockStreamInput;
  SetAkashaContentBlockStreamPayload: Omit<Types.SetAkashaContentBlockStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaContentBlockStream'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  SetAkashaFollowInput: Types.SetAkashaFollowInput;
  SetAkashaFollowPayload: Omit<Types.SetAkashaFollowPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaFollow'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  SetAkashaIndexedStreamInput: Types.SetAkashaIndexedStreamInput;
  SetAkashaIndexedStreamPayload: Omit<Types.SetAkashaIndexedStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaIndexedStream'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  SetAkashaInterestsStreamInput: Types.SetAkashaInterestsStreamInput;
  SetAkashaInterestsStreamPayload: Omit<Types.SetAkashaInterestsStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaInterestsStream'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  SetAkashaProfileInput: Types.SetAkashaProfileInput;
  SetAkashaProfileInterestsInput: Types.SetAkashaProfileInterestsInput;
  SetAkashaProfileInterestsPayload: Omit<Types.SetAkashaProfileInterestsPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaProfileInterests'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  SetAkashaProfilePayload: Omit<Types.SetAkashaProfilePayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaProfile'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  SetAkashaProfileStreamInput: Types.SetAkashaProfileStreamInput;
  SetAkashaProfileStreamPayload: Omit<Types.SetAkashaProfileStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaProfileStream'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  SetAkashaReflectStreamInput: Types.SetAkashaReflectStreamInput;
  SetAkashaReflectStreamPayload: Omit<Types.SetAkashaReflectStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaReflectStream'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  SetOptionsInput: Types.SetOptionsInput;
  StringValueFilterInput: Types.StringValueFilterInput;
  URI: Types.Scalars['URI']['output'];
  UpdateAkashaAppInput: Types.UpdateAkashaAppInput;
  UpdateAkashaAppPayload: Omit<Types.UpdateAkashaAppPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaApp'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  UpdateAkashaAppReleaseInput: Types.UpdateAkashaAppReleaseInput;
  UpdateAkashaAppReleasePayload: Omit<Types.UpdateAkashaAppReleasePayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaAppRelease'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  UpdateAkashaAppsStreamInput: Types.UpdateAkashaAppsStreamInput;
  UpdateAkashaAppsStreamPayload: Omit<Types.UpdateAkashaAppsStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaAppsStream'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  UpdateAkashaBeamInput: Types.UpdateAkashaBeamInput;
  UpdateAkashaBeamPayload: Omit<Types.UpdateAkashaBeamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaBeam'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  UpdateAkashaBeamStreamInput: Types.UpdateAkashaBeamStreamInput;
  UpdateAkashaBeamStreamPayload: Omit<Types.UpdateAkashaBeamStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaBeamStream'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  UpdateAkashaBlockStorageInput: Types.UpdateAkashaBlockStorageInput;
  UpdateAkashaBlockStoragePayload: Omit<Types.UpdateAkashaBlockStoragePayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaBlockStorage'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  UpdateAkashaContentBlockInput: Types.UpdateAkashaContentBlockInput;
  UpdateAkashaContentBlockPayload: Omit<Types.UpdateAkashaContentBlockPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaContentBlock'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  UpdateAkashaContentBlockStreamInput: Types.UpdateAkashaContentBlockStreamInput;
  UpdateAkashaContentBlockStreamPayload: Omit<Types.UpdateAkashaContentBlockStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaContentBlockStream'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  UpdateAkashaFollowInput: Types.UpdateAkashaFollowInput;
  UpdateAkashaFollowPayload: Omit<Types.UpdateAkashaFollowPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaFollow'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  UpdateAkashaIndexedStreamInput: Types.UpdateAkashaIndexedStreamInput;
  UpdateAkashaIndexedStreamPayload: Omit<Types.UpdateAkashaIndexedStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaIndexedStream'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  UpdateAkashaInterestsStreamInput: Types.UpdateAkashaInterestsStreamInput;
  UpdateAkashaInterestsStreamPayload: Omit<Types.UpdateAkashaInterestsStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaInterestsStream'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  UpdateAkashaProfileInput: Types.UpdateAkashaProfileInput;
  UpdateAkashaProfileInterestsInput: Types.UpdateAkashaProfileInterestsInput;
  UpdateAkashaProfileInterestsPayload: Omit<Types.UpdateAkashaProfileInterestsPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaProfileInterests'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  UpdateAkashaProfilePayload: Omit<Types.UpdateAkashaProfilePayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaProfile'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  UpdateAkashaProfileStreamInput: Types.UpdateAkashaProfileStreamInput;
  UpdateAkashaProfileStreamPayload: Omit<Types.UpdateAkashaProfileStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaProfileStream'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  UpdateAkashaReflectInput: Types.UpdateAkashaReflectInput;
  UpdateAkashaReflectPayload: Omit<Types.UpdateAkashaReflectPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaReflect'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
  UpdateAkashaReflectStreamInput: Types.UpdateAkashaReflectStreamInput;
  UpdateAkashaReflectStreamPayload: Omit<Types.UpdateAkashaReflectStreamPayload, 'document' | 'node' | 'viewer'> & { document: ResolversParentTypes['AkashaReflectStream'], node?: Types.Maybe<ResolversParentTypes['Node']>, viewer?: Types.Maybe<ResolversParentTypes['CeramicAccount']> };
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
