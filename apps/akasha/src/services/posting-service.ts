import { forkJoin } from 'rxjs';

export const MEDIA_URL_PREFIX = 'CID:';
export const PROVIDER_AKASHA = 'AkashaApp';
export const PROPERTY_SLATE_CONTENT = 'slateContent';
export const PROPERTY_TEXT_CONTENT = 'textContent';

export const getMediaUrl = (ipfsGateway: string, hash?: string, data?: any) => {
  let ipfsUrl = '';

  if (hash && !data) {
    ipfsUrl = `${ipfsGateway}/${hash}`;
  }

  if (data) {
    let imageSize = '';
    for (const size in data) {
      if (data.hasOwnProperty(size)) {
        imageSize = size;
        break;
      }
    }
    if (imageSize) {
      ipfsUrl = `${ipfsGateway}/${hash}/${imageSize}/src`;
    }
  }

  return ipfsUrl;
};

export const serializeLegacyContentToSlate = (
  entryData: {
    CID: string;
    excerpt: string;
    featuredImage: { hash: string; data: { xs?: any; md?: any; sm?: any } };
    tags: string[];
    title: string;
  },
  ipfsGateway: string,
) => {
  const serializedContent = [];

  if (entryData.title) {
    serializedContent.push({
      type: 'paragraph',
      children: [{ text: entryData.title, bold: true }],
    });
  }

  if (entryData.excerpt) {
    serializedContent.push({
      type: 'paragraph',
      children: [{ text: JSON.parse(entryData.excerpt) }],
    });
  }

  if (entryData.featuredImage) {
    const mediaUrl = getMediaUrl(
      ipfsGateway,
      entryData.featuredImage.hash,
      entryData.featuredImage.data,
    );
    if (mediaUrl) {
      serializedContent.push({
        type: 'image',
        url: mediaUrl,
        children: [{ text: '' }],
      });
    }
  }

  if (entryData.tags?.length > 0) {
    entryData.tags.forEach((tag: string, idx: number) => {
      if (idx > 0) {
        serializedContent.push({ text: ' ' });
      }
      serializedContent.push({
        type: 'tag',
        value: tag,
        children: [{ text: '' }],
      });
    });
  }

  return serializedContent;
};

export interface IConfig {
  quality?: number;
  maxWidth: number;
  maxHeight: number;
  autoRotate?: boolean;
  mimeType?: string;
}

export const uploadMediaToTextile = (profileStore: any, ipfsSettings: any) => async (
  data: any,
  isUrl = false,
) => {
  const gatewayCall = ipfsSettings.getSettings({});
  const uploadData: {
    isUrl: boolean;
    content: any;
    name?: string;
    config: IConfig;
  } = {
    isUrl,
    content: data,
    config: {
      quality: 0.8,
      maxWidth: 640,
      maxHeight: 640,
      autoRotate: true,
    },
  };

  if (data.type) {
    uploadData.config.mimeType = data.type;
  }

  if (data.name) {
    uploadData.name = data.name;
  }
  const uploadCall = profileStore.saveMediaFile(uploadData);
  try {
    const res: any = await forkJoin([gatewayCall, uploadCall]).toPromise();
    return {
      data: { src: `${res[0].data}/${res[1].data?.CID}`, size: res[1].data?.size },
    };
  } catch (error) {
    return {
      error: error,
    };
  }
};

function toBinary(data: string) {
  const codeUnits = new Uint16Array(data.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = data.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint8Array(codeUnits.buffer));
}

function fromBinary(binary: any) {
  let result = binary;

  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  result = String.fromCharCode(...new Uint16Array(bytes.buffer));

  return result;
}

export const serializeSlateToBase64 = (slateContent: any) => {
  return btoa(toBinary(JSON.stringify(slateContent)));
};

export const serializeBase64ToSlate = (base64Content: string, logger?: any) => {
  const stringContent = atob(base64Content);
  let result;
  try {
    const stringified = fromBinary(stringContent);
    result = JSON.parse(stringified);
  } catch (err) {
    if (logger) {
      logger.error('Error parsing content: %j', err);
    }
  }
  if (!Array.isArray(result)) {
    result = JSON.parse(stringContent);
  }
  return result;
};

export const mapEntry = (
  entry: {
    content: { provider: string; property: string; value: string }[];
    CID?: string;
    _id: string;
    quotes?: any[];
    quotedBy?: string[];
    creationDate: string;
    totalComments: string;
    author: {
      CID?: string;
      description?: string;
      avatar?: string;
      coverImage: string;
      userName?: string;
      name?: string;
      ethAddress: string;
      totalPosts?: number | string;
      totalFollowers?: number | string;
      totalFollowing?: number | string;
    };
  },
  ipfsGateway: string,
  logger?: any,
) => {
  const slateContent = entry.content.find(elem => elem.property === PROPERTY_SLATE_CONTENT);
  let content = null;
  try {
    if (slateContent) {
      content = serializeBase64ToSlate(slateContent.value, logger);
    }
  } catch (error) {
    if (logger) {
      logger.error('Error serializing base64 to slateContent: %j', error);
    }
    if (slateContent) {
      content = [
        {
          type: 'paragraph',
          children: [{ text: slateContent.value }],
        },
      ];
    }
  }

  const contentWithMediaGateways = content.map((node: any) => {
    // in the slate content only the ipfs hash prepended with CID: is saved for the image urls
    // like: CID:bafybeidywav2f4jezkpqe7ydkvhrvqxf3mp76aqzhpvlhp2zg6xapg5nr4
    const nodeClone = Object.assign({}, node);
    if (node.type === 'image' && node.url.startsWith(MEDIA_URL_PREFIX)) {
      nodeClone.url = getMediaUrl(ipfsGateway, node.url.slice(4));
    }
    return nodeClone;
  });

  let quotedEntry: any;
  if (entry.quotes && entry.quotes[0]) {
    quotedEntry = mapEntry(entry.quotes[0], ipfsGateway, logger);
  }

  return {
    author: {
      CID: entry.author.CID,
      description: entry.author.description,
      avatar: getMediaUrl(ipfsGateway, entry.author.avatar),
      coverImage: getMediaUrl(ipfsGateway, entry.author.coverImage),
      userName: entry.author.userName,
      name: entry.author.name,
      ethAddress: entry.author.ethAddress,
      totalPosts: entry.author.totalPosts,
      totalFollowers: entry.author.totalFollowers,
      totalFollowing: entry.author.totalFollowing,
    },
    CID: entry.CID,
    content: contentWithMediaGateways,
    quote: quotedEntry,
    entryId: entry._id,
    time: entry.creationDate,
    reposts: entry.quotedBy?.length,
    ipfsLink: entry._id,
    permalink: 'null',
    replies: +entry.totalComments,
  };
};

interface PendingEntry {
  author: {
    CID?: string;
    avatar?: string;
    coverImage?: string;
    description?: string;
    name?: string;
    ethAddress: string;
    userName?: string;
  };
  content: {};
  ipfsLink?: string;
  entryId?: string;
  replies?: number;
  reposts?: number;
  time: string;
}

export const createPendingEntry = (
  author: PendingEntry['author'],
  entryPublishData: any,
): PendingEntry => {
  return {
    author: author,
    content: entryPublishData.content,
    replies: 0,
    reposts: 0,
    time: `${Date.now()}`,
  };
};

export const buildPublishObject = (data: any, parentEntryId?: string) => {
  // save only the ipfs CID prepended with CID: for the slate content image urls
  const cleanedContent = data.content.map((node: any) => {
    const nodeClone = Object.assign({}, node);
    if (node.type === 'image' && node.url.includes('gateway.ipfs')) {
      const hashIndex = node.url.lastIndexOf('/');
      const hash = node.url.substr(hashIndex + 1);
      nodeClone.url = `${MEDIA_URL_PREFIX}${hash}`;
    }
    return nodeClone;
  });

  const quotes = [];
  if (data.metadata.quote) {
    quotes.push(data.metadata.quote);
  }

  const postObj: any = {
    tags: data.metadata.tags,
    mentions: data.metadata.mentions,
  };
  // logic specific to comments
  if (parentEntryId) {
    postObj.postID = parentEntryId;
  } else {
    postObj.quotes = quotes;
  }

  const entryObj: any = {
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
    entryObj.comment = postObj;
  } else {
    entryObj.post = postObj;
  }

  return entryObj;
};
