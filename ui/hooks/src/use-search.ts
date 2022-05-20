import { useQuery } from 'react-query';
import { forkJoin, lastValueFrom } from 'rxjs';

import getSDK from '@akashaorg/awf-sdk';

import { checkStatus } from './use-moderation';
import { buildProfileMediaLinks } from './utils/media-utils';
import { mapEntry } from './utils/entry-utils';
import { logError } from './utils/error-handler';

export const SEARCH_PROFILES_KEY = 'SEARCH_PROFILES';
export const SEARCH_POSTS_KEY = 'SEARCH_POSTS';
export const SEARCH_COMMENTS_KEY = 'SEARCH_COMMENTS';
export const SEARCH_TAGS_KEY = 'SEARCH_TAGS';
export const SEARCH_KEY = 'SEARCH';

const getSearchProfiles = async (
  searchQuery: string,
  page: number,
  loggedUser?: string,
  pageSize?: number,
) => {
  const sdk = getSDK();
  const searchResp = await lastValueFrom(sdk.api.profile.searchProfiles(searchQuery));

  const profilesResp = searchResp.data.searchProfiles?.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );
  // get profiles moderation status
  const getProfilesModStatus = profilesResp.map(profile =>
    checkStatus({
      user: loggedUser,
      contentIds: [profile.pubKey],
    }),
  );

  const profilesModResp = await lastValueFrom(forkJoin(getProfilesModStatus), {
    defaultValue: [],
  });

  const completeProfiles = profilesResp?.map((profileResp, idx) => {
    return {
      ...buildProfileMediaLinks(profileResp),
      ...profilesModResp[idx][0],
    };
  });

  return completeProfiles || [];
};

/**
 * Hook to search for profiles
 * @returns search results for profiles, containing full profile data
 */
export function useSearchProfiles(
  searchQuery: string,
  page: number,
  loggedUser?: string,
  enabler = true,
  pageSize = 5,
) {
  return useQuery(
    [SEARCH_PROFILES_KEY, searchQuery, page],
    () => getSearchProfiles(searchQuery, page, loggedUser, pageSize),
    {
      initialData: [],
      enabled: !!(searchQuery && enabler),
      keepPreviousData: true,
      onError: (err: Error) => logError('useSearch.searchProfiles', err),
    },
  );
}

const getSearchPosts = async (
  searchQuery: string,
  page: number,
  loggedUser?: string,
  pageSize = 5,
) => {
  const sdk = getSDK();
  const searchResp = await lastValueFrom(sdk.api.profile.globalSearch(searchQuery));

  // get posts data
  const getEntriesCalls = searchResp.data?.globalSearch?.posts
    ?.slice((page - 1) * pageSize, page * pageSize)
    ?.map((entry: { id: string }) => sdk.api.entries.getEntry(entry.id));

  // get posts moderation status
  const getEntriesModStatus = searchResp.data?.globalSearch?.posts?.map((entry: { id: string }) =>
    checkStatus({
      user: loggedUser,
      contentIds: [entry.id],
    }),
  );

  const entriesResp = await lastValueFrom(forkJoin(getEntriesCalls), { defaultValue: [] });

  const entriesModResp = await lastValueFrom(forkJoin(getEntriesModStatus), { defaultValue: [] });

  const completeEntries = entriesResp?.map((entryResp, idx) => {
    return mapEntry({ ...entryResp.data?.getPost, ...entriesModResp[idx][0] });
  });

  return completeEntries || [];
};

/**
 * Hook to search for posts
 * @returns search results for posts
 */
export function useSearchPosts(
  searchQuery: string,
  page: number,
  loggedUser?: string,
  enabler = true,
  pageSize = 5,
) {
  return useQuery(
    [SEARCH_POSTS_KEY, searchQuery, page],
    () => getSearchPosts(searchQuery, page, loggedUser, pageSize),
    {
      initialData: [],
      enabled: !!(searchQuery && enabler),
      keepPreviousData: true,
      onError: (err: Error) => logError('useSearch.searchPosts', err),
    },
  );
}

const getSearchComments = async (
  searchQuery: string,
  page: number,
  loggedUser?: string,
  pageSize = 5,
) => {
  const sdk = getSDK();
  const searchResp = await lastValueFrom(sdk.api.profile.globalSearch(searchQuery));

  // get comments data
  const getCommentsCalls = searchResp.data?.globalSearch?.comments
    ?.slice((page - 1) * pageSize, page * pageSize)
    ?.map((comment: { id: string }) => sdk.api.comments.getComment(comment.id));

  // get comments moderation status
  const getCommentsModStatus = searchResp.data?.globalSearch?.comments?.map(
    (comment: { id: string }) =>
      checkStatus({
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

  return completeComments || [];
};

/**
 * Hook to search for comments
 * @returns search results for comments
 */
export function useSearchComments(
  searchQuery: string,
  page: number,
  loggedUser?: string,
  enabler = true,
  pageSize = 5,
) {
  return useQuery(
    [SEARCH_COMMENTS_KEY, searchQuery, page],
    () => getSearchComments(searchQuery, page, loggedUser, pageSize),
    {
      initialData: [],
      enabled: !!(searchQuery && enabler),
      keepPreviousData: true,
      onError: (err: Error) => logError('useSearch.searchComments', err),
    },
  );
}

const getSearchTags = async (searchQuery: string) => {
  const sdk = getSDK();
  const searchResp = await lastValueFrom(sdk.api.tags.searchTags(searchQuery));

  // get tags data
  const completeTags = searchResp.data?.searchTags;
  return completeTags || [];
};

/**
 * Hook to search for tags
 * @returns search results for posts, comments, tags and profiles
 */
export function useSearchTags(searchQuery: string, enabler = true) {
  return useQuery([SEARCH_TAGS_KEY, searchQuery], () => getSearchTags(searchQuery), {
    initialData: [],
    enabled: !!(searchQuery && enabler),
    keepPreviousData: true,
    onError: (err: Error) => logError('useSearch.searchTags', err),
  });
}

const getSearch = async (searchQuery: string, loggedUser?: string) => {
  const sdk = getSDK();
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
      checkStatus({
        user: loggedUser,
        contentIds: [profile.id],
      }),
  );

  const profilesResp = await lastValueFrom(forkJoin(getProfilesCalls), { defaultValue: [] });

  const profilesModResp = await lastValueFrom(forkJoin(getProfilesModStatus), {
    defaultValue: [],
  });

  const completeProfiles = profilesResp?.map((profileResp, idx) => {
    return {
      ...buildProfileMediaLinks(profileResp.data.resolveProfile),
      ...profilesModResp[idx][0],
    };
  });

  // get posts data
  const getEntriesCalls = searchResp.data?.globalSearch?.posts?.map((entry: { id: string }) =>
    sdk.api.entries.getEntry(entry.id),
  );

  // get posts moderation status
  const getEntriesModStatus = searchResp.data?.globalSearch?.posts?.map((entry: { id: string }) =>
    checkStatus({
      user: loggedUser,
      contentIds: [entry.id],
    }),
  );

  const entriesResp = await lastValueFrom(forkJoin(getEntriesCalls), { defaultValue: [] });

  const entriesModResp = await lastValueFrom(forkJoin(getEntriesModStatus), { defaultValue: [] });

  const completeEntries = entriesResp?.map((entryResp, idx) => {
    return mapEntry({ ...entryResp.data?.getPost, ...entriesModResp[idx][0] });
  });

  // get comments data
  const getCommentsCalls = searchResp.data?.globalSearch?.comments?.map((comment: { id: string }) =>
    sdk.api.comments.getComment(comment.id),
  );

  // get comments moderation status
  const getCommentsModStatus = searchResp.data?.globalSearch?.comments?.map(
    (comment: { id: string }) =>
      checkStatus({
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
};

/**
 * Hook for fetching search results for a specific query
 * @returns search results for posts, comments, tags and profiles
 */
export function useSearch(searchQuery: string, loggedUser?: string, enabler = true) {
  return useQuery([SEARCH_KEY, searchQuery], () => getSearch(searchQuery, loggedUser), {
    initialData: { profiles: [], entries: [], comments: [], tags: [] },
    enabled: !!(searchQuery && enabler),
    keepPreviousData: true,
    onError: (err: Error) => logError('useSearch.search', err),
  });
}
