import { forkJoin } from 'rxjs';

export const authorize = async ({
  authModule,
  logger,
  setJwtToken,
  ethProvider,
}: {
  authModule: any;
  logger: any;
  setJwtToken: any;
  ethProvider: number;
}) => {
  const { auth_service } = authModule;
  const call = auth_service.signIn(ethProvider);
  call.subscribe((data: any) => {
    logger.info('we should be signed in now', data);
    console.log(data, 'the data');
    setJwtToken(data);
  });
};

export const getEthAddress = async ({
  commonModule,
  logger,
  setEthAddress,
}: {
  commonModule: any;
  logger: any;
  setEthAddress: (ethAddress: string) => void;
}) => {
  const { cache_service, web3_service } = commonModule;

  const $cache = cache_service.getStash(null);
  const $web3Instance = web3_service.web3(null);
  const call = forkJoin({
    cache: $cache,
    web3Instance: $web3Instance,
  });

  return call.subscribe(async (deps: { cache: any; web3Instance: any }) => {
    let ethAddress: string = '';
    try {
      const signer = await deps.web3Instance.getSigner();
      if (deps.cache.entries.has('auth')) {
        const authValue = deps.cache.get('auth');
        if (authValue.hasOwnProperty('ethAddress')) {
          ethAddress = authValue.ethAddress;
        }
      }
      if (!ethAddress) {
        try {
          ethAddress = await signer.getAddress();
        } catch (err) {
          throw new Error('Cannot get ethereum address!');
        }
      }
      return setEthAddress(ethAddress);
    } catch (ex) {
      logger.error(ex.message);
      throw new Error(ex.message);
    }
  });
};
