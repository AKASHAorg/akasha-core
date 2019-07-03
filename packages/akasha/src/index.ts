import initDI from '@akashaproject/sdk-core';
import runtime from '@akashaproject/sdk-runtime';
import registerCommonModule from '@akashaproject/sdk-common';

export default function init () {
  const di = initDI();
  const commonModule = registerCommonModule();
  commonModule.init(di);


  const modules = { common: commonModule };
  const start = async () => {
    for(const moduleName of Object.values(modules)){
      await moduleName.startServices(di);
    }
  };
  return { di, Channel: runtime.Transport, modules, start }
}
