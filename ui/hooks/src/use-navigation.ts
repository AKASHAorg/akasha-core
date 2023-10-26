import React from 'react';
import { NavigateToParams, EntityTypes, IContentClickDetails } from '@akashaorg/typings/lib/ui';

/**
 * Hook to navigation to entry's page
 * @example useEntryNavigation hook
 * ```typescript
 * // navigateFn handles the actual navigation
 * const handleEntryNavigate = useEntryNavigation(navigateTo, 'current-beam-id');
 * ```
 */
export const useEntryNavigation = (
  navigateFn?: (args: NavigateToParams) => void,
  currentBeamId?: string,
) => {
  return React.useCallback(
    (navigationDetails: IContentClickDetails, itemType: EntityTypes) => {
      const { id, reflect } = navigationDetails;
      if (typeof navigateFn !== 'function' || (currentBeamId && currentBeamId === id)) {
        return;
      }

      navigateFn({
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: navRoutes =>
          `${itemType === EntityTypes.REFLECT ? navRoutes.Reflect : navRoutes.Beam}/${id}${
            reflect ? navRoutes.Reflect : ''
          }`,
      });
    },
    [navigateFn, currentBeamId],
  );
};
