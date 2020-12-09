// import { forkJoin } from 'rxjs';

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

export const uploadMediaToTextile = (profileStore: any) => (data: any, isUrl = false) => {
  // const gatewayCall = profileStore.getSettings({});
  const uploadData: { isUrl: boolean; content: any; name?: string } = {
    isUrl,
    content: data,
  };
  if (data.name) {
    uploadData.name = data.name;
  }
  const uploadCall = profileStore.saveMediaFile(uploadData);
  return uploadCall.toPromise();
  // return forkJoin([ipfsGatewayCall, uploadCall]).toPromise();
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
    CID: string;
    _id: string;
    author: {
      CID: string;
      description: string;
      avatar: string;
      coverImage: string;
      userName: string;
      name: string;
      ethAddress: string;
    };
  },
  ipfsGateway: string,
  logger?: any,
) => {
  const slateContent = entry.content.find(elem => elem.property === 'slateContent');
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
    // in the slate content only the ipfs hash preprended with ipfs: is saved for the image urls
    // like: ipfs:
    if (node.type === 'image' && node.url.startsWith('ipfs:')) {
      node.url = getMediaUrl(ipfsGateway, node.url.slice(4));
    }
    return node;
  });

  return {
    author: {
      CID: entry.author.CID,
      description: entry.author.description,
      avatar: getMediaUrl(ipfsGateway, entry.author.avatar),
      coverImage: getMediaUrl(ipfsGateway, entry.author.coverImage),
      ensName: entry.author.userName,
      userName: entry.author.name,
      ethAddress: entry.author.ethAddress,
    },
    CID: entry.CID,
    content: contentWithMediaGateways,
    entryId: entry._id,
    ipfsLink: entry._id,
    permalink: 'null',
  };
};
