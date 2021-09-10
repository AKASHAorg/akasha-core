import { useQuery } from 'react-query';
import { lastValueFrom, forkJoin } from 'rxjs';

import getSDK from '@akashaproject/awf-sdk';

import moderationRequest from './moderation-request';
import { getMediaUrl } from './utils/media-utils';
import { mapEntry } from './utils/entry-utils';
import { logError } from './utils/error-handler';

export const SEARCH_KEY = 'SEARCH';

const getSearch = async (searchQuery: string, loggedUser?: string) => {
  const sdk = getSDK();
  try {
    const searchResp = await lastValueFrom(sdk.api.profile.globalSearch(searchQuery));

    // get profiles data
    const getProfilesCalls = searchResp.data?.globalSearch?.profiles?.map(
      (profile: { id: string }) => {
        return sdk.api.profile.getProfile({ pubKey: profile.id });
      },
    );

    // get profiles moderation status
    const getProfilesModStatus = searchResp.data?.globalSearch?.profiles?.map(
      (profile: { id: string }) =>
        moderationRequest.checkStatus(true, {
          user: loggedUser,
          contentIds: [profile.id],
        }),
    );

    const profilesResp = await lastValueFrom(forkJoin(getProfilesCalls), { defaultValue: [] });

    const profilesModResp = await lastValueFrom(forkJoin(getProfilesModStatus), {
      defaultValue: [],
    });

    const completeProfiles = profilesResp?.map((profileResp, idx) => {
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
      const profileData = { ...images, ...other, ...profilesModResp[idx][0] };
      return profileData;
    });

    // get posts data
    const getEntriesCalls = searchResp.data?.globalSearch?.posts?.map((entry: { id: string }) =>
      sdk.api.entries.getEntry(entry.id),
    );

    // get posts moderation status
    const getEntriesModStatus = searchResp.data?.globalSearch?.posts?.map((entry: { id: string }) =>
      moderationRequest.checkStatus(true, {
        user: loggedUser,
        contentIds: [entry.id],
      }),
    );

    const entriesResp = await lastValueFrom(forkJoin(getEntriesCalls), { defaultValue: [] });

    const entriesModResp = await lastValueFrom(forkJoin(getEntriesModStatus), { defaultValue: [] });

    const entryIds: string[] = [];

    const completeEntries = entriesResp?.map((entryResp, idx) => {
      entryIds.push(entryResp.data?.getPost._id);
      return mapEntry({ ...entryResp.data?.getPost, ...entriesModResp[idx][0] });
    });

    // get comments data
    const getCommentsCalls = searchResp.data?.globalSearch?.comments?.map(
      (comment: { id: string }) => sdk.api.comments.getComment(comment.id),
    );

    // get comments moderation status
    const getCommentsModStatus = searchResp.data?.globalSearch?.comments?.map(
      (comment: { id: string }) =>
        moderationRequest.checkStatus(true, {
          user: loggedUser,
          contentIds: [comment.id],
        }),
    );

    const commentsResp = await lastValueFrom(forkJoin(getCommentsCalls), { defaultValue: [] });

    const commentsModResp = await lastValueFrom(forkJoin(getCommentsModStatus), {
      defaultValue: [],
    });

    const completeComments = commentsResp?.map((commentResp, idx) => {
      return mapEntry({ ...commentResp.data?.getComment, ...commentsModResp[idx][0] });
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

export function useSearch(searchQuery: string, loggedUser?: string, enabler = true) {
  return useQuery([SEARCH_KEY, searchQuery], () => getSearch(searchQuery, loggedUser), {
    initialData: { profiles: [], entries: [], comments: [], tags: [] },
    enabled: !!(searchQuery && enabler),
    keepPreviousData: true,
  });
}
