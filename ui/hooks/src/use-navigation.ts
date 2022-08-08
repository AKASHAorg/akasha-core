import React from 'react';
import { useQueryClient } from 'react-query';

import { NavigateToParams, EntityTypes } from '@akashaorg/typings/ui';
import { IContentClickDetails } from '@akashaorg/design-system/lib/components/EntryCard/entry-box';

import { COMMENT_KEY } from './index';

/**
 * Hook to navigation to entry's page
 * @example useEntryNavigation hook
 * ```typescript
 * // navigateFn handles the actual navigation
 * const handleEntryNavigate = useEntryNavigation(navigateTo, 'current-post-id');
 * ```
 */
export const useEntryNavigation = (
  navigateFn?: (args: NavigateToParams) => void,
  currentPostId?: string,
) => {
  const queryClient = useQueryClient();

  return React.useCallback(
    (navigationDetails: IContentClickDetails, itemType: EntityTypes) => {
      const { id, replyTo } = navigationDetails;
      if (typeof navigateFn !== 'function' || (currentPostId && currentPostId === id)) {
        return;
      }

      const dynamicUrlSegment =
        /* Navigate to parent post because we don't have the comment page yet */
        itemType === EntityTypes.COMMENT
          ? queryClient.getQueryData<{ postId: string }>([COMMENT_KEY, id])?.postId ||
            replyTo?.entryId
          : id;

      navigateFn({
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: navRoutes => `${navRoutes.Post}/${dynamicUrlSegment}`,
      });
    },
    [navigateFn, queryClient, currentPostId],
  );
};
