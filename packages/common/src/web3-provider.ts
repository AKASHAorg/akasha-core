import { ICommonSettings } from '@akashaproject/sdk-core/lib/settings';
import { SETTINGS_SERVICE, WEB3_SERVICE } from '@akashaproject/sdk-core/lib/constants';
import { CONNECT_EXISTING, ETH_NETWORK } from './settings';
import { ethers } from 'ethers';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { moduleName } from './constants';

export default function registerService (di: DIContainer) {

  const runService = async function() {
    let service;
    const moduleSettings: ICommonSettings = di.getService(SETTINGS_SERVICE).getSettings(moduleName);
    const networkSettings = moduleSettings.find(serviceSettings => serviceSettings[0] === ETH_NETWORK);
    if (!networkSettings) {
      throw new Error(`Must provide an ${ETH_NETWORK} value.`);
    }
    const network = networkSettings[1];
    if (network !== CONNECT_EXISTING) {
      service = ethers.getDefaultProvider(network);
    } else {
      service = ethers;
    }

    return service;
  };

  return { name: WEB3_SERVICE, service: runService };
}
