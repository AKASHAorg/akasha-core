import { getMediaUrl } from './media-utils';
import { IProfileData } from '@akashaproject/ui-awf-typings/lib/profile';
import {
  IEntryData,
  PostResponse,
  CommentResponse,
  IPublishData,
} from '@akashaproject/ui-awf-typings/lib/entry';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import getSDK from '@akashaproject/awf-sdk';

export const MEDIA_URL_PREFIX = 'CID:';
export const PROVIDER_AKASHA = 'AkashaApp';
export const PROPERTY_SLATE_CONTENT = 'slateContent';
export const PROPERTY_TEXT_CONTENT = 'textContent';

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

export const decodeb64SlateContent = (base64Content: string, logger?: ILogger) => {
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
  if (!Array.isArray(result)) {
    result = JSON.parse(stringContent);
  }
  return result;
};

export const serializeSlateToBase64 = (slateContent: unknown) => {
  return window.btoa(toBinary(JSON.stringify(slateContent)));
};

/**
 * Remap entry data coming from a response to the format expected by EntryCard
 * content - from b64 to slate format
 * profile images - append ipfs gateway
 * entry images - append ipfs gateway
 */
export const mapEntry = (entry: PostResponse | CommentResponse, logger?: ILogger): IEntryData => {
  const slateContent = entry.content.find(elem => elem.property === PROPERTY_SLATE_CONTENT);
  let content;
  let quotedByAuthors: IEntryData['author'][];
  let quotedEntry: IEntryData;
  const isRemoved = entry.content.length === 1 && entry.content[0].property === 'removed';

  if (isRemoved) {
    content = entry.content;
    /* [
      {
        type: 'paragraph',
        children: [{ text: 'Deleted' }],
      },
    ]; */
  } else {
    try {
      const decodedContent = decodeb64SlateContent(slateContent.value, logger);
      content = decodedContent.map(node => {
        if (node.type === 'image' && node.url.startsWith(MEDIA_URL_PREFIX)) {
          node.url = getMediaUrl(node.url.replace(MEDIA_URL_PREFIX, ''));
        }
        return node;
      });
    } catch (error) {
      if (logger) {
        logger.error(`Error serializing base64 to slateContent: ${error.message}`);
      }
      content = [
        {
          type: 'paragraph',
          children: [{ text: 'Error serializing base64 to slateContent' }],
        },
      ];
    }
  }
  if (entry.hasOwnProperty('quotes') && entry['quotes'] && entry['quotes'][0]) {
    quotedEntry = mapEntry(entry['quotes'][0], logger);
  }

  if (
    entry.hasOwnProperty('quotedByAuthors') &&
    entry['quotedByAuthors'] &&
    entry['quotedByAuthors'].length > 0
  ) {
    quotedByAuthors = entry['quotedByAuthors'].map((author: IEntryData['author']) => {
      let avatarWithGateway;
      if (author.avatar) {
        avatarWithGateway = getMediaUrl(author.avatar);
      }
      return {
        ...author,
        avatar: avatarWithGateway,
      };
    });
  }

  const totalComments = entry.hasOwnProperty('totalComments') ? +entry['totalComments'] : undefined;

  return {
    ...entry,
    author: {
      ...entry.author,
      avatar: getMediaUrl(entry.author.avatar),
      coverImage: getMediaUrl(entry.author.coverImage),
    },
    content,
    quote: quotedEntry,
    entryId: entry._id,
    time: entry.creationDate,
    reposts: entry['quotedBy']?.length,
    // ipfsLink: entry._id,
    replies: totalComments,
    quotedByAuthors: quotedByAuthors,
    type: entry['type'],
  };
};

interface PendingEntry {
  author: IProfileData;
  content: IPublishData['content'];
  ipfsLink: string;
  permalink: string;
  entryId: string;
  replies?: number;
  reposts?: number;
  time: string;
  quote: IEntryData['quote'];
}

export const createPendingEntry = (
  author: IProfileData,
  entryPublishData: IPublishData & { entryId?: string },
  quote?: IEntryData['quote'],
): PendingEntry => {
  return {
    quote,
    author: author,
    content: entryPublishData.content,
    replies: 0,
    reposts: 0,
    time: `${Date.now()}`,
    permalink: '',
    ipfsLink: '',
    entryId: entryPublishData.entryId,
  };
};

export interface EntryPublishObject {
  data: PostResponse['content'];
  post: {
    tags: IPublishData['metadata']['tags'];
    mentions: IPublishData['metadata']['mentions'];
  };

  quotes: IPublishData['metadata']['quote']['entryId'][];
}
export interface CommentPublishObject {
  data: CommentResponse['content'];
  comment: {
    tags: IPublishData['metadata']['tags'];
    mentions: IPublishData['metadata']['mentions'];
    postID: string;
  };
}

export function buildPublishObject(data: IPublishData): EntryPublishObject;
export function buildPublishObject(data: IPublishData, parentEntryId: string): CommentPublishObject;
export function buildPublishObject(data: IPublishData, parentEntryId?: string) {
  // save only the ipfs CID prepended with `CID:` for the slate content image urls
  const sdk = getSDK();
  const ipfsGateway = sdk.services.common.ipfs.getSettings().gateway;
  const cleanedContent = data.content.map(node => {
    const nodeClone = Object.assign({}, node);
    if (node.type === 'image' && node.url.startsWith(ipfsGateway)) {
      const hashIndex = node.url.lastIndexOf('/');
      const hash = node.url.substr(hashIndex + 1);
      nodeClone.url = `${MEDIA_URL_PREFIX}${hash}`;
    }
    return nodeClone;
  });

  const quotes = [];
  if (data.metadata.quote) {
    quotes.push(data.metadata.quote.entryId);
  }

  const postObj = {
    data: [
      {
        provider: PROVIDER_AKASHA,
        property: PROPERTY_SLATE_CONTENT,
        // perform 2 transforms on content: change unicode chars to ASCII and then convert to base64
        value: serializeSlateToBase64(cleanedContent),
      },
      {
        provider: PROVIDER_AKASHA,
        property: PROPERTY_TEXT_CONTENT,
        value: data.textContent,
      },
    ],
  };
  // logic specific to comments
  if (parentEntryId) {
    return {
      ...postObj,
      comment: {
        tags: data.metadata.tags,
        mentions: data.metadata.mentions,
        postID: parentEntryId,
      },
    };
  }
  return {
    ...postObj,
    post: {
      tags: data.metadata.tags,
      mentions: data.metadata.mentions,
    },
    quotes,
  };
}
