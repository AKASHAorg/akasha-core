// service for creating objects of cache container
import { IAkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import Stash from '@akashaproject/sdk-runtime/lib/Stash';
import { CACHE_PROVIDER_FACTORY } from './constants';

const registerCacheProvider = (di: DIContainer): IAkashaService => {
  const service = () => {
    const stash = new Stash();
    return () => stash;
  };
  return { name: CACHE_PROVIDER_FACTORY, service };
};

export default registerCacheProvider;
