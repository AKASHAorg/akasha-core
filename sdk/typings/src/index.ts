import TYPES from './service.types';
import Services from './service.interfaces';
import { Observable } from 'rxjs';
import { AWF_IAuth } from './interfaces';
import { AWF_IENS } from './interfaces/registry';
import AWF_IProfile from './interfaces/profile';
import { AWF_IComments, AWF_IEntry, AWF_ITags } from './interfaces/posts';
import * as events from './interfaces/events';

export interface IAwfSDK {
  services: Services;
  api: {
    globalChannel: Observable<unknown>;
    auth: AWF_IAuth;
    ens: AWF_IENS;
    profile: AWF_IProfile;
    entries: AWF_IEntry;
    tags: AWF_ITags;
    comments: AWF_IComments;
  };
}
export { Services };
export { TYPES };

export { events };
