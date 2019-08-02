// service for creating objects of cache container
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import Stash from '@akashaproject/sdk-runtime/lib/Stash';
import { CACHE_PROVIDER_FACTORY } from './constants';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';

const registerCacheProvider = function(di: DIContainer): AkashaService {
  const service = function() {
    const stash = new Stash();
    return () => stash;
  };
  return { name: CACHE_PROVIDER_FACTORY, service };
};

export default registerCacheProvider;
