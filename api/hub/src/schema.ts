import { gql } from 'apollo-server-koa';

const typeDefs = gql`
  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
    inheritMaxAge: Boolean
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

  type TagsResult @cacheControl(maxAge: 60) {
    results: [Tag!]
    nextIndex: String
    total: Int
  }
  type PostsResult @cacheControl(maxAge: 60) {
    results: [Post!]
    nextIndex: String
    total: Int
  }
  type ProfilesResult @cacheControl(maxAge: 60) {
    results: [UserProfile!]
    nextIndex: Int
    total: Int
  }
  type NewPostsResult @cacheControl(maxAge: 60) {
    results: [Post!]
    nextIndex: Int
    total: Int
  }
  type CommentsResult @cacheControl(maxAge: 60) {
    results: [Comment!]
    nextIndex: String
    total: Int
  }

  type SearchTagsResult {
    name: String
    totalPosts: Int
  }
  type GlobalSearchResultItem {
    id: String
    name: String
  }
  type GlobalSearchResultTagItem {
    id: String
    name: String
    totalPosts: Int
  }
  type GlobalSearchResult {
    posts: [GlobalSearchResultItem]
    tags: [GlobalSearchResultTagItem]
    comments: [GlobalSearchResultItem]
    profiles: [GlobalSearchResultItem]
  }

  type Moderator @cacheControl(maxAge: 3600) {
    _id: ID!
    creationDate: String!
    ethAddress: String!
    admin: Boolean
    active: Boolean
  }

  type Decision @cacheControl(maxAge: 3600) {
    _id: ID!
    creationDate: String!
    contentType: String!
    contentID: String!
    moderator: UserProfile
    moderatedDate: String
    explanation: String
    reports: Int!
    reportedBy: UserProfile!
    reportedDate: String!
    reasons: [String]!
    delisted: Boolean
    moderated: Boolean
  }

  type DecisionsCount @cacheControl(maxAge: 3600) {
    pending: Int
    delisted: Int
    kept: Int
  }

  type VideoPreview @cacheControl(maxAge: 10800) {
    url: String
    secureUrl: String
    type: String
    width: String
    height: String
  }
  type LinkPreview @cacheControl(maxAge: 10800) {
    url: String
    mediaType: String
    contentType: String
    favicons: [String]
    videos: [VideoPreview]
    title: String
    siteName: String
    description: String
    images: [String]
  }

  type IntegrationInfo @cacheControl(maxAge: 3600) {
    id: String
    name: String
    author: String
    integrationType: Int
    latestReleaseId: String
    enabled: Boolean
  }

  type InfoLink @cacheControl(maxAge: 3600) {
    publicRepository: String
    documentation: String
    detailedDescription: String
  }
  type ManifestInfo @cacheControl(maxAge: 3600) {
    mainFile: String
    license: String
    description: String
    keywords: [String]
    displayName: String
  }

  type IntegrationReleaseInfo @cacheControl(maxAge: 3600) {
    id: String
    name: String
    version: String
    integrationType: Int
    links: InfoLink
    sources: [String]
    integrationID: String
    author: String
    enabled: Boolean
    manifestData: ManifestInfo
    createdAt: Int
  }

  type Query {
    getProfile(ethAddress: String!): UserProfile!
    resolveProfile(pubKey: String!): UserProfile!
    getPost(id: String!, pubKey: String): Post!
    getTag(name: String!): Tag
    searchTags(name: String!): [SearchTagsResult]
    searchProfiles(name: String!): [UserProfile]
    globalSearch(keyword: String!): GlobalSearchResult
    tags(offset: String, limit: Int): TagsResult
    posts(offset: String, limit: Int, pubKey: String): PostsResult
    isFollowing(follower: String!, following: String!): Boolean
    getComments(postID: String!, offset: String, limit: Int): CommentsResult
    getComment(commentID: String!): Comment!
    getPostsByAuthor(author: String!, offset: Int, limit: Int, pubKey: String): NewPostsResult
    getPostsByTag(tag: String!, offset: Int, limit: Int, pubKey: String): NewPostsResult
    getFollowers(pubKey: String!, limit: Int, offset: Int): ProfilesResult
    getFollowing(pubKey: String!, limit: Int, offset: Int): ProfilesResult
    getCustomFeed(limit: Int, offset: Int): NewPostsResult
    getInterests(pubKey: String!): [String]
    getLatestRelease(integrationIDs: [String]): [IntegrationReleaseInfo]
    getIntegrationInfo(integrationIDs: [String]): [IntegrationInfo]
  }

  input DataProviderInput {
    provider: String
    property: String
    value: String
  }

  type DataProvider {
    provider: String
    property: String
    value: String
  }
  input PostData {
    title: String
    tags: [String]
    quotes: [String]
    mentions: [String]
    type: PostType
  }

  input CommentData {
    postID: String
    mentions: [String]
    tags: [String]
    replyTo: String
  }

  input ReportData {
    reason: String
    explanation: String
  }

  input ReportMeta {
    contentType: String
    contentID: String
  }

  input DecisionData {
    explanation: String
    delisted: Boolean
  }

  input DecisionMeta {
    contentID: String
  }

  input ModeratorData {
    ethAddress: String
    admin: Boolean
    active: Boolean
  }

  type Mutation {
    addProfileProvider(data: [DataProviderInput]): String!
    makeDefaultProvider(data: [DataProviderInput]): String!
    saveMetaData(data: DataProviderInput): String!
    registerUserName(name: String!): String!
    createTag(name: String!): String
    createPost(content: [DataProviderInput!], post: PostData): String
    follow(pubKey: String!): Boolean
    unFollow(pubKey: String!): Boolean
    addComment(content: [DataProviderInput!], comment: CommentData): String
    reportContent(report: ReportData, meta: ReportMeta): String
    moderateContent(decision: DecisionData, meta: DecisionMeta): Boolean
    updateModerator(moderator: ModeratorData): Boolean
    editPost(content: [DataProviderInput!], post: PostData, id: String!): Boolean
    editComment(content: [DataProviderInput!], comment: CommentData, id: String!): Boolean
    removePost(id: String!): Boolean
    removeComment(id: String!): Boolean
    toggleInterestSub(sub: String!): Boolean
    getLinkPreview(link: String!): LinkPreview
  }

  type Tag {
    _id: ID!
    name: String!
    creationDate: String!
    posts: [String!]
    comments: [String!]
    totalPosts: Int
  }

  type UserProfile {
    _id: ID!
    ethAddress: String!
    pubKey: String!
    creationDate: String
    userName: String
    name: String
    description: String
    avatar: String
    coverImage: String
    totalPosts: String
    providers: [DataProvider]
    default: [DataProvider]
    totalFollowers: Int
    totalFollowing: Int
    totalInterests: Int
  }

  enum PostType {
    DEFAULT
    ARTICLE
    APP
    REMOVED
  }

  type Post {
    _id: ID!
    type: PostType!
    creationDate: String!
    updatedAt: String
    author: UserProfile!
    title: String
    content: [DataProvider!]
    quotes: [Post!]
    tags: [String!]
    quotedBy: [String]
    mentions: [String]
    totalComments: String
    quotedByAuthors: [UserProfile]
  }

  type Comment {
    _id: ID!
    creationDate: String!
    updatedAt: String
    author: UserProfile!
    content: [DataProvider!]
    mentions: [String]
    replyTo: String
    postId: String
  }
`;

export default typeDefs;
