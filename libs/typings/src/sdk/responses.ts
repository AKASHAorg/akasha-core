import { Observable } from 'rxjs';
import { DataProviderInput, UserProfile } from './graphql-types';

export type ServiceCallResult<T> = Observable<{ data: T }>;

export enum PostType {
  DEFAULT,
  ARTICLE,
  APP,
}

export interface Comment_Response {
  _id: string;
  creationDate: string;
  updatedAt: string;
  author: UserProfile;
  content: [DataProviderInput];
  mentions: [string];
  replyTo: string;
  postId: string;
}

export interface Comments_Response {
  results: [Comment_Response];
  nextIndex: string;
  total: number;
}

export interface Post_Response {
  _id: string;
  type: PostType;
  creationDate: string;
  updatedAt: string;
  author: UserProfile_Response;
  title: string;
  content: [DataProviderInput];
  quotes: [Post_Response];
  tags: [string];
  quotedBy: [string];
  mentions: [string];
  totalComments: string;
  quotedByAuthors: [UserProfile_Response];
}

export interface PostsResult_Response {
  results: [Post_Response];
  nextIndex: string;
  total: number;
}

export interface VideoPreview_Response {
  url: string;
  secureUrl: string;
  type: string;
  width: string;
  height: string;
}

export interface LinkPreview_Response {
  url: string;
  mediaType: string;
  contentType: string;
  favicons: [string];
  videos: [VideoPreview_Response];
  title: string;
  siteName: string;
  description: string;
  images: [string];
  imagePreviewHash?: string;
  faviconPreviewHash?: string;
}

export interface UserProfile_Response {
  _id: string;
  ethAddress: string;
  pubKey: string;
  creationDate: string;
  userName: string;
  name: string;
  description: string;
  avatar: string;
  coverImage: string;
  totalPosts: string;
  providers: [DataProviderInput];
  default: [DataProviderInput];
  totalFollowers: number;
  totalFollowing: number;
  totalInterests: number;
}

export interface UserFollowers_Response {
  results: [UserProfile_Response];
  nextIndex: number;
  total: number;
}

export interface Tag_Response {
  _id: string;
  name: string;
  creationDate: string;
  posts: [string];
  comments: [string];
  // totalSubscribers: number;
  totalPosts: number;
}

export interface TagsResult_Response {
  results: [Tag_Response];
  nextIndex: string;
  total: number;
}

export interface SearchTagsResult_Response {
  name: string;
  totalPosts: number;
}

export interface GlobalSearchResultItem {
  id: string;
  name: string;
}
export interface GlobalSearchResultTagItem {
  id: string;
  name: string;
  totalPosts: number;
}
export interface GlobalSearchResult {
  posts: [GlobalSearchResultItem];
  tags: [GlobalSearchResultTagItem];
  comments: [GlobalSearchResultItem];
  profiles: [GlobalSearchResultItem];
}
