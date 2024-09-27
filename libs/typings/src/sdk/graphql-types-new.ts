export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  CacaoHeaderT: { input: any; output: any; }
  CacaoSignatureT: { input: any; output: any; }
  /** A Ceramic Commit ID */
  CeramicCommitID: { input: any; output: any; }
  /** A Ceramic Stream ID */
  CeramicStreamID: { input: any; output: any; }
  /** A field whose value conforms to the standard DID format as specified in did-core: https://www.w3.org/TR/did-core/. */
  DID: { input: any; output: any; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: { input: any; output: any; }
  /** A field whose value conforms to the standard Uniform Resource Identifier (URI) format as specified in RFC3986. */
  URI: { input: any; output: any; }
  join__FieldSet: { input: any; output: any; }
  link__Import: { input: any; output: any; }
  _FieldSet: { input: any; output: any; }
};

export type AkashaApp = AkashaAppInterface & Node & {
  applicationType?: Maybe<AkashaAppApplicationType>;
  /** Account controlling the document */
  author: CeramicAccount;
  contributors?: Maybe<Array<Maybe<CeramicAccount>>>;
  coverImage?: Maybe<AppImageSource>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  gallery?: Maybe<Array<Maybe<AppImageSource>>>;
  id: Scalars['ID']['output'];
  keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  license: Scalars['String']['output'];
  links?: Maybe<Array<Maybe<AppLinkSource>>>;
  logoImage?: Maybe<AppImageSource>;
  meta?: Maybe<Array<Maybe<AppProviderValue>>>;
  name: Scalars['String']['output'];
  nsfw?: Maybe<Scalars['Boolean']['output']>;
  releases: AkashaAppReleaseInterfaceConnection;
  releasesCount: Scalars['Int']['output'];
  /** Current version of the document */
  version: Scalars['CeramicCommitID']['output'];
};


export type AkashaAppReleasesArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaAppReleaseInterfaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaAppReleaseInterfaceSortingInput>;
};


export type AkashaAppReleasesCountArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  filters?: InputMaybe<AkashaAppReleaseInterfaceFiltersInput>;
};

export enum AkashaAppApplicationType {
  App = 'APP',
  Other = 'OTHER',
  Plugin = 'PLUGIN',
  Widget = 'WIDGET'
}

export type AkashaAppApplicationTypeValueFilterInput = {
  equalTo?: InputMaybe<AkashaAppApplicationType>;
  in?: InputMaybe<Array<AkashaAppApplicationType>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqualTo?: InputMaybe<AkashaAppApplicationType>;
  notIn?: InputMaybe<Array<AkashaAppApplicationType>>;
};

/** A connection to a list of items. */
export type AkashaAppConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaAppEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaAppEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaApp>;
};

export type AkashaAppFiltersInput = {
  and?: InputMaybe<Array<AkashaAppFiltersInput>>;
  not?: InputMaybe<AkashaAppFiltersInput>;
  or?: InputMaybe<Array<AkashaAppFiltersInput>>;
  where?: InputMaybe<AkashaAppObjectFilterInput>;
};

export type AkashaAppInput = {
  applicationType?: InputMaybe<AkashaAppApplicationType>;
  contributors?: InputMaybe<Array<InputMaybe<Scalars['DID']['input']>>>;
  coverImage?: InputMaybe<AppImageSourceInput>;
  createdAt: Scalars['DateTime']['input'];
  description: Scalars['String']['input'];
  displayName: Scalars['String']['input'];
  gallery?: InputMaybe<Array<InputMaybe<AppImageSourceInput>>>;
  keywords?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  license: Scalars['String']['input'];
  links?: InputMaybe<Array<InputMaybe<AppLinkSourceInput>>>;
  logoImage?: InputMaybe<AppImageSourceInput>;
  meta?: InputMaybe<Array<InputMaybe<AppProviderValueInput>>>;
  name: Scalars['String']['input'];
  nsfw?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AkashaAppInterface = {
  /** Account controlling the document */
  author: CeramicAccount;
  contributors?: Maybe<Array<Maybe<CeramicAccount>>>;
  coverImage?: Maybe<AppImageSource>;
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  displayName: Scalars['String']['output'];
  gallery?: Maybe<Array<Maybe<AppImageSource>>>;
  id: Scalars['ID']['output'];
  keywords?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  license: Scalars['String']['output'];
  links?: Maybe<Array<Maybe<AppLinkSource>>>;
  logoImage?: Maybe<AppImageSource>;
  meta?: Maybe<Array<Maybe<AppProviderValue>>>;
  name: Scalars['String']['output'];
  nsfw?: Maybe<Scalars['Boolean']['output']>;
  /** Current version of the document */
  version: Scalars['CeramicCommitID']['output'];
};

/** A connection to a list of items. */
export type AkashaAppInterfaceConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaAppInterfaceEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaAppInterfaceEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaAppInterface>;
};

export type AkashaAppInterfaceFiltersInput = {
  and?: InputMaybe<Array<AkashaAppInterfaceFiltersInput>>;
  not?: InputMaybe<AkashaAppInterfaceFiltersInput>;
  or?: InputMaybe<Array<AkashaAppInterfaceFiltersInput>>;
  where?: InputMaybe<AkashaAppInterfaceObjectFilterInput>;
};

export type AkashaAppInterfaceObjectFilterInput = {
  createdAt?: InputMaybe<StringValueFilterInput>;
  description?: InputMaybe<StringValueFilterInput>;
  displayName?: InputMaybe<StringValueFilterInput>;
  license?: InputMaybe<StringValueFilterInput>;
  name?: InputMaybe<StringValueFilterInput>;
  nsfw?: InputMaybe<BooleanValueFilterInput>;
};

export type AkashaAppInterfaceSortingInput = {
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  license?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  nsfw?: InputMaybe<SortOrder>;
};

export type AkashaAppObjectFilterInput = {
  applicationType?: InputMaybe<AkashaAppApplicationTypeValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  displayName?: InputMaybe<StringValueFilterInput>;
  name?: InputMaybe<StringValueFilterInput>;
  nsfw?: InputMaybe<BooleanValueFilterInput>;
};

export type AkashaAppRelease = AkashaAppReleaseInterface & Node & {
  application?: Maybe<AkashaAppInterface>;
  applicationID: Scalars['CeramicStreamID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  meta?: Maybe<Array<Maybe<AppProviderValue>>>;
  source: Scalars['URI']['output'];
  version: Scalars['String']['output'];
};

/** A connection to a list of items. */
export type AkashaAppReleaseConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaAppReleaseEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaAppReleaseEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaAppRelease>;
};

export type AkashaAppReleaseFiltersInput = {
  and?: InputMaybe<Array<AkashaAppReleaseFiltersInput>>;
  not?: InputMaybe<AkashaAppReleaseFiltersInput>;
  or?: InputMaybe<Array<AkashaAppReleaseFiltersInput>>;
  where?: InputMaybe<AkashaAppReleaseObjectFilterInput>;
};

export type AkashaAppReleaseInput = {
  applicationID: Scalars['CeramicStreamID']['input'];
  createdAt: Scalars['DateTime']['input'];
  meta?: InputMaybe<Array<InputMaybe<AppProviderValueInput>>>;
  source: Scalars['URI']['input'];
  version: Scalars['String']['input'];
};

export type AkashaAppReleaseInterface = {
  application?: Maybe<AkashaAppInterface>;
  applicationID: Scalars['CeramicStreamID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  meta?: Maybe<Array<Maybe<AppProviderValue>>>;
  source: Scalars['URI']['output'];
  version: Scalars['String']['output'];
};

/** A connection to a list of items. */
export type AkashaAppReleaseInterfaceConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaAppReleaseInterfaceEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaAppReleaseInterfaceEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaAppReleaseInterface>;
};

export type AkashaAppReleaseInterfaceFiltersInput = {
  and?: InputMaybe<Array<AkashaAppReleaseInterfaceFiltersInput>>;
  not?: InputMaybe<AkashaAppReleaseInterfaceFiltersInput>;
  or?: InputMaybe<Array<AkashaAppReleaseInterfaceFiltersInput>>;
  where?: InputMaybe<AkashaAppReleaseInterfaceObjectFilterInput>;
};

export type AkashaAppReleaseInterfaceObjectFilterInput = {
  applicationID?: InputMaybe<StringValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  source?: InputMaybe<StringValueFilterInput>;
  version?: InputMaybe<StringValueFilterInput>;
};

export type AkashaAppReleaseInterfaceSortingInput = {
  applicationID?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  source?: InputMaybe<SortOrder>;
  version?: InputMaybe<SortOrder>;
};

export type AkashaAppReleaseObjectFilterInput = {
  applicationID?: InputMaybe<StringValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  version?: InputMaybe<StringValueFilterInput>;
};

export type AkashaAppReleaseSortingInput = {
  applicationID?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  version?: InputMaybe<SortOrder>;
};

export type AkashaAppSortingInput = {
  applicationType?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  nsfw?: InputMaybe<SortOrder>;
};

export type AkashaAppsStream = AkashaIndexStreamInterface & Node & {
  active: Scalars['Boolean']['output'];
  application?: Maybe<AkashaAppInterface>;
  applicationID: Scalars['CeramicStreamID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  moderation?: Maybe<Node>;
  moderationID?: Maybe<Scalars['CeramicStreamID']['output']>;
  status?: Maybe<AkashaAppsStreamModerationStatus>;
};

/** A connection to a list of items. */
export type AkashaAppsStreamConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaAppsStreamEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaAppsStreamEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaAppsStream>;
};

export type AkashaAppsStreamFiltersInput = {
  and?: InputMaybe<Array<AkashaAppsStreamFiltersInput>>;
  not?: InputMaybe<AkashaAppsStreamFiltersInput>;
  or?: InputMaybe<Array<AkashaAppsStreamFiltersInput>>;
  where?: InputMaybe<AkashaAppsStreamObjectFilterInput>;
};

export type AkashaAppsStreamInput = {
  active: Scalars['Boolean']['input'];
  applicationID: Scalars['CeramicStreamID']['input'];
  createdAt: Scalars['DateTime']['input'];
  moderationID?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  status?: InputMaybe<AkashaAppsStreamModerationStatus>;
};

export enum AkashaAppsStreamModerationStatus {
  InReview = 'IN_REVIEW',
  Nsfw = 'NSFW',
  Ok = 'OK',
  Other = 'OTHER',
  Removed = 'REMOVED',
  Suspended = 'SUSPENDED'
}

export type AkashaAppsStreamModerationStatusValueFilterInput = {
  equalTo?: InputMaybe<AkashaAppsStreamModerationStatus>;
  in?: InputMaybe<Array<AkashaAppsStreamModerationStatus>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqualTo?: InputMaybe<AkashaAppsStreamModerationStatus>;
  notIn?: InputMaybe<Array<AkashaAppsStreamModerationStatus>>;
};

export type AkashaAppsStreamObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  applicationID?: InputMaybe<StringValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  moderationID?: InputMaybe<StringValueFilterInput>;
  status?: InputMaybe<AkashaAppsStreamModerationStatusValueFilterInput>;
};

export type AkashaAppsStreamSortingInput = {
  active?: InputMaybe<SortOrder>;
  applicationID?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  moderationID?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
};

export type AkashaBeam = AkashaBeamInterface & Node & {
  active: Scalars['Boolean']['output'];
  app?: Maybe<AkashaAppInterface>;
  appID: Scalars['CeramicStreamID']['output'];
  appVersion?: Maybe<AkashaAppReleaseInterface>;
  appVersionID: Scalars['CeramicStreamID']['output'];
  /** Account controlling the document */
  author: CeramicAccount;
  content: Array<BeamBlockRecord>;
  createdAt: Scalars['DateTime']['output'];
  embeddedStream?: Maybe<BeamEmbeddedType>;
  id: Scalars['ID']['output'];
  mentions?: Maybe<Array<Maybe<CeramicAccount>>>;
  nsfw?: Maybe<Scalars['Boolean']['output']>;
  reflections: AkashaReflectInterfaceConnection;
  reflectionsCount: Scalars['Int']['output'];
  tags?: Maybe<Array<Maybe<BeamLabeled>>>;
  /** Current version of the document */
  version: Scalars['CeramicCommitID']['output'];
};


export type AkashaBeamReflectionsArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaReflectInterfaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaReflectInterfaceSortingInput>;
};


export type AkashaBeamReflectionsCountArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  filters?: InputMaybe<AkashaReflectInterfaceFiltersInput>;
};

/** A connection to a list of items. */
export type AkashaBeamConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaBeamEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaBeamEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaBeam>;
};

export type AkashaBeamFiltersInput = {
  and?: InputMaybe<Array<AkashaBeamFiltersInput>>;
  not?: InputMaybe<AkashaBeamFiltersInput>;
  or?: InputMaybe<Array<AkashaBeamFiltersInput>>;
  where?: InputMaybe<AkashaBeamObjectFilterInput>;
};

export type AkashaBeamInput = {
  active: Scalars['Boolean']['input'];
  appID: Scalars['CeramicStreamID']['input'];
  appVersionID: Scalars['CeramicStreamID']['input'];
  content: Array<InputMaybe<BeamBlockRecordInput>>;
  createdAt: Scalars['DateTime']['input'];
  embeddedStream?: InputMaybe<BeamEmbeddedTypeInput>;
  mentions?: InputMaybe<Array<InputMaybe<Scalars['DID']['input']>>>;
  nsfw?: InputMaybe<Scalars['Boolean']['input']>;
  tags?: InputMaybe<Array<InputMaybe<BeamLabeledInput>>>;
};

export type AkashaBeamInterface = {
  active: Scalars['Boolean']['output'];
  app?: Maybe<AkashaAppInterface>;
  appID: Scalars['CeramicStreamID']['output'];
  appVersion?: Maybe<AkashaAppReleaseInterface>;
  appVersionID: Scalars['CeramicStreamID']['output'];
  /** Account controlling the document */
  author: CeramicAccount;
  content: Array<BeamBlockRecord>;
  createdAt: Scalars['DateTime']['output'];
  embeddedStream?: Maybe<BeamEmbeddedType>;
  id: Scalars['ID']['output'];
  mentions?: Maybe<Array<Maybe<CeramicAccount>>>;
  nsfw?: Maybe<Scalars['Boolean']['output']>;
  tags?: Maybe<Array<Maybe<BeamLabeled>>>;
  /** Current version of the document */
  version: Scalars['CeramicCommitID']['output'];
};

/** A connection to a list of items. */
export type AkashaBeamInterfaceConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaBeamInterfaceEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaBeamInterfaceEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaBeamInterface>;
};

export type AkashaBeamInterfaceFiltersInput = {
  and?: InputMaybe<Array<AkashaBeamInterfaceFiltersInput>>;
  not?: InputMaybe<AkashaBeamInterfaceFiltersInput>;
  or?: InputMaybe<Array<AkashaBeamInterfaceFiltersInput>>;
  where?: InputMaybe<AkashaBeamInterfaceObjectFilterInput>;
};

export type AkashaBeamInterfaceObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  appID?: InputMaybe<StringValueFilterInput>;
  appVersionID?: InputMaybe<StringValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  nsfw?: InputMaybe<BooleanValueFilterInput>;
};

export type AkashaBeamInterfaceSortingInput = {
  active?: InputMaybe<SortOrder>;
  appID?: InputMaybe<SortOrder>;
  appVersionID?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  nsfw?: InputMaybe<SortOrder>;
};

export type AkashaBeamObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  appID?: InputMaybe<StringValueFilterInput>;
  appVersionID?: InputMaybe<StringValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  nsfw?: InputMaybe<BooleanValueFilterInput>;
};

export type AkashaBeamSortingInput = {
  active?: InputMaybe<SortOrder>;
  appID?: InputMaybe<SortOrder>;
  appVersionID?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  nsfw?: InputMaybe<SortOrder>;
};

export type AkashaBeamStream = AkashaIndexStreamInterface & Node & {
  active: Scalars['Boolean']['output'];
  appID?: Maybe<Scalars['CeramicStreamID']['output']>;
  beam?: Maybe<AkashaBeamInterface>;
  beamID: Scalars['CeramicStreamID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  moderation?: Maybe<Node>;
  moderationID?: Maybe<Scalars['CeramicStreamID']['output']>;
  status?: Maybe<AkashaBeamStreamModerationStatus>;
};

/** A connection to a list of items. */
export type AkashaBeamStreamConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaBeamStreamEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaBeamStreamEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaBeamStream>;
};

export type AkashaBeamStreamFiltersInput = {
  and?: InputMaybe<Array<AkashaBeamStreamFiltersInput>>;
  not?: InputMaybe<AkashaBeamStreamFiltersInput>;
  or?: InputMaybe<Array<AkashaBeamStreamFiltersInput>>;
  where?: InputMaybe<AkashaBeamStreamObjectFilterInput>;
};

export type AkashaBeamStreamInput = {
  active: Scalars['Boolean']['input'];
  appID?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  beamID: Scalars['CeramicStreamID']['input'];
  createdAt: Scalars['DateTime']['input'];
  moderationID?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  status?: InputMaybe<AkashaBeamStreamModerationStatus>;
};

export enum AkashaBeamStreamModerationStatus {
  InReview = 'IN_REVIEW',
  Nsfw = 'NSFW',
  Ok = 'OK',
  Other = 'OTHER',
  Removed = 'REMOVED',
  Suspended = 'SUSPENDED'
}

export type AkashaBeamStreamModerationStatusValueFilterInput = {
  equalTo?: InputMaybe<AkashaBeamStreamModerationStatus>;
  in?: InputMaybe<Array<AkashaBeamStreamModerationStatus>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqualTo?: InputMaybe<AkashaBeamStreamModerationStatus>;
  notIn?: InputMaybe<Array<AkashaBeamStreamModerationStatus>>;
};

export type AkashaBeamStreamObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  appID?: InputMaybe<StringValueFilterInput>;
  beamID?: InputMaybe<StringValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  moderationID?: InputMaybe<StringValueFilterInput>;
  status?: InputMaybe<AkashaBeamStreamModerationStatusValueFilterInput>;
};

export type AkashaBeamStreamSortingInput = {
  active?: InputMaybe<SortOrder>;
  appID?: InputMaybe<SortOrder>;
  beamID?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  moderationID?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
};

export type AkashaBlockStorage = AkashaContentBlockInterface & Node & {
  active: Scalars['Boolean']['output'];
  appVersion?: Maybe<AkashaAppReleaseInterface>;
  appVersionID: Scalars['CeramicStreamID']['output'];
  /** Account controlling the document */
  author: CeramicAccount;
  block?: Maybe<AkashaContentBlock>;
  blockID: Scalars['CeramicStreamID']['output'];
  content: Array<BlockLabeledValue>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  kind?: Maybe<AkashaBlockStorageBlockDef>;
  nsfw?: Maybe<Scalars['Boolean']['output']>;
  /** Current version of the document */
  version: Scalars['CeramicCommitID']['output'];
};

export enum AkashaBlockStorageBlockDef {
  AnimatedImage = 'ANIMATED_IMAGE',
  Bool = 'BOOL',
  Emoji = 'EMOJI',
  Form = 'FORM',
  FormData = 'FORM_DATA',
  Image = 'IMAGE',
  Other = 'OTHER',
  Rtf = 'RTF',
  Text = 'TEXT',
  Video = 'VIDEO'
}

export type AkashaBlockStorageBlockDefValueFilterInput = {
  equalTo?: InputMaybe<AkashaBlockStorageBlockDef>;
  in?: InputMaybe<Array<AkashaBlockStorageBlockDef>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqualTo?: InputMaybe<AkashaBlockStorageBlockDef>;
  notIn?: InputMaybe<Array<AkashaBlockStorageBlockDef>>;
};

/** A connection to a list of items. */
export type AkashaBlockStorageConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaBlockStorageEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaBlockStorageEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaBlockStorage>;
};

export type AkashaBlockStorageFiltersInput = {
  and?: InputMaybe<Array<AkashaBlockStorageFiltersInput>>;
  not?: InputMaybe<AkashaBlockStorageFiltersInput>;
  or?: InputMaybe<Array<AkashaBlockStorageFiltersInput>>;
  where?: InputMaybe<AkashaBlockStorageObjectFilterInput>;
};

export type AkashaBlockStorageInput = {
  active: Scalars['Boolean']['input'];
  appVersionID: Scalars['CeramicStreamID']['input'];
  blockID: Scalars['CeramicStreamID']['input'];
  content: Array<InputMaybe<BlockLabeledValueInput>>;
  createdAt: Scalars['DateTime']['input'];
  kind?: InputMaybe<AkashaBlockStorageBlockDef>;
  nsfw?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AkashaBlockStorageObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  appVersionID?: InputMaybe<StringValueFilterInput>;
  blockID?: InputMaybe<StringValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  kind?: InputMaybe<AkashaBlockStorageBlockDefValueFilterInput>;
  nsfw?: InputMaybe<BooleanValueFilterInput>;
};

export type AkashaBlockStorageSortingInput = {
  active?: InputMaybe<SortOrder>;
  appVersionID?: InputMaybe<SortOrder>;
  blockID?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  kind?: InputMaybe<SortOrder>;
  nsfw?: InputMaybe<SortOrder>;
};

export type AkashaContentBlock = AkashaContentBlockInterface & Node & {
  active: Scalars['Boolean']['output'];
  appVersion?: Maybe<AkashaAppReleaseInterface>;
  appVersionID: Scalars['CeramicStreamID']['output'];
  /** Account controlling the document */
  author: CeramicAccount;
  content: Array<BlockLabeledValue>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  kind?: Maybe<AkashaContentBlockBlockDef>;
  nsfw?: Maybe<Scalars['Boolean']['output']>;
  /** Current version of the document */
  version: Scalars['CeramicCommitID']['output'];
};

export enum AkashaContentBlockBlockDef {
  AnimatedImage = 'ANIMATED_IMAGE',
  Bool = 'BOOL',
  Emoji = 'EMOJI',
  Form = 'FORM',
  FormData = 'FORM_DATA',
  Image = 'IMAGE',
  Other = 'OTHER',
  Rtf = 'RTF',
  Text = 'TEXT',
  Video = 'VIDEO'
}

export type AkashaContentBlockBlockDefValueFilterInput = {
  equalTo?: InputMaybe<AkashaContentBlockBlockDef>;
  in?: InputMaybe<Array<AkashaContentBlockBlockDef>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqualTo?: InputMaybe<AkashaContentBlockBlockDef>;
  notIn?: InputMaybe<Array<AkashaContentBlockBlockDef>>;
};

/** A connection to a list of items. */
export type AkashaContentBlockConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaContentBlockEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaContentBlockEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaContentBlock>;
};

export type AkashaContentBlockFiltersInput = {
  and?: InputMaybe<Array<AkashaContentBlockFiltersInput>>;
  not?: InputMaybe<AkashaContentBlockFiltersInput>;
  or?: InputMaybe<Array<AkashaContentBlockFiltersInput>>;
  where?: InputMaybe<AkashaContentBlockObjectFilterInput>;
};

export type AkashaContentBlockInput = {
  active: Scalars['Boolean']['input'];
  appVersionID: Scalars['CeramicStreamID']['input'];
  content: Array<InputMaybe<BlockLabeledValueInput>>;
  createdAt: Scalars['DateTime']['input'];
  kind?: InputMaybe<AkashaContentBlockBlockDef>;
  nsfw?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AkashaContentBlockInterface = {
  active: Scalars['Boolean']['output'];
  appVersion?: Maybe<AkashaAppReleaseInterface>;
  appVersionID: Scalars['CeramicStreamID']['output'];
  /** Account controlling the document */
  author: CeramicAccount;
  content: Array<BlockLabeledValue>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  nsfw?: Maybe<Scalars['Boolean']['output']>;
  /** Current version of the document */
  version: Scalars['CeramicCommitID']['output'];
};

/** A connection to a list of items. */
export type AkashaContentBlockInterfaceConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaContentBlockInterfaceEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaContentBlockInterfaceEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaContentBlockInterface>;
};

export type AkashaContentBlockInterfaceFiltersInput = {
  and?: InputMaybe<Array<AkashaContentBlockInterfaceFiltersInput>>;
  not?: InputMaybe<AkashaContentBlockInterfaceFiltersInput>;
  or?: InputMaybe<Array<AkashaContentBlockInterfaceFiltersInput>>;
  where?: InputMaybe<AkashaContentBlockInterfaceObjectFilterInput>;
};

export type AkashaContentBlockInterfaceObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  appVersionID?: InputMaybe<StringValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  nsfw?: InputMaybe<BooleanValueFilterInput>;
};

export type AkashaContentBlockInterfaceSortingInput = {
  active?: InputMaybe<SortOrder>;
  appVersionID?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  nsfw?: InputMaybe<SortOrder>;
};

export type AkashaContentBlockObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  appVersionID?: InputMaybe<StringValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  kind?: InputMaybe<AkashaContentBlockBlockDefValueFilterInput>;
  nsfw?: InputMaybe<BooleanValueFilterInput>;
};

export type AkashaContentBlockSortingInput = {
  active?: InputMaybe<SortOrder>;
  appVersionID?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  kind?: InputMaybe<SortOrder>;
  nsfw?: InputMaybe<SortOrder>;
};

export type AkashaContentBlockStream = AkashaIndexStreamInterface & Node & {
  active: Scalars['Boolean']['output'];
  block?: Maybe<AkashaContentBlockInterface>;
  blockID: Scalars['CeramicStreamID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  moderation?: Maybe<Node>;
  moderationID?: Maybe<Scalars['CeramicStreamID']['output']>;
  status?: Maybe<AkashaContentBlockStreamModerationStatus>;
};

/** A connection to a list of items. */
export type AkashaContentBlockStreamConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaContentBlockStreamEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaContentBlockStreamEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaContentBlockStream>;
};

export type AkashaContentBlockStreamFiltersInput = {
  and?: InputMaybe<Array<AkashaContentBlockStreamFiltersInput>>;
  not?: InputMaybe<AkashaContentBlockStreamFiltersInput>;
  or?: InputMaybe<Array<AkashaContentBlockStreamFiltersInput>>;
  where?: InputMaybe<AkashaContentBlockStreamObjectFilterInput>;
};

export type AkashaContentBlockStreamInput = {
  active: Scalars['Boolean']['input'];
  blockID: Scalars['CeramicStreamID']['input'];
  createdAt: Scalars['DateTime']['input'];
  moderationID?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  status?: InputMaybe<AkashaContentBlockStreamModerationStatus>;
};

export enum AkashaContentBlockStreamModerationStatus {
  InReview = 'IN_REVIEW',
  Nsfw = 'NSFW',
  Ok = 'OK',
  Other = 'OTHER',
  Removed = 'REMOVED',
  Suspended = 'SUSPENDED'
}

export type AkashaContentBlockStreamModerationStatusValueFilterInput = {
  equalTo?: InputMaybe<AkashaContentBlockStreamModerationStatus>;
  in?: InputMaybe<Array<AkashaContentBlockStreamModerationStatus>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqualTo?: InputMaybe<AkashaContentBlockStreamModerationStatus>;
  notIn?: InputMaybe<Array<AkashaContentBlockStreamModerationStatus>>;
};

export type AkashaContentBlockStreamObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  blockID?: InputMaybe<StringValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  moderationID?: InputMaybe<StringValueFilterInput>;
  status?: InputMaybe<AkashaContentBlockStreamModerationStatusValueFilterInput>;
};

export type AkashaContentBlockStreamSortingInput = {
  active?: InputMaybe<SortOrder>;
  blockID?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  moderationID?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
};

export type AkashaFollow = AkashaFollowInterface & Node & {
  /** Account controlling the document */
  did: CeramicAccount;
  id: Scalars['ID']['output'];
  isFollowing: Scalars['Boolean']['output'];
  profile?: Maybe<AkashaProfileInterface>;
  profileID: Scalars['CeramicStreamID']['output'];
};

/** A connection to a list of items. */
export type AkashaFollowConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaFollowEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaFollowEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaFollow>;
};

export type AkashaFollowFiltersInput = {
  and?: InputMaybe<Array<AkashaFollowFiltersInput>>;
  not?: InputMaybe<AkashaFollowFiltersInput>;
  or?: InputMaybe<Array<AkashaFollowFiltersInput>>;
  where?: InputMaybe<AkashaFollowObjectFilterInput>;
};

export type AkashaFollowInput = {
  isFollowing: Scalars['Boolean']['input'];
  profileID: Scalars['CeramicStreamID']['input'];
};

export type AkashaFollowInterface = {
  /** Account controlling the document */
  did: CeramicAccount;
  id: Scalars['ID']['output'];
  isFollowing: Scalars['Boolean']['output'];
  profile?: Maybe<AkashaProfileInterface>;
  profileID: Scalars['CeramicStreamID']['output'];
};

/** A connection to a list of items. */
export type AkashaFollowInterfaceConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaFollowInterfaceEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaFollowInterfaceEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaFollowInterface>;
};

export type AkashaFollowInterfaceFiltersInput = {
  and?: InputMaybe<Array<AkashaFollowInterfaceFiltersInput>>;
  not?: InputMaybe<AkashaFollowInterfaceFiltersInput>;
  or?: InputMaybe<Array<AkashaFollowInterfaceFiltersInput>>;
  where?: InputMaybe<AkashaFollowInterfaceObjectFilterInput>;
};

export type AkashaFollowInterfaceObjectFilterInput = {
  isFollowing?: InputMaybe<BooleanValueFilterInput>;
  profileID?: InputMaybe<StringValueFilterInput>;
};

export type AkashaFollowInterfaceSortingInput = {
  isFollowing?: InputMaybe<SortOrder>;
  profileID?: InputMaybe<SortOrder>;
};

export type AkashaFollowObjectFilterInput = {
  isFollowing?: InputMaybe<BooleanValueFilterInput>;
  profileID?: InputMaybe<StringValueFilterInput>;
};

export type AkashaFollowSortingInput = {
  isFollowing?: InputMaybe<SortOrder>;
  profileID?: InputMaybe<SortOrder>;
};

export type AkashaIndexStreamInterface = {
  active: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  moderation?: Maybe<Node>;
  moderationID?: Maybe<Scalars['CeramicStreamID']['output']>;
};

/** A connection to a list of items. */
export type AkashaIndexStreamInterfaceConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaIndexStreamInterfaceEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaIndexStreamInterfaceEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaIndexStreamInterface>;
};

export type AkashaIndexStreamInterfaceFiltersInput = {
  and?: InputMaybe<Array<AkashaIndexStreamInterfaceFiltersInput>>;
  not?: InputMaybe<AkashaIndexStreamInterfaceFiltersInput>;
  or?: InputMaybe<Array<AkashaIndexStreamInterfaceFiltersInput>>;
  where?: InputMaybe<AkashaIndexStreamInterfaceObjectFilterInput>;
};

export type AkashaIndexStreamInterfaceObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  moderationID?: InputMaybe<StringValueFilterInput>;
};

export type AkashaIndexStreamInterfaceSortingInput = {
  active?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  moderationID?: InputMaybe<SortOrder>;
};

export type AkashaIndexedStream = AkashaIndexStreamInterface & Node & {
  active: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  indexType: Scalars['String']['output'];
  indexValue: Scalars['String']['output'];
  moderation?: Maybe<Node>;
  moderationID?: Maybe<Scalars['CeramicStreamID']['output']>;
  status?: Maybe<AkashaIndexedStreamModerationStatus>;
  stream: Scalars['CeramicStreamID']['output'];
  streamType?: Maybe<AkashaIndexedStreamStreamType>;
  streamView?: Maybe<Node>;
};

/** A connection to a list of items. */
export type AkashaIndexedStreamConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaIndexedStreamEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaIndexedStreamEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaIndexedStream>;
};

export type AkashaIndexedStreamFiltersInput = {
  and?: InputMaybe<Array<AkashaIndexedStreamFiltersInput>>;
  not?: InputMaybe<AkashaIndexedStreamFiltersInput>;
  or?: InputMaybe<Array<AkashaIndexedStreamFiltersInput>>;
  where?: InputMaybe<AkashaIndexedStreamObjectFilterInput>;
};

export type AkashaIndexedStreamInput = {
  active: Scalars['Boolean']['input'];
  createdAt: Scalars['DateTime']['input'];
  indexType: Scalars['String']['input'];
  indexValue: Scalars['String']['input'];
  moderationID?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  status?: InputMaybe<AkashaIndexedStreamModerationStatus>;
  stream: Scalars['CeramicStreamID']['input'];
  streamType?: InputMaybe<AkashaIndexedStreamStreamType>;
};

export enum AkashaIndexedStreamModerationStatus {
  InReview = 'IN_REVIEW',
  Nsfw = 'NSFW',
  Ok = 'OK',
  Other = 'OTHER',
  Removed = 'REMOVED',
  Suspended = 'SUSPENDED'
}

export type AkashaIndexedStreamModerationStatusValueFilterInput = {
  equalTo?: InputMaybe<AkashaIndexedStreamModerationStatus>;
  in?: InputMaybe<Array<AkashaIndexedStreamModerationStatus>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqualTo?: InputMaybe<AkashaIndexedStreamModerationStatus>;
  notIn?: InputMaybe<Array<AkashaIndexedStreamModerationStatus>>;
};

export type AkashaIndexedStreamObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  indexType?: InputMaybe<StringValueFilterInput>;
  indexValue?: InputMaybe<StringValueFilterInput>;
  moderationID?: InputMaybe<StringValueFilterInput>;
  status?: InputMaybe<AkashaIndexedStreamModerationStatusValueFilterInput>;
  stream?: InputMaybe<StringValueFilterInput>;
  streamType?: InputMaybe<AkashaIndexedStreamStreamTypeValueFilterInput>;
};

export type AkashaIndexedStreamSortingInput = {
  active?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  indexType?: InputMaybe<SortOrder>;
  indexValue?: InputMaybe<SortOrder>;
  moderationID?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  stream?: InputMaybe<SortOrder>;
  streamType?: InputMaybe<SortOrder>;
};

export enum AkashaIndexedStreamStreamType {
  App = 'APP',
  Beam = 'BEAM',
  Extension = 'EXTENSION',
  Other = 'OTHER',
  Plugin = 'PLUGIN',
  Profile = 'PROFILE',
  Reflect = 'REFLECT',
  Widget = 'WIDGET'
}

export type AkashaIndexedStreamStreamTypeValueFilterInput = {
  equalTo?: InputMaybe<AkashaIndexedStreamStreamType>;
  in?: InputMaybe<Array<AkashaIndexedStreamStreamType>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqualTo?: InputMaybe<AkashaIndexedStreamStreamType>;
  notIn?: InputMaybe<Array<AkashaIndexedStreamStreamType>>;
};

export type AkashaInterestsStream = AkashaIndexStreamInterface & Node & {
  active: Scalars['Boolean']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  labelType: Scalars['String']['output'];
  moderation?: Maybe<Node>;
  moderationID?: Maybe<Scalars['CeramicStreamID']['output']>;
  status?: Maybe<AkashaInterestsStreamModerationStatus>;
  value: Scalars['String']['output'];
};

/** A connection to a list of items. */
export type AkashaInterestsStreamConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaInterestsStreamEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaInterestsStreamEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaInterestsStream>;
};

export type AkashaInterestsStreamFiltersInput = {
  and?: InputMaybe<Array<AkashaInterestsStreamFiltersInput>>;
  not?: InputMaybe<AkashaInterestsStreamFiltersInput>;
  or?: InputMaybe<Array<AkashaInterestsStreamFiltersInput>>;
  where?: InputMaybe<AkashaInterestsStreamObjectFilterInput>;
};

export type AkashaInterestsStreamInput = {
  active: Scalars['Boolean']['input'];
  createdAt: Scalars['DateTime']['input'];
  labelType: Scalars['String']['input'];
  moderationID?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  status?: InputMaybe<AkashaInterestsStreamModerationStatus>;
  value: Scalars['String']['input'];
};

export enum AkashaInterestsStreamModerationStatus {
  InReview = 'IN_REVIEW',
  Nsfw = 'NSFW',
  Ok = 'OK',
  Other = 'OTHER',
  Removed = 'REMOVED',
  Suspended = 'SUSPENDED'
}

export type AkashaInterestsStreamModerationStatusValueFilterInput = {
  equalTo?: InputMaybe<AkashaInterestsStreamModerationStatus>;
  in?: InputMaybe<Array<AkashaInterestsStreamModerationStatus>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqualTo?: InputMaybe<AkashaInterestsStreamModerationStatus>;
  notIn?: InputMaybe<Array<AkashaInterestsStreamModerationStatus>>;
};

export type AkashaInterestsStreamObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  labelType?: InputMaybe<StringValueFilterInput>;
  moderationID?: InputMaybe<StringValueFilterInput>;
  status?: InputMaybe<AkashaInterestsStreamModerationStatusValueFilterInput>;
  value?: InputMaybe<StringValueFilterInput>;
};

export type AkashaInterestsStreamSortingInput = {
  active?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  labelType?: InputMaybe<SortOrder>;
  moderationID?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
  value?: InputMaybe<SortOrder>;
};

export type AkashaProfile = AkashaProfileInterface & Node & {
  app?: Maybe<AkashaAppInterface>;
  appID: Scalars['CeramicStreamID']['output'];
  appVersion?: Maybe<AkashaAppReleaseInterface>;
  appVersionID: Scalars['CeramicStreamID']['output'];
  avatar?: Maybe<ProfileImageVersions>;
  background?: Maybe<ProfileImageVersions>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  /** Account controlling the document */
  did: CeramicAccount;
  followers: AkashaFollowInterfaceConnection;
  followersCount: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  links?: Maybe<Array<Maybe<ProfileLinkSource>>>;
  name: Scalars['String']['output'];
  nsfw?: Maybe<Scalars['Boolean']['output']>;
};


export type AkashaProfileFollowersArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaFollowInterfaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaFollowInterfaceSortingInput>;
};


export type AkashaProfileFollowersCountArgs = {
  account?: InputMaybe<Scalars['ID']['input']>;
  filters?: InputMaybe<AkashaFollowInterfaceFiltersInput>;
};

/** A connection to a list of items. */
export type AkashaProfileConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaProfileEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaProfileEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaProfile>;
};

export type AkashaProfileFiltersInput = {
  and?: InputMaybe<Array<AkashaProfileFiltersInput>>;
  not?: InputMaybe<AkashaProfileFiltersInput>;
  or?: InputMaybe<Array<AkashaProfileFiltersInput>>;
  where?: InputMaybe<AkashaProfileObjectFilterInput>;
};

export type AkashaProfileInput = {
  appID: Scalars['CeramicStreamID']['input'];
  appVersionID: Scalars['CeramicStreamID']['input'];
  avatar?: InputMaybe<ProfileImageVersionsInput>;
  background?: InputMaybe<ProfileImageVersionsInput>;
  createdAt: Scalars['DateTime']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  links?: InputMaybe<Array<InputMaybe<ProfileLinkSourceInput>>>;
  name: Scalars['String']['input'];
  nsfw?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AkashaProfileInterests = AkashaProfileInterestsInterface & Node & {
  /** Account controlling the document */
  did: CeramicAccount;
  id: Scalars['ID']['output'];
  topics: Array<ProfileLabeled>;
};

/** A connection to a list of items. */
export type AkashaProfileInterestsConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaProfileInterestsEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaProfileInterestsEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaProfileInterests>;
};

export type AkashaProfileInterestsInput = {
  topics: Array<InputMaybe<ProfileLabeledInput>>;
};

export type AkashaProfileInterestsInterface = {
  /** Account controlling the document */
  did: CeramicAccount;
  id: Scalars['ID']['output'];
  topics: Array<ProfileLabeled>;
};

/** A connection to a list of items. */
export type AkashaProfileInterestsInterfaceConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaProfileInterestsInterfaceEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaProfileInterestsInterfaceEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaProfileInterestsInterface>;
};

export type AkashaProfileInterface = {
  app?: Maybe<AkashaAppInterface>;
  appID: Scalars['CeramicStreamID']['output'];
  appVersion?: Maybe<AkashaAppReleaseInterface>;
  appVersionID: Scalars['CeramicStreamID']['output'];
  avatar?: Maybe<ProfileImageVersions>;
  background?: Maybe<ProfileImageVersions>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  /** Account controlling the document */
  did: CeramicAccount;
  id: Scalars['ID']['output'];
  links?: Maybe<Array<Maybe<ProfileLinkSource>>>;
  name: Scalars['String']['output'];
  nsfw?: Maybe<Scalars['Boolean']['output']>;
};

/** A connection to a list of items. */
export type AkashaProfileInterfaceConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaProfileInterfaceEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaProfileInterfaceEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaProfileInterface>;
};

export type AkashaProfileInterfaceFiltersInput = {
  and?: InputMaybe<Array<AkashaProfileInterfaceFiltersInput>>;
  not?: InputMaybe<AkashaProfileInterfaceFiltersInput>;
  or?: InputMaybe<Array<AkashaProfileInterfaceFiltersInput>>;
  where?: InputMaybe<AkashaProfileInterfaceObjectFilterInput>;
};

export type AkashaProfileInterfaceObjectFilterInput = {
  appID?: InputMaybe<StringValueFilterInput>;
  appVersionID?: InputMaybe<StringValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  description?: InputMaybe<StringValueFilterInput>;
  name?: InputMaybe<StringValueFilterInput>;
  nsfw?: InputMaybe<BooleanValueFilterInput>;
};

export type AkashaProfileInterfaceSortingInput = {
  appID?: InputMaybe<SortOrder>;
  appVersionID?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  description?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  nsfw?: InputMaybe<SortOrder>;
};

export type AkashaProfileObjectFilterInput = {
  appID?: InputMaybe<StringValueFilterInput>;
  appVersionID?: InputMaybe<StringValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  name?: InputMaybe<StringValueFilterInput>;
  nsfw?: InputMaybe<BooleanValueFilterInput>;
};

export type AkashaProfileSortingInput = {
  appID?: InputMaybe<SortOrder>;
  appVersionID?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  nsfw?: InputMaybe<SortOrder>;
};

export type AkashaProfileStream = AkashaIndexStreamInterface & Node & {
  active: Scalars['Boolean']['output'];
  appID?: Maybe<Scalars['CeramicStreamID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  moderation?: Maybe<Node>;
  moderationID?: Maybe<Scalars['CeramicStreamID']['output']>;
  profile?: Maybe<AkashaProfileInterface>;
  profileID: Scalars['CeramicStreamID']['output'];
  status?: Maybe<AkashaProfileStreamModerationStatus>;
};

/** A connection to a list of items. */
export type AkashaProfileStreamConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaProfileStreamEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaProfileStreamEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaProfileStream>;
};

export type AkashaProfileStreamFiltersInput = {
  and?: InputMaybe<Array<AkashaProfileStreamFiltersInput>>;
  not?: InputMaybe<AkashaProfileStreamFiltersInput>;
  or?: InputMaybe<Array<AkashaProfileStreamFiltersInput>>;
  where?: InputMaybe<AkashaProfileStreamObjectFilterInput>;
};

export type AkashaProfileStreamInput = {
  active: Scalars['Boolean']['input'];
  appID?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  createdAt: Scalars['DateTime']['input'];
  moderationID?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  profileID: Scalars['CeramicStreamID']['input'];
  status?: InputMaybe<AkashaProfileStreamModerationStatus>;
};

export enum AkashaProfileStreamModerationStatus {
  InReview = 'IN_REVIEW',
  Nsfw = 'NSFW',
  Ok = 'OK',
  Other = 'OTHER',
  Removed = 'REMOVED',
  Suspended = 'SUSPENDED'
}

export type AkashaProfileStreamModerationStatusValueFilterInput = {
  equalTo?: InputMaybe<AkashaProfileStreamModerationStatus>;
  in?: InputMaybe<Array<AkashaProfileStreamModerationStatus>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqualTo?: InputMaybe<AkashaProfileStreamModerationStatus>;
  notIn?: InputMaybe<Array<AkashaProfileStreamModerationStatus>>;
};

export type AkashaProfileStreamObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  appID?: InputMaybe<StringValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  moderationID?: InputMaybe<StringValueFilterInput>;
  profileID?: InputMaybe<StringValueFilterInput>;
  status?: InputMaybe<AkashaProfileStreamModerationStatusValueFilterInput>;
};

export type AkashaProfileStreamSortingInput = {
  active?: InputMaybe<SortOrder>;
  appID?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  moderationID?: InputMaybe<SortOrder>;
  profileID?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
};

export type AkashaReflect = AkashaReflectInterface & Node & {
  active: Scalars['Boolean']['output'];
  /** Account controlling the document */
  author: CeramicAccount;
  beam?: Maybe<AkashaBeamInterface>;
  beamID: Scalars['CeramicStreamID']['output'];
  content: Array<ReflectProviderValue>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isReply?: Maybe<Scalars['Boolean']['output']>;
  mentions?: Maybe<Array<Maybe<Scalars['CeramicStreamID']['output']>>>;
  nsfw?: Maybe<Scalars['Boolean']['output']>;
  reflection?: Maybe<Scalars['CeramicStreamID']['output']>;
  reflectionView?: Maybe<Node>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Current version of the document */
  version: Scalars['CeramicCommitID']['output'];
};

/** A connection to a list of items. */
export type AkashaReflectConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaReflectEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaReflectEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaReflect>;
};

export type AkashaReflectFiltersInput = {
  and?: InputMaybe<Array<AkashaReflectFiltersInput>>;
  not?: InputMaybe<AkashaReflectFiltersInput>;
  or?: InputMaybe<Array<AkashaReflectFiltersInput>>;
  where?: InputMaybe<AkashaReflectObjectFilterInput>;
};

export type AkashaReflectInput = {
  active: Scalars['Boolean']['input'];
  beamID: Scalars['CeramicStreamID']['input'];
  content: Array<InputMaybe<ReflectProviderValueInput>>;
  createdAt: Scalars['DateTime']['input'];
  isReply?: InputMaybe<Scalars['Boolean']['input']>;
  mentions?: InputMaybe<Array<InputMaybe<Scalars['CeramicStreamID']['input']>>>;
  nsfw?: InputMaybe<Scalars['Boolean']['input']>;
  reflection?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

export type AkashaReflectInterface = {
  active: Scalars['Boolean']['output'];
  /** Account controlling the document */
  author: CeramicAccount;
  beam?: Maybe<AkashaBeamInterface>;
  beamID: Scalars['CeramicStreamID']['output'];
  content: Array<ReflectProviderValue>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isReply?: Maybe<Scalars['Boolean']['output']>;
  mentions?: Maybe<Array<Maybe<Scalars['CeramicStreamID']['output']>>>;
  nsfw?: Maybe<Scalars['Boolean']['output']>;
  reflection?: Maybe<Scalars['CeramicStreamID']['output']>;
  reflectionView?: Maybe<Node>;
  tags?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Current version of the document */
  version: Scalars['CeramicCommitID']['output'];
};

/** A connection to a list of items. */
export type AkashaReflectInterfaceConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaReflectInterfaceEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaReflectInterfaceEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaReflectInterface>;
};

export type AkashaReflectInterfaceFiltersInput = {
  and?: InputMaybe<Array<AkashaReflectInterfaceFiltersInput>>;
  not?: InputMaybe<AkashaReflectInterfaceFiltersInput>;
  or?: InputMaybe<Array<AkashaReflectInterfaceFiltersInput>>;
  where?: InputMaybe<AkashaReflectInterfaceObjectFilterInput>;
};

export type AkashaReflectInterfaceObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  beamID?: InputMaybe<StringValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  isReply?: InputMaybe<BooleanValueFilterInput>;
  nsfw?: InputMaybe<BooleanValueFilterInput>;
  reflection?: InputMaybe<StringValueFilterInput>;
};

export type AkashaReflectInterfaceSortingInput = {
  active?: InputMaybe<SortOrder>;
  beamID?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  isReply?: InputMaybe<SortOrder>;
  nsfw?: InputMaybe<SortOrder>;
  reflection?: InputMaybe<SortOrder>;
};

export type AkashaReflectObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  beamID?: InputMaybe<StringValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  isReply?: InputMaybe<BooleanValueFilterInput>;
  nsfw?: InputMaybe<BooleanValueFilterInput>;
  reflection?: InputMaybe<StringValueFilterInput>;
};

export type AkashaReflectSortingInput = {
  active?: InputMaybe<SortOrder>;
  beamID?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  isReply?: InputMaybe<SortOrder>;
  nsfw?: InputMaybe<SortOrder>;
  reflection?: InputMaybe<SortOrder>;
};

export type AkashaReflectStream = AkashaIndexStreamInterface & Node & {
  active: Scalars['Boolean']['output'];
  beamID: Scalars['CeramicStreamID']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isReply?: Maybe<Scalars['Boolean']['output']>;
  moderation?: Maybe<Node>;
  moderationID?: Maybe<Scalars['CeramicStreamID']['output']>;
  reflection?: Maybe<AkashaReflectInterface>;
  reflectionID: Scalars['CeramicStreamID']['output'];
  replyTo?: Maybe<Scalars['CeramicStreamID']['output']>;
  status?: Maybe<AkashaReflectStreamModerationStatus>;
};

/** A connection to a list of items. */
export type AkashaReflectStreamConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AkashaReflectStreamEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AkashaReflectStreamEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String']['output'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaReflectStream>;
};

export type AkashaReflectStreamFiltersInput = {
  and?: InputMaybe<Array<AkashaReflectStreamFiltersInput>>;
  not?: InputMaybe<AkashaReflectStreamFiltersInput>;
  or?: InputMaybe<Array<AkashaReflectStreamFiltersInput>>;
  where?: InputMaybe<AkashaReflectStreamObjectFilterInput>;
};

export type AkashaReflectStreamInput = {
  active: Scalars['Boolean']['input'];
  beamID: Scalars['CeramicStreamID']['input'];
  createdAt: Scalars['DateTime']['input'];
  isReply?: InputMaybe<Scalars['Boolean']['input']>;
  moderationID?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  reflectionID: Scalars['CeramicStreamID']['input'];
  replyTo?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  status?: InputMaybe<AkashaReflectStreamModerationStatus>;
};

export enum AkashaReflectStreamModerationStatus {
  InReview = 'IN_REVIEW',
  Nsfw = 'NSFW',
  Ok = 'OK',
  Other = 'OTHER',
  Removed = 'REMOVED',
  Suspended = 'SUSPENDED'
}

export type AkashaReflectStreamModerationStatusValueFilterInput = {
  equalTo?: InputMaybe<AkashaReflectStreamModerationStatus>;
  in?: InputMaybe<Array<AkashaReflectStreamModerationStatus>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  notEqualTo?: InputMaybe<AkashaReflectStreamModerationStatus>;
  notIn?: InputMaybe<Array<AkashaReflectStreamModerationStatus>>;
};

export type AkashaReflectStreamObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  beamID?: InputMaybe<StringValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  isReply?: InputMaybe<BooleanValueFilterInput>;
  moderationID?: InputMaybe<StringValueFilterInput>;
  reflectionID?: InputMaybe<StringValueFilterInput>;
  replyTo?: InputMaybe<StringValueFilterInput>;
  status?: InputMaybe<AkashaReflectStreamModerationStatusValueFilterInput>;
};

export type AkashaReflectStreamSortingInput = {
  active?: InputMaybe<SortOrder>;
  beamID?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  isReply?: InputMaybe<SortOrder>;
  moderationID?: InputMaybe<SortOrder>;
  reflectionID?: InputMaybe<SortOrder>;
  replyTo?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
};

export type AppImageSource = {
  height?: Maybe<Scalars['Int']['output']>;
  src: Scalars['URI']['output'];
  width?: Maybe<Scalars['Int']['output']>;
};

export type AppImageSourceInput = {
  height?: InputMaybe<Scalars['Int']['input']>;
  src: Scalars['URI']['input'];
  width?: InputMaybe<Scalars['Int']['input']>;
};

export type AppLinkSource = {
  href: Scalars['URI']['output'];
  label?: Maybe<Scalars['String']['output']>;
};

export type AppLinkSourceInput = {
  href: Scalars['URI']['input'];
  label?: InputMaybe<Scalars['String']['input']>;
};

export type AppProviderValue = {
  property: Scalars['String']['output'];
  provider: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type AppProviderValueInput = {
  property: Scalars['String']['input'];
  provider: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type BeamBlockRecord = {
  blockID: Scalars['CeramicStreamID']['output'];
  order: Scalars['Int']['output'];
};

export type BeamBlockRecordInput = {
  blockID: Scalars['CeramicStreamID']['input'];
  order: Scalars['Int']['input'];
};

export type BeamEmbeddedType = {
  embeddedID: Scalars['CeramicStreamID']['output'];
  label: Scalars['String']['output'];
};

export type BeamEmbeddedTypeInput = {
  embeddedID: Scalars['CeramicStreamID']['input'];
  label: Scalars['String']['input'];
};

export type BeamLabeled = {
  labelType: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type BeamLabeledInput = {
  labelType: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type BlockLabeledValue = {
  label: Scalars['String']['output'];
  propertyType: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type BlockLabeledValueInput = {
  label: Scalars['String']['input'];
  propertyType: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type BooleanValueFilterInput = {
  equalTo?: InputMaybe<Scalars['Boolean']['input']>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Cacao_Capability = {
  h: CacaoHeader;
  p: CacaoPayload;
  s?: InputMaybe<CacaoSignature>;
};

export type CacaoHeader = {
  t: Scalars['CacaoHeaderT']['input'];
};

export type CacaoPayload = {
  aud: Scalars['String']['input'];
  domain: Scalars['String']['input'];
  exp?: InputMaybe<Scalars['String']['input']>;
  iat: Scalars['String']['input'];
  iss: Scalars['String']['input'];
  nbf?: InputMaybe<Scalars['String']['input']>;
  nonce: Scalars['String']['input'];
  requestId?: InputMaybe<Scalars['String']['input']>;
  resources?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  statement?: InputMaybe<Scalars['String']['input']>;
  version: Scalars['String']['input'];
};

export type CacaoSignature = {
  s: Scalars['String']['input'];
  t: Scalars['CacaoSignatureT']['input'];
};

export type CeramicAccount = Node & {
  akashaApp?: Maybe<AkashaApp>;
  akashaAppInterfaceList?: Maybe<AkashaAppInterfaceConnection>;
  akashaAppInterfaceListCount: Scalars['Int']['output'];
  akashaAppList?: Maybe<AkashaAppConnection>;
  akashaAppListCount: Scalars['Int']['output'];
  akashaAppRelease?: Maybe<AkashaAppRelease>;
  akashaAppReleaseInterfaceList?: Maybe<AkashaAppReleaseInterfaceConnection>;
  akashaAppReleaseInterfaceListCount: Scalars['Int']['output'];
  akashaAppReleaseList?: Maybe<AkashaAppReleaseConnection>;
  akashaAppReleaseListCount: Scalars['Int']['output'];
  akashaAppsStream?: Maybe<AkashaAppsStream>;
  akashaAppsStreamList?: Maybe<AkashaAppsStreamConnection>;
  akashaAppsStreamListCount: Scalars['Int']['output'];
  akashaBeamInterfaceList?: Maybe<AkashaBeamInterfaceConnection>;
  akashaBeamInterfaceListCount: Scalars['Int']['output'];
  akashaBeamList?: Maybe<AkashaBeamConnection>;
  akashaBeamListCount: Scalars['Int']['output'];
  akashaBeamStream?: Maybe<AkashaBeamStream>;
  akashaBeamStreamList?: Maybe<AkashaBeamStreamConnection>;
  akashaBeamStreamListCount: Scalars['Int']['output'];
  akashaBlockStorage?: Maybe<AkashaBlockStorage>;
  akashaBlockStorageList?: Maybe<AkashaBlockStorageConnection>;
  akashaBlockStorageListCount: Scalars['Int']['output'];
  akashaContentBlockInterfaceList?: Maybe<AkashaContentBlockInterfaceConnection>;
  akashaContentBlockInterfaceListCount: Scalars['Int']['output'];
  akashaContentBlockList?: Maybe<AkashaContentBlockConnection>;
  akashaContentBlockListCount: Scalars['Int']['output'];
  akashaContentBlockStream?: Maybe<AkashaContentBlockStream>;
  akashaContentBlockStreamList?: Maybe<AkashaContentBlockStreamConnection>;
  akashaContentBlockStreamListCount: Scalars['Int']['output'];
  akashaFollow?: Maybe<AkashaFollow>;
  akashaFollowInterfaceList?: Maybe<AkashaFollowInterfaceConnection>;
  akashaFollowInterfaceListCount: Scalars['Int']['output'];
  akashaFollowList?: Maybe<AkashaFollowConnection>;
  akashaFollowListCount: Scalars['Int']['output'];
  akashaIndexStreamInterfaceList?: Maybe<AkashaIndexStreamInterfaceConnection>;
  akashaIndexStreamInterfaceListCount: Scalars['Int']['output'];
  akashaIndexedStream?: Maybe<AkashaIndexedStream>;
  akashaIndexedStreamList?: Maybe<AkashaIndexedStreamConnection>;
  akashaIndexedStreamListCount: Scalars['Int']['output'];
  akashaInterestsStream?: Maybe<AkashaInterestsStream>;
  akashaInterestsStreamList?: Maybe<AkashaInterestsStreamConnection>;
  akashaInterestsStreamListCount: Scalars['Int']['output'];
  akashaProfile?: Maybe<AkashaProfile>;
  akashaProfileInterests?: Maybe<AkashaProfileInterests>;
  akashaProfileInterestsInterfaceList?: Maybe<AkashaProfileInterestsInterfaceConnection>;
  akashaProfileInterestsInterfaceListCount: Scalars['Int']['output'];
  akashaProfileInterfaceList?: Maybe<AkashaProfileInterfaceConnection>;
  akashaProfileInterfaceListCount: Scalars['Int']['output'];
  akashaProfileStream?: Maybe<AkashaProfileStream>;
  akashaProfileStreamList?: Maybe<AkashaProfileStreamConnection>;
  akashaProfileStreamListCount: Scalars['Int']['output'];
  akashaReflectInterfaceList?: Maybe<AkashaReflectInterfaceConnection>;
  akashaReflectInterfaceListCount: Scalars['Int']['output'];
  akashaReflectList?: Maybe<AkashaReflectConnection>;
  akashaReflectListCount: Scalars['Int']['output'];
  akashaReflectStream?: Maybe<AkashaReflectStream>;
  akashaReflectStreamList?: Maybe<AkashaReflectStreamConnection>;
  akashaReflectStreamListCount: Scalars['Int']['output'];
  /** Globally unique identifier of the account (DID string) */
  id: Scalars['ID']['output'];
  /** Whether the Ceramic instance is currently authenticated with this account or not */
  isViewer: Scalars['Boolean']['output'];
};


export type CeramicAccountAkashaAppArgs = {
  with: WithAkashaAppInput;
};


export type CeramicAccountAkashaAppInterfaceListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaAppInterfaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaAppInterfaceSortingInput>;
};


export type CeramicAccountAkashaAppInterfaceListCountArgs = {
  filters?: InputMaybe<AkashaAppInterfaceFiltersInput>;
};


export type CeramicAccountAkashaAppListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaAppFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaAppSortingInput>;
};


export type CeramicAccountAkashaAppListCountArgs = {
  filters?: InputMaybe<AkashaAppFiltersInput>;
};


export type CeramicAccountAkashaAppReleaseArgs = {
  with: WithAkashaAppReleaseInput;
};


export type CeramicAccountAkashaAppReleaseInterfaceListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaAppReleaseInterfaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaAppReleaseInterfaceSortingInput>;
};


export type CeramicAccountAkashaAppReleaseInterfaceListCountArgs = {
  filters?: InputMaybe<AkashaAppReleaseInterfaceFiltersInput>;
};


export type CeramicAccountAkashaAppReleaseListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaAppReleaseFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaAppReleaseSortingInput>;
};


export type CeramicAccountAkashaAppReleaseListCountArgs = {
  filters?: InputMaybe<AkashaAppReleaseFiltersInput>;
};


export type CeramicAccountAkashaAppsStreamArgs = {
  with: WithAkashaAppsStreamInput;
};


export type CeramicAccountAkashaAppsStreamListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaAppsStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaAppsStreamSortingInput>;
};


export type CeramicAccountAkashaAppsStreamListCountArgs = {
  filters?: InputMaybe<AkashaAppsStreamFiltersInput>;
};


export type CeramicAccountAkashaBeamInterfaceListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaBeamInterfaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaBeamInterfaceSortingInput>;
};


export type CeramicAccountAkashaBeamInterfaceListCountArgs = {
  filters?: InputMaybe<AkashaBeamInterfaceFiltersInput>;
};


export type CeramicAccountAkashaBeamListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaBeamFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaBeamSortingInput>;
};


export type CeramicAccountAkashaBeamListCountArgs = {
  filters?: InputMaybe<AkashaBeamFiltersInput>;
};


export type CeramicAccountAkashaBeamStreamArgs = {
  with: WithAkashaBeamStreamInput;
};


export type CeramicAccountAkashaBeamStreamListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaBeamStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaBeamStreamSortingInput>;
};


export type CeramicAccountAkashaBeamStreamListCountArgs = {
  filters?: InputMaybe<AkashaBeamStreamFiltersInput>;
};


export type CeramicAccountAkashaBlockStorageArgs = {
  with: WithAkashaBlockStorageInput;
};


export type CeramicAccountAkashaBlockStorageListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaBlockStorageFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaBlockStorageSortingInput>;
};


export type CeramicAccountAkashaBlockStorageListCountArgs = {
  filters?: InputMaybe<AkashaBlockStorageFiltersInput>;
};


export type CeramicAccountAkashaContentBlockInterfaceListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaContentBlockInterfaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaContentBlockInterfaceSortingInput>;
};


export type CeramicAccountAkashaContentBlockInterfaceListCountArgs = {
  filters?: InputMaybe<AkashaContentBlockInterfaceFiltersInput>;
};


export type CeramicAccountAkashaContentBlockListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaContentBlockFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaContentBlockSortingInput>;
};


export type CeramicAccountAkashaContentBlockListCountArgs = {
  filters?: InputMaybe<AkashaContentBlockFiltersInput>;
};


export type CeramicAccountAkashaContentBlockStreamArgs = {
  with: WithAkashaContentBlockStreamInput;
};


export type CeramicAccountAkashaContentBlockStreamListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaContentBlockStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaContentBlockStreamSortingInput>;
};


export type CeramicAccountAkashaContentBlockStreamListCountArgs = {
  filters?: InputMaybe<AkashaContentBlockStreamFiltersInput>;
};


export type CeramicAccountAkashaFollowArgs = {
  with: WithAkashaFollowInput;
};


export type CeramicAccountAkashaFollowInterfaceListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaFollowInterfaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaFollowInterfaceSortingInput>;
};


export type CeramicAccountAkashaFollowInterfaceListCountArgs = {
  filters?: InputMaybe<AkashaFollowInterfaceFiltersInput>;
};


export type CeramicAccountAkashaFollowListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaFollowFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaFollowSortingInput>;
};


export type CeramicAccountAkashaFollowListCountArgs = {
  filters?: InputMaybe<AkashaFollowFiltersInput>;
};


export type CeramicAccountAkashaIndexStreamInterfaceListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaIndexStreamInterfaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaIndexStreamInterfaceSortingInput>;
};


export type CeramicAccountAkashaIndexStreamInterfaceListCountArgs = {
  filters?: InputMaybe<AkashaIndexStreamInterfaceFiltersInput>;
};


export type CeramicAccountAkashaIndexedStreamArgs = {
  with: WithAkashaIndexedStreamInput;
};


export type CeramicAccountAkashaIndexedStreamListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaIndexedStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaIndexedStreamSortingInput>;
};


export type CeramicAccountAkashaIndexedStreamListCountArgs = {
  filters?: InputMaybe<AkashaIndexedStreamFiltersInput>;
};


export type CeramicAccountAkashaInterestsStreamArgs = {
  with: WithAkashaInterestsStreamInput;
};


export type CeramicAccountAkashaInterestsStreamListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaInterestsStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaInterestsStreamSortingInput>;
};


export type CeramicAccountAkashaInterestsStreamListCountArgs = {
  filters?: InputMaybe<AkashaInterestsStreamFiltersInput>;
};


export type CeramicAccountAkashaProfileInterestsInterfaceListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type CeramicAccountAkashaProfileInterfaceListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaProfileInterfaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaProfileInterfaceSortingInput>;
};


export type CeramicAccountAkashaProfileInterfaceListCountArgs = {
  filters?: InputMaybe<AkashaProfileInterfaceFiltersInput>;
};


export type CeramicAccountAkashaProfileStreamArgs = {
  with: WithAkashaProfileStreamInput;
};


export type CeramicAccountAkashaProfileStreamListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaProfileStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaProfileStreamSortingInput>;
};


export type CeramicAccountAkashaProfileStreamListCountArgs = {
  filters?: InputMaybe<AkashaProfileStreamFiltersInput>;
};


export type CeramicAccountAkashaReflectInterfaceListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaReflectInterfaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaReflectInterfaceSortingInput>;
};


export type CeramicAccountAkashaReflectInterfaceListCountArgs = {
  filters?: InputMaybe<AkashaReflectInterfaceFiltersInput>;
};


export type CeramicAccountAkashaReflectListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaReflectFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaReflectSortingInput>;
};


export type CeramicAccountAkashaReflectListCountArgs = {
  filters?: InputMaybe<AkashaReflectFiltersInput>;
};


export type CeramicAccountAkashaReflectStreamArgs = {
  with: WithAkashaReflectStreamInput;
};


export type CeramicAccountAkashaReflectStreamListArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaReflectStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaReflectStreamSortingInput>;
};


export type CeramicAccountAkashaReflectStreamListCountArgs = {
  filters?: InputMaybe<AkashaReflectStreamFiltersInput>;
};

export type CreateAkashaBeamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: AkashaBeamInput;
  options?: InputMaybe<CreateOptionsInput>;
};

export type CreateAkashaBeamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaBeam;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAkashaBeamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type CreateAkashaContentBlockInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: AkashaContentBlockInput;
  options?: InputMaybe<CreateOptionsInput>;
};

export type CreateAkashaContentBlockPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaContentBlock;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAkashaContentBlockPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type CreateAkashaProfileInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: AkashaProfileInput;
  options?: InputMaybe<SetOptionsInput>;
};

export type CreateAkashaProfileInterestsInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: AkashaProfileInterestsInput;
  options?: InputMaybe<SetOptionsInput>;
};

export type CreateAkashaProfileInterestsPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaProfileInterests;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAkashaProfileInterestsPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type CreateAkashaProfilePayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaProfile;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAkashaProfilePayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type CreateAkashaReflectInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: AkashaReflectInput;
  options?: InputMaybe<CreateOptionsInput>;
};

export type CreateAkashaReflectPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaReflect;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAkashaReflectPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type CreateOptionsInput = {
  /** Inform indexers if they should index this document or not */
  shouldIndex?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Did_Jws = {
  payload: Scalars['String']['input'];
  signatures: Array<Jws_Signature>;
};

export type EnableIndexingAkashaAppInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingAkashaAppPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<AkashaApp>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingAkashaAppPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingAkashaAppReleaseInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingAkashaAppReleasePayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<AkashaAppRelease>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingAkashaAppReleasePayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingAkashaAppsStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingAkashaAppsStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<AkashaAppsStream>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingAkashaAppsStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingAkashaBeamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingAkashaBeamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<AkashaBeam>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingAkashaBeamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingAkashaBeamStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingAkashaBeamStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<AkashaBeamStream>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingAkashaBeamStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingAkashaBlockStorageInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingAkashaBlockStoragePayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<AkashaBlockStorage>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingAkashaBlockStoragePayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingAkashaContentBlockInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingAkashaContentBlockPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<AkashaContentBlock>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingAkashaContentBlockPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingAkashaContentBlockStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingAkashaContentBlockStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<AkashaContentBlockStream>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingAkashaContentBlockStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingAkashaFollowInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingAkashaFollowPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<AkashaFollow>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingAkashaFollowPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingAkashaIndexedStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingAkashaIndexedStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<AkashaIndexedStream>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingAkashaIndexedStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingAkashaInterestsStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingAkashaInterestsStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<AkashaInterestsStream>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingAkashaInterestsStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingAkashaProfileInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingAkashaProfileInterestsInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingAkashaProfileInterestsPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<AkashaProfileInterests>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingAkashaProfileInterestsPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingAkashaProfilePayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<AkashaProfile>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingAkashaProfilePayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingAkashaProfileStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingAkashaProfileStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<AkashaProfileStream>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingAkashaProfileStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingAkashaReflectInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingAkashaReflectPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<AkashaReflect>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingAkashaReflectPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type EnableIndexingAkashaReflectStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  shouldIndex: Scalars['Boolean']['input'];
};

export type EnableIndexingAkashaReflectStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document?: Maybe<AkashaReflectStream>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type EnableIndexingAkashaReflectStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type IndexAppPayload = {
  document?: Maybe<IndexAppPayloadDocument>;
};

export type IndexAppPayloadDocument = {
  applicationID: Scalars['String']['output'];
};

export type IndexBeamPayload = {
  document?: Maybe<IndexBeamPayloadDocument>;
};

export type IndexBeamPayloadDocument = {
  beamID: Scalars['String']['output'];
};

export type IndexContentBlockPayload = {
  document?: Maybe<IndexContentBlockPayloadDocument>;
};

export type IndexContentBlockPayloadDocument = {
  blockID: Scalars['String']['output'];
};

export type IndexInterestPayload = {
  document?: Maybe<IndexInterestPayloadDocument>;
};

export type IndexInterestPayloadDocument = {
  labelType: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type IndexProfilePayload = {
  document?: Maybe<IndexProfilePayloadDocument>;
};

export type IndexProfilePayloadDocument = {
  profileID: Scalars['String']['output'];
};

export type IndexReflectPayload = {
  document?: Maybe<IndexReflectPayloadDocument>;
};

export type IndexReflectPayloadDocument = {
  reflectionID: Scalars['String']['output'];
};

export type Jws_Signature = {
  protected: Scalars['String']['input'];
  signature: Scalars['String']['input'];
};

export type Mutation = {
  createAkashaBeam?: Maybe<CreateAkashaBeamPayload>;
  createAkashaContentBlock?: Maybe<CreateAkashaContentBlockPayload>;
  /** @deprecated Replaced by the setAkashaProfile mutation, createAkashaProfile will be removed in a future version of ComposeDB. */
  createAkashaProfile?: Maybe<CreateAkashaProfilePayload>;
  /** @deprecated Replaced by the setAkashaProfileInterests mutation, createAkashaProfileInterests will be removed in a future version of ComposeDB. */
  createAkashaProfileInterests?: Maybe<CreateAkashaProfileInterestsPayload>;
  createAkashaReflect?: Maybe<CreateAkashaReflectPayload>;
  enableIndexingAkashaApp?: Maybe<EnableIndexingAkashaAppPayload>;
  enableIndexingAkashaAppRelease?: Maybe<EnableIndexingAkashaAppReleasePayload>;
  enableIndexingAkashaAppsStream?: Maybe<EnableIndexingAkashaAppsStreamPayload>;
  enableIndexingAkashaBeam?: Maybe<EnableIndexingAkashaBeamPayload>;
  enableIndexingAkashaBeamStream?: Maybe<EnableIndexingAkashaBeamStreamPayload>;
  enableIndexingAkashaBlockStorage?: Maybe<EnableIndexingAkashaBlockStoragePayload>;
  enableIndexingAkashaContentBlock?: Maybe<EnableIndexingAkashaContentBlockPayload>;
  enableIndexingAkashaContentBlockStream?: Maybe<EnableIndexingAkashaContentBlockStreamPayload>;
  enableIndexingAkashaFollow?: Maybe<EnableIndexingAkashaFollowPayload>;
  enableIndexingAkashaIndexedStream?: Maybe<EnableIndexingAkashaIndexedStreamPayload>;
  enableIndexingAkashaInterestsStream?: Maybe<EnableIndexingAkashaInterestsStreamPayload>;
  enableIndexingAkashaProfile?: Maybe<EnableIndexingAkashaProfilePayload>;
  enableIndexingAkashaProfileInterests?: Maybe<EnableIndexingAkashaProfileInterestsPayload>;
  enableIndexingAkashaProfileStream?: Maybe<EnableIndexingAkashaProfileStreamPayload>;
  enableIndexingAkashaReflect?: Maybe<EnableIndexingAkashaReflectPayload>;
  enableIndexingAkashaReflectStream?: Maybe<EnableIndexingAkashaReflectStreamPayload>;
  indexApp?: Maybe<IndexAppPayload>;
  indexBeam?: Maybe<IndexBeamPayload>;
  indexContentBlock?: Maybe<IndexContentBlockPayload>;
  indexInterest?: Maybe<IndexInterestPayload>;
  indexProfile?: Maybe<IndexProfilePayload>;
  indexReflection?: Maybe<IndexReflectPayload>;
  setAkashaApp?: Maybe<SetAkashaAppPayload>;
  setAkashaAppRelease?: Maybe<SetAkashaAppReleasePayload>;
  setAkashaAppsStream?: Maybe<SetAkashaAppsStreamPayload>;
  setAkashaBeamStream?: Maybe<SetAkashaBeamStreamPayload>;
  setAkashaBlockStorage?: Maybe<SetAkashaBlockStoragePayload>;
  setAkashaContentBlockStream?: Maybe<SetAkashaContentBlockStreamPayload>;
  setAkashaFollow?: Maybe<SetAkashaFollowPayload>;
  setAkashaIndexedStream?: Maybe<SetAkashaIndexedStreamPayload>;
  setAkashaInterestsStream?: Maybe<SetAkashaInterestsStreamPayload>;
  setAkashaProfile?: Maybe<SetAkashaProfilePayload>;
  setAkashaProfileInterests?: Maybe<SetAkashaProfileInterestsPayload>;
  setAkashaProfileStream?: Maybe<SetAkashaProfileStreamPayload>;
  setAkashaReflectStream?: Maybe<SetAkashaReflectStreamPayload>;
  updateAkashaApp?: Maybe<UpdateAkashaAppPayload>;
  updateAkashaAppRelease?: Maybe<UpdateAkashaAppReleasePayload>;
  updateAkashaAppsStream?: Maybe<UpdateAkashaAppsStreamPayload>;
  updateAkashaBeam?: Maybe<UpdateAkashaBeamPayload>;
  updateAkashaBeamStream?: Maybe<UpdateAkashaBeamStreamPayload>;
  updateAkashaBlockStorage?: Maybe<UpdateAkashaBlockStoragePayload>;
  updateAkashaContentBlock?: Maybe<UpdateAkashaContentBlockPayload>;
  updateAkashaContentBlockStream?: Maybe<UpdateAkashaContentBlockStreamPayload>;
  updateAkashaFollow?: Maybe<UpdateAkashaFollowPayload>;
  updateAkashaIndexedStream?: Maybe<UpdateAkashaIndexedStreamPayload>;
  updateAkashaInterestsStream?: Maybe<UpdateAkashaInterestsStreamPayload>;
  updateAkashaProfile?: Maybe<UpdateAkashaProfilePayload>;
  updateAkashaProfileInterests?: Maybe<UpdateAkashaProfileInterestsPayload>;
  updateAkashaProfileStream?: Maybe<UpdateAkashaProfileStreamPayload>;
  updateAkashaReflect?: Maybe<UpdateAkashaReflectPayload>;
  updateAkashaReflectStream?: Maybe<UpdateAkashaReflectStreamPayload>;
};


export type MutationCreateAkashaBeamArgs = {
  input: CreateAkashaBeamInput;
};


export type MutationCreateAkashaContentBlockArgs = {
  input: CreateAkashaContentBlockInput;
};


export type MutationCreateAkashaProfileArgs = {
  input: CreateAkashaProfileInput;
};


export type MutationCreateAkashaProfileInterestsArgs = {
  input: CreateAkashaProfileInterestsInput;
};


export type MutationCreateAkashaReflectArgs = {
  input: CreateAkashaReflectInput;
};


export type MutationEnableIndexingAkashaAppArgs = {
  input: EnableIndexingAkashaAppInput;
};


export type MutationEnableIndexingAkashaAppReleaseArgs = {
  input: EnableIndexingAkashaAppReleaseInput;
};


export type MutationEnableIndexingAkashaAppsStreamArgs = {
  input: EnableIndexingAkashaAppsStreamInput;
};


export type MutationEnableIndexingAkashaBeamArgs = {
  input: EnableIndexingAkashaBeamInput;
};


export type MutationEnableIndexingAkashaBeamStreamArgs = {
  input: EnableIndexingAkashaBeamStreamInput;
};


export type MutationEnableIndexingAkashaBlockStorageArgs = {
  input: EnableIndexingAkashaBlockStorageInput;
};


export type MutationEnableIndexingAkashaContentBlockArgs = {
  input: EnableIndexingAkashaContentBlockInput;
};


export type MutationEnableIndexingAkashaContentBlockStreamArgs = {
  input: EnableIndexingAkashaContentBlockStreamInput;
};


export type MutationEnableIndexingAkashaFollowArgs = {
  input: EnableIndexingAkashaFollowInput;
};


export type MutationEnableIndexingAkashaIndexedStreamArgs = {
  input: EnableIndexingAkashaIndexedStreamInput;
};


export type MutationEnableIndexingAkashaInterestsStreamArgs = {
  input: EnableIndexingAkashaInterestsStreamInput;
};


export type MutationEnableIndexingAkashaProfileArgs = {
  input: EnableIndexingAkashaProfileInput;
};


export type MutationEnableIndexingAkashaProfileInterestsArgs = {
  input: EnableIndexingAkashaProfileInterestsInput;
};


export type MutationEnableIndexingAkashaProfileStreamArgs = {
  input: EnableIndexingAkashaProfileStreamInput;
};


export type MutationEnableIndexingAkashaReflectArgs = {
  input: EnableIndexingAkashaReflectInput;
};


export type MutationEnableIndexingAkashaReflectStreamArgs = {
  input: EnableIndexingAkashaReflectStreamInput;
};


export type MutationIndexAppArgs = {
  capability?: InputMaybe<Cacao_Capability>;
  jws?: InputMaybe<Did_Jws>;
};


export type MutationIndexBeamArgs = {
  capability?: InputMaybe<Cacao_Capability>;
  jws?: InputMaybe<Did_Jws>;
};


export type MutationIndexContentBlockArgs = {
  capability?: InputMaybe<Cacao_Capability>;
  jws?: InputMaybe<Did_Jws>;
};


export type MutationIndexInterestArgs = {
  capability?: InputMaybe<Cacao_Capability>;
  jws?: InputMaybe<Did_Jws>;
};


export type MutationIndexProfileArgs = {
  capability?: InputMaybe<Cacao_Capability>;
  jws?: InputMaybe<Did_Jws>;
};


export type MutationIndexReflectionArgs = {
  capability?: InputMaybe<Cacao_Capability>;
  jws?: InputMaybe<Did_Jws>;
};


export type MutationSetAkashaAppArgs = {
  input: SetAkashaAppInput;
};


export type MutationSetAkashaAppReleaseArgs = {
  input: SetAkashaAppReleaseInput;
};


export type MutationSetAkashaAppsStreamArgs = {
  input: SetAkashaAppsStreamInput;
};


export type MutationSetAkashaBeamStreamArgs = {
  input: SetAkashaBeamStreamInput;
};


export type MutationSetAkashaBlockStorageArgs = {
  input: SetAkashaBlockStorageInput;
};


export type MutationSetAkashaContentBlockStreamArgs = {
  input: SetAkashaContentBlockStreamInput;
};


export type MutationSetAkashaFollowArgs = {
  input: SetAkashaFollowInput;
};


export type MutationSetAkashaIndexedStreamArgs = {
  input: SetAkashaIndexedStreamInput;
};


export type MutationSetAkashaInterestsStreamArgs = {
  input: SetAkashaInterestsStreamInput;
};


export type MutationSetAkashaProfileArgs = {
  input: SetAkashaProfileInput;
};


export type MutationSetAkashaProfileInterestsArgs = {
  input: SetAkashaProfileInterestsInput;
};


export type MutationSetAkashaProfileStreamArgs = {
  input: SetAkashaProfileStreamInput;
};


export type MutationSetAkashaReflectStreamArgs = {
  input: SetAkashaReflectStreamInput;
};


export type MutationUpdateAkashaAppArgs = {
  input: UpdateAkashaAppInput;
};


export type MutationUpdateAkashaAppReleaseArgs = {
  input: UpdateAkashaAppReleaseInput;
};


export type MutationUpdateAkashaAppsStreamArgs = {
  input: UpdateAkashaAppsStreamInput;
};


export type MutationUpdateAkashaBeamArgs = {
  input: UpdateAkashaBeamInput;
};


export type MutationUpdateAkashaBeamStreamArgs = {
  input: UpdateAkashaBeamStreamInput;
};


export type MutationUpdateAkashaBlockStorageArgs = {
  input: UpdateAkashaBlockStorageInput;
};


export type MutationUpdateAkashaContentBlockArgs = {
  input: UpdateAkashaContentBlockInput;
};


export type MutationUpdateAkashaContentBlockStreamArgs = {
  input: UpdateAkashaContentBlockStreamInput;
};


export type MutationUpdateAkashaFollowArgs = {
  input: UpdateAkashaFollowInput;
};


export type MutationUpdateAkashaIndexedStreamArgs = {
  input: UpdateAkashaIndexedStreamInput;
};


export type MutationUpdateAkashaInterestsStreamArgs = {
  input: UpdateAkashaInterestsStreamInput;
};


export type MutationUpdateAkashaProfileArgs = {
  input: UpdateAkashaProfileInput;
};


export type MutationUpdateAkashaProfileInterestsArgs = {
  input: UpdateAkashaProfileInterestsInput;
};


export type MutationUpdateAkashaProfileStreamArgs = {
  input: UpdateAkashaProfileStreamInput;
};


export type MutationUpdateAkashaReflectArgs = {
  input: UpdateAkashaReflectInput;
};


export type MutationUpdateAkashaReflectStreamArgs = {
  input: UpdateAkashaReflectStreamInput;
};

/** An object with an ID */
export type Node = {
  /** The id of the object. */
  id: Scalars['ID']['output'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type PartialAkashaAppInput = {
  applicationType?: InputMaybe<AkashaAppApplicationType>;
  contributors?: InputMaybe<Array<InputMaybe<Scalars['DID']['input']>>>;
  coverImage?: InputMaybe<AppImageSourceInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  gallery?: InputMaybe<Array<InputMaybe<AppImageSourceInput>>>;
  links?: InputMaybe<Array<InputMaybe<AppLinkSourceInput>>>;
  logoImage?: InputMaybe<AppImageSourceInput>;
  meta?: InputMaybe<Array<InputMaybe<AppProviderValueInput>>>;
};

export type PartialAkashaAppReleaseInput = {
  meta?: InputMaybe<Array<InputMaybe<AppProviderValueInput>>>;
};

export type PartialAkashaAppsStreamInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<AkashaAppsStreamModerationStatus>;
};

export type PartialAkashaBeamInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  nsfw?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PartialAkashaBeamStreamInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<AkashaBeamStreamModerationStatus>;
};

export type PartialAkashaBlockStorageInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  kind?: InputMaybe<AkashaBlockStorageBlockDef>;
};

export type PartialAkashaContentBlockInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  kind?: InputMaybe<AkashaContentBlockBlockDef>;
};

export type PartialAkashaContentBlockStreamInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<AkashaContentBlockStreamModerationStatus>;
};

export type PartialAkashaFollowInput = {
  isFollowing?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PartialAkashaIndexedStreamInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<AkashaIndexedStreamModerationStatus>;
  streamType?: InputMaybe<AkashaIndexedStreamStreamType>;
};

export type PartialAkashaInterestsStreamInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<AkashaInterestsStreamModerationStatus>;
};

export type PartialAkashaProfileInput = {
  avatar?: InputMaybe<ProfileImageVersionsInput>;
  background?: InputMaybe<ProfileImageVersionsInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  links?: InputMaybe<Array<InputMaybe<ProfileLinkSourceInput>>>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type PartialAkashaProfileInterestsInput = {
  topics?: InputMaybe<Array<InputMaybe<ProfileLabeledInput>>>;
};

export type PartialAkashaProfileStreamInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  status?: InputMaybe<AkashaProfileStreamModerationStatus>;
};

export type PartialAkashaReflectInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  nsfw?: InputMaybe<Scalars['Boolean']['input']>;
};

export type PartialAkashaReflectStreamInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  beamID?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  isReply?: InputMaybe<Scalars['Boolean']['input']>;
  replyTo?: InputMaybe<Scalars['CeramicStreamID']['input']>;
  status?: InputMaybe<AkashaReflectStreamModerationStatus>;
};

export type ProfileImageSource = {
  height: Scalars['Int']['output'];
  src: Scalars['URI']['output'];
  width: Scalars['Int']['output'];
};

export type ProfileImageSourceInput = {
  height: Scalars['Int']['input'];
  src: Scalars['URI']['input'];
  width: Scalars['Int']['input'];
};

export type ProfileImageVersions = {
  alternatives?: Maybe<Array<Maybe<ProfileImageSource>>>;
  default: ProfileImageSource;
};

export type ProfileImageVersionsInput = {
  alternatives?: InputMaybe<Array<InputMaybe<ProfileImageSourceInput>>>;
  default: ProfileImageSourceInput;
};

export type ProfileLabeled = {
  labelType: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ProfileLabeledInput = {
  labelType: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type ProfileLinkSource = {
  href: Scalars['URI']['output'];
  label?: Maybe<Scalars['String']['output']>;
};

export type ProfileLinkSourceInput = {
  href: Scalars['URI']['input'];
  label?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  akashaAppCount: Scalars['Int']['output'];
  akashaAppIndex?: Maybe<AkashaAppConnection>;
  akashaAppInterfaceCount: Scalars['Int']['output'];
  akashaAppInterfaceIndex?: Maybe<AkashaAppInterfaceConnection>;
  akashaAppReleaseCount: Scalars['Int']['output'];
  akashaAppReleaseIndex?: Maybe<AkashaAppReleaseConnection>;
  akashaAppReleaseInterfaceCount: Scalars['Int']['output'];
  akashaAppReleaseInterfaceIndex?: Maybe<AkashaAppReleaseInterfaceConnection>;
  akashaAppsStreamCount: Scalars['Int']['output'];
  akashaAppsStreamIndex?: Maybe<AkashaAppsStreamConnection>;
  akashaBeamCount: Scalars['Int']['output'];
  akashaBeamIndex?: Maybe<AkashaBeamConnection>;
  akashaBeamInterfaceCount: Scalars['Int']['output'];
  akashaBeamInterfaceIndex?: Maybe<AkashaBeamInterfaceConnection>;
  akashaBeamStreamCount: Scalars['Int']['output'];
  akashaBeamStreamIndex?: Maybe<AkashaBeamStreamConnection>;
  akashaBlockStorageCount: Scalars['Int']['output'];
  akashaBlockStorageIndex?: Maybe<AkashaBlockStorageConnection>;
  akashaContentBlockCount: Scalars['Int']['output'];
  akashaContentBlockIndex?: Maybe<AkashaContentBlockConnection>;
  akashaContentBlockInterfaceCount: Scalars['Int']['output'];
  akashaContentBlockInterfaceIndex?: Maybe<AkashaContentBlockInterfaceConnection>;
  akashaContentBlockStreamCount: Scalars['Int']['output'];
  akashaContentBlockStreamIndex?: Maybe<AkashaContentBlockStreamConnection>;
  akashaFollowCount: Scalars['Int']['output'];
  akashaFollowIndex?: Maybe<AkashaFollowConnection>;
  akashaFollowInterfaceCount: Scalars['Int']['output'];
  akashaFollowInterfaceIndex?: Maybe<AkashaFollowInterfaceConnection>;
  akashaIndexStreamInterfaceCount: Scalars['Int']['output'];
  akashaIndexStreamInterfaceIndex?: Maybe<AkashaIndexStreamInterfaceConnection>;
  akashaIndexedStreamCount: Scalars['Int']['output'];
  akashaIndexedStreamIndex?: Maybe<AkashaIndexedStreamConnection>;
  akashaInterestsStreamCount: Scalars['Int']['output'];
  akashaInterestsStreamIndex?: Maybe<AkashaInterestsStreamConnection>;
  akashaProfileCount: Scalars['Int']['output'];
  akashaProfileIndex?: Maybe<AkashaProfileConnection>;
  akashaProfileInterestsCount: Scalars['Int']['output'];
  akashaProfileInterestsIndex?: Maybe<AkashaProfileInterestsConnection>;
  akashaProfileInterestsInterfaceCount: Scalars['Int']['output'];
  akashaProfileInterestsInterfaceIndex?: Maybe<AkashaProfileInterestsInterfaceConnection>;
  akashaProfileInterfaceCount: Scalars['Int']['output'];
  akashaProfileInterfaceIndex?: Maybe<AkashaProfileInterfaceConnection>;
  akashaProfileStreamCount: Scalars['Int']['output'];
  akashaProfileStreamIndex?: Maybe<AkashaProfileStreamConnection>;
  akashaReflectCount: Scalars['Int']['output'];
  akashaReflectIndex?: Maybe<AkashaReflectConnection>;
  akashaReflectInterfaceCount: Scalars['Int']['output'];
  akashaReflectInterfaceIndex?: Maybe<AkashaReflectInterfaceConnection>;
  akashaReflectStreamCount: Scalars['Int']['output'];
  akashaReflectStreamIndex?: Maybe<AkashaReflectStreamConnection>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Fetches objects given their IDs */
  nodes: Array<Maybe<Node>>;
  serviceStatus?: Maybe<Scalars['String']['output']>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type QueryAkashaAppCountArgs = {
  filters?: InputMaybe<AkashaAppFiltersInput>;
};


export type QueryAkashaAppIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaAppFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaAppSortingInput>;
};


export type QueryAkashaAppInterfaceCountArgs = {
  filters?: InputMaybe<AkashaAppInterfaceFiltersInput>;
};


export type QueryAkashaAppInterfaceIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaAppInterfaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaAppInterfaceSortingInput>;
};


export type QueryAkashaAppReleaseCountArgs = {
  filters?: InputMaybe<AkashaAppReleaseFiltersInput>;
};


export type QueryAkashaAppReleaseIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaAppReleaseFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaAppReleaseSortingInput>;
};


export type QueryAkashaAppReleaseInterfaceCountArgs = {
  filters?: InputMaybe<AkashaAppReleaseInterfaceFiltersInput>;
};


export type QueryAkashaAppReleaseInterfaceIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaAppReleaseInterfaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaAppReleaseInterfaceSortingInput>;
};


export type QueryAkashaAppsStreamCountArgs = {
  filters?: InputMaybe<AkashaAppsStreamFiltersInput>;
};


export type QueryAkashaAppsStreamIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaAppsStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaAppsStreamSortingInput>;
};


export type QueryAkashaBeamCountArgs = {
  filters?: InputMaybe<AkashaBeamFiltersInput>;
};


export type QueryAkashaBeamIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaBeamFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaBeamSortingInput>;
};


export type QueryAkashaBeamInterfaceCountArgs = {
  filters?: InputMaybe<AkashaBeamInterfaceFiltersInput>;
};


export type QueryAkashaBeamInterfaceIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaBeamInterfaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaBeamInterfaceSortingInput>;
};


export type QueryAkashaBeamStreamCountArgs = {
  filters?: InputMaybe<AkashaBeamStreamFiltersInput>;
};


export type QueryAkashaBeamStreamIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaBeamStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaBeamStreamSortingInput>;
};


export type QueryAkashaBlockStorageCountArgs = {
  filters?: InputMaybe<AkashaBlockStorageFiltersInput>;
};


export type QueryAkashaBlockStorageIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaBlockStorageFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaBlockStorageSortingInput>;
};


export type QueryAkashaContentBlockCountArgs = {
  filters?: InputMaybe<AkashaContentBlockFiltersInput>;
};


export type QueryAkashaContentBlockIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaContentBlockFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaContentBlockSortingInput>;
};


export type QueryAkashaContentBlockInterfaceCountArgs = {
  filters?: InputMaybe<AkashaContentBlockInterfaceFiltersInput>;
};


export type QueryAkashaContentBlockInterfaceIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaContentBlockInterfaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaContentBlockInterfaceSortingInput>;
};


export type QueryAkashaContentBlockStreamCountArgs = {
  filters?: InputMaybe<AkashaContentBlockStreamFiltersInput>;
};


export type QueryAkashaContentBlockStreamIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaContentBlockStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaContentBlockStreamSortingInput>;
};


export type QueryAkashaFollowCountArgs = {
  filters?: InputMaybe<AkashaFollowFiltersInput>;
};


export type QueryAkashaFollowIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaFollowFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaFollowSortingInput>;
};


export type QueryAkashaFollowInterfaceCountArgs = {
  filters?: InputMaybe<AkashaFollowInterfaceFiltersInput>;
};


export type QueryAkashaFollowInterfaceIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaFollowInterfaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaFollowInterfaceSortingInput>;
};


export type QueryAkashaIndexStreamInterfaceCountArgs = {
  filters?: InputMaybe<AkashaIndexStreamInterfaceFiltersInput>;
};


export type QueryAkashaIndexStreamInterfaceIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaIndexStreamInterfaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaIndexStreamInterfaceSortingInput>;
};


export type QueryAkashaIndexedStreamCountArgs = {
  filters?: InputMaybe<AkashaIndexedStreamFiltersInput>;
};


export type QueryAkashaIndexedStreamIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaIndexedStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaIndexedStreamSortingInput>;
};


export type QueryAkashaInterestsStreamCountArgs = {
  filters?: InputMaybe<AkashaInterestsStreamFiltersInput>;
};


export type QueryAkashaInterestsStreamIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaInterestsStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaInterestsStreamSortingInput>;
};


export type QueryAkashaProfileCountArgs = {
  filters?: InputMaybe<AkashaProfileFiltersInput>;
};


export type QueryAkashaProfileIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaProfileFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaProfileSortingInput>;
};


export type QueryAkashaProfileInterestsIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAkashaProfileInterestsInterfaceIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAkashaProfileInterfaceCountArgs = {
  filters?: InputMaybe<AkashaProfileInterfaceFiltersInput>;
};


export type QueryAkashaProfileInterfaceIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaProfileInterfaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaProfileInterfaceSortingInput>;
};


export type QueryAkashaProfileStreamCountArgs = {
  filters?: InputMaybe<AkashaProfileStreamFiltersInput>;
};


export type QueryAkashaProfileStreamIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaProfileStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaProfileStreamSortingInput>;
};


export type QueryAkashaReflectCountArgs = {
  filters?: InputMaybe<AkashaReflectFiltersInput>;
};


export type QueryAkashaReflectIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaReflectFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaReflectSortingInput>;
};


export type QueryAkashaReflectInterfaceCountArgs = {
  filters?: InputMaybe<AkashaReflectInterfaceFiltersInput>;
};


export type QueryAkashaReflectInterfaceIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaReflectInterfaceFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaReflectInterfaceSortingInput>;
};


export type QueryAkashaReflectStreamCountArgs = {
  filters?: InputMaybe<AkashaReflectStreamFiltersInput>;
};


export type QueryAkashaReflectStreamIndexArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<AkashaReflectStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  sorting?: InputMaybe<AkashaReflectStreamSortingInput>;
};


export type QueryNodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryNodesArgs = {
  ids: Array<Scalars['ID']['input']>;
};

export type ReflectProviderValue = {
  label: Scalars['String']['output'];
  propertyType: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type ReflectProviderValueInput = {
  label: Scalars['String']['input'];
  propertyType: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type SetAkashaAppInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: AkashaAppInput;
  options?: InputMaybe<SetOptionsInput>;
};

export type SetAkashaAppPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaApp;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type SetAkashaAppPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type SetAkashaAppReleaseInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: AkashaAppReleaseInput;
  options?: InputMaybe<SetOptionsInput>;
};

export type SetAkashaAppReleasePayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaAppRelease;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type SetAkashaAppReleasePayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type SetAkashaAppsStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: AkashaAppsStreamInput;
  options?: InputMaybe<SetOptionsInput>;
};

export type SetAkashaAppsStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaAppsStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type SetAkashaAppsStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type SetAkashaBeamStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: AkashaBeamStreamInput;
  options?: InputMaybe<SetOptionsInput>;
};

export type SetAkashaBeamStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaBeamStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type SetAkashaBeamStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type SetAkashaBlockStorageInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: AkashaBlockStorageInput;
  options?: InputMaybe<SetOptionsInput>;
};

export type SetAkashaBlockStoragePayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaBlockStorage;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type SetAkashaBlockStoragePayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type SetAkashaContentBlockStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: AkashaContentBlockStreamInput;
  options?: InputMaybe<SetOptionsInput>;
};

export type SetAkashaContentBlockStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaContentBlockStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type SetAkashaContentBlockStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type SetAkashaFollowInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: AkashaFollowInput;
  options?: InputMaybe<SetOptionsInput>;
};

export type SetAkashaFollowPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaFollow;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type SetAkashaFollowPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type SetAkashaIndexedStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: AkashaIndexedStreamInput;
  options?: InputMaybe<SetOptionsInput>;
};

export type SetAkashaIndexedStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaIndexedStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type SetAkashaIndexedStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type SetAkashaInterestsStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: AkashaInterestsStreamInput;
  options?: InputMaybe<SetOptionsInput>;
};

export type SetAkashaInterestsStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaInterestsStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type SetAkashaInterestsStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type SetAkashaProfileInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: AkashaProfileInput;
  options?: InputMaybe<SetOptionsInput>;
};

export type SetAkashaProfileInterestsInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: AkashaProfileInterestsInput;
  options?: InputMaybe<SetOptionsInput>;
};

export type SetAkashaProfileInterestsPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaProfileInterests;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type SetAkashaProfileInterestsPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type SetAkashaProfilePayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaProfile;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type SetAkashaProfilePayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type SetAkashaProfileStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: AkashaProfileStreamInput;
  options?: InputMaybe<SetOptionsInput>;
};

export type SetAkashaProfileStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaProfileStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type SetAkashaProfileStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type SetAkashaReflectStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: AkashaReflectStreamInput;
  options?: InputMaybe<SetOptionsInput>;
};

export type SetAkashaReflectStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaReflectStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type SetAkashaReflectStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type SetOptionsInput = {
  /** Inform indexers if they should index this document or not */
  shouldIndex?: InputMaybe<Scalars['Boolean']['input']>;
  /** Maximum amount of time to lookup the stream over the network, in seconds - see https://developers.ceramic.network/reference/typescript/interfaces/_ceramicnetwork_common.CreateOpts.html#syncTimeoutSeconds */
  syncTimeout?: InputMaybe<Scalars['Int']['input']>;
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StringValueFilterInput = {
  equalTo?: InputMaybe<Scalars['String']['input']>;
  greaterThan?: InputMaybe<Scalars['String']['input']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  isNull?: InputMaybe<Scalars['Boolean']['input']>;
  lessThan?: InputMaybe<Scalars['String']['input']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['String']['input']>;
  notEqualTo?: InputMaybe<Scalars['String']['input']>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateAkashaAppInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialAkashaAppInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaAppPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaApp;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaAppPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateAkashaAppReleaseInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialAkashaAppReleaseInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaAppReleasePayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaAppRelease;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaAppReleasePayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateAkashaAppsStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialAkashaAppsStreamInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaAppsStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaAppsStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaAppsStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateAkashaBeamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialAkashaBeamInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaBeamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaBeam;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaBeamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateAkashaBeamStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialAkashaBeamStreamInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaBeamStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaBeamStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaBeamStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateAkashaBlockStorageInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialAkashaBlockStorageInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaBlockStoragePayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaBlockStorage;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaBlockStoragePayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateAkashaContentBlockInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialAkashaContentBlockInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaContentBlockPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaContentBlock;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaContentBlockPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateAkashaContentBlockStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialAkashaContentBlockStreamInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaContentBlockStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaContentBlockStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaContentBlockStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateAkashaFollowInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialAkashaFollowInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaFollowPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaFollow;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaFollowPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateAkashaIndexedStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialAkashaIndexedStreamInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaIndexedStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaIndexedStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaIndexedStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateAkashaInterestsStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialAkashaInterestsStreamInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaInterestsStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaInterestsStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaInterestsStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateAkashaProfileInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialAkashaProfileInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaProfileInterestsInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialAkashaProfileInterestsInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaProfileInterestsPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaProfileInterests;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaProfileInterestsPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateAkashaProfilePayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaProfile;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaProfilePayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateAkashaProfileStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialAkashaProfileStreamInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaProfileStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaProfileStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaProfileStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateAkashaReflectInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialAkashaReflectInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaReflectPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaReflect;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaReflectPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateAkashaReflectStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  content: PartialAkashaReflectStreamInput;
  id: Scalars['ID']['input'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaReflectStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']['output']>;
  document: AkashaReflectStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaReflectStreamPayloadNodeArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateOptionsInput = {
  /** Fully replace the document contents instead of performing a shallow merge */
  replace?: InputMaybe<Scalars['Boolean']['input']>;
  /** Inform indexers if they should index this document or not */
  shouldIndex?: InputMaybe<Scalars['Boolean']['input']>;
  /** Only perform mutation if the document matches the provided version */
  version?: InputMaybe<Scalars['CeramicCommitID']['input']>;
};

export type WithAkashaAppInput = {
  name: Scalars['String']['input'];
};

export type WithAkashaAppReleaseInput = {
  applicationID: Scalars['CeramicStreamID']['input'];
  version: Scalars['String']['input'];
};

export type WithAkashaAppsStreamInput = {
  applicationID: Scalars['CeramicStreamID']['input'];
};

export type WithAkashaBeamStreamInput = {
  beamID: Scalars['CeramicStreamID']['input'];
};

export type WithAkashaBlockStorageInput = {
  blockID: Scalars['CeramicStreamID']['input'];
};

export type WithAkashaContentBlockStreamInput = {
  blockID: Scalars['CeramicStreamID']['input'];
};

export type WithAkashaFollowInput = {
  profileID: Scalars['CeramicStreamID']['input'];
};

export type WithAkashaIndexedStreamInput = {
  indexType: Scalars['String']['input'];
  indexValue: Scalars['String']['input'];
  stream: Scalars['CeramicStreamID']['input'];
};

export type WithAkashaInterestsStreamInput = {
  labelType: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

export type WithAkashaProfileStreamInput = {
  profileID: Scalars['CeramicStreamID']['input'];
};

export type WithAkashaReflectStreamInput = {
  reflectionID: Scalars['CeramicStreamID']['input'];
};

export enum Join__Graph {
  Composedb = 'COMPOSEDB',
  Streams = 'STREAMS'
}

export enum Link__Purpose {
  /** `EXECUTION` features provide metadata necessary for operation execution. */
  Execution = 'EXECUTION',
  /** `SECURITY` features provide metadata necessary to securely resolve fields. */
  Security = 'SECURITY'
}
