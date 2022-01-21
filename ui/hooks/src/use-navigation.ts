import { ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { useQueryClient } from 'react-query';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';
import React from 'react';
import { COMMENT_KEY } from './index';
import { getLogger } from './utils/error-handler';

const StaticUrlSegments = {
  [ItemTypes.PROFILE]: '/profile/',
  [ItemTypes.TAG]: '/social-app/tags/',
  [ItemTypes.ENTRY]: '/social-app/post/',
  [ItemTypes.COMMENT]: '/social-app/post/',
};

export const useHandleNavigation = (navigateFn: (url: string) => void, currentPostId?: string) => {
  const queryClient = useQueryClient();

  return React.useCallback(
    (navigationDetails: IContentClickDetails, itemType: ItemTypes) => {
      const { id, replyTo } = navigationDetails;
      if (currentPostId && currentPostId === id) {
        return;
      }

      const staticUrlSegment = StaticUrlSegments[itemType];
      if (!staticUrlSegment) {
        const logger = getLogger('useHandleNavigation');
        return logger.warn(`ItemType ${itemType} not found in StaticUrlSegments`);
      }
      const dynamicUrlSegment =
        /* Navigate to parent post because we don't have the comment page yet */
        itemType === ItemTypes.COMMENT
          ? queryClient.getQueryData<{ postId: string }>([COMMENT_KEY, id])?.postId ||
            replyTo?.entryId
          : id;

      const url = staticUrlSegment + dynamicUrlSegment;
      navigateFn(url);
    },
    [navigateFn, queryClient, currentPostId],
  );
};
