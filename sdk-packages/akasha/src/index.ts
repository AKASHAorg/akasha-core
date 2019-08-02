import registerCommonModule from '@akashaproject/sdk-common';
import initDI from '@akashaproject/sdk-core';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import initChannel from './channel';
import { buildModuleServiceChannels, IModuleCallableService, startServices } from './utils';

export default async function init(options = { start: true }) {
  const di: DIContainer = await initDI();
  const commonModule = registerCommonModule();
  let modules: IModuleCallableService;
  // list of all the registered modules for the sdk
  const modulesList = [commonModule];
  // general channel to send service calls
  const channel = initChannel(di);

  const start = async (): Promise<IModuleCallableService> => {
    await startServices(modulesList, di);
    // build the module services for the sdk consumer
    return buildModuleServiceChannels(modulesList, channel.send);
  };
  if (options.start) {
    modules = await start();
  }
  const baseReturnedObj = { di, channel };
  // for the case when options.start is false the start function is returned
  const startFn = options.start ? { modules } : { start };
  return Object.assign({}, baseReturnedObj, startFn);
}
