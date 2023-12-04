import { Logger } from '@akashaorg/awf-sdk';
import { Comment } from '@akashaorg/typings/lib/sdk/graphql-types';
import type { PostResultFragment } from '@akashaorg/typings/lib/sdk/graphql-operation-types';

export const MEDIA_URL_PREFIX = 'CID:';
export const TEXTILE_GATEWAY = 'https://hub.textile.io/ipfs/';
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
 * Utility to decode base64 slate content
 */
export const decodeb64SlateContent = (
  base64Content: string,
  logger?: Logger,
  handleOldSlateFormat?: boolean,
) => {
  const stringContent = window.atob(base64Content);
  let result;
  try {
    const stringified = fromBinary(stringContent);
    result = JSON.parse(stringified);
  } catch (err) {
    if (logger) {
      logger.error(`Error parsing content: ${err.message}`);
    }
  }
  if (handleOldSlateFormat && !Array.isArray(result)) {
    result = JSON.parse(stringContent);
  }
  return result;
};

/**
 * Utility to serialize slate content to base64
 */
export const serializeSlateToBase64 = (slateContent: unknown) => {
  return window.btoa(toBinary(JSON.stringify(slateContent)));
};
