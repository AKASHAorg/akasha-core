import { useMemo } from 'react';
import { useGetLogin } from './use-login.new';

/**
 * Hook for retrieving a flag to check if a user is logged in or not and the profile id of a user
 * @example useLoggedIn hook
 * ```typescript
 * const { isLoggedIn, loggedInProfileId } = useLoggedIn();
 * ```
 */
export function useLoggedIn() {
  const loginQuery = useGetLogin();
  const data = useMemo(() => {
    return loginQuery.data;
  }, [loginQuery.data]);
  return { isLoggedIn: !!data?.id, loggedInProfileId: (data?.id || '').toLowerCase() };
}
