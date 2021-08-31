import { Descendant } from 'slate';
import {
  Comment_Response,
  Post_Response,
} from '@akashaproject/sdk-typings/lib/interfaces/responses';
import { IProfileData } from './profile';

export interface PostResponse extends Post_Response {
  moderated?: boolean;
  reason?: string;
  reported?: boolean;
  delisted?: boolean;
  isPublishing?: boolean;
}

export interface CommentResponse extends Comment_Response {
  moderated?: boolean;
  reason?: string;
  reported?: boolean;
  delisted?: boolean;
  isPublishing?: boolean;
}

export interface IEntryData {
  CID?: string;
  content: any;
  time?: string | number | Date;
  replies?: number;
  reposts?: number;
  ipfsLink?: string;
  permalink?: string;
  entryId: string;
  author: IProfileData;
  quotedByAuthors?: IProfileData[];
  quotedBy?: string[];
  quote?: IEntryData;
  delisted?: boolean;
  reported?: boolean;
  moderated?: boolean;
  reason?: string;
  type?: string;
  isPublishing?: boolean;
  postId?: string;
}

export interface IPublishData {
  metadata: IMetadata;
  content: (Descendant & { url?: string; type?: string })[];
  textContent: string;
  author: string | null;
  pubKey?: string;
}

export interface IMetadata {
  app: string;
  version: number;
  quote?: IEntryData;
  tags: string[];
  mentions: string[];
}
