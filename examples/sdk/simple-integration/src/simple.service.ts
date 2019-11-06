import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';

export const serviceName = 'simpleService';

const service: AkashaService = (invoke, log) => {
  log.info(`${serviceName} initiated!`);
  const logMore = async (q: string) => {
    log.info(`logMore: ${q}`);
  };

  return { logMore };
};

export default { name: serviceName, service };
