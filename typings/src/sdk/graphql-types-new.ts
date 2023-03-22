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

export type AppIntegration = Node & {
  /** Account controlling the document */
  author: CeramicAccount;
  contributors?: Maybe<Array<Maybe<CeramicAccount>>>;
  description: Scalars['String'];
  displayName: Scalars['String'];
  id: Scalars['ID'];
  integrationType?: Maybe<AppIntegrationIntegrationType>;
  keywords?: Maybe<Array<Maybe<Scalars['String']>>>;
  licence: Scalars['String'];
  name: Scalars['String'];
  releases: AppReleaseConnection;
  releasessCount: Scalars['Int'];
};


export type AppIntegrationReleasesArgs = {
  account?: InputMaybe<Scalars['ID']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type AppIntegrationReleasessCountArgs = {
  account?: InputMaybe<Scalars['ID']>;
};

/** A connection to a list of items. */
export type AppIntegrationConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<AppIntegrationEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type AppIntegrationEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<AppIntegration>;
};

export type AppIntegrationInput = {
  contributors?: InputMaybe<Array<InputMaybe<Scalars['DID']>>>;
  description: Scalars['String'];
  displayName: Scalars['String'];
  integrationType?: InputMaybe<AppIntegrationIntegrationType>;
  keywords?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  licence: Scalars['String'];
  name: Scalars['String'];
};

export enum AppIntegrationIntegrationType {
  App = 'APP',
  Other = 'OTHER',
  Plugin = 'PLUGIN',
  Widget = 'WIDGET'
}

export type AppRelease = Node & {
  id: Scalars['ID'];
  integration?: Maybe<AppIntegration>;
  integrationID: Scalars['CeramicStreamID'];
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
  integrationID: Scalars['CeramicStreamID'];
  source: Scalars['InterPlanetaryCID'];
  version: Scalars['String'];
};

export type CeramicAccount = Node & {
  appIntegrationList?: Maybe<AppIntegrationConnection>;
  appReleaseList?: Maybe<AppReleaseConnection>;
  commentList?: Maybe<CommentConnection>;
  commentReplyList?: Maybe<CommentReplyConnection>;
  followList?: Maybe<FollowConnection>;
  /** Globally unique identifier of the account (DID string) */
  id: Scalars['ID'];
  interests?: Maybe<Interests>;
  /** Whether the Ceramic instance is currently authenticated with this account or not */
  isViewer: Scalars['Boolean'];
  postList?: Maybe<PostConnection>;
  postQuoteList?: Maybe<PostQuoteConnection>;
  profile?: Maybe<Profile>;
  profileMentionList?: Maybe<ProfileMentionConnection>;
};


export type CeramicAccountAppIntegrationListArgs = {
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


export type CeramicAccountCommentListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type CeramicAccountCommentReplyListArgs = {
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


export type CeramicAccountPostListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type CeramicAccountPostQuoteListArgs = {
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

export type Comment = Node & {
  active: Scalars['Boolean'];
  /** Account controlling the document */
  author: CeramicAccount;
  content: Array<CommentProviderValue>;
  id: Scalars['ID'];
  isReply: Scalars['Boolean'];
  post?: Maybe<Post>;
  postID: Scalars['CeramicStreamID'];
  replies: CommentReplyConnection;
  repliesCount: Scalars['Int'];
  /** Current version of the document */
  version: Scalars['CeramicCommitID'];
};


export type CommentRepliesArgs = {
  account?: InputMaybe<Scalars['ID']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type CommentRepliesCountArgs = {
  account?: InputMaybe<Scalars['ID']>;
};

/** A connection to a list of items. */
export type CommentConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<CommentEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type CommentEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Comment>;
};

export type CommentInput = {
  active: Scalars['Boolean'];
  content: Array<InputMaybe<CommentProviderValueInput>>;
  isReply: Scalars['Boolean'];
  postID: Scalars['CeramicStreamID'];
};

export type CommentProviderValue = {
  property: Scalars['String'];
  provider: Scalars['String'];
  value: Scalars['String'];
};

export type CommentProviderValueInput = {
  property: Scalars['String'];
  provider: Scalars['String'];
  value: Scalars['String'];
};

export type CommentReply = Node & {
  active: Scalars['Boolean'];
  comment?: Maybe<Comment>;
  commentID: Scalars['CeramicStreamID'];
  id: Scalars['ID'];
  reply?: Maybe<Comment>;
  replyID: Scalars['CeramicStreamID'];
};

/** A connection to a list of items. */
export type CommentReplyConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<CommentReplyEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type CommentReplyEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<CommentReply>;
};

export type CommentReplyInput = {
  active: Scalars['Boolean'];
  commentID: Scalars['CeramicStreamID'];
  replyID: Scalars['CeramicStreamID'];
};

export type CreateAppIntegrationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: AppIntegrationInput;
};

export type CreateAppIntegrationPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AppIntegration;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateAppIntegrationPayloadNodeArgs = {
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

export type CreateCommentInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: CommentInput;
};

export type CreateCommentPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: Comment;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateCommentPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreateCommentReplyInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: CommentReplyInput;
};

export type CreateCommentReplyPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: CommentReply;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreateCommentReplyPayloadNodeArgs = {
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

export type CreatePostInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PostInput;
};

export type CreatePostPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: Post;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreatePostPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type CreatePostQuoteInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PostQuoteInput;
};

export type CreatePostQuotePayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: PostQuote;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type CreatePostQuotePayloadNodeArgs = {
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
  createAppIntegration?: Maybe<CreateAppIntegrationPayload>;
  createAppRelease?: Maybe<CreateAppReleasePayload>;
  createComment?: Maybe<CreateCommentPayload>;
  createCommentReply?: Maybe<CreateCommentReplyPayload>;
  createFollow?: Maybe<CreateFollowPayload>;
  createInterests?: Maybe<CreateInterestsPayload>;
  createPost?: Maybe<CreatePostPayload>;
  createPostQuote?: Maybe<CreatePostQuotePayload>;
  createProfile?: Maybe<CreateProfilePayload>;
  createProfileMention?: Maybe<CreateProfileMentionPayload>;
  updateAppIntegration?: Maybe<UpdateAppIntegrationPayload>;
  updateAppRelease?: Maybe<UpdateAppReleasePayload>;
  updateComment?: Maybe<UpdateCommentPayload>;
  updateCommentReply?: Maybe<UpdateCommentReplyPayload>;
  updateFollow?: Maybe<UpdateFollowPayload>;
  updateInterests?: Maybe<UpdateInterestsPayload>;
  updatePost?: Maybe<UpdatePostPayload>;
  updatePostQuote?: Maybe<UpdatePostQuotePayload>;
  updateProfile?: Maybe<UpdateProfilePayload>;
  updateProfileMention?: Maybe<UpdateProfileMentionPayload>;
};


export type MutationCreateAppIntegrationArgs = {
  input: CreateAppIntegrationInput;
};


export type MutationCreateAppReleaseArgs = {
  input: CreateAppReleaseInput;
};


export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};


export type MutationCreateCommentReplyArgs = {
  input: CreateCommentReplyInput;
};


export type MutationCreateFollowArgs = {
  input: CreateFollowInput;
};


export type MutationCreateInterestsArgs = {
  input: CreateInterestsInput;
};


export type MutationCreatePostArgs = {
  input: CreatePostInput;
};


export type MutationCreatePostQuoteArgs = {
  input: CreatePostQuoteInput;
};


export type MutationCreateProfileArgs = {
  input: CreateProfileInput;
};


export type MutationCreateProfileMentionArgs = {
  input: CreateProfileMentionInput;
};


export type MutationUpdateAppIntegrationArgs = {
  input: UpdateAppIntegrationInput;
};


export type MutationUpdateAppReleaseArgs = {
  input: UpdateAppReleaseInput;
};


export type MutationUpdateCommentArgs = {
  input: UpdateCommentInput;
};


export type MutationUpdateCommentReplyArgs = {
  input: UpdateCommentReplyInput;
};


export type MutationUpdateFollowArgs = {
  input: UpdateFollowInput;
};


export type MutationUpdateInterestsArgs = {
  input: UpdateInterestsInput;
};


export type MutationUpdatePostArgs = {
  input: UpdatePostInput;
};


export type MutationUpdatePostQuoteArgs = {
  input: UpdatePostQuoteInput;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUpdateProfileMentionArgs = {
  input: UpdateProfileMentionInput;
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

export type PartialAppIntegrationInput = {
  contributors?: InputMaybe<Array<InputMaybe<Scalars['DID']>>>;
  description?: InputMaybe<Scalars['String']>;
  displayName?: InputMaybe<Scalars['String']>;
  integrationType?: InputMaybe<AppIntegrationIntegrationType>;
  keywords?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  licence?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type PartialAppReleaseInput = {
  integrationID?: InputMaybe<Scalars['CeramicStreamID']>;
  source?: InputMaybe<Scalars['InterPlanetaryCID']>;
  version?: InputMaybe<Scalars['String']>;
};

export type PartialCommentInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  content?: InputMaybe<Array<InputMaybe<CommentProviderValueInput>>>;
  isReply?: InputMaybe<Scalars['Boolean']>;
  postID?: InputMaybe<Scalars['CeramicStreamID']>;
};

export type PartialCommentReplyInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  commentID?: InputMaybe<Scalars['CeramicStreamID']>;
  replyID?: InputMaybe<Scalars['CeramicStreamID']>;
};

export type PartialFollowInput = {
  isFollowing?: InputMaybe<Scalars['Boolean']>;
  profileID?: InputMaybe<Scalars['CeramicStreamID']>;
};

export type PartialInterestsInput = {
  topics?: InputMaybe<Array<InputMaybe<InterestsLabeledInput>>>;
};

export type PartialPostInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  content?: InputMaybe<Array<InputMaybe<PostProviderValueInput>>>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PartialPostQuoteInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  postID?: InputMaybe<Scalars['CeramicStreamID']>;
  quotedPostID?: InputMaybe<Scalars['CeramicStreamID']>;
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
  postID?: InputMaybe<Scalars['CeramicStreamID']>;
  profileID?: InputMaybe<Scalars['CeramicStreamID']>;
};

export type Post = Node & {
  active: Scalars['Boolean'];
  /** Account controlling the document */
  author: CeramicAccount;
  comments: CommentConnection;
  commentsCount: Scalars['Int'];
  content: Array<PostProviderValue>;
  id: Scalars['ID'];
  mentions: ProfileMentionConnection;
  quotes: PostQuoteConnection;
  quotesCount: Scalars['Int'];
  tags?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Current version of the document */
  version: Scalars['CeramicCommitID'];
};


export type PostCommentsArgs = {
  account?: InputMaybe<Scalars['ID']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type PostCommentsCountArgs = {
  account?: InputMaybe<Scalars['ID']>;
};


export type PostMentionsArgs = {
  account?: InputMaybe<Scalars['ID']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type PostQuotesArgs = {
  account?: InputMaybe<Scalars['ID']>;
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type PostQuotesCountArgs = {
  account?: InputMaybe<Scalars['ID']>;
};

/** A connection to a list of items. */
export type PostConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<PostEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type PostEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<Post>;
};

export type PostInput = {
  active: Scalars['Boolean'];
  content: Array<InputMaybe<PostProviderValueInput>>;
  tags?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

export type PostProviderValue = {
  property: Scalars['String'];
  provider: Scalars['String'];
  value: Scalars['String'];
};

export type PostProviderValueInput = {
  property: Scalars['String'];
  provider: Scalars['String'];
  value: Scalars['String'];
};

export type PostQuote = Node & {
  active: Scalars['Boolean'];
  id: Scalars['ID'];
  post?: Maybe<Post>;
  postID: Scalars['CeramicStreamID'];
  quotedPost?: Maybe<Post>;
  quotedPostID: Scalars['CeramicStreamID'];
};

/** A connection to a list of items. */
export type PostQuoteConnection = {
  /** A list of edges. */
  edges?: Maybe<Array<Maybe<PostQuoteEdge>>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
};

/** An edge in a connection. */
export type PostQuoteEdge = {
  /** A cursor for use in pagination */
  cursor: Scalars['String'];
  /** The item at the end of the edge */
  node?: Maybe<PostQuote>;
};

export type PostQuoteInput = {
  active: Scalars['Boolean'];
  postID: Scalars['CeramicStreamID'];
  quotedPostID: Scalars['CeramicStreamID'];
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
  id: Scalars['ID'];
  post?: Maybe<Post>;
  postID: Scalars['CeramicStreamID'];
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
  postID: Scalars['CeramicStreamID'];
  profileID: Scalars['CeramicStreamID'];
};

export type Query = {
  appIntegrationIndex?: Maybe<AppIntegrationConnection>;
  appReleaseIndex?: Maybe<AppReleaseConnection>;
  commentIndex?: Maybe<CommentConnection>;
  commentReplyIndex?: Maybe<CommentReplyConnection>;
  followIndex?: Maybe<FollowConnection>;
  interestsIndex?: Maybe<InterestsConnection>;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  postIndex?: Maybe<PostConnection>;
  postQuoteIndex?: Maybe<PostQuoteConnection>;
  profileIndex?: Maybe<ProfileConnection>;
  profileMentionIndex?: Maybe<ProfileMentionConnection>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type QueryAppIntegrationIndexArgs = {
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


export type QueryCommentIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryCommentReplyIndexArgs = {
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


export type QueryPostIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryPostQuoteIndexArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
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

export type UpdateAppIntegrationInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialAppIntegrationInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateAppIntegrationPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: AppIntegration;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateAppIntegrationPayloadNodeArgs = {
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

export type UpdateCommentInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialCommentInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateCommentPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: Comment;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateCommentPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdateCommentReplyInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialCommentReplyInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdateCommentReplyPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: CommentReply;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdateCommentReplyPayloadNodeArgs = {
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

export type UpdatePostInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialPostInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdatePostPayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: Post;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdatePostPayloadNodeArgs = {
  id: Scalars['ID'];
};

export type UpdatePostQuoteInput = {
  clientMutationId?: InputMaybe<Scalars['String']>;
  content: PartialPostQuoteInput;
  id: Scalars['ID'];
  options?: InputMaybe<UpdateOptionsInput>;
};

export type UpdatePostQuotePayload = {
  clientMutationId?: Maybe<Scalars['String']>;
  document: PostQuote;
  /** Fetches an object given its ID */
  node?: Maybe<Node>;
  /** Account currently authenticated on the Ceramic instance, if set */
  viewer?: Maybe<CeramicAccount>;
};


export type UpdatePostQuotePayloadNodeArgs = {
  id: Scalars['ID'];
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
