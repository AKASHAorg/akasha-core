import TYPES from './service.types';
import Services from './service.interfaces';
import { ReplaySubject } from 'rxjs';
import { AWF_IAuth } from './interfaces';
import { AWF_IIC_REGISTRY, AWF_IENS } from './interfaces/registry';
import AWF_IProfile from './interfaces/profile';
import { AWF_IComments, AWF_IEntry, AWF_ITags } from './interfaces/posts';
import * as events from './interfaces/events';
import { GlobalEventBusData } from './interfaces/common';

/**
 * AKASHA SDK contains two main objects:
 *
 * - `api` - used to communicate with remote products and services.
 *
 * - `services` - Helpers and utilities to interact with underlying packages and technologies.
 *     - example: web3, local database, user settings (local) etc.
 */
export interface IAwfSDK {
  services: Services;
  api: {
    globalChannel: ReplaySubject<GlobalEventBusData>;
    /** {@link (AWF_IAuth:interface) | Auth APIs} */
    auth: AWF_IAuth;
    ens: AWF_IENS;
    profile: AWF_IProfile;
    entries: AWF_IEntry;
    tags: AWF_ITags;
    comments: AWF_IComments;
    icRegistry: AWF_IIC_REGISTRY;
  };
}
export { Services };
export { TYPES };

export { events };
