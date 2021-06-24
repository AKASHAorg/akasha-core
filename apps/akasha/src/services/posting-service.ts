import { getMediaUrl } from '@akashaproject/ui-awf-hooks/lib/utils/media-utils';

export const MEDIA_URL_PREFIX = 'CID:';
export const PROVIDER_AKASHA = 'AkashaApp';
export const PROPERTY_SLATE_CONTENT = 'slateContent';
export const PROPERTY_TEXT_CONTENT = 'textContent';

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
  content: Record<string, unknown>;
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
