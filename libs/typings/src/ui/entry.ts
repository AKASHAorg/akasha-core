import { Descendant } from 'slate';
import { LinkPreview } from '../sdk/graphql-types';
import { AkashaBeam, AkashaReflect } from '../sdk/graphql-types-new';

export type ITag = {
  name: string;
  totalPosts: number;
};

export type Interest = {
  labelType: string;
  value: string;
  totalPosts?: number;
};

export interface ILinkPreviewExt extends LinkPreview {
  imageSources?: { url: string; fallbackUrl: string };
  faviconSources?: { url: string; fallbackUrl: string };
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
  linkPreview?: ILinkPreviewExt;
  images?: {
    originalSrc?: string;
    src: { url?: string; fallbackUrl?: string };
    size: { width: number; height: number; naturalWidth: number; naturalHeight: number };
    id: string;
  }[];
  tags: string[];
  mentions: string[];
}

export type EntryData = {
  id: string;
  active: boolean;
  authorId: string;
  createdAt: string;
  nsfw?: boolean;
  tags?: string[];
};

export type BeamEntryData = EntryData & { content: AkashaBeam['content'] } & {
  reflectionsCount?: number;
};

export type ReflectEntryData = EntryData & {
  content: AkashaReflect['content'];
  beamID: AkashaReflect['beamID'];
};
