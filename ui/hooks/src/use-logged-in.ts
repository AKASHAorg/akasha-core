import { useMemo } from 'react';
import { useGetLogin } from './use-login.new';

export function useLoggedIn() {
  const loginQuery = useGetLogin();
  const data = useMemo(() => {
    return loginQuery.data;
  }, [loginQuery.data]);
  return { isLoggedIn: !!data?.id, loggedInProfileId: data?.id };
}
