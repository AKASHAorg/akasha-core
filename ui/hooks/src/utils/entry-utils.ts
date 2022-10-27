import getSDK from '@akashaorg/awf-sdk';
import { Logger } from '@akashaorg/awf-sdk';
import { PostResultFragment, Comment, UserProfile } from '@akashaorg/awf-sdk/src/gql/api';
import { IEntryData, IPublishData } from '@akashaorg/typings/ui';

import { getMediaUrl } from './media-utils';

export const MEDIA_URL_PREFIX = 'CID:';
export const TEXTILE_GATEWAY = 'https://hub.textile.io/ipfs/';
export const PROVIDER_AKASHA = 'AkashaApp';
export const PROPERTY_SLATE_CONTENT = 'slateContent';
export const PROPERTY_TEXT_CONTENT = 'textContent';
export const PROPERTY_LINK_PREVIEW = 'linkPreview';
export const PROPERTY_IMAGES = 'images';

export interface EntryPublishObject {
  data: PostResultFragment['content'];
  post: {
    tags: PostResultFragment['tags'];
    mentions: string[];
    quotes: string[];
  };

  quotes: PostResultFragment['quotes'];
}
export interface CommentPublishObject {
  data: Comment['content'];
  comment: {
    tags: PostResultFragment['tags'];
    mentions: string[];
    quotes: string[];
    postID: string;
  };
}

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

/**
 * Remap entry data coming from a response to the format expected by EntryCard
 * content - from b64 to slate format
 * profile images - append ipfs gateway
 * entry images - append ipfs gateway
 */
export const mapEntry = (entry: PostResultFragment | Comment, logger?: Logger) => {
  const slateContent = entry.content.find(elem => elem.property === PROPERTY_SLATE_CONTENT);
  const linkPreviewData = entry.content.find(elem => elem.property === PROPERTY_LINK_PREVIEW);
  const imagesData = entry.content.find(elem => elem.property === PROPERTY_IMAGES);
  let content;
  let linkPreview;
  let images;
  let quotedByAuthors: IEntryData['author'][];
  let quotedEntry;
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
      const decodedContent = decodeb64SlateContent(slateContent.value, logger, true);
      content = decodedContent.map(node => {
        if (node.type === 'image' && node.url?.startsWith(MEDIA_URL_PREFIX)) {
          node.url = getMediaUrl(node.url?.replace(MEDIA_URL_PREFIX, ''))?.originLink;
        }
        if (node.type === 'image' && node.fallbackUrl.startsWith(MEDIA_URL_PREFIX)) {
          node.fallbackUrl = getMediaUrl(
            node.fallbackUrl?.replace(MEDIA_URL_PREFIX, ''),
          )?.fallbackLink;
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

    try {
      linkPreview = decodeb64SlateContent(linkPreviewData.value, logger);
      const imageSources = { url: '', fallbackUrl: '' };
      const faviconSources = { url: '', fallbackUrl: '' };
      if (linkPreview.imagePreviewHash) {
        const ipfsLinks = getMediaUrl(linkPreview.imagePreviewHash);
        imageSources.url = ipfsLinks.originLink;
        imageSources.fallbackUrl = ipfsLinks.fallbackLink;
      } else if (!linkPreview.imagePreviewHash && linkPreview.images.length) {
        const uploadedImageURL = new URL(linkPreview.images[0]);
        const hash = uploadedImageURL.hostname.split('.')[0];
        const ipfsLinks = getMediaUrl(hash);
        imageSources.url = ipfsLinks.originLink;
        imageSources.fallbackUrl = ipfsLinks.fallbackLink;
      }
      if (linkPreview.faviconPreviewHash) {
        const ipfsLinks = getMediaUrl(linkPreview.faviconPreviewHash);
        faviconSources.url = ipfsLinks.originLink;
        faviconSources.fallbackUrl = ipfsLinks.fallbackLink;
      } else if (!linkPreview.faviconPreviewHash && linkPreview.favicons.length) {
        const uploadedFaviconURL = new URL(linkPreview.favicons[0]);
        const hash = uploadedFaviconURL.hostname.split('.')[0];
        const ipfsLinks = getMediaUrl(hash);
        faviconSources.url = ipfsLinks.originLink;
        faviconSources.fallbackUrl = ipfsLinks.fallbackLink;
      }
      linkPreview.imageSources = imageSources;
      linkPreview.faviconSources = faviconSources;
    } catch (error) {
      if (logger) {
        logger.error(`Error serializing base64 to linkPreview: ${error.message}`);
      }
    }
    try {
      const decodedImages = decodeb64SlateContent(imagesData.value, logger);
      const sdk = getSDK();
      const ipfsGateway = sdk.services.common.ipfs.getSettings().gateway;
      images = decodedImages.map(img => {
        const imgClone = { id: img.id, size: img.size, src: { url: '', fallbackUrl: '' } };
        if (typeof img.src === 'string' && img.src?.startsWith(ipfsGateway)) {
          const ipfsLinks = getMediaUrl(img.src.replace(ipfsGateway, ''));
          imgClone.src.url = ipfsLinks?.originLink;
          imgClone.src.fallbackUrl = ipfsLinks?.fallbackLink;
        } else if (typeof img.src === 'object' && img.src?.url?.startsWith(MEDIA_URL_PREFIX)) {
          const ipfsLinks = getMediaUrl(img.src?.url?.replace(MEDIA_URL_PREFIX, ''));
          imgClone.src.url = ipfsLinks?.originLink;
          imgClone.src.fallbackUrl = ipfsLinks?.fallbackLink;
          // handle older uploaded images where the textile gatweway was saved also
        } else if (typeof img.src === 'string' && img.src?.startsWith(TEXTILE_GATEWAY)) {
          const ipfsLinks = getMediaUrl(img.src.replace(TEXTILE_GATEWAY, ''));
          imgClone.src.url = ipfsLinks?.originLink;
          imgClone.src.fallbackUrl = ipfsLinks?.fallbackLink;
          // handle older uploaded images where the ipfs origing link was saved also
        } else if (typeof img.src === 'string') {
          const uploadedUrl = new URL(img.src);
          const hash = uploadedUrl.hostname.split('.')[0];
          const ipfsLinks = getMediaUrl(hash);
          imgClone.src.url = ipfsLinks?.originLink;
          imgClone.src.fallbackUrl = ipfsLinks?.fallbackLink;
        }
        return imgClone;
      });
    } catch (error) {
      if (logger) {
        logger.error(`Error serializing base64 to images: ${error.message}`);
      }
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
    quotedByAuthors = entry['quotedByAuthors'].map((author: PostResultFragment['author']) => {
      const avatarWithGateway = getMediaUrl(author.avatar);
      return {
        ...author,
        avatar: {
          url: avatarWithGateway?.originLink,
          fallbackUrl: avatarWithGateway?.fallbackLink,
        },
      };
    });
  }

  const totalComments = entry.hasOwnProperty('totalComments') ? +entry['totalComments'] : undefined;

  return {
    ...entry,
    author: {
      ...entry.author,
      avatar: {
        url: getMediaUrl(entry.author.avatar)?.originLink,
        fallbackUrl: getMediaUrl(entry.author.avatar)?.fallbackLink,
      },
      coverImage: {
        url: getMediaUrl(entry.author.coverImage)?.originLink,
        fallbackUrl: getMediaUrl(entry.author.coverImage)?.fallbackLink,
      },
    },
    isRemoved,
    slateContent: content,
    linkPreview,
    images,
    quote: quotedEntry,
    entryId: entry._id,
    time: entry.creationDate,
    updatedAt: entry.updatedAt,
    reposts: entry['quotedBy']?.length,
    // ipfsLink: entry._id,
    replies: totalComments,
    quotedByAuthors: quotedByAuthors,
    type: entry['type'],
  };
};

/**
 * Utility to create an entry yet to be published
 */
export const createPendingEntry = (
  author: UserProfile,
  entryPublishData: IPublishData & { entryId?: string },
) => {
  return {
    quote: entryPublishData.metadata.quote,
    linkPreview: entryPublishData.metadata.linkPreview,
    images: entryPublishData.metadata.images,
    author: author,
    slateContent: entryPublishData.slateContent,
    replies: 0,
    reposts: 0,
    time: `${Date.now()}`,
    permalink: '',
    ipfsLink: '',
    entryId: entryPublishData.entryId,
  };
};

export function buildPublishObject(data: IPublishData): EntryPublishObject;
export function buildPublishObject(data: IPublishData, parentEntryId: string): CommentPublishObject;
export function buildPublishObject(data: IPublishData, parentEntryId?: string) {
  // save only the ipfs CID prepended with `CID:` for the slate content image urls
  const sdk = getSDK();
  const ipfsGateway = sdk.services.common.ipfs.getSettings().gateway;
  const cleanedContent = data.slateContent.map(node => {
    const nodeClone = Object.assign({}, node);
    if (node.type === 'image') {
      let hash;
      if (node.url.startsWith(ipfsGateway)) {
        const hashIndex = node.url.lastIndexOf('/');
        hash = node.url.substr(hashIndex + 1);
      } else if (!node.url.startsWith(MEDIA_URL_PREFIX)) {
        const url = new URL(node.url);
        hash = url.hostname.split('.')[0];
      }
      if (hash) {
        nodeClone.url = `${MEDIA_URL_PREFIX}${hash}`;
        nodeClone.fallbackUrl = `${MEDIA_URL_PREFIX}${hash}`;
      }
    }
    return nodeClone;
  });

  const quotes = [];
  if (data.metadata.quote) {
    quotes.push(data.metadata.quote.entryId);
  }

  // to add new post related data enhance this with another object
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

  if (data.metadata.linkPreview) {
    const clonedLinkPreviewData = JSON.parse(JSON.stringify(data.metadata.linkPreview));
    if (clonedLinkPreviewData.imageSources) {
      delete clonedLinkPreviewData.imageSources;
    }
    if (clonedLinkPreviewData.faviconSources) {
      delete clonedLinkPreviewData.faviconSources;
    }
    postObj.data.push({
      provider: PROVIDER_AKASHA,
      property: PROPERTY_LINK_PREVIEW,
      value: serializeSlateToBase64(clonedLinkPreviewData),
    });
  }
  if (data.metadata.images) {
    // save only the ipfs hash prepended with CID: when publishing
    const clonedImages = JSON.parse(JSON.stringify(data.metadata.images));
    const cleanedImages = clonedImages.map(img => {
      const imgClone = Object.assign({}, img);
      let hash;
      if (img.src.url.startsWith(ipfsGateway)) {
        const hashIndex = img.src.url.lastIndexOf('/');
        hash = img.src.url.substr(hashIndex + 1);
      } else if (!img.src.url.startsWith(MEDIA_URL_PREFIX)) {
        const url = new URL(img.src.url);
        hash = url.hostname.split('.')[0];
      }
      if (hash) {
        imgClone.src.url = `${MEDIA_URL_PREFIX}${hash}`;
        imgClone.src.fallbackUrl = `${MEDIA_URL_PREFIX}${hash}`;
      }
      // strip the original source before publishing
      delete imgClone.originalSrc;
      return imgClone;
    });
    postObj.data.push({
      provider: PROVIDER_AKASHA,
      property: PROPERTY_IMAGES,
      value: serializeSlateToBase64(cleanedImages),
    });
  }
  // logic specific to comments
  if (parentEntryId) {
    return {
      ...postObj,
      comment: {
        tags: data.metadata.tags,
        mentions: data.metadata.mentions,
        postID: parentEntryId,
      },
    } as CommentPublishObject;
  }
  return {
    ...postObj,
    post: {
      tags: data.metadata.tags,
      mentions: data.metadata.mentions,
      quotes,
    },
  } as EntryPublishObject;
}
