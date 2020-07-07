import registerRegistryModule from '@akashaproject/sdk-registry';
import { extractCallableServices } from '../utils';
import { ENS_SERVICE } from '@akashaproject/sdk-registry/lib/constants';

export const registryModule = registerRegistryModule();

/**
 *
 * @param channel
 * returns { registry: { ens: { getContracts, claimName, registerName  }}}
 */
export default function registryApi(channel) {
  const extractedServices = extractCallableServices(registryModule, channel);
  return {
    [registryModule.name]: {
      ens: {
        getContracts: extractedServices[ENS_SERVICE]('getContracts'),
        claimName: extractedServices[ENS_SERVICE]('claimName'),
        registerName: extractedServices[ENS_SERVICE]('registerName'),
      },
    },
  };
}
