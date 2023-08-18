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
  createdAt?: InputMaybe<StringValueFilterInput>;
  version?: InputMaybe<StringValueFilterInput>;
};

export type AkashaAppReleaseSortingInput = {
  createdAt?: InputMaybe<SortOrder>;
  version?: InputMaybe<SortOrder>;
};

export type AkashaAppSortingInput = {
  applicationType?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  displayName?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
};

export type AkashaBeam = Node & {
  active: Scalars['Boolean'];
  /** Account controlling the document */
  author: CeramicAccount;
  content: Array<AkashaBeamBlockRecord>;
  createdAt: Scalars['DateTime'];
  embeddedBeam?: Maybe<Scalars['CeramicStreamID']>;
  id: Scalars['ID'];
  mentions?: Maybe<Array<Maybe<Scalars['CeramicStreamID']>>>;
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
  embeddedBeam?: InputMaybe<Scalars['CeramicStreamID']>;
  mentions?: InputMaybe<Array<InputMaybe<Scalars['CeramicStreamID']>>>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type AkashaBeamObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
};

export type AkashaBeamSortingInput = {
  active?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
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
  createdAt?: InputMaybe<StringValueFilterInput>;
  kind?: InputMaybe<AkashaContentBlockBlockDefValueFilterInput>;
};

export type AkashaContentBlockSortingInput = {
  active?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  kind?: InputMaybe<SortOrder>;
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
};

export type AkashaFollowSortingInput = {
  isFollowing?: InputMaybe<SortOrder>;
};

export type AkashaProfile = Node & {
  avatar?: Maybe<AkashaProfileImageVersions>;
  background?: Maybe<AkashaProfileImageVersions>;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  /** Account controlling the document */
  did: CeramicAccount;
  followers: AkashaFollowConnection;
  id: Scalars['ID'];
  links?: Maybe<Array<Maybe<AkashaProfileLinkSource>>>;
  name: Scalars['String'];
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
};

export type AkashaProfileSortingInput = {
  createdAt?: InputMaybe<SortOrder>;
  name?: InputMaybe<SortOrder>;
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
  reflection?: InputMaybe<Scalars['CeramicStreamID']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type AkashaReflectObjectFilterInput = {
  active?: InputMaybe<BooleanValueFilterInput>;
  createdAt?: InputMaybe<StringValueFilterInput>;
  isReply?: InputMaybe<BooleanValueFilterInput>;
  reflection?: InputMaybe<StringValueFilterInput>;
};

export type AkashaReflectProviderValue = {
  property: Scalars['String'];
  provider: Scalars['String'];
  value: Scalars['String'];
};

export type AkashaReflectProviderValueInput = {
  property: Scalars['String'];
  provider: Scalars['String'];
  value: Scalars['String'];
};

export type AkashaReflectSortingInput = {
  active?: InputMaybe<SortOrder>;
  createdAt?: InputMaybe<SortOrder>;
  isReply?: InputMaybe<SortOrder>;
  reflection?: InputMaybe<SortOrder>;
};

export type BooleanValueFilterInput = {
  equalTo?: InputMaybe<Scalars['Boolean']>;
  isNull?: InputMaybe<Scalars['Boolean']>;
};

export type CeramicAccount = Node & {
  akashaAppList?: Maybe<AkashaAppConnection>;
  akashaAppReleaseList?: Maybe<AkashaAppReleaseConnection>;
  akashaBeamList?: Maybe<AkashaBeamConnection>;
  akashaBlockStorageList?: Maybe<AkashaBlockStorageConnection>;
  akashaContentBlockList?: Maybe<AkashaContentBlockConnection>;
  akashaFollowList?: Maybe<AkashaFollowConnection>;
  akashaProfile?: Maybe<AkashaProfile>;
  akashaProfileInterests?: Maybe<AkashaProfileInterests>;
  akashaReflectList?: Maybe<AkashaReflectConnection>;
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


export type CeramicAccountAkashaBeamListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaBeamFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaBeamSortingInput>;
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


export type CeramicAccountAkashaFollowListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaFollowFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaFollowSortingInput>;
};


export type CeramicAccountAkashaReflectListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaReflectFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaReflectSortingInput>;
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

export type Mutation = {
  createAkashaApp?: Maybe<CreateAkashaAppPayload>;
  createAkashaAppRelease?: Maybe<CreateAkashaAppReleasePayload>;
  createAkashaBeam?: Maybe<CreateAkashaBeamPayload>;
  createAkashaBlockStorage?: Maybe<CreateAkashaBlockStoragePayload>;
  createAkashaContentBlock?: Maybe<CreateAkashaContentBlockPayload>;
  createAkashaFollow?: Maybe<CreateAkashaFollowPayload>;
  createAkashaProfile?: Maybe<CreateAkashaProfilePayload>;
  createAkashaProfileInterests?: Maybe<CreateAkashaProfileInterestsPayload>;
  createAkashaReflect?: Maybe<CreateAkashaReflectPayload>;
  updateAkashaApp?: Maybe<UpdateAkashaAppPayload>;
  updateAkashaAppRelease?: Maybe<UpdateAkashaAppReleasePayload>;
  updateAkashaBeam?: Maybe<UpdateAkashaBeamPayload>;
  updateAkashaBlockStorage?: Maybe<UpdateAkashaBlockStoragePayload>;
  updateAkashaContentBlock?: Maybe<UpdateAkashaContentBlockPayload>;
  updateAkashaFollow?: Maybe<UpdateAkashaFollowPayload>;
  updateAkashaProfile?: Maybe<UpdateAkashaProfilePayload>;
  updateAkashaProfileInterests?: Maybe<UpdateAkashaProfileInterestsPayload>;
  updateAkashaReflect?: Maybe<UpdateAkashaReflectPayload>;
};


export type MutationCreateAkashaAppArgs = {
  input: CreateAkashaAppInput;
};


export type MutationCreateAkashaAppReleaseArgs = {
  input: CreateAkashaAppReleaseInput;
};


export type MutationCreateAkashaBeamArgs = {
  input: CreateAkashaBeamInput;
};


export type MutationCreateAkashaBlockStorageArgs = {
  input: CreateAkashaBlockStorageInput;
};


export type MutationCreateAkashaContentBlockArgs = {
  input: CreateAkashaContentBlockInput;
};


export type MutationCreateAkashaFollowArgs = {
  input: CreateAkashaFollowInput;
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


export type MutationUpdateAkashaAppArgs = {
  input: UpdateAkashaAppInput;
};


export type MutationUpdateAkashaAppReleaseArgs = {
  input: UpdateAkashaAppReleaseInput;
};


export type MutationUpdateAkashaBeamArgs = {
  input: UpdateAkashaBeamInput;
};


export type MutationUpdateAkashaBlockStorageArgs = {
  input: UpdateAkashaBlockStorageInput;
};


export type MutationUpdateAkashaContentBlockArgs = {
  input: UpdateAkashaContentBlockInput;
};


export type MutationUpdateAkashaFollowArgs = {
  input: UpdateAkashaFollowInput;
};


export type MutationUpdateAkashaProfileArgs = {
  input: UpdateAkashaProfileInput;
};


export type MutationUpdateAkashaProfileInterestsArgs = {
  input: UpdateAkashaProfileInterestsInput;
};


export type MutationUpdateAkashaReflectArgs = {
  input: UpdateAkashaReflectInput;
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

export type PartialAkashaBeamInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  content?: InputMaybe<Array<InputMaybe<AkashaBeamBlockRecordInput>>>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  embeddedBeam?: InputMaybe<Scalars['CeramicStreamID']>;
  mentions?: InputMaybe<Array<InputMaybe<Scalars['CeramicStreamID']>>>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
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
};

export type PartialAkashaFollowInput = {
  isFollowing?: InputMaybe<Scalars['Boolean']>;
  profileID?: InputMaybe<Scalars['CeramicStreamID']>;
};

export type PartialAkashaProfileInput = {
  avatar?: InputMaybe<AkashaProfileImageVersionsInput>;
  background?: InputMaybe<AkashaProfileImageVersionsInput>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  links?: InputMaybe<Array<InputMaybe<AkashaProfileLinkSourceInput>>>;
  name?: InputMaybe<Scalars['String']>;
};

export type PartialAkashaProfileInterestsInput = {
  topics?: InputMaybe<Array<InputMaybe<AkashaProfileInterestsLabeledInput>>>;
};

export type PartialAkashaReflectInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  beamID?: InputMaybe<Scalars['CeramicStreamID']>;
  content?: InputMaybe<Array<InputMaybe<AkashaReflectProviderValueInput>>>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  isReply?: InputMaybe<Scalars['Boolean']>;
  mentions?: InputMaybe<Array<InputMaybe<Scalars['CeramicStreamID']>>>;
  reflection?: InputMaybe<Scalars['CeramicStreamID']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type Query = {
  akashaAppIndex?: Maybe<AkashaAppConnection>;
  akashaAppReleaseIndex?: Maybe<AkashaAppReleaseConnection>;
  akashaBeamIndex?: Maybe<AkashaBeamConnection>;
  akashaBlockStorageIndex?: Maybe<AkashaBlockStorageConnection>;
  akashaContentBlockIndex?: Maybe<AkashaContentBlockConnection>;
  akashaFollowIndex?: Maybe<AkashaFollowConnection>;
  akashaProfileIndex?: Maybe<AkashaProfileConnection>;
  akashaProfileInterestsIndex?: Maybe<AkashaProfileInterestsConnection>;
  akashaReflectIndex?: Maybe<AkashaReflectConnection>;
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


export type QueryAkashaBeamIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaBeamFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaBeamSortingInput>;
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


export type QueryAkashaFollowIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaFollowFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaFollowSortingInput>;
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


export type QueryAkashaReflectIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<AkashaReflectFiltersInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  sorting?: InputMaybe<AkashaReflectSortingInput>;
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

export type UpdateOptionsInput = {
  /** Fully replace the document contents instead of performing a shallow merge */
  replace?: InputMaybe<Scalars['Boolean']>;
  /** Only perform mutation if the document matches the provided version */
  version?: InputMaybe<Scalars['CeramicCommitID']>;
};
