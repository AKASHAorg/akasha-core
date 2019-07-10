import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import {
  SETTINGS_SERVICE,
  WEB3_SERVICE_PROVIDER,
  WEB3_WALLET
} from '@akashaproject/sdk-core/lib/constants';
import { ICommonSettings } from '@akashaproject/sdk-core/lib/settings';
import { moduleName } from './constants';
import { CONNECT_EXISTING, ETH_NETWORK } from './settings';
import { ethers } from 'ethers';
import { IAkashaModule } from '@akashaproject/sdk-core/lib/IAkashaModule';

export default function registerService (di: DIContainer) {
  const runService = async function() {
    const moduleSettings: ICommonSettings = di.getService(SETTINGS_SERVICE).getSettings(moduleName);
    const networkSettings = moduleSettings.find(serviceSettings => serviceSettings[0] === ETH_NETWORK);
    if (!networkSettings) {
      throw new Error(`Must provide an ${ETH_NETWORK} value.`);
    }
    const network = networkSettings[1];

    if (network !== CONNECT_EXISTING) {
      return ethers.Wallet;
    }
    const provider = di.getService(IAkashaModule.getServiceName(moduleName, WEB3_SERVICE_PROVIDER));
    return provider.getSigner();
  };
  return { name: WEB3_WALLET, service: runService };
}
