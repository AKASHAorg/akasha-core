import * as React from 'react';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import { createErrorHandler } from './utils/error-handler';
import { debounceTime } from 'rxjs/operators';

export interface UseMentionsActions {
  getTags: (query: string) => void;
  getMentions: (query: string) => void;
}

export interface UseMentionsProps {
  onError?: (error: IAkashaError) => void;
  profileService: any;
  postsService: any;
}

export interface UseMentionsState {
  tags: any[];
  mentions: any[];
}

/* A hook to access legal documents from the ipfsService */
export const useMentions = (props: UseMentionsProps): [UseMentionsState, UseMentionsActions] => {
  const { onError, profileService, postsService } = props;
  const [mentionsState, setMentionsState] = React.useState<UseMentionsState>({
    tags: [],
    mentions: [],
  });

  const actions: UseMentionsActions = {
    getMentions(query) {
      const mentionsService = profileService
        .searchProfiles({
          name: query,
        })
        .pipe(debounceTime(300));
      mentionsService.subscribe((resp: any) => {
        if (resp.data?.searchProfiles) {
          const filteredMentions = resp.data.searchProfiles;
          setMentionsState(prev => ({ ...prev, mentions: filteredMentions }));
        }
      }, createErrorHandler('useMentions.getMentions', false, onError));
    },
    getTags(query) {
      const tagsService = postsService.searchTags({ tagName: query }).pipe(debounceTime(300));
      tagsService.subscribe((resp: any) => {
        if (resp.data?.searchTags) {
          const filteredTags = resp.data.searchTags;
          setMentionsState(prev => ({ ...prev, tags: filteredTags }));
        }
      }, createErrorHandler('useMentions.getMentions', false, onError));
    },
  };

  return [mentionsState, actions];
};

export default useMentions;
