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
  return React.useCallback(
    (navigationDetails: IContentClickDetails, itemType: EntityTypes) => {
      const { id } = navigationDetails;
      if (typeof navigateFn !== 'function' || (currentPostId && currentPostId === id)) {
        return;
      }

      navigateFn({
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: navRoutes => `${itemType === 2 ? navRoutes.Reply : navRoutes.Post}/${id}`,
      });
    },
    [navigateFn, currentPostId],
  );
};
