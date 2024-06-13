import { AkashaProfile, IUserStore } from '@akashaorg/typings/lib/ui';
import { useRootComponentProps } from '../use-root-props';
import { useSyncExternalStore } from 'react';

export function useAkashaStore() {
  const { plugins } = useRootComponentProps();
  const userStore = plugins['@akashaorg/app-profile']?.profile
    ?.userStore as IUserStore<AkashaProfile>;
  const data = useSyncExternalStore(userStore?.subscribe, userStore?.getSnapshot);
  return { data, userStore };
}
