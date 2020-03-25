// service for creating objects of cache container
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import Stash from '@akashaproject/sdk-runtime/lib/Stash';
import { CACHE_SERVICE } from './constants';

const service: AkashaService = (invoke, log) => {
  const stash = new Stash({ max: 512, maxAge: 0 });
  const getStash = async () => stash;
  return { getStash };
};

export default { service, name: CACHE_SERVICE };
