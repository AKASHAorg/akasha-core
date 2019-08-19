import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { registerServiceMethods, toNamedService } from '@akashaproject/sdk-core/lib/utils';
import { DB_SERVICE } from './constants';
import connect from './db.methods/connect';

const service: AkashaService = serviceInvoker => {
  return registerServiceMethods({ connect });
};

export default toNamedService(DB_SERVICE, service);
