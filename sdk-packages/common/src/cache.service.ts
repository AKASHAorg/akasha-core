// service for creating objects of cache container
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import {
  createServiceMethod,
  registerServiceMethods,
  toNamedService
} from '@akashaproject/sdk-core/lib/utils';
import Stash from '@akashaproject/sdk-runtime/lib/Stash';
import { CACHE_SERVICE } from './constants';

const service: AkashaService = () => {
  const stash = new Stash({ max: 500, maxAge: 1000 * 60 * 60 });
  return registerServiceMethods({ stash: createServiceMethod(stash) });
};

export default toNamedService(CACHE_SERVICE, service);
