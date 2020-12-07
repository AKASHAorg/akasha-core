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

export const serializeToSlate = (
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

export const mapEntry = (entry: any, ipfsGateway: string) => {
  let content;
  try {
    content = JSON.parse(atob(entry.content[0].value));
  } catch (error) {
    content = [
      {
        type: 'paragraph',
        children: [{ text: entry.content[0].value }],
      },
    ];
  }
  return {
    author: {
      CID: entry.author.CID,
      description: entry.author.description,
      avatar: getMediaUrl(ipfsGateway, entry.author.avatar),
      coverImage: getMediaUrl(
        ipfsGateway,
        entry.author.backgroundImage?.hash,
        entry.author.backgroundImage?.data,
      ),
      ensName: entry.author.userName,
      userName: entry.author.name,
      ethAddress: entry.author.ethAddress,
      postsNumber: entry.author.entries && Object.keys(entry.author.entries).length,
    },
    CID: entry.CID,
    content,
    entryId: entry._id,
    ipfsLink: entry._id,
    permalink: 'null',
  };
};
