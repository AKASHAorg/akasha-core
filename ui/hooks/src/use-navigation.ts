import { ItemTypes } from '@akashaorg/ui-awf-typings/lib/app-loader';
import { useQueryClient } from 'react-query';
import { IContentClickDetails } from '@akashaorg/design-system/lib/components/EntryCard/entry-box';
import React from 'react';
import { COMMENT_KEY } from './index';
import { NavigateToParams } from '@akashaorg/ui-awf-typings';

export const useEntryNavigation = (
  navigateFn?: (args: NavigateToParams) => void,
  currentPostId?: string,
) => {
  const queryClient = useQueryClient();

  return React.useCallback(
    (navigationDetails: IContentClickDetails, itemType: ItemTypes) => {
      const { id, replyTo } = navigationDetails;
      if (typeof navigateFn !== 'function' || (currentPostId && currentPostId === id)) {
        return;
      }

      const dynamicUrlSegment =
        /* Navigate to parent post because we don't have the comment page yet */
        itemType === ItemTypes.COMMENT
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
