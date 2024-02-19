import { Logger } from '@akashaorg/awf-sdk';
import { Comment } from '@akashaorg/typings/lib/sdk/graphql-types';
import type { PostResultFragment } from '@akashaorg/typings/lib/sdk/graphql-operation-types';
import type { BeamEntryData, ReflectEntryData, SlateDescendant } from '@akashaorg/typings/lib/ui';
import { AkashaBeam, AkashaReflect } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import getSDK from '@akashaorg/awf-sdk';

export const PROVIDER_AKASHA = 'AkashaApp';
export const PROPERTY_SLATE_CONTENT = 'slateContent';
export const PROPERTY_TEXT_CONTENT = 'textContent';
export const PROPERTY_LINK_PREVIEW = 'linkPreview';
export const PROPERTY_IMAGES = 'images';

export type EntryPublishObject = {
  data: PostResultFragment['content'];
  post: {
    tags: PostResultFragment['tags'];
    mentions: string[];
    quotes: string[];
  };

  quotes: PostResultFragment['quotes'];
};

export type CommentPublishObject = {
  data: Comment['content'];
  comment: {
    tags: PostResultFragment['tags'];
    mentions: string[];
    quotes: string[];
    postID: string;
    replyTo: string;
  };
};

/**
 * Utility to decode base64 slate content
 */
export const decodeb64SlateContent = (base64Content: string, logger?: Logger) => {
  try {
    const stringContent = window.atob(base64Content);
    const stringified = fromBinary(stringContent);
    const result = JSON.parse(stringified);
    return result;
  } catch (err) {
    if (logger) {
      logger.error(`Error parsing content: ${err.message}`);
    }
  }
};

/**
 * Utility to encode slate content to base64
 */
export const encodeSlateToBase64 = (slateContent: SlateDescendant[]) => {
  const stringified = JSON.stringify(slateContent);
  const binary = toBinary(stringified);
  const encoded = window.btoa(binary);
  return encoded;
};

function toBinary(data: string) {
  const codeUnits = new Uint16Array(data.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = data.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint8Array(codeUnits.buffer));
}

function fromBinary(binary: string) {
  let result = binary;

  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  result = String.fromCharCode(...new Uint16Array(bytes.buffer));

  return result;
}

/**
 * Utility to map reflect entry data
 */
export const mapReflectEntryData = (
  reflection?: Pick<AkashaReflect, 'id' | 'active' | 'createdAt' | 'nsfw' | 'content'> & {
    author: { id: string };
    beam?: { id: string };
  },
): ReflectEntryData => {
  if (!reflection) return null;

  return {
    id: reflection.id,
    active: reflection.active,
    authorId: reflection.author.id,
    createdAt: reflection.createdAt,
    content: reflection.content,
    nsfw: reflection?.nsfw,
    beamID: reflection.beam?.id,
  };
};

/**
 * Utility to map beam entry data
 */
export const mapBeamEntryData = (
  beam?: Pick<
    AkashaBeam,
    'id' | 'active' | 'createdAt' | 'content' | 'nsfw' | 'tags' | 'reflectionsCount'
  > & {
    author: { id: string };
  },
): BeamEntryData => {
  if (!beam) return null;
  const sdk = getSDK();
  return {
    id: beam.id,
    active: beam.active,
    authorId: beam.author.id,
    createdAt: beam.createdAt,
    content: beam.content,
    nsfw: beam?.nsfw,
    tags: beam?.tags
      ?.filter(labeledTag => labeledTag.labelType === sdk.services.gql.labelTypes.TAG)
      .map(labeledTag => labeledTag.value),
    reflectionsCount: beam?.reflectionsCount,
  };
};
