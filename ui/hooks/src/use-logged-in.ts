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
    if (loginQuery.data?.id && !myProfileQuery.data) {
      const refetchProfileData = async () => {
        const { data } = await myProfileQuery.refetch();
        return data;
      };

      if (!refetchProfileData()) {
        queryClient.setQueryData([LOGIN_STATE_KEY], null);
      }
    }

    if (!loginQuery.data?.id && myProfileQuery.data) {
      const resetQueryPromise = queryClient.resetQueries(useGetMyProfileQuery.getKey());
      const timeoutPromise = new Promise((resolve, _) => {
        setTimeout(resolve, 3000);
      });

      const res = async () => Promise.race([resetQueryPromise, timeoutPromise]);
      res();
    }
  }, [loginQuery.data, myProfileQuery, queryClient]);

  return {
    isLoggedIn: !!myProfileQuery.data,
    loggedInProfileId: (
      myProfileQuery.data?.akashaProfile?.did.id ??
      (loginQuery.data?.id || '')
    ).toLowerCase(),
    userName: myProfileQuery.data?.akashaProfile?.name ?? '',
    avatar: myProfileQuery.data?.akashaProfile?.avatar ?? null,
  };
}
