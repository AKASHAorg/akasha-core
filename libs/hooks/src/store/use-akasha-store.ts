import { useRootComponentProps } from '../use-root-props';
import { useSyncExternalStore } from 'react';
import { getProfileInfo } from './get-profile-info';
import { AuthenticationStore } from './authentication-store';
import { AkashaProfile } from '@akashaorg/typings/lib/ui';

export function useAkashaStore() {
  const { plugins } = useRootComponentProps();
  const authenticationStore = AuthenticationStore.getInstance<AkashaProfile>(
    plugins['@akashaorg/app-profile']?.profile?.getProfileInfo || getProfileInfo,
  );
  const data = useSyncExternalStore(
    authenticationStore?.subscribe,
    authenticationStore?.getSnapshot,
  );
  return { data, authenticationStore };
}
