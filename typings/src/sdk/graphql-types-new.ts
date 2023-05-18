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
  releases: AppReleaseConnection;
  releasessCount: Scalars['Int'];
};


export type AkashaAppReleasesArgs = {
  account?: InputMaybe<Scalars['ID']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type AkashaAppReleasessCountArgs = {
  account?: InputMaybe<Scalars['ID']>;
};

export enum AkashaAppApplicationType {
  App = 'APP',
  Other = 'OTHER',
  Plugin = 'PLUGIN',
  Widget = 'WIDGET'
}

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

export type AppRelease = Node & {
  application?: Maybe<AkashaApp>;
  applicationID: Scalars['CeramicStreamID'];
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  source: Scalars['InterPlanetaryCID'];
  version: Scalars['String'];
};

/** A connection to a list of items. */
export type AppReleaseConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AppReleaseEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AppReleaseEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<AppRelease>;
};

export type AppReleaseInput = {
  applicationID: Scalars['CeramicStreamID'];
  createdAt: Scalars['DateTime'];
  source: Scalars['InterPlanetaryCID'];
  version: Scalars['String'];
};

export type Beam = Node & {
  active: Scalars['Boolean'];
  /** Account controlling the document */
  author: CeramicAccount;
  content: Array<BeamProviderValue>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  mentions: ProfileMentionConnection;
  rebeams: RebeamConnection;
  rebeamsCount: Scalars['Int'];
  reflections: ReflectConnection;
  reflectionsCount: Scalars['Int'];
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Current version of the document */
  version: Scalars['CeramicCommitID'];
};


export type BeamMentionsArgs = {
  account?: InputMaybe<Scalars['ID']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type BeamRebeamsArgs = {
  account?: InputMaybe<Scalars['ID']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type BeamRebeamsCountArgs = {
  account?: InputMaybe<Scalars['ID']>;
};


export type BeamReflectionsArgs = {
  account?: InputMaybe<Scalars['ID']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type BeamReflectionsCountArgs = {
  account?: InputMaybe<Scalars['ID']>;
};

/** A connection to a list of items. */
export type BeamConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<BeamEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type BeamEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Beam>;
};

export type BeamInput = {
  active: Scalars['Boolean'];
  content: Array<InputMaybe<BeamProviderValueInput>>;
  createdAt: Scalars['DateTime'];
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type BeamProviderValue = {
  property: Scalars['String'];
  provider: Scalars['String'];
  value: Scalars['String'];
};

export type BeamProviderValueInput = {
  property: Scalars['String'];
  provider: Scalars['String'];
  value: Scalars['String'];
};

export type CeramicAccount = Node & {
  akashaAppList?: Maybe<AkashaAppConnection>;
  appReleaseList?: Maybe<AppReleaseConnection>;
  beamList?: Maybe<BeamConnection>;
  followList?: Maybe<FollowConnection>;
  /** Globally unique identifier of the account (DID string) */
  id: Scalars['ID'];
  interests?: Maybe<Interests>;
  /** Whether the Ceramic instance is currently authenticated with this account or not */
  isViewer: Scalars['Boolean'];
  profile?: Maybe<Profile>;
  profileMentionList?: Maybe<ProfileMentionConnection>;
  rebeamList?: Maybe<RebeamConnection>;
  reflectList?: Maybe<ReflectConnection>;
  reflectionList?: Maybe<ReflectionConnection>;
};


export type CeramicAccountAkashaAppListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type CeramicAccountAppReleaseListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type CeramicAccountBeamListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type CeramicAccountFollowListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type CeramicAccountProfileMentionListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type CeramicAccountRebeamListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type CeramicAccountReflectListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type CeramicAccountReflectionListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
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

export type CreateAppReleaseInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: AppReleaseInput;
};

export type CreateAppReleasePayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AppRelease;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAppReleasePayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateBeamInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: BeamInput;
};

export type CreateBeamPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: Beam;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateBeamPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateFollowInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: FollowInput;
};

export type CreateFollowPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: Follow;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateFollowPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateInterestsInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: InterestsInput;
};

export type CreateInterestsPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: Interests;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateInterestsPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateProfileInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: ProfileInput;
};

export type CreateProfileMentionInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: ProfileMentionInput;
};

export type CreateProfileMentionPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: ProfileMention;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateProfileMentionPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateProfilePayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: Profile;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateProfilePayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateRebeamInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: RebeamInput;
};

export type CreateRebeamPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: Rebeam;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateRebeamPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateReflectInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: ReflectInput;
};

export type CreateReflectPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: Reflect;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateReflectPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateReflectionInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: ReflectionInput;
};

export type CreateReflectionPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: Reflection;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateReflectionPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type Follow = Node & {
  /** Account controlling the document */
  did: CeramicAccount;
  id: Scalars['ID'];
  isFollowing: Scalars['Boolean'];
  profile?: Maybe<Profile>;
  profileID: Scalars['CeramicStreamID'];
};

/** A connection to a list of items. */
export type FollowConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<FollowEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type FollowEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Follow>;
};

export type FollowInput = {
  isFollowing: Scalars['Boolean'];
  profileID: Scalars['CeramicStreamID'];
};

export type Interests = Node & {
  /** Account controlling the document */
  did: CeramicAccount;
  id: Scalars['ID'];
  topics: Array<InterestsLabeled>;
};

/** A connection to a list of items. */
export type InterestsConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<InterestsEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type InterestsEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Interests>;
};

export type InterestsInput = {
  topics: Array<InputMaybe<InterestsLabeledInput>>;
};

export type InterestsLabeled = {
  labelType: Scalars['String'];
  value: Scalars['String'];
};

export type InterestsLabeledInput = {
  labelType: Scalars['String'];
  value: Scalars['String'];
};

export type Mutation = {
  createAkashaApp?: Maybe<CreateAkashaAppPayload>;
  createAppRelease?: Maybe<CreateAppReleasePayload>;
  createBeam?: Maybe<CreateBeamPayload>;
  createFollow?: Maybe<CreateFollowPayload>;
  createInterests?: Maybe<CreateInterestsPayload>;
  createProfile?: Maybe<CreateProfilePayload>;
  createProfileMention?: Maybe<CreateProfileMentionPayload>;
  createRebeam?: Maybe<CreateRebeamPayload>;
  createReflect?: Maybe<CreateReflectPayload>;
  createReflection?: Maybe<CreateReflectionPayload>;
  updateAkashaApp?: Maybe<UpdateAkashaAppPayload>;
  updateAppRelease?: Maybe<UpdateAppReleasePayload>;
  updateBeam?: Maybe<UpdateBeamPayload>;
  updateFollow?: Maybe<UpdateFollowPayload>;
  updateInterests?: Maybe<UpdateInterestsPayload>;
  updateProfile?: Maybe<UpdateProfilePayload>;
  updateProfileMention?: Maybe<UpdateProfileMentionPayload>;
  updateRebeam?: Maybe<UpdateRebeamPayload>;
  updateReflect?: Maybe<UpdateReflectPayload>;
  updateReflection?: Maybe<UpdateReflectionPayload>;
};


export type MutationCreateAkashaAppArgs = {
  input: CreateAkashaAppInput;
};


export type MutationCreateAppReleaseArgs = {
  input: CreateAppReleaseInput;
};


export type MutationCreateBeamArgs = {
  input: CreateBeamInput;
};


export type MutationCreateFollowArgs = {
  input: CreateFollowInput;
};


export type MutationCreateInterestsArgs = {
  input: CreateInterestsInput;
};


export type MutationCreateProfileArgs = {
  input: CreateProfileInput;
};


export type MutationCreateProfileMentionArgs = {
  input: CreateProfileMentionInput;
};


export type MutationCreateRebeamArgs = {
  input: CreateRebeamInput;
};


export type MutationCreateReflectArgs = {
  input: CreateReflectInput;
};


export type MutationCreateReflectionArgs = {
  input: CreateReflectionInput;
};


export type MutationUpdateAkashaAppArgs = {
  input: UpdateAkashaAppInput;
};


export type MutationUpdateAppReleaseArgs = {
  input: UpdateAppReleaseInput;
};


export type MutationUpdateBeamArgs = {
  input: UpdateBeamInput;
};


export type MutationUpdateFollowArgs = {
  input: UpdateFollowInput;
};


export type MutationUpdateInterestsArgs = {
  input: UpdateInterestsInput;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUpdateProfileMentionArgs = {
  input: UpdateProfileMentionInput;
};


export type MutationUpdateRebeamArgs = {
  input: UpdateRebeamInput;
};


export type MutationUpdateReflectArgs = {
  input: UpdateReflectInput;
};


export type MutationUpdateReflectionArgs = {
  input: UpdateReflectionInput;
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

export type PartialAppReleaseInput = {
  applicationID?: InputMaybe<Scalars['CeramicStreamID']>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  source?: InputMaybe<Scalars['InterPlanetaryCID']>;
  version?: InputMaybe<Scalars['String']>;
};

export type PartialBeamInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  content?: InputMaybe<Array<InputMaybe<BeamProviderValueInput>>>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PartialFollowInput = {
  isFollowing?: InputMaybe<Scalars['Boolean']>;
  profileID?: InputMaybe<Scalars['CeramicStreamID']>;
};

export type PartialInterestsInput = {
  topics?: InputMaybe<Array<InputMaybe<InterestsLabeledInput>>>;
};

export type PartialProfileInput = {
  avatar?: InputMaybe<ProfileImageVersionsInput>;
  background?: InputMaybe<ProfileImageVersionsInput>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  description?: InputMaybe<Scalars['String']>;
  links?: InputMaybe<Array<InputMaybe<ProfileLinkSourceInput>>>;
  name?: InputMaybe<Scalars['String']>;
};

export type PartialProfileMentionInput = {
  beamID?: InputMaybe<Scalars['CeramicStreamID']>;
  profileID?: InputMaybe<Scalars['CeramicStreamID']>;
};

export type PartialRebeamInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  beamID?: InputMaybe<Scalars['CeramicStreamID']>;
  quotedBeamID?: InputMaybe<Scalars['CeramicStreamID']>;
};

export type PartialReflectInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  beamID?: InputMaybe<Scalars['CeramicStreamID']>;
  content?: InputMaybe<Array<InputMaybe<ReflectProviderValueInput>>>;
  createdAt?: InputMaybe<Scalars['DateTime']>;
  isReply?: InputMaybe<Scalars['Boolean']>;
};

export type PartialReflectionInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  reflectID?: InputMaybe<Scalars['CeramicStreamID']>;
  reflectionID?: InputMaybe<Scalars['CeramicStreamID']>;
};

export type Profile = Node & {
  avatar?: Maybe<ProfileImageVersions>;
  background?: Maybe<ProfileImageVersions>;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  /** Account controlling the document */
  did: CeramicAccount;
  followers: FollowConnection;
  id: Scalars['ID'];
  links?: Maybe<Array<Maybe<ProfileLinkSource>>>;
  name: Scalars['String'];
};


export type ProfileFollowersArgs = {
  account?: InputMaybe<Scalars['ID']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

/** A connection to a list of items. */
export type ProfileConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ProfileEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ProfileEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Profile>;
};

export type ProfileImageSource = {
  height: Scalars['Int'];
  src: Scalars['URI'];
  width: Scalars['Int'];
};

export type ProfileImageSourceInput = {
  height: Scalars['Int'];
  src: Scalars['URI'];
  width: Scalars['Int'];
};

export type ProfileImageVersions = {
  alternatives?: Maybe<Array<Maybe<ProfileImageSource>>>;
  default: ProfileImageSource;
};

export type ProfileImageVersionsInput = {
  alternatives?: InputMaybe<Array<InputMaybe<ProfileImageSourceInput>>>;
  default: ProfileImageSourceInput;
};

export type ProfileInput = {
  avatar?: InputMaybe<ProfileImageVersionsInput>;
  background?: InputMaybe<ProfileImageVersionsInput>;
  createdAt: Scalars['DateTime'];
  description?: InputMaybe<Scalars['String']>;
  links?: InputMaybe<Array<InputMaybe<ProfileLinkSourceInput>>>;
  name: Scalars['String'];
};

export type ProfileLinkSource = {
  href: Scalars['URI'];
  label?: Maybe<Scalars['String']>;
};

export type ProfileLinkSourceInput = {
  href: Scalars['URI'];
  label?: InputMaybe<Scalars['String']>;
};

export type ProfileMention = Node & {
  beam?: Maybe<Beam>;
  beamID: Scalars['CeramicStreamID'];
  id: Scalars['ID'];
  profile?: Maybe<Profile>;
  profileID: Scalars['CeramicStreamID'];
};

/** A connection to a list of items. */
export type ProfileMentionConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ProfileMentionEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ProfileMentionEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<ProfileMention>;
};

export type ProfileMentionInput = {
  beamID: Scalars['CeramicStreamID'];
  profileID: Scalars['CeramicStreamID'];
};

export type Query = {
  akashaAppIndex?: Maybe<AkashaAppConnection>;
  appReleaseIndex?: Maybe<AppReleaseConnection>;
  beamIndex?: Maybe<BeamConnection>;
  followIndex?: Maybe<FollowConnection>;
  interestsIndex?: Maybe<InterestsConnection>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  profileIndex?: Maybe<ProfileConnection>;
  profileMentionIndex?: Maybe<ProfileMentionConnection>;
  rebeamIndex?: Maybe<RebeamConnection>;
  reflectIndex?: Maybe<ReflectConnection>;
  reflectionIndex?: Maybe<ReflectionConnection>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type QueryAkashaAppIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryAppReleaseIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryBeamIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryFollowIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryInterestsIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};


export type QueryProfileIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryProfileMentionIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryRebeamIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryReflectIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryReflectionIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};

export type Rebeam = Node & {
  active: Scalars['Boolean'];
  beam?: Maybe<Beam>;
  beamID: Scalars['CeramicStreamID'];
  id: Scalars['ID'];
  quotedBeam?: Maybe<Beam>;
  quotedBeamID: Scalars['CeramicStreamID'];
};

/** A connection to a list of items. */
export type RebeamConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<RebeamEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type RebeamEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Rebeam>;
};

export type RebeamInput = {
  active: Scalars['Boolean'];
  beamID: Scalars['CeramicStreamID'];
  quotedBeamID: Scalars['CeramicStreamID'];
};

export type Reflect = Node & {
  active: Scalars['Boolean'];
  /** Account controlling the document */
  author: CeramicAccount;
  beam?: Maybe<Beam>;
  beamID: Scalars['CeramicStreamID'];
  content: Array<ReflectProviderValue>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  isReply: Scalars['Boolean'];
  reflections: ReflectionConnection;
  reflectionsCount: Scalars['Int'];
  /** Current version of the document */
  version: Scalars['CeramicCommitID'];
};


export type ReflectReflectionsArgs = {
  account?: InputMaybe<Scalars['ID']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type ReflectReflectionsCountArgs = {
  account?: InputMaybe<Scalars['ID']>;
};

/** A connection to a list of items. */
export type ReflectConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ReflectEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ReflectEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Reflect>;
};

export type ReflectInput = {
  active: Scalars['Boolean'];
  beamID: Scalars['CeramicStreamID'];
  content: Array<InputMaybe<ReflectProviderValueInput>>;
  createdAt: Scalars['DateTime'];
  isReply: Scalars['Boolean'];
};

export type ReflectProviderValue = {
  property: Scalars['String'];
  provider: Scalars['String'];
  value: Scalars['String'];
};

export type ReflectProviderValueInput = {
  property: Scalars['String'];
  provider: Scalars['String'];
  value: Scalars['String'];
};

export type Reflection = Node & {
  active: Scalars['Boolean'];
  id: Scalars['ID'];
  reflect?: Maybe<Reflect>;
  reflectID: Scalars['CeramicStreamID'];
  reflection?: Maybe<Reflect>;
  reflectionID: Scalars['CeramicStreamID'];
};

/** A connection to a list of items. */
export type ReflectionConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<ReflectionEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type ReflectionEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Reflection>;
};

export type ReflectionInput = {
  active: Scalars['Boolean'];
  reflectID: Scalars['CeramicStreamID'];
  reflectionID: Scalars['CeramicStreamID'];
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

export type UpdateAppReleaseInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialAppReleaseInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAppReleasePayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AppRelease;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAppReleasePayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateBeamInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialBeamInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateBeamPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: Beam;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateBeamPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateFollowInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialFollowInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateFollowPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: Follow;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateFollowPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateInterestsInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialInterestsInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateInterestsPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: Interests;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateInterestsPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateOptionsInput = {
  /** Fully replace the document contents instead of performing a shallow merge */
  replace?: InputMaybe<Scalars['Boolean']>;
  /** Only perform mutation if the document matches the provided version */
  version?: InputMaybe<Scalars['CeramicCommitID']>;
};

export type UpdateProfileInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialProfileInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateProfileMentionInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialProfileMentionInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateProfileMentionPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: ProfileMention;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateProfileMentionPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateProfilePayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: Profile;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateProfilePayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateRebeamInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialRebeamInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateRebeamPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: Rebeam;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateRebeamPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateReflectInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialReflectInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateReflectPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: Reflect;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateReflectPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateReflectionInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialReflectionInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateReflectionPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: Reflection;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateReflectionPayloadNodeArgs = {
  id: Scalars['ID'];
};
