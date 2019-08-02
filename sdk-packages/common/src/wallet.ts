import { services as coreServices } from '@akashaproject/sdk-core/lib/constants';
import { IAkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { ICommonSettings } from '@akashaproject/sdk-core/lib/settings';
import { callService } from '@akashaproject/sdk-core/lib/utils';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { ethers } from 'ethers';
import { moduleName, services as commonServices, WEB3_WALLET } from './constants';
import { CONNECT_EXISTING, ETH_NETWORK } from './settings';

export default function registerService(di: DIContainer): IAkashaService {
  const runService = async () => {
    const moduleSettings: ICommonSettings = (await callService(
      di,
      coreServices.SETTINGS_SERVICE
    )).getSettings(moduleName);
    const networkSettings = moduleSettings.find(
      serviceSettings => serviceSettings[0] === ETH_NETWORK
    );
    if (!networkSettings) {
      throw new Error(`Must provide an ${ETH_NETWORK} value.`);
    }
    const network = networkSettings[1];

    if (network !== CONNECT_EXISTING) {
      return () => ethers.Wallet;
    }

    return async () => {
      const provider = await callService(di, commonServices.WEB3_SERVICE_PROVIDER);
      return provider.getSigner();
    };
  };
  return { name: WEB3_WALLET, service: runService };
}
