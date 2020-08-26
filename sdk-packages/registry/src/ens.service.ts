import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import {
  ENS_SERVICE,
  REGISTRAR_ADDRESS,
  REVERSE_STRING,
  RESOLVER_ADDRESS,
  ENS_ADDRESS,
} from './constants';
import AkashaRegistrarABI from './artifacts/AkashaRegistrar.json';
import ReverseRegistrarABI from './artifacts/ReverseRegistrar.json';
import EnsABI from './artifacts/ENS.json';

import commonServices, { WEB3_SERVICE } from '@akashaproject/sdk-common/lib/constants';

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
    const registerTx = await AkashaRegistrarInstance.register(args.name, RESOLVER_ADDRESS);
    await registerTx.wait();
    await claimName(args);
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
    return AkashaRegistrarInstance.isAvailable(args.name);
  };

  const resolveAddress = async (args: { ethAddress: string }) => {
    const web3Provider = await invoke(commonServices[WEB3_SERVICE]).getWeb3Instance();
    return await web3Provider.lookupAddress(args.ethAddress);
  };

  const resolveName = async (args: { name: string }) => {
    const web3Provider = await invoke(commonServices[WEB3_SERVICE]).getWeb3Instance();
    return await web3Provider.resolveName(args.name);
  };

  // boilerplate for smart contracts
  const setupContracts = async () => {
    const web3Provider = await invoke(commonServices[WEB3_SERVICE]).getWeb3Instance();
    const contractFactory = await invoke(commonServices[WEB3_SERVICE]).getContractFactory();
    const AkashaRegistrar = await contractFactory.fromSolidity(AkashaRegistrarABI);
    const ReverseRegistrar = await contractFactory.fromSolidity(ReverseRegistrarABI);
    const ENS = await contractFactory.fromSolidity(EnsABI);
    const signer = await web3Provider.getSigner();
    AkashaRegistrarInstance = await AkashaRegistrar.connect(signer);
    AkashaRegistrarInstance = await AkashaRegistrarInstance.attach(REGISTRAR_ADDRESS);
    // get the ens address from subdomain registrar
    // const ensAddress = await AkashaRegistrarInstance.ens();
    ENSinstance = await ENS.connect(signer);
    ENSinstance = await ENSinstance.attach(ENS_ADDRESS);
    await AkashaRegistrarInstance.deployed();
    await ENSinstance.deployed();
    // getting the actual reverse address from registry
    const reverseAddress = await ENSinstance.owner(REVERSE_STRING);
    ReverseRegistrarInstance = await ReverseRegistrar.connect(signer);
    ReverseRegistrarInstance = await ReverseRegistrarInstance.attach(reverseAddress);
    await ReverseRegistrarInstance.deployed();
  };

  // interact with contracts from ui
  const getContracts = async () => {
    return {
      AkashaRegistrarInstance,
      ENSinstance,
      ReverseRegistrarInstance,
    };
  };

  return { getContracts, claimName, registerName, resolveAddress, resolveName, isAvailable };
};

export default { service, name: ENS_SERVICE };
