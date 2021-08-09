import { useQuery } from 'react-query';
import { lastValueFrom, forkJoin } from 'rxjs';
import { getMediaUrl } from './utils/media-utils';
import { mapEntry } from './utils/entry-utils';
import getSDK from '@akashaproject/awf-sdk';
import { logError } from './utils/error-handler';

export const SEARCH_KEY = 'SEARCH';

const getSearch = async (searchQuery: string) => {
  const sdk = getSDK();
  try {
    const searchResp = await lastValueFrom(sdk.api.profile.globalSearch(searchQuery));

    // get profiles data
    const getProfilesCalls = searchResp.data?.globalSearch?.profiles?.map(
      (profile: { id: string }) => {
        return sdk.api.profile.getProfile({ pubKey: profile.id });
      },
    );
    const profilesResp = await lastValueFrom(forkJoin(getProfilesCalls));
    const completeProfiles = profilesResp?.map(profileResp => {
      const { avatar, coverImage, ...other } = profileResp.data.resolveProfile;
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

    // get posts data
    const getEntriesCalls = searchResp.data?.globalSearch?.posts?.map((entry: { id: string }) =>
      sdk.api.entries.getEntry(entry.id),
    );
    const entriesResp = await lastValueFrom(forkJoin(getEntriesCalls));

    const entryIds: string[] = [];

    const completeEntries = entriesResp?.map(entryResp => {
      entryIds.push(entryResp.data?.getPost._id);
      return mapEntry(entryResp.data?.getPost);
    });

    // get comments data
    const getCommentsCalls = searchResp.data?.globalSearch?.comments?.map(
      (comment: { id: string }) => sdk.api.comments.getComment(comment.id),
    );
    const commentsResp = await lastValueFrom(forkJoin(getCommentsCalls));

    const completeComments = commentsResp?.map(commentResp => {
      return mapEntry(commentResp.data?.getComment);
    });

    // get tags data
    const completeTags = searchResp.data?.globalSearch?.tags;
    return {
      profiles: completeProfiles || [],
      entries: completeEntries || [],
      comments: completeComments || [],
      tags: completeTags || [],
    };
  } catch (error) {
    logError('useSearch.search', error);
  }
};

export function useSearch(searchQuery: string) {
  return useQuery([SEARCH_KEY, searchQuery], () => getSearch(searchQuery), {
    placeholderData: { profiles: [], entries: [], comments: [], tags: [] },
    keepPreviousData: true,
  });
}
