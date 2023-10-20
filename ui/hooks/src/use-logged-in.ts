import { useEffect } from 'react';
import { useGetLogin } from './use-login.new';
import { useGetMyProfileQuery } from './generated/hooks-new';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook for retrieving a flag to check if a user is logged in or not and the profile id of a user
 * @example useLoggedIn hook
 * ```typescript
 * const { isLoggedIn, loggedInProfileId } = useLoggedIn();
 * ```
 */
export function useLoggedIn() {
  const loginQuery = useGetLogin();
  const queryClient = useQueryClient();

  const myProfileQuery = useGetMyProfileQuery(null, {
    enabled: !!loginQuery.data?.id,
    select: response => response.viewer,
  });

  useEffect(() => {
    if (loginQuery.data?.id && !myProfileQuery.data) {
      myProfileQuery.refetch();
    }

    if (!loginQuery.data?.id && myProfileQuery.data) {
      queryClient.resetQueries(useGetMyProfileQuery.getKey());
    }
  }, [loginQuery.data, myProfileQuery, queryClient]);

  return {
    isLoggedIn: !!myProfileQuery.data,
    loggedInProfileId: (
      myProfileQuery.data?.akashaProfile?.did.id ??
      (loginQuery.data?.id || '')
    ).toLowerCase(),
  };
}
