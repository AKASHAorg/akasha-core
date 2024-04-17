import { AkashaProfile } from '@akashaorg/typings/lib/ui';
import { useRootComponentProps } from '../use-root-props';
import { UserStore } from './user-store';
import { useSyncExternalStore } from 'react';

export function useAkashaStore() {
  const { plugins } = useRootComponentProps();
  const userStore = plugins['@akashaorg/app-profile']?.profile
    ?.userStore as UserStore<AkashaProfile>;
  const data = useSyncExternalStore(userStore?.subscribe, userStore?.getSnapshot);
  return { data, userStore };
}
