import { Descendant } from 'slate';
import { LinkPreview } from '../sdk/graphql-types';
import { Profile } from './profile';

export type ITag = {
  name: string;
  totalPosts: number;
};

export type Interest = {
  labelType: string;
  value: string;
  totalPosts?: number;
};

export interface LinkPreviewExt extends LinkPreview {
  imageSources?: { url: string; fallbackUrl: string };
  faviconSources?: { url: string; fallbackUrl: string };
}

export interface IEntryData {
  // id is missing when the entry is in pending state
  id?: string;
  // the following props are deprecated!
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
  author: Profile;
  quotedByAuthors?: Profile[];
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

export interface IPublishData {
  metadata: IMetadata;
  slateContent: (Descendant & { url?: string; type?: string; fallbackUrl?: string })[];
  textContent: string;
  author: string | null;
  userId?: string;
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

export interface ImageObject {
  originalSrc?: string;
  src: { url?: string; fallbackUrl?: string };
  size: { width: number; height: number; naturalWidth?: number; naturalHeight?: number };
  name?: string;
}
