import { Logger } from '@akashaorg/awf-sdk';
import { Comment } from '@akashaorg/typings/lib/sdk/graphql-types';
import type { PostResultFragment } from '@akashaorg/typings/lib/sdk/graphql-operation-types';
import type { BeamEntryData, ReflectEntryData } from '@akashaorg/typings/lib/ui';
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
export const decodeb64SlateContent = async (base64Content: string, logger?: Logger) => {
  try {
    const contentBuffer = base64ToArrayBuffer(base64Content);
    const decompressed = await decompress(contentBuffer, 'gzip', logger);
    const result = JSON.parse(decompressed);
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
export const encodeSlateToBase64 = async (slateContent: unknown) => {
  const stringified = JSON.stringify(slateContent);
  const compressed = await compress(stringified);
  const result = arrayBufferToBase64(compressed);
  return result;
};

const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const base64ToArrayBuffer = base64 => {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export const compress = (
  str: string,
  encoding = 'gzip' as CompressionFormat,
): Promise<ArrayBuffer> => {
  const byteArray = new TextEncoder().encode(str);
  const cs = new CompressionStream(encoding);
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  const result = new Response(cs.readable).arrayBuffer();
  return result;
};

export const decompress = async (
  byteArray: ArrayBuffer,
  encoding = 'gzip' as CompressionFormat,
  logger?: Logger,
): Promise<string> => {
  try {
    const cs = new DecompressionStream(encoding);
    const writer = cs.writable.getWriter();
    writer.write(byteArray);
    writer.close();
    const arrayBuffer = await new Response(cs.readable).arrayBuffer();
    return new TextDecoder().decode(arrayBuffer);
  } catch (err) {
    if (logger) {
      logger.error(`Error decompressing] content: ${err.message}`);
    }
  }
};

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
  beam?: Pick<AkashaBeam, 'id' | 'active' | 'createdAt' | 'content' | 'nsfw' | 'tags'> & {
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
  };
};
