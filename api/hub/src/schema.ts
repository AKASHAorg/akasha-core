import { gql } from 'apollo-server-koa';

const typeDefs = gql`
  type TagsResult {
    results: [Tag!]
    nextIndex: String
    total: Int
  }
  type PostsResult {
    results: [Post!]
    nextIndex: String
    total: Int
  }
  type CommentsResult {
    results: [Comment!]
    nextIndex: String
    total: Int
  }

  type Query {
    getProfile(ethAddress: String!): UserProfile!
    resolveProfile(pubKey: String!): UserProfile!
    getPost(id: String!): Post!
    getTag(name: String!): Tag
    searchTags(name: String!): [String]
    searchProfiles(name: String!): [UserProfile]
    tags(offset: String, limit: Int): TagsResult
    posts(offset: String, limit: Int): PostsResult
    isFollowing(follower: String!, following: String!): Boolean
    getComments(postID: String!, offset: String, limit: Int): CommentsResult
    getComment(commentID: String!): Comment!
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

  type Mutation {
    addProfileProvider(data: [DataProviderInput]): String!
    makeDefaultProvider(data: [DataProviderInput]): String!
    saveMetaData(data: DataProviderInput): String!
    registerUserName(name: String!): String!
    createTag(name: String!): String
    createPost(content: [DataProviderInput!], post: PostData): String
    follow(ethAddress: String!): Boolean
    unFollow(ethAddress: String!): Boolean
    addComment(content: [DataProviderInput!], comment: CommentData): String
  }

  type Tag {
    _id: ID!
    name: String!
    creationDate: String!
    posts: [String!]
    comments: [String!]
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
  }

  enum PostType {
    DEFAULT
    ARTICLE
    APP
  }

  type Post {
    _id: ID!
    type: PostType!
    creationDate: String!
    author: UserProfile!
    title: String
    content: [DataProvider!]
    quotes: [Post!]
    tags: [String!]
    quotedBy: [String]
    mentions: [String]
    totalComments: String
  }

  type Comment {
    _id: ID!
    creationDate: String!
    author: UserProfile!
    content: [DataProvider!]
    mentions: [String]
    replyTo: String
    postID: String
  }
`;

export default typeDefs;
