import * as React from 'react';
import { forkJoin, lastValueFrom } from 'rxjs';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import getSDK from '@akashaproject/awf-sdk';
import { mapEntry } from './utils/entry-utils';
import { getMediaUrl } from './utils/media-utils';
import { createErrorHandler } from './utils/error-handler';
import moderationRequest from './moderation-request';

export interface UseSearchActions {
  /**
   * global search for a specific keyword, searches posts, comments, tags, profiles
   * @param keyword - text to search for
   */
  search: (keyword: string) => void;
  /**
   * updates an entry state from outside the hook
   */
  updateSearchState: (updatedEntry: any) => void;
}

export interface ISearchState {
  profiles: any[];
  entries: any[];
  comments: any[];
  tags: any[];
  isFetching: string | null;
}

const initialSearchState: ISearchState = {
  profiles: [],
  entries: [],
  comments: [],
  tags: [],
  isFetching: null,
};

export interface UseSearchProps {
  user: string | null;
  onError: (error: IAkashaError) => void;
  logger: any;
}

export type ISearchAction =
  | { type: 'GET_SEARCH_RESULTS'; payload: string }
  | {
      type: 'GET_SEARCH_RESULTS_SUCCESS';
      payload: { entries: any[]; comments: any[]; profiles: any[]; tags: any[] };
    }
  | { type: 'UPDATE_ENTRY'; payload: any };

const SearchStateReducer = (state: ISearchState, action: ISearchAction) => {
  switch (action.type) {
    case 'GET_SEARCH_RESULTS':
      return { ...state, isFetching: action.payload };
    case 'GET_SEARCH_RESULTS_SUCCESS': {
      const { entries, comments, profiles, tags } = action.payload;

      return {
        ...state,
        entries: entries || [],
        comments: comments || [],
        profiles: profiles || [],
        tags: tags || [],
        isFetching: null,
      };
    }

    case 'UPDATE_ENTRY': {
      const { updatedEntry } = action.payload;
      const updatedEntries = state.entries.map((entry: any) =>
        entry.entryId === updatedEntry.entryId ? updatedEntry : entry,
      );
      return {
        ...state,
        entries: updatedEntries,
      };
    }

    default:
      throw new Error('[UseSearchReducer] action is not defined!');
  }
};

/* A hook to get search results and resolve the data within */
export const useSearch = (props: UseSearchProps): [ISearchState, UseSearchActions] => {
  const { user, onError, logger } = props;

  const sdk = getSDK();

  const [searchResultsState, dispatch] = React.useReducer(SearchStateReducer, initialSearchState);

  async function fetchSearchResults(searchQuery: string) {
    const searchResp = await lastValueFrom(sdk.api.profile.globalSearch(searchQuery));
    const ipfsGateway = sdk.services.common.ipfs.getSettings().gateway;

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
        images.avatar = getMediaUrl(ipfsGateway, avatar);
      }
      if (coverImage) {
        images.coverImage = getMediaUrl(ipfsGateway, coverImage);
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

    let completeEntries = entriesResp?.map(entryResp => {
      entryIds.push(entryResp.data?.getPost._id);
      return mapEntry(entryResp.data?.getPost, ipfsGateway, logger);
    });

    try {
      // check moderation status for all entry ids
      const status = await moderationRequest.checkStatus(true, { user, contentIds: entryIds });

      if (status && status.constructor === Array) {
        // if valid response is returned and is an array, reduce to an object
        const statusObject = status.reduce(
          (obj: any, el: any) => ({ ...obj, [el.contentId]: el }),
          {},
        );

        // map through the completeEntries and update moderation props for each entry
        completeEntries = completeEntries.map(entry => ({
          ...entry,
          reported: statusObject[entry.entryId].moderated
            ? false
            : statusObject[entry.entryId].reported,
          delisted: statusObject[entry.entryId].delisted,
        }));
      }
    } catch (err) {
      entryIds.forEach(id => {
        createErrorHandler(
          `${id}`,
          false,
          onError,
        )(new Error(`Failed to fetch moderated content. ${err.message}`));
      });
    }

    // get comments data
    const getCommentsCalls = searchResp.data?.globalSearch?.comments?.map(
      (comment: { id: string }) => sdk.api.comments.getComment(comment.id),
    );
    const commentsResp = await lastValueFrom(forkJoin(getCommentsCalls));

    const completeComments = commentsResp?.map(commentResp => {
      return mapEntry(commentResp.data?.getComment, ipfsGateway, logger);
    });

    // get tags data
    const completeTags = searchResp.data?.globalSearch?.tags;

    dispatch({
      type: 'GET_SEARCH_RESULTS_SUCCESS',
      payload: {
        profiles: completeProfiles || [],
        entries: completeEntries || [],
        comments: completeComments || [],
        tags: completeTags || [],
      },
    });
  }

  React.useEffect(() => {
    if (searchResultsState?.isFetching) {
      fetchSearchResults(searchResultsState.isFetching);
    }
    return;
  }, [searchResultsState?.isFetching]);

  const actions: UseSearchActions = {
    async search(keyword) {
      dispatch({ type: 'GET_SEARCH_RESULTS', payload: keyword });
    },
    updateSearchState: (updatedEntry: any) => {
      dispatch({ type: 'UPDATE_ENTRY', payload: updatedEntry });
    },
  };

  return [searchResultsState, actions];
};

export default useSearch;
