import initDI from '@akashaproject/sdk-core';
import registerCommonModule from '@akashaproject/sdk-common';
import initChannel from './channel';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { buildModuleServiceChannels, startServices } from './utils';

export default async function init (options = { start: true }) {
  const di: DIContainer = await initDI();
  const commonModule = registerCommonModule();

  // list of all the registered modules for the sdk
  const modulesList = [commonModule];
  // general channel to send service calls
  const channel = initChannel(di);
  // build the module services for the sdk consumer
  const modules = buildModuleServiceChannels(modulesList, channel.send);
  const start = async (): Promise<boolean> => {
    await startServices(modulesList, di);
    return true;
  };
  const baseReturnedObj = { di, channel, modules };
  if (options.start) {
    await start();
  }
  // for the case when options.start is false the start function is returned
  const startFn = options.start ? {}: { start: start };
  return Object.assign({}, baseReturnedObj, startFn);
}
