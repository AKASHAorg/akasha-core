import { useEffect } from 'react';
import { useGetLogin } from './use-login.new';
import { useQueryClient } from '@tanstack/react-query';
import { useGetMyProfileQuery } from './generated/hooks-new';
import { LOGIN_STATE_KEY } from './use-login.new';
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
    //users who hasnt filled in their account info has no akashaProfile(null), but they are considered logged in if the viewer is not null
    select: response => response.viewer,
  });

  console.log('useLoggedIn', 'useGetLogin', loginQuery, myProfileQuery);

  useEffect(() => {

    if (!loginQuery.data?.id && myProfileQuery.data) {
      const res = async () => await queryClient.resetQueries(useGetMyProfileQuery.getKey());
      res();
    }
  }, [loginQuery.data, myProfileQuery, queryClient]);

  return {
    // myProfileQuery.data is used for login state because it is more reliable than loginQuery.data for checking if a user is truly logged in on ceramic or not
    isLoggedIn: !!myProfileQuery.data,
    loggedInProfileId: (
      myProfileQuery.data?.akashaProfile?.did.id ??
      (loginQuery.data?.id || '')
    ).toLowerCase(),
    userName: myProfileQuery.data?.akashaProfile?.name ?? '',
    avatar: myProfileQuery.data?.akashaProfile?.avatar ?? null,
  };
}
