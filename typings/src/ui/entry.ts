import { Descendant } from 'slate';
import { IProfileData } from './profile';

export interface ITag {
  name: string;
  totalPosts: number;
}

export interface IEntryData {
  CID?: string;
  linkPreview?: unknown;
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
  linkPreview?: unknown;
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
