import initDI from '@akashaproject/sdk-core';
import registerCommonModule from '@akashaproject/sdk-common';
import initChannel from './channel';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';

export default async function init () {
  const di: DIContainer = await initDI();
  const commonModule = registerCommonModule();

  const modules = { common: commonModule };
  const start = async () => {
    for (const moduleName of Object.values(modules)) {
      await moduleName.startServices(di);
    }
  };

  const channel = initChannel(di);
  return { di, channel, modules, start };
}
