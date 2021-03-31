export const MEDIA_URL_PREFIX = 'CID:';
export const PROPERTY_SLATE_CONTENT = 'slateContent';

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

function fromBinary(binary: any) {
  let result = binary;

  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  result = String.fromCharCode(...new Uint16Array(bytes.buffer));

  return result;
}

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
    quotes: any[];
    quotedBy?: string[];
    quotedByAuthors?: any[];
    creationDate: string;
    totalComments: string;
    postId?: string;
    author: {
      CID?: string;
      description: string;
      avatar: string;
      coverImage: string;
      userName: string;
      name: string;
      ethAddress: string;
      pubKey: string;
      totalPosts?: number | string;
      totalFollowers?: number | string;
      totalFollowing?: number | string;
    };
    delisted?: boolean;
    reported?: boolean;
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
  let quotedByAuthors;
  if (entry.quotedByAuthors && entry.quotedByAuthors.length > 0) {
    quotedByAuthors = entry.quotedByAuthors.map((author: any) => {
      let avatarWithGateway;
      if (author.avatar) {
        avatarWithGateway = getMediaUrl(ipfsGateway, author.avatar);
      }
      return {
        ...author,
        avatar: avatarWithGateway,
      };
    });
  }

  return {
    author: {
      CID: entry.author.CID,
      description: entry.author.description,
      avatar: getMediaUrl(ipfsGateway, entry.author.avatar),
      coverImage: getMediaUrl(ipfsGateway, entry.author.coverImage),
      ensName: entry.author.userName,
      userName: entry.author.name,
      ethAddress: entry.author.ethAddress,
      pubKey: entry.author.pubKey,
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
    delisted: entry.delisted || false,
    reported: entry.reported || false,
    postId: entry.postId,
    quotedBy: entry.quotedBy,
    quotedByAuthors: quotedByAuthors,
  };
};
