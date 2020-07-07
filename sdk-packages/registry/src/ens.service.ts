import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { ENS_SERVICE, REGISTRAR_ADDRESS, REVERSE_STRING, RESOLVER_ADDRESS } from './constants';
import AkashaRegistrarABI from './abi/AkashaRegistrar.json';
import ReverseRegistrarABI from './abi/ReverseRegistrar.json';
import EnsABI from './abi/ENS.json';

import commonServices, { WEB3_SERVICE } from '@akashaproject/sdk-common/lib/constants';
// tslint:disable-next-line:no-var-requires
const contract = require('@truffle/contract');

const service: AkashaService = (invoke, log) => {
  let AkashaRegistrarInstance;
  let ReverseRegistrarInstance;
  let ENSinstance;

  // register an akasha.eth subdomain
  const registerName = async (args: { name: string }) => {
    const available = await isAvailable(args);
    if (!available) {
      throw new Error('Subdomain already taken!');
    }
    await AkashaRegistrarInstance.register(args.name, RESOLVER_ADDRESS);
  };

  // set the returned name for address lookup
  const claimName = async (args: { name: string }) => {
    if (!ReverseRegistrarInstance) {
      await setupContracts();
    }
    await ReverseRegistrarInstance.setName(`${args.name}.akasha.eth`);
  };

  const isAvailable = async (args: { name: string }) => {
    if (!AkashaRegistrarInstance) {
      await setupContracts();
    }
    return AkashaRegistrarInstance.isAvailable.call(args.name);
  };

  // boilerplate for smart contracts
  const setupContracts = async () => {
    // @ts-ignore
    const AkashaRegistrar = contract(AkashaRegistrarABI);
    // @ts-ignore
    const ReverseRegistrar = contract(ReverseRegistrarABI);
    // @ts-ignore
    const ENS = contract(EnsABI);

    const web3Provider = await invoke(commonServices[WEB3_SERVICE]).getWeb3Instance();
    AkashaRegistrar.setProvider(web3Provider);
    ReverseRegistrar.setProvider(web3Provider);
    ENS.setProvider(web3Provider);
    AkashaRegistrarInstance = await AkashaRegistrar.at(REGISTRAR_ADDRESS);
    // get the ens address from subdomain registrar
    const ensAddress = await AkashaRegistrarInstance.ens.call();
    ENSinstance = await ENS.at(ensAddress);
    // getting the actual reverse address from registry
    const reverseAddress = await ENSinstance.owner(REVERSE_STRING);
    ReverseRegistrarInstance = await ReverseRegistrar.at(reverseAddress);
  };

  // interact with contracts from ui
  const getContracts = async () => {
    return {
      AkashaRegistrarInstance,
      ENSinstance,
      ReverseRegistrarInstance,
    };
  };

  return { getContracts, claimName, registerName };
};

export default { service, name: ENS_SERVICE };
