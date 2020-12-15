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
  type Query {
    getProfile(ethAddress: String!): UserProfile!
    resolveProfile(pubKey: String!): UserProfile!
    getPost(id: String!): Post!
    getTag(name: String!): Tag
    tags(offset: String, limit: Int): TagsResult
    posts(offset: String, limit: Int): PostsResult
    isFollowing(follower: String!, following: String!): Boolean
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
    type: PostType
  }

  type Mutation {
    addProfileProvider(data: [DataProviderInput]): [String!]
    makeDefaultProvider(data: DataProviderInput): [String!]
    saveMetaData(data: DataProviderInput): [String!]
    registerUserName(name: String!): [String!]
    createTag(name: String!): String
    createPost(content: [DataProviderInput!], post: PostData): String
    follow(ethAddress: String!): Boolean
    unFollow(ethAddress: String!): Boolean
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
  }
`;

export default typeDefs;
