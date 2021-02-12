import * as React from 'react';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import { getMediaUrl } from './utils/media-utils';
import { forkJoin } from 'rxjs';
import { mapEntry } from './utils/entry-utils';

export interface UseSearchActions {
  search: (keyword: string) => void;
}

export interface UseSearchState {
  profiles: any[];
  entries: any[];
  comments: any[];
  tags: any[];
  isFetching: boolean;
}

export interface UseSearchProps {
  onError: (error: IAkashaError) => void;
  logger: any;
  ipfsService: any;
  profileService: any;
  postsService: any;
}

/* A hook to get search results and resolve the data within */
export const useSearch = (props: UseSearchProps): [UseSearchState, UseSearchActions] => {
  const { onError, logger, ipfsService, profileService, postsService } = props;
  const [searchResultsState, setSearchResultsState] = React.useState<UseSearchState>({
    profiles: [],
    entries: [],
    comments: [],
    tags: [],
    isFetching: false,
  });

  const actions: UseSearchActions = {
    async search(keyword) {
      try {
        setSearchResultsState(prev => {
          return {
            ...prev,
            isFetching: true,
          };
        });
        const searchResp = await profileService.globalSearch(keyword).toPromise();
        const ipfsGatewayResp = await ipfsService.getSettings(null).toPromise();

        // get profiles data
        const getProfilesCalls = searchResp.data?.globalSearch?.profiles?.map(
          (profile: { id: string }) => {
            return profileService.getProfile({ pubKey: profile.id });
          },
        );
        const profilesResp: any = await forkJoin(getProfilesCalls).toPromise();
        const completeProfiles = profilesResp?.map((profileResp: any) => {
          const { avatar, coverImage, ...other } = profileResp.data?.resolveProfile;
          const images: { avatar: string | null; coverImage: string | null } = {
            avatar: null,
            coverImage: null,
          };
          if (avatar) {
            images.avatar = getMediaUrl(ipfsGatewayResp.data, avatar);
          }
          if (coverImage) {
            images.coverImage = getMediaUrl(ipfsGatewayResp.data, coverImage);
          }
          const profileData = { ...images, ...other };
          return profileData;
        });

        // get posts data
        const getEntriesCalls = searchResp.data?.globalSearch?.posts?.map((entry: { id: string }) =>
          postsService.entries.getEntry({ entryId: entry.id }),
        );
        const entriesResp: any = await forkJoin(getEntriesCalls).toPromise();

        const completeEntries = entriesResp?.map((entryResp: any) => {
          return mapEntry(entryResp.data?.getPost, ipfsGatewayResp.data, logger);
        });

        // get comments data
        const getCommentsCalls = searchResp.data?.globalSearch?.comments?.map(
          (comment: { id: string }) => postsService.comments.getComment({ commentID: comment.id }),
        );
        const commentsResp: any = await forkJoin(getCommentsCalls).toPromise();

        const completeComments = commentsResp?.map((commentResp: any) => {
          return mapEntry(commentResp.data?.getComment, ipfsGatewayResp.data, logger);
        });

        // get tags data
        const completeTags = searchResp.data?.globalSearch?.tags?.map(
          (tag: { id: string; name: string }) => tag.name,
        );

        setSearchResultsState({
          isFetching: false,
          profiles: completeProfiles || [],
          entries: completeEntries || [],
          comments: completeComments || [],
          tags: completeTags || [],
        });
      } catch (ex) {
        if (onError) {
          onError({
            errorKey: 'useSearch.search',
            error: ex,
            critical: false,
          });
        }
      }
    },
  };

  return [searchResultsState, actions];
};

export default useSearch;
