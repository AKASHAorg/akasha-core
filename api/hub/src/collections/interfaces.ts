export interface DataProvider {
  provider: string;
  property: string;
  value: string;
}

export interface Tag {
  _id: string;
  name: string;
  creationDate: string;
  posts: string[];
  comments: string[];
}

export interface PostItem {
  _id: string;
  title?: string;
  creationDate: string;
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
  creationDate: string;
  following?: string[];
  followers?: string[];
  providers?: DataProvider[];
  metaData?: DataProvider[];
}

export interface Comment {
  _id: string;
  creationDate: string;
  author: string;
  content: DataProvider[];
  tags: string[];
  mentions: string[];
  metaData: DataProvider[];
  postId: string;
  replyTo: string;
}
