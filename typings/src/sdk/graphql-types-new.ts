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
  /** A Ceramic Commit ID */
  CeramicCommitID: any;
  /** A Ceramic Stream ID */
  CeramicStreamID: any;
  /** A field whose value conforms to the standard DID format as specified in did-core: https://www.w3.org/TR/did-core/. */
  DID: any;
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any;
  /** A IPLD CID */
  InterPlanetaryCID: any;
  /** A field whose value conforms to the standard Uniform Resource Identifier (URI) format as specified in RFC3986. */
  URI: any;
  _FieldSet: any;
};

export type AkashaApp = Node & {
  applicationType?: Maybe<AkashaAppApplicationType>;
  /** Account controlling the document */
  author: CeramicAccount;
  contributors?: Maybe<Array<Maybe<CeramicAccount>>>;
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  displayName: Scalars['String'];
  id: Scalars['ID'];
  keywords?: Maybe<Array<Maybe<Scalars['String']>>>;
  licence: Scalars['String'];
  name: Scalars['String'];
  releases: AkashaAppReleaseConnection;
  releasesCount: Scalars['Int'];
};


export type AkashaAppReleasesArgs = {
  account?: InputMaybe<Scalars['ID']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaAppReleaseFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaAppReleaseSortingInput>;
};


export type AkashaAppReleasesCountArgs = {
  account?: InputMaybe<Scalars['ID']>;
  filters?: InputMaybe<AkashaAppReleaseFiltersInput>;
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
  isNull?: InputMaybe<Scalars['Boolean']>;
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
  cursor: Scalars['String'];
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
  contributors?: InputMaybe<Array<InputMaybe<Scalars['DID']>>>;
  createdAt: Scalars['DateTime'];
  description: Scalars['String'];
  displayName: Scalars['String'];
  keywords?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  licence: Scalars['String'];
  name: Scalars['String'];
};

export type AkashaAppObjectFilterInput = {
  applicationType?: InputMaybe<AkashaAppApplicationTypeValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  displayName?: InputMaybe<StringValueFilterInput>;
  name?: InputMaybe<StringValueFilterInput>;
};

export type AkashaAppRelease = Node & {
  application?: Maybe<AkashaApp>;
  applicationID: Scalars['CeramicStreamID'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  source: Scalars['InterPlanetaryCID'];
  version: Scalars['String'];
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
  cursor: Scalars['String'];
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
  applicationID: Scalars['CeramicStreamID'];
  createdAt: Scalars['DateTime'];
  source: Scalars['InterPlanetaryCID'];
  version: Scalars['String'];
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
};

export type AkashaAppsStream = Node & {
  active: Scalars['Boolean'];
  application?: Maybe<AkashaApp>;
  applicationID: Scalars['CeramicStreamID'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  moderationID?: Maybe<Scalars['CeramicStreamID']>;
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
  cursor: Scalars['String'];
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
  active: Scalars['Boolean'];
  applicationID: Scalars['CeramicStreamID'];
  createdAt: Scalars['DateTime'];
  moderationID?: InputMaybe<Scalars['CeramicStreamID']>;
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
  isNull?: InputMaybe<Scalars['Boolean']>;
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

export type AkashaBeam = Node & {
  active: Scalars['Boolean'];
  /** Account controlling the document */
  author: CeramicAccount;
  content: Array<AkashaBeamBlockRecord>;
  createdAt: Scalars['DateTime'];
  embeddedBeam?: Maybe<AkashaBeamEmbeddedType>;
  id: Scalars['ID'];
  mentions?: Maybe<Array<Maybe<Scalars['CeramicStreamID']>>>;
  nsfw?: Maybe<Scalars['Boolean']>;
  reflections: AkashaReflectConnection;
  reflectionsCount: Scalars['Int'];
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Current version of the document */
  version: Scalars['CeramicCommitID'];
};


export type AkashaBeamReflectionsArgs = {
  account?: InputMaybe<Scalars['ID']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaReflectFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaReflectSortingInput>;
};


export type AkashaBeamReflectionsCountArgs = {
  account?: InputMaybe<Scalars['ID']>;
  filters?: InputMaybe<AkashaReflectFiltersInput>;
};

export type AkashaBeamBlockRecord = {
  blockID: Scalars['CeramicStreamID'];
  order: Scalars['Int'];
};

export type AkashaBeamBlockRecordInput = {
  blockID: Scalars['CeramicStreamID'];
  order: Scalars['Int'];
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
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaBeam>;
};

export type AkashaBeamEmbeddedType = {
  embeddedID: Scalars['CeramicStreamID'];
  label: Scalars['String'];
};

export type AkashaBeamEmbeddedTypeInput = {
  embeddedID: Scalars['CeramicStreamID'];
  label: Scalars['String'];
};

export type AkashaBeamFiltersInput = {
  and?: InputMaybe<Array<AkashaBeamFiltersInput>>;
  not?: InputMaybe<AkashaBeamFiltersInput>;
  or?: InputMaybe<Array<AkashaBeamFiltersInput>>;
  where?: InputMaybe<AkashaBeamObjectFilterInput>;
};

export type AkashaBeamInput = {
  active: Scalars['Boolean'];
  content: Array<InputMaybe<AkashaBeamBlockRecordInput>>;
  createdAt: Scalars['DateTime'];
  embeddedBeam?: InputMaybe<AkashaBeamEmbeddedTypeInput>;
  mentions?: InputMaybe<Array<InputMaybe<Scalars['CeramicStreamID']>>>;
  nsfw?: InputMaybe<Scalars['Boolean']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type AkashaBeamObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  nsfw?: InputMaybe<BooleanValueFilterInput>;
};

export type AkashaBeamSortingInput = {
  active?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  nsfw?: InputMaybe<SortOrder>;
};

export type AkashaBeamStream = Node & {
  active: Scalars['Boolean'];
  beam?: Maybe<AkashaBeam>;
  beamID: Scalars['CeramicStreamID'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  moderationID?: Maybe<Scalars['CeramicStreamID']>;
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
  cursor: Scalars['String'];
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
  active: Scalars['Boolean'];
  beamID: Scalars['CeramicStreamID'];
  createdAt: Scalars['DateTime'];
  moderationID?: InputMaybe<Scalars['CeramicStreamID']>;
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
  isNull?: InputMaybe<Scalars['Boolean']>;
  notEqualTo?: InputMaybe<AkashaBeamStreamModerationStatus>;
  notIn?: InputMaybe<Array<AkashaBeamStreamModerationStatus>>;
};

export type AkashaBeamStreamObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  beamID?: InputMaybe<StringValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  moderationID?: InputMaybe<StringValueFilterInput>;
  status?: InputMaybe<AkashaBeamStreamModerationStatusValueFilterInput>;
};

export type AkashaBeamStreamSortingInput = {
  active?: InputMaybe<SortOrder>;
  beamID?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  moderationID?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
};

export type AkashaBlockStorage = Node & {
  active: Scalars['Boolean'];
  appVersion?: Maybe<AkashaAppRelease>;
  appVersionID: Scalars['CeramicStreamID'];
  /** Account controlling the document */
  author: CeramicAccount;
  block?: Maybe<AkashaContentBlock>;
  blockID: Scalars['CeramicStreamID'];
  content: Array<AkashaBlockStorageLabeledValue>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  kind?: Maybe<AkashaBlockStorageBlockStorageDef>;
  /** Current version of the document */
  version: Scalars['CeramicCommitID'];
};

export enum AkashaBlockStorageBlockStorageDef {
  Bool = 'BOOL',
  Emoji = 'EMOJI',
  FormData = 'FORM_DATA',
  Other = 'OTHER',
  Text = 'TEXT'
}

export type AkashaBlockStorageBlockStorageDefValueFilterInput = {
  equalTo?: InputMaybe<AkashaBlockStorageBlockStorageDef>;
  in?: InputMaybe<Array<AkashaBlockStorageBlockStorageDef>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  notEqualTo?: InputMaybe<AkashaBlockStorageBlockStorageDef>;
  notIn?: InputMaybe<Array<AkashaBlockStorageBlockStorageDef>>;
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
  cursor: Scalars['String'];
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
  active: Scalars['Boolean'];
  appVersionID: Scalars['CeramicStreamID'];
  blockID: Scalars['CeramicStreamID'];
  content: Array<InputMaybe<AkashaBlockStorageLabeledValueInput>>;
  createdAt: Scalars['DateTime'];
  kind?: InputMaybe<AkashaBlockStorageBlockStorageDef>;
};

export type AkashaBlockStorageLabeledValue = {
  label: Scalars['String'];
  propertyType: Scalars['String'];
  value: Scalars['String'];
};

export type AkashaBlockStorageLabeledValueInput = {
  label: Scalars['String'];
  propertyType: Scalars['String'];
  value: Scalars['String'];
};

export type AkashaBlockStorageObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  kind?: InputMaybe<AkashaBlockStorageBlockStorageDefValueFilterInput>;
};

export type AkashaBlockStorageSortingInput = {
  active?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  kind?: InputMaybe<SortOrder>;
};

export type AkashaContentBlock = Node & {
  active: Scalars['Boolean'];
  appVersion?: Maybe<AkashaAppRelease>;
  appVersionID: Scalars['CeramicStreamID'];
  /** Account controlling the document */
  author: CeramicAccount;
  content: Array<AkashaContentBlockLabeledValue>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  kind?: Maybe<AkashaContentBlockBlockDef>;
  nsfw?: Maybe<Scalars['Boolean']>;
  /** Current version of the document */
  version: Scalars['CeramicCommitID'];
};

export enum AkashaContentBlockBlockDef {
  Form = 'FORM',
  Other = 'OTHER',
  Text = 'TEXT'
}

export type AkashaContentBlockBlockDefValueFilterInput = {
  equalTo?: InputMaybe<AkashaContentBlockBlockDef>;
  in?: InputMaybe<Array<AkashaContentBlockBlockDef>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
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
  cursor: Scalars['String'];
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
  active: Scalars['Boolean'];
  appVersionID: Scalars['CeramicStreamID'];
  content: Array<InputMaybe<AkashaContentBlockLabeledValueInput>>;
  createdAt: Scalars['DateTime'];
  kind?: InputMaybe<AkashaContentBlockBlockDef>;
  nsfw?: InputMaybe<Scalars['Boolean']>;
};

export type AkashaContentBlockLabeledValue = {
  label: Scalars['String'];
  propertyType: Scalars['String'];
  value: Scalars['String'];
};

export type AkashaContentBlockLabeledValueInput = {
  label: Scalars['String'];
  propertyType: Scalars['String'];
  value: Scalars['String'];
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

export type AkashaContentBlockStream = Node & {
  active: Scalars['Boolean'];
  beamID: Scalars['CeramicStreamID'];
  block?: Maybe<AkashaContentBlock>;
  blockID: Scalars['CeramicStreamID'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  moderationID?: Maybe<Scalars['CeramicStreamID']>;
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
  cursor: Scalars['String'];
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
  active: Scalars['Boolean'];
  beamID: Scalars['CeramicStreamID'];
  blockID: Scalars['CeramicStreamID'];
  createdAt: Scalars['DateTime'];
  moderationID?: InputMaybe<Scalars['CeramicStreamID']>;
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
  isNull?: InputMaybe<Scalars['Boolean']>;
  notEqualTo?: InputMaybe<AkashaContentBlockStreamModerationStatus>;
  notIn?: InputMaybe<Array<AkashaContentBlockStreamModerationStatus>>;
};

export type AkashaContentBlockStreamObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  beamID?: InputMaybe<StringValueFilterInput>;
  blockID?: InputMaybe<StringValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  moderationID?: InputMaybe<StringValueFilterInput>;
  status?: InputMaybe<AkashaContentBlockStreamModerationStatusValueFilterInput>;
};

export type AkashaContentBlockStreamSortingInput = {
  active?: InputMaybe<SortOrder>;
  beamID?: InputMaybe<SortOrder>;
  blockID?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  moderationID?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
};

export type AkashaFollow = Node & {
  /** Account controlling the document */
  did: CeramicAccount;
  id: Scalars['ID'];
  isFollowing: Scalars['Boolean'];
  profile?: Maybe<AkashaProfile>;
  profileID: Scalars['CeramicStreamID'];
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
  cursor: Scalars['String'];
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
  isFollowing: Scalars['Boolean'];
  profileID: Scalars['CeramicStreamID'];
};

export type AkashaFollowObjectFilterInput = {
  isFollowing?: InputMaybe<BooleanValueFilterInput>;
  profileID?: InputMaybe<StringValueFilterInput>;
};

export type AkashaFollowSortingInput = {
  isFollowing?: InputMaybe<SortOrder>;
  profileID?: InputMaybe<SortOrder>;
};

export type AkashaInterestsStream = Node & {
  active: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  labelType: Scalars['String'];
  moderationID?: Maybe<Scalars['CeramicStreamID']>;
  status?: Maybe<AkashaInterestsStreamModerationStatus>;
  value: Scalars['String'];
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
  cursor: Scalars['String'];
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
  active: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  labelType: Scalars['String'];
  moderationID?: InputMaybe<Scalars['CeramicStreamID']>;
  status?: InputMaybe<AkashaInterestsStreamModerationStatus>;
  value: Scalars['String'];
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
  isNull?: InputMaybe<Scalars['Boolean']>;
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

export type AkashaProfile = Node & {
  avatar?: Maybe<AkashaProfileImageVersions>;
  background?: Maybe<AkashaProfileImageVersions>;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  /** Account controlling the document */
  did: CeramicAccount;
  followers: AkashaFollowConnection;
  followersCount: Scalars['Int'];
  id: Scalars['ID'];
  links?: Maybe<Array<Maybe<AkashaProfileLinkSource>>>;
  name: Scalars['String'];
  nsfw?: Maybe<Scalars['Boolean']>;
};


export type AkashaProfileFollowersArgs = {
  account?: InputMaybe<Scalars['ID']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaFollowFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaFollowSortingInput>;
};


export type AkashaProfileFollowersCountArgs = {
  account?: InputMaybe<Scalars['ID']>;
  filters?: InputMaybe<AkashaFollowFiltersInput>;
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
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaProfile>;
};

export type AkashaProfileFiltersInput = {
  and?: InputMaybe<Array<AkashaProfileFiltersInput>>;
  not?: InputMaybe<AkashaProfileFiltersInput>;
  or?: InputMaybe<Array<AkashaProfileFiltersInput>>;
  where?: InputMaybe<AkashaProfileObjectFilterInput>;
};

export type AkashaProfileImageSource = {
  height: Scalars['Int'];
  src: Scalars['URI'];
  width: Scalars['Int'];
};

export type AkashaProfileImageSourceInput = {
  height: Scalars['Int'];
  src: Scalars['URI'];
  width: Scalars['Int'];
};

export type AkashaProfileImageVersions = {
  alternatives?: Maybe<Array<Maybe<AkashaProfileImageSource>>>;
  default: AkashaProfileImageSource;
};

export type AkashaProfileImageVersionsInput = {
  alternatives?: InputMaybe<Array<InputMaybe<AkashaProfileImageSourceInput>>>;
  default: AkashaProfileImageSourceInput;
};

export type AkashaProfileInput = {
  avatar?: InputMaybe<AkashaProfileImageVersionsInput>;
  background?: InputMaybe<AkashaProfileImageVersionsInput>;
  createdAt: Scalars['DateTime'];
  description?: InputMaybe<Scalars['String']>;
  links?: InputMaybe<Array<InputMaybe<AkashaProfileLinkSourceInput>>>;
  name: Scalars['String'];
  nsfw?: InputMaybe<Scalars['Boolean']>;
};

export type AkashaProfileInterests = Node & {
  /** Account controlling the document */
  did: CeramicAccount;
  id: Scalars['ID'];
  topics: Array<AkashaProfileInterestsLabeled>;
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
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<AkashaProfileInterests>;
};

export type AkashaProfileInterestsInput = {
  topics: Array<InputMaybe<AkashaProfileInterestsLabeledInput>>;
};

export type AkashaProfileInterestsLabeled = {
  labelType: Scalars['String'];
  value: Scalars['String'];
};

export type AkashaProfileInterestsLabeledInput = {
  labelType: Scalars['String'];
  value: Scalars['String'];
};

export type AkashaProfileLinkSource = {
  href: Scalars['URI'];
  label?: Maybe<Scalars['String']>;
};

export type AkashaProfileLinkSourceInput = {
  href: Scalars['URI'];
  label?: InputMaybe<Scalars['String']>;
};

export type AkashaProfileObjectFilterInput = {
  createdAt?: InputMaybe<StringValueFilterInput>;
  name?: InputMaybe<StringValueFilterInput>;
  nsfw?: InputMaybe<BooleanValueFilterInput>;
};

export type AkashaProfileSortingInput = {
  createdAt?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
  nsfw?: InputMaybe<SortOrder>;
};

export type AkashaProfileStream = Node & {
  active: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  moderationID?: Maybe<Scalars['CeramicStreamID']>;
  profile?: Maybe<AkashaProfile>;
  profileID: Scalars['CeramicStreamID'];
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
  cursor: Scalars['String'];
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
  active: Scalars['Boolean'];
  createdAt: Scalars['DateTime'];
  moderationID?: InputMaybe<Scalars['CeramicStreamID']>;
  profileID: Scalars['CeramicStreamID'];
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
  isNull?: InputMaybe<Scalars['Boolean']>;
  notEqualTo?: InputMaybe<AkashaProfileStreamModerationStatus>;
  notIn?: InputMaybe<Array<AkashaProfileStreamModerationStatus>>;
};

export type AkashaProfileStreamObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  moderationID?: InputMaybe<StringValueFilterInput>;
  profileID?: InputMaybe<StringValueFilterInput>;
  status?: InputMaybe<AkashaProfileStreamModerationStatusValueFilterInput>;
};

export type AkashaProfileStreamSortingInput = {
  active?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  moderationID?: InputMaybe<SortOrder>;
  profileID?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
};

export type AkashaReflect = Node & {
  active: Scalars['Boolean'];
  /** Account controlling the document */
  author: CeramicAccount;
  beam?: Maybe<AkashaBeam>;
  beamID: Scalars['CeramicStreamID'];
  content: Array<AkashaReflectProviderValue>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  isReply: Scalars['Boolean'];
  mentions?: Maybe<Array<Maybe<Scalars['CeramicStreamID']>>>;
  nsfw?: Maybe<Scalars['Boolean']>;
  reflection?: Maybe<Scalars['CeramicStreamID']>;
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Current version of the document */
  version: Scalars['CeramicCommitID'];
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
  cursor: Scalars['String'];
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
  active: Scalars['Boolean'];
  beamID: Scalars['CeramicStreamID'];
  content: Array<InputMaybe<AkashaReflectProviderValueInput>>;
  createdAt: Scalars['DateTime'];
  isReply: Scalars['Boolean'];
  mentions?: InputMaybe<Array<InputMaybe<Scalars['CeramicStreamID']>>>;
  nsfw?: InputMaybe<Scalars['Boolean']>;
  reflection?: InputMaybe<Scalars['CeramicStreamID']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type AkashaReflectObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  isReply?: InputMaybe<BooleanValueFilterInput>;
  nsfw?: InputMaybe<BooleanValueFilterInput>;
  reflection?: InputMaybe<StringValueFilterInput>;
};

export type AkashaReflectProviderValue = {
  label: Scalars['String'];
  propertyType: Scalars['String'];
  value: Scalars['String'];
};

export type AkashaReflectProviderValueInput = {
  label: Scalars['String'];
  propertyType: Scalars['String'];
  value: Scalars['String'];
};

export type AkashaReflectSortingInput = {
  active?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  isReply?: InputMaybe<SortOrder>;
  nsfw?: InputMaybe<SortOrder>;
  reflection?: InputMaybe<SortOrder>;
};

export type AkashaReflectStream = Node & {
  active: Scalars['Boolean'];
  beamID: Scalars['CeramicStreamID'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  moderationID?: Maybe<Scalars['CeramicStreamID']>;
  reflection?: Maybe<AkashaReflect>;
  reflectionID: Scalars['CeramicStreamID'];
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
  cursor: Scalars['String'];
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
  active: Scalars['Boolean'];
  beamID: Scalars['CeramicStreamID'];
  createdAt: Scalars['DateTime'];
  moderationID?: InputMaybe<Scalars['CeramicStreamID']>;
  reflectionID: Scalars['CeramicStreamID'];
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
  isNull?: InputMaybe<Scalars['Boolean']>;
  notEqualTo?: InputMaybe<AkashaReflectStreamModerationStatus>;
  notIn?: InputMaybe<Array<AkashaReflectStreamModerationStatus>>;
};

export type AkashaReflectStreamObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  beamID?: InputMaybe<StringValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  moderationID?: InputMaybe<StringValueFilterInput>;
  reflectionID?: InputMaybe<StringValueFilterInput>;
  status?: InputMaybe<AkashaReflectStreamModerationStatusValueFilterInput>;
};

export type AkashaReflectStreamSortingInput = {
  active?: InputMaybe<SortOrder>;
  beamID?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  moderationID?: InputMaybe<SortOrder>;
  reflectionID?: InputMaybe<SortOrder>;
  status?: InputMaybe<SortOrder>;
};

export type BooleanValueFilterInput = {
  equalTo?: InputMaybe<Scalars['Boolean']>;
  isNull?: InputMaybe<Scalars['Boolean']>;
};

export type CeramicAccount = Node & {
  akashaAppList?: Maybe<AkashaAppConnection>;
  akashaAppReleaseList?: Maybe<AkashaAppReleaseConnection>;
  akashaAppsStreamList?: Maybe<AkashaAppsStreamConnection>;
  akashaBeamList?: Maybe<AkashaBeamConnection>;
  akashaBeamStreamList?: Maybe<AkashaBeamStreamConnection>;
  akashaBlockStorageList?: Maybe<AkashaBlockStorageConnection>;
  akashaContentBlockList?: Maybe<AkashaContentBlockConnection>;
  akashaContentBlockStreamList?: Maybe<AkashaContentBlockStreamConnection>;
  akashaFollowList?: Maybe<AkashaFollowConnection>;
  akashaInterestsStreamList?: Maybe<AkashaInterestsStreamConnection>;
  akashaProfile?: Maybe<AkashaProfile>;
  akashaProfileInterests?: Maybe<AkashaProfileInterests>;
  akashaProfileStreamList?: Maybe<AkashaProfileStreamConnection>;
  akashaReflectList?: Maybe<AkashaReflectConnection>;
  akashaReflectStreamList?: Maybe<AkashaReflectStreamConnection>;
  /** Globally unique identifier of the account (DID string) */
  id: Scalars['ID'];
  /** Whether the Ceramic instance is currently authenticated with this account or not */
  isViewer: Scalars['Boolean'];
};


export type CeramicAccountAkashaAppListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaAppFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaAppSortingInput>;
};


export type CeramicAccountAkashaAppReleaseListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaAppReleaseFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaAppReleaseSortingInput>;
};


export type CeramicAccountAkashaAppsStreamListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaAppsStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaAppsStreamSortingInput>;
};


export type CeramicAccountAkashaBeamListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaBeamFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaBeamSortingInput>;
};


export type CeramicAccountAkashaBeamStreamListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaBeamStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaBeamStreamSortingInput>;
};


export type CeramicAccountAkashaBlockStorageListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaBlockStorageFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaBlockStorageSortingInput>;
};


export type CeramicAccountAkashaContentBlockListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaContentBlockFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaContentBlockSortingInput>;
};


export type CeramicAccountAkashaContentBlockStreamListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaContentBlockStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaContentBlockStreamSortingInput>;
};


export type CeramicAccountAkashaFollowListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaFollowFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaFollowSortingInput>;
};


export type CeramicAccountAkashaInterestsStreamListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaInterestsStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaInterestsStreamSortingInput>;
};


export type CeramicAccountAkashaProfileStreamListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaProfileStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaProfileStreamSortingInput>;
};


export type CeramicAccountAkashaReflectListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaReflectFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaReflectSortingInput>;
};


export type CeramicAccountAkashaReflectStreamListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaReflectStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaReflectStreamSortingInput>;
};

export type CreateAkashaAppInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: AkashaAppInput;
};

export type CreateAkashaAppPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaApp;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAkashaAppPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateAkashaAppReleaseInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: AkashaAppReleaseInput;
};

export type CreateAkashaAppReleasePayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaAppRelease;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAkashaAppReleasePayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateAkashaAppsStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: AkashaAppsStreamInput;
};

export type CreateAkashaAppsStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaAppsStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAkashaAppsStreamPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateAkashaBeamInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: AkashaBeamInput;
};

export type CreateAkashaBeamPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaBeam;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAkashaBeamPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateAkashaBeamStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: AkashaBeamStreamInput;
};

export type CreateAkashaBeamStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaBeamStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAkashaBeamStreamPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateAkashaBlockStorageInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: AkashaBlockStorageInput;
};

export type CreateAkashaBlockStoragePayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaBlockStorage;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAkashaBlockStoragePayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateAkashaContentBlockInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: AkashaContentBlockInput;
};

export type CreateAkashaContentBlockPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaContentBlock;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAkashaContentBlockPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateAkashaContentBlockStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: AkashaContentBlockStreamInput;
};

export type CreateAkashaContentBlockStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaContentBlockStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAkashaContentBlockStreamPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateAkashaFollowInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: AkashaFollowInput;
};

export type CreateAkashaFollowPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaFollow;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAkashaFollowPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateAkashaInterestsStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: AkashaInterestsStreamInput;
};

export type CreateAkashaInterestsStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaInterestsStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAkashaInterestsStreamPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateAkashaProfileInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: AkashaProfileInput;
};

export type CreateAkashaProfileInterestsInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: AkashaProfileInterestsInput;
};

export type CreateAkashaProfileInterestsPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaProfileInterests;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAkashaProfileInterestsPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateAkashaProfilePayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaProfile;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAkashaProfilePayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateAkashaProfileStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: AkashaProfileStreamInput;
};

export type CreateAkashaProfileStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaProfileStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAkashaProfileStreamPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateAkashaReflectInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: AkashaReflectInput;
};

export type CreateAkashaReflectPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaReflect;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAkashaReflectPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateAkashaReflectStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: AkashaReflectStreamInput;
};

export type CreateAkashaReflectStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaReflectStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAkashaReflectStreamPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type Mutation = {
  createAkashaApp?: Maybe<CreateAkashaAppPayload>;
  createAkashaAppRelease?: Maybe<CreateAkashaAppReleasePayload>;
  createAkashaAppsStream?: Maybe<CreateAkashaAppsStreamPayload>;
  createAkashaBeam?: Maybe<CreateAkashaBeamPayload>;
  createAkashaBeamStream?: Maybe<CreateAkashaBeamStreamPayload>;
  createAkashaBlockStorage?: Maybe<CreateAkashaBlockStoragePayload>;
  createAkashaContentBlock?: Maybe<CreateAkashaContentBlockPayload>;
  createAkashaContentBlockStream?: Maybe<CreateAkashaContentBlockStreamPayload>;
  createAkashaFollow?: Maybe<CreateAkashaFollowPayload>;
  createAkashaInterestsStream?: Maybe<CreateAkashaInterestsStreamPayload>;
  createAkashaProfile?: Maybe<CreateAkashaProfilePayload>;
  createAkashaProfileInterests?: Maybe<CreateAkashaProfileInterestsPayload>;
  createAkashaProfileStream?: Maybe<CreateAkashaProfileStreamPayload>;
  createAkashaReflect?: Maybe<CreateAkashaReflectPayload>;
  createAkashaReflectStream?: Maybe<CreateAkashaReflectStreamPayload>;
  updateAkashaApp?: Maybe<UpdateAkashaAppPayload>;
  updateAkashaAppRelease?: Maybe<UpdateAkashaAppReleasePayload>;
  updateAkashaAppsStream?: Maybe<UpdateAkashaAppsStreamPayload>;
  updateAkashaBeam?: Maybe<UpdateAkashaBeamPayload>;
  updateAkashaBeamStream?: Maybe<UpdateAkashaBeamStreamPayload>;
  updateAkashaBlockStorage?: Maybe<UpdateAkashaBlockStoragePayload>;
  updateAkashaContentBlock?: Maybe<UpdateAkashaContentBlockPayload>;
  updateAkashaContentBlockStream?: Maybe<UpdateAkashaContentBlockStreamPayload>;
  updateAkashaFollow?: Maybe<UpdateAkashaFollowPayload>;
  updateAkashaInterestsStream?: Maybe<UpdateAkashaInterestsStreamPayload>;
  updateAkashaProfile?: Maybe<UpdateAkashaProfilePayload>;
  updateAkashaProfileInterests?: Maybe<UpdateAkashaProfileInterestsPayload>;
  updateAkashaProfileStream?: Maybe<UpdateAkashaProfileStreamPayload>;
  updateAkashaReflect?: Maybe<UpdateAkashaReflectPayload>;
  updateAkashaReflectStream?: Maybe<UpdateAkashaReflectStreamPayload>;
};


export type MutationCreateAkashaAppArgs = {
  input: CreateAkashaAppInput;
};


export type MutationCreateAkashaAppReleaseArgs = {
  input: CreateAkashaAppReleaseInput;
};


export type MutationCreateAkashaAppsStreamArgs = {
  input: CreateAkashaAppsStreamInput;
};


export type MutationCreateAkashaBeamArgs = {
  input: CreateAkashaBeamInput;
};


export type MutationCreateAkashaBeamStreamArgs = {
  input: CreateAkashaBeamStreamInput;
};


export type MutationCreateAkashaBlockStorageArgs = {
  input: CreateAkashaBlockStorageInput;
};


export type MutationCreateAkashaContentBlockArgs = {
  input: CreateAkashaContentBlockInput;
};


export type MutationCreateAkashaContentBlockStreamArgs = {
  input: CreateAkashaContentBlockStreamInput;
};


export type MutationCreateAkashaFollowArgs = {
  input: CreateAkashaFollowInput;
};


export type MutationCreateAkashaInterestsStreamArgs = {
  input: CreateAkashaInterestsStreamInput;
};


export type MutationCreateAkashaProfileArgs = {
  input: CreateAkashaProfileInput;
};


export type MutationCreateAkashaProfileInterestsArgs = {
  input: CreateAkashaProfileInterestsInput;
};


export type MutationCreateAkashaProfileStreamArgs = {
  input: CreateAkashaProfileStreamInput;
};


export type MutationCreateAkashaReflectArgs = {
  input: CreateAkashaReflectInput;
};


export type MutationCreateAkashaReflectStreamArgs = {
  input: CreateAkashaReflectStreamInput;
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
  id: Scalars['ID'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

export type PartialAkashaAppInput = {
  applicationType?: InputMaybe<AkashaAppApplicationType>;
  contributors?: InputMaybe<Array<InputMaybe<Scalars['DID']>>>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  keywords?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  licence?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type PartialAkashaAppReleaseInput = {
  applicationID?: InputMaybe<Scalars['CeramicStreamID']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  source?: InputMaybe<Scalars['InterPlanetaryCID']>;
  version?: InputMaybe<Scalars['String']>;
};

export type PartialAkashaAppsStreamInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  applicationID?: InputMaybe<Scalars['CeramicStreamID']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  moderationID?: InputMaybe<Scalars['CeramicStreamID']>;
  status?: InputMaybe<AkashaAppsStreamModerationStatus>;
};

export type PartialAkashaBeamInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  content?: InputMaybe<Array<InputMaybe<AkashaBeamBlockRecordInput>>>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  embeddedBeam?: InputMaybe<AkashaBeamEmbeddedTypeInput>;
  mentions?: InputMaybe<Array<InputMaybe<Scalars['CeramicStreamID']>>>;
  nsfw?: InputMaybe<Scalars['Boolean']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PartialAkashaBeamStreamInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  beamID?: InputMaybe<Scalars['CeramicStreamID']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  moderationID?: InputMaybe<Scalars['CeramicStreamID']>;
  status?: InputMaybe<AkashaBeamStreamModerationStatus>;
};

export type PartialAkashaBlockStorageInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  appVersionID?: InputMaybe<Scalars['CeramicStreamID']>;
  blockID?: InputMaybe<Scalars['CeramicStreamID']>;
  content?: InputMaybe<Array<InputMaybe<AkashaBlockStorageLabeledValueInput>>>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  kind?: InputMaybe<AkashaBlockStorageBlockStorageDef>;
};

export type PartialAkashaContentBlockInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  appVersionID?: InputMaybe<Scalars['CeramicStreamID']>;
  content?: InputMaybe<Array<InputMaybe<AkashaContentBlockLabeledValueInput>>>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  kind?: InputMaybe<AkashaContentBlockBlockDef>;
  nsfw?: InputMaybe<Scalars['Boolean']>;
};

export type PartialAkashaContentBlockStreamInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  beamID?: InputMaybe<Scalars['CeramicStreamID']>;
  blockID?: InputMaybe<Scalars['CeramicStreamID']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  moderationID?: InputMaybe<Scalars['CeramicStreamID']>;
  status?: InputMaybe<AkashaContentBlockStreamModerationStatus>;
};

export type PartialAkashaFollowInput = {
  isFollowing?: InputMaybe<Scalars['Boolean']>;
  profileID?: InputMaybe<Scalars['CeramicStreamID']>;
};

export type PartialAkashaInterestsStreamInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  labelType?: InputMaybe<Scalars['String']>;
  moderationID?: InputMaybe<Scalars['CeramicStreamID']>;
  status?: InputMaybe<AkashaInterestsStreamModerationStatus>;
  value?: InputMaybe<Scalars['String']>;
};

export type PartialAkashaProfileInput = {
  avatar?: InputMaybe<AkashaProfileImageVersionsInput>;
  background?: InputMaybe<AkashaProfileImageVersionsInput>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  links?: InputMaybe<Array<InputMaybe<AkashaProfileLinkSourceInput>>>;
  name?: InputMaybe<Scalars['String']>;
  nsfw?: InputMaybe<Scalars['Boolean']>;
};

export type PartialAkashaProfileInterestsInput = {
  topics?: InputMaybe<Array<InputMaybe<AkashaProfileInterestsLabeledInput>>>;
};

export type PartialAkashaProfileStreamInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  moderationID?: InputMaybe<Scalars['CeramicStreamID']>;
  profileID?: InputMaybe<Scalars['CeramicStreamID']>;
  status?: InputMaybe<AkashaProfileStreamModerationStatus>;
};

export type PartialAkashaReflectInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  beamID?: InputMaybe<Scalars['CeramicStreamID']>;
  content?: InputMaybe<Array<InputMaybe<AkashaReflectProviderValueInput>>>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  isReply?: InputMaybe<Scalars['Boolean']>;
  mentions?: InputMaybe<Array<InputMaybe<Scalars['CeramicStreamID']>>>;
  nsfw?: InputMaybe<Scalars['Boolean']>;
  reflection?: InputMaybe<Scalars['CeramicStreamID']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PartialAkashaReflectStreamInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  beamID?: InputMaybe<Scalars['CeramicStreamID']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  moderationID?: InputMaybe<Scalars['CeramicStreamID']>;
  reflectionID?: InputMaybe<Scalars['CeramicStreamID']>;
  status?: InputMaybe<AkashaReflectStreamModerationStatus>;
};

export type Query = {
  akashaAppIndex?: Maybe<AkashaAppConnection>;
  akashaAppReleaseIndex?: Maybe<AkashaAppReleaseConnection>;
  akashaAppsStreamIndex?: Maybe<AkashaAppsStreamConnection>;
  akashaBeamIndex?: Maybe<AkashaBeamConnection>;
  akashaBeamStreamIndex?: Maybe<AkashaBeamStreamConnection>;
  akashaBlockStorageIndex?: Maybe<AkashaBlockStorageConnection>;
  akashaContentBlockIndex?: Maybe<AkashaContentBlockConnection>;
  akashaContentBlockStreamIndex?: Maybe<AkashaContentBlockStreamConnection>;
  akashaFollowIndex?: Maybe<AkashaFollowConnection>;
  akashaInterestsStreamIndex?: Maybe<AkashaInterestsStreamConnection>;
  akashaProfileIndex?: Maybe<AkashaProfileConnection>;
  akashaProfileInterestsIndex?: Maybe<AkashaProfileInterestsConnection>;
  akashaProfileStreamIndex?: Maybe<AkashaProfileStreamConnection>;
  akashaReflectIndex?: Maybe<AkashaReflectConnection>;
  akashaReflectStreamIndex?: Maybe<AkashaReflectStreamConnection>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type QueryAkashaAppIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaAppFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaAppSortingInput>;
};


export type QueryAkashaAppReleaseIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaAppReleaseFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaAppReleaseSortingInput>;
};


export type QueryAkashaAppsStreamIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaAppsStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaAppsStreamSortingInput>;
};


export type QueryAkashaBeamIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaBeamFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaBeamSortingInput>;
};


export type QueryAkashaBeamStreamIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaBeamStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaBeamStreamSortingInput>;
};


export type QueryAkashaBlockStorageIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaBlockStorageFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaBlockStorageSortingInput>;
};


export type QueryAkashaContentBlockIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaContentBlockFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaContentBlockSortingInput>;
};


export type QueryAkashaContentBlockStreamIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaContentBlockStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaContentBlockStreamSortingInput>;
};


export type QueryAkashaFollowIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaFollowFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaFollowSortingInput>;
};


export type QueryAkashaInterestsStreamIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaInterestsStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaInterestsStreamSortingInput>;
};


export type QueryAkashaProfileIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaProfileFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaProfileSortingInput>;
};


export type QueryAkashaProfileInterestsIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryAkashaProfileStreamIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaProfileStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaProfileStreamSortingInput>;
};


export type QueryAkashaReflectIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaReflectFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaReflectSortingInput>;
};


export type QueryAkashaReflectStreamIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaReflectStreamFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaReflectStreamSortingInput>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type StringValueFilterInput = {
  equalTo?: InputMaybe<Scalars['String']>;
  greaterThan?: InputMaybe<Scalars['String']>;
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']>;
  in?: InputMaybe<Array<Scalars['String']>>;
  isNull?: InputMaybe<Scalars['Boolean']>;
  lessThan?: InputMaybe<Scalars['String']>;
  lessThanOrEqualTo?: InputMaybe<Scalars['String']>;
  notEqualTo?: InputMaybe<Scalars['String']>;
  notIn?: InputMaybe<Array<Scalars['String']>>;
};

export type UpdateAkashaAppInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialAkashaAppInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaAppPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaApp;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaAppPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateAkashaAppReleaseInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialAkashaAppReleaseInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaAppReleasePayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaAppRelease;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaAppReleasePayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateAkashaAppsStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialAkashaAppsStreamInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaAppsStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaAppsStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaAppsStreamPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateAkashaBeamInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialAkashaBeamInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaBeamPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaBeam;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaBeamPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateAkashaBeamStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialAkashaBeamStreamInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaBeamStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaBeamStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaBeamStreamPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateAkashaBlockStorageInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialAkashaBlockStorageInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaBlockStoragePayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaBlockStorage;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaBlockStoragePayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateAkashaContentBlockInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialAkashaContentBlockInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaContentBlockPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaContentBlock;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaContentBlockPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateAkashaContentBlockStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialAkashaContentBlockStreamInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaContentBlockStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaContentBlockStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaContentBlockStreamPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateAkashaFollowInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialAkashaFollowInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaFollowPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaFollow;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaFollowPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateAkashaInterestsStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialAkashaInterestsStreamInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaInterestsStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaInterestsStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaInterestsStreamPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateAkashaProfileInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialAkashaProfileInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaProfileInterestsInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialAkashaProfileInterestsInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaProfileInterestsPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaProfileInterests;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaProfileInterestsPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateAkashaProfilePayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaProfile;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaProfilePayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateAkashaProfileStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialAkashaProfileStreamInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaProfileStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaProfileStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaProfileStreamPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateAkashaReflectInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialAkashaReflectInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaReflectPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaReflect;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaReflectPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateAkashaReflectStreamInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialAkashaReflectStreamInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAkashaReflectStreamPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AkashaReflectStream;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAkashaReflectStreamPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateOptionsInput = {
  /** Fully replace the document contents instead of performing a shallow merge */
  replace?: InputMaybe<Scalars['Boolean']>;
  /** Only perform mutation if the document matches the provided version */
  version?: InputMaybe<Scalars['CeramicCommitID']>;
};
