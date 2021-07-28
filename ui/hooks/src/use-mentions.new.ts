import { useQuery } from 'react-query';
import { lastValueFrom } from 'rxjs';
import getSDK from '@akashaproject/awf-sdk';
import { getMediaUrl } from './utils/media-utils';

export const TAGS_KEY = 'Tags';
export const MENTIONS_KEY = 'Mentions';

const getTags = async tagName => {
  const sdk = getSDK();
  const res = await lastValueFrom(sdk.api.tags.searchTags(tagName));
  return res;
};

export function useTags(tagName: string) {
  return useQuery([TAGS_KEY, tagName], () => getTags(tagName), {
    enabled: !!tagName,
    keepPreviousData: true,
  });
}

const getMentions = async mention => {
  const sdk = getSDK();
  const res = await lastValueFrom(sdk.api.profile.searchProfiles(mention));
  const completeProfiles = res.data.searchProfiles.map(profileResp => {
    const { avatar, coverImage, ...other } = profileResp;
    const images: { avatar: string | null; coverImage: string | null } = {
      avatar: null,
      coverImage: null,
    };
    if (avatar) {
      images.avatar = getMediaUrl(avatar);
    }
    if (coverImage) {
      images.coverImage = getMediaUrl(coverImage);
    }
    const profileData = { ...images, ...other };
    return profileData;
  });
  return completeProfiles;
};

export function useMentions(mention: string) {
  return useQuery([MENTIONS_KEY, mention], () => getMentions(mention), {
    enabled: !!mention,
    keepPreviousData: true,
  });
}
