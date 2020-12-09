import { forkJoin } from 'rxjs';

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

export const uploadMediaToIpfs = (ipfsService: any) => (data: string | File, isUrl = false) => {
  const ipfsGatewayCall = ipfsService.getSettings({});
  const uploadCall = ipfsService.upload([{ isUrl, content: data }]);
  return forkJoin([ipfsGatewayCall, uploadCall]).toPromise();
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
  try {
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    result = String.fromCharCode(...new Uint16Array(bytes.buffer));
  } catch (err) {
    console.log(err);
  }
  return result;
}

export const serializeSlateToBase64 = (slateContent: any) => {
  return btoa(toBinary(JSON.stringify(slateContent)));
};

export const serializeBase64ToSlate = (base64Content: string) => {
  const stringContent = atob(base64Content);

  let result;

  const stringified = fromBinary(stringContent);
  try {
    result = JSON.parse(stringified);
  } catch (err) {}
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
) => {
  const slateContent = entry.content.find(elem => elem.property === 'slateContent');
  let content = null;
  try {
    if (slateContent) {
      content = serializeBase64ToSlate(slateContent.value);
    }
  } catch (error) {
    if (slateContent) {
      content = [
        {
          type: 'paragraph',
          children: [{ text: slateContent.value }],
        },
      ];
    }
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
    },
    CID: entry.CID,
    content: content,
    entryId: entry._id,
    ipfsLink: entry._id,
    permalink: 'null',
  };
};
