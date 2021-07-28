import { useQuery } from 'react-query';
import { lastValueFrom } from 'rxjs';
import { getMediaUrl } from './utils/media-utils';
import getSDK from '@akashaproject/awf-sdk';

export const TRENDING_TAGS_KEY = 'Trending_Tags';
export const TRENDING_PROFILES_KEY = 'Trending_Profiles';

const getTrendingTags = async () => {
  const sdk = getSDK();
  const res = await lastValueFrom(sdk.api.tags.getTrending());
  return res.data.searchTags;
};

export function useTrendingTags() {
  return useQuery([TRENDING_TAGS_KEY], () => getTrendingTags(), {
    placeholderData: [],
    keepPreviousData: true,
  });
}

const getTrendingProfiles = async () => {
  const sdk = getSDK();
  const res = await lastValueFrom(sdk.api.profile.getTrending());
  const profiles = res.data.searchProfiles.map(profile => {
    const { avatar, coverImage, ...other } = profile;
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
  return profiles || [];
};

export function useTrendingProfiles() {
  return useQuery([TRENDING_PROFILES_KEY], () => getTrendingProfiles(), {
    placeholderData: [],
    keepPreviousData: true,
  });
}
