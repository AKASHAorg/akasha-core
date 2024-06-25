import { Descendant } from 'slate';
import { AkashaBeam, AkashaReflect } from '../sdk/graphql-types-new';

/**
 * Type defining tag object
 */
export type Tag = {
  name: string;
  totalPosts: number;
};

/**
 * Type defining interest object
 */
export type Interest = {
  labelType: string;
  value: string;
  totalPosts?: number;
};

/**
 * Interface defining data to be published
 */
export interface IPublishData {
  metadata: IMetadata;
  slateContent: (Descendant & { url?: string; type?: string; fallbackUrl?: string })[];
  textContent: string;
  author: string | null;
  userId?: string;
}

/**
 * Interface defining metadata of a content which will be used by an editor
 */
export interface IMetadata {
  app: string;
  version: number;
  images?: {
    originalSrc?: string;
    src: { url?: string; fallbackUrl?: string };
    size: { width: number; height: number; naturalWidth: number; naturalHeight: number };
    id: string;
  }[];
  tags: string[];
  mentions: string[];
}

/**
 * Type defining plain old javascript object for an entry which can be either a beam or a reflection
 */
export type EntryData = {
  id: string;
  active: boolean;
  authorId: string;
  createdAt: string;
  nsfw?: boolean;
  tags?: string[];
};

/**
 * Type defining plain old javascript object for a beam
 */
export type BeamData = EntryData & { content: AkashaBeam['content'] } & {
  reflectionsCount?: number;
};

/**
 * Type defining plain old javascript object for a reflection
 */
export type ReflectionData = EntryData & {
  content: AkashaReflect['content'];
  beamID: AkashaReflect['beamID'];
};

/**
 * Type defining raw data of a beam obtained from an api
 */
export type RawBeamData = Pick<
  AkashaBeam,
  'id' | 'active' | 'createdAt' | 'content' | 'nsfw' | 'tags' | 'reflectionsCount'
> & {
  author: {
    id: string;
  };
};
