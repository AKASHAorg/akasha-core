import { useRootComponentProps } from '../use-root-props';
import { useSyncExternalStore } from 'react';
import { getAkashaProfileInfo } from './get-akasha-profile-info';
import { AuthenticationStore } from './authentication-store';
import { AkashaProfile } from '@akashaorg/typings/lib/ui';

export function useAkashaStore() {
  const { plugins } = useRootComponentProps();
  const authenticationStore = AuthenticationStore.getInstance<AkashaProfile>(
    plugins['@akashaorg/app-profile']?.profile?.getProfileInfo || getAkashaProfileInfo,
  );
  const data = useSyncExternalStore(
    authenticationStore?.subscribe,
    authenticationStore?.getSnapshot,
  );
  return { data, authenticationStore };
}
