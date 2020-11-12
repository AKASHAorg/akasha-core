import { gql } from 'apollo-server-koa';

const typeDefs = gql`
  type Query {
    profile(ethAddress: String!): UserProfile!
    post(id: String!): Post!
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
    Regular
    Article
    App
  }

  type Post {
    type: PostType!
    version: Int!
    appUsed: String!
    creationDate: String!
    author: UserProfile!
    title: String!
    content: String!
    quotes: [String!]
    tags: [String!]
  }
`;

export default typeDefs;
