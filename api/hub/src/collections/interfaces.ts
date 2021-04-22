export interface DataProvider {
  provider: string;
  property: string;
  value: string;
}

export interface Tag {
  _id: string;
  name: string;
  creationDate: number;
  posts: string[];
  comments: string[];
}

export interface PostItem {
  _id: string;
  title?: string;
  creationDate: number;
  author: string;
  type: string;
  content: DataProvider[];
  tags?: string[];
  mentions?: string[];
  quotes?: string[];
  metaData?: DataProvider[];
}

export interface Profile {
  _id: string;
  ethAddress: string;
  pubKey: string;
  userName?: string;
  default?: DataProvider[];
  creationDate: number;
  following?: string[];
  followers?: string[];
  providers?: DataProvider[];
  metaData?: DataProvider[];
}

export interface Comment {
  _id: string;
  creationDate: number;
  author: string;
  content: DataProvider[];
  tags: string[];
  mentions: string[];
  metaData: DataProvider[];
  postId: string;
  replyTo: string;
}

export interface Moderator {
  _id: string;
  creationDate: number;
  ethAddress: string;
  admin: boolean;
  active: boolean;
}

export interface ModerationReport {
  _id: string;
  creationDate: number;
  contentType: string;
  contentID: string;
  author: string;
  reason: string;
  explanation?: string;
}

export interface ModerationDecision {
  _id: string;
  creationDate: number;
  contentType: string;
  contentID: string;
  moderator?: string;
  moderatedDate?: number;
  explanation?: string;
  delisted: boolean;
  moderated: boolean;
}
