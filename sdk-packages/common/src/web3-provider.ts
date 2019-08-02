import { services as coreServices } from '@akashaproject/sdk-core/lib/constants';
import { IAkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { ICommonSettings } from '@akashaproject/sdk-core/lib/settings';
import { callService } from '@akashaproject/sdk-core/lib/utils';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { ethers } from 'ethers';
import { moduleName, services as commonServices, WEB3_SERVICE_PROVIDER } from './constants';
import { CONNECT_EXISTING, ETH_NETWORK } from './settings';

export default function registerService(di: DIContainer): IAkashaService {
  const runService = async () => {
    let service;
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
      service = ethers.getDefaultProvider(network);
    } else {
      const existingProvider = await callService(di, commonServices.WEB3_EXISTING_PROVIDER);
      service = new ethers.providers.Web3Provider(existingProvider);
    }

    return () => service;
  };

  return { name: WEB3_SERVICE_PROVIDER, service: runService };
}
