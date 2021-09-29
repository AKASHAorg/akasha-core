import { Descendant } from 'slate';
import {
  Comment_Response,
  Post_Response,
  LinkPreview_Response,
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

export interface ITag {
  name: string;
  totalPosts: number;
}

export interface IEntryData {
  CID?: string;
  linkPreview?: LinkPreview_Response;
  slateContent: Descendant[];
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
  isRemoved?: boolean;
  type?: string;
  isPublishing?: boolean;
  postId?: string;
}

export interface PendingEntry {
  author: IProfileData;
  slateContent: IEntryData['slateContent'];
  ipfsLink: string;
  permalink: string;
  entryId: string;
  replies?: number;
  reposts?: number;
  time: string;
  quote: IEntryData['quote'];
  linkPreview: IEntryData['linkPreview'];
}

export interface IPublishData {
  metadata: IMetadata;
  slateContent: (Descendant & { url?: string; type?: string })[];
  textContent: string;
  author: string | null;
  pubKey?: string;
}

export interface IMetadata {
  app: string;
  version: number;
  linkPreview?: LinkPreview_Response;
  quote?: IEntryData;
  tags: string[];
  mentions: string[];
}
