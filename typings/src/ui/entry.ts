import { Descendant } from 'slate';
import { Comment, Post, LinkPreview } from '../sdk/graphql-types';
import { IProfileData } from './profile';

export interface PostResponse extends Post {
  moderated?: boolean;
  reason?: string;
  reported?: boolean;
  delisted?: boolean;
  isPublishing?: boolean;
}

export interface CommentResponse extends Comment {
  moderated?: boolean;
  reason?: string;
  reported?: boolean;
  delisted?: boolean;
  isPublishing?: boolean;
}

export type ITag = {
  name: string;
  totalPosts: number;
};

export interface LinkPreviewExt extends LinkPreview {
  imageSources?: { url: string; fallbackUrl: string };
  faviconSources?: { url: string; fallbackUrl: string };
}

export interface IEntryData {
  CID?: string;
  linkPreview?: LinkPreviewExt;
  images?: IMetadata['images'];
  slateContent: Descendant[];
  time?: string | number | Date;
  updatedAt?: string | number | Date;
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
  linkPreview?: IEntryData['linkPreview'];
  images?: IEntryData['images'];
}

export interface IPublishData {
  metadata: IMetadata;
  slateContent: (Descendant & { url?: string; type?: string; fallbackUrl?: string })[];
  textContent: string;
  author: string | null;
  pubKey?: string;
}

export interface IMetadata {
  app: string;
  version: number;
  linkPreview?: LinkPreviewExt;
  images?: {
    originalSrc?: string;
    src: { url?: string; fallbackUrl?: string };
    size: { width: number; height: number; naturalWidth: number; naturalHeight: number };
    id: string;
  }[];
  quote?: IEntryData;
  tags: string[];
  mentions: string[];
}

export interface IEntryPage {
  results: string[];
  total?: number;
}
