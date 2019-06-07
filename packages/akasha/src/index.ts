import initDI from '@akashaproject/sdk-core';
import runtime from '@akashaproject/sdk-runtime';
import registerCommonModule from '@akashaproject/sdk-common';

export default function init () {
  const di = initDI();
  const commonModule = registerCommonModule();
  commonModule.init(di);

  return { di, Channel: runtime.Transport }
}
