import TYPES from './service.types';
import Services from './service.interfaces';
import { Observable } from 'rxjs';
import { IAWF_Auth } from './interfaces';

export interface AwfSDK {
  services: Services;
  api: {
    globalChannel: Observable<unknown>;
    auth: IAWF_Auth;
  };
}
export { Services };
export { TYPES };
