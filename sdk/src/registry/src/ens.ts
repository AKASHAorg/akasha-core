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
import { normalize } from 'eth-ens-namehash';
import authServices, { AUTH_SERVICE } from '@akashaproject/sdk-auth/lib/constants';
import { inject, injectable } from 'inversify';
import { TYPES } from '@akashaproject/sdk-typings';
import Logging from '../../logging';
import Gql from '../../gql';
import AWF_Auth from '../../auth';
import Settings from '../../settings';
import Web3Connector from '../../common/web3.connector';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';

@injectable()
export default class AWF_ENS {
  private readonly _web3: Web3Connector;
  private _log: ILogger;
  private _gql: Gql;
  private _auth: AWF_Auth;
  private _settings: Settings;
  constructor(
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Gql) gql: Gql,
    @inject(TYPES.Auth) auth: AWF_Auth,
    @inject(TYPES.Settings) settings: Settings,
  ) {
    this._log = log.create('AWF_ENS');
    this._gql = gql;
    this._auth = auth;
    this._settings = settings;
  }
}
//
// const service: AkashaService = (invoke, log) => {
//   let AkashaRegistrarInstance;
//   let ReverseRegistrarInstance;
//   let ENSinstance;
//   let chainChecked = false;
//
//   // register an akasha.eth subdomain
//   const registerName = async (args: { name: string }) => {
//     const validatedName = await validateName(args.name);
//     const available = await isAvailable({ name: validatedName });
//     if (!available) {
//       throw new Error('Subdomain already taken!');
//     }
//     const isOwner = await userIsOwnerOf({ name: validatedName });
//     if (!isOwner) {
//       const registerTx = await AkashaRegistrarInstance.register(validatedName, RESOLVER_ADDRESS);
//       await registerTx.wait();
//     }
//     return claimName({ name: validatedName });
//   };
//
//   // set the returned name for address lookup
//   const claimName = async (args: { name: string }) => {
//     if (!ReverseRegistrarInstance) {
//       await setupContracts();
//     }
//     const validatedName = await validateName(args.name);
//     return ReverseRegistrarInstance.setName(`${validatedName}.akasha.eth`);
//   };
//
//   const userIsOwnerOf = async (args: { name: string }) => {
//     const { getCurrentUser } = await invoke(authServices[AUTH_SERVICE]);
//     const curUser = await getCurrentUser();
//     if (curUser?.ethAddress) {
//       const resolved = await resolveName({ name: `${args.name}.akasha.eth` });
//       if (resolved === curUser.ethAddress) {
//         return true;
//       }
//     }
//     return false;
//   };
//   const isAvailable = async (args: { name: string }) => {
//     if (!AkashaRegistrarInstance) {
//       await setupContracts();
//     }
//     const isOwner = await userIsOwnerOf(args);
//     if (isOwner) {
//       return true;
//     }
//     return AkashaRegistrarInstance.isAvailable(args.name);
//   };
//
//   const resolveAddress = async (args: { ethAddress: string }) => {
//     if (!chainChecked) {
//       const { checkCurrentNetwork } = await invoke(commonServices[WEB3_SERVICE]);
//       await checkCurrentNetwork();
//       chainChecked = true;
//     }
//     const web3Provider = await invoke(commonServices[WEB3_SERVICE]).getWeb3Instance();
//     if (!AkashaRegistrarInstance) {
//       await setupContracts();
//     }
//     return web3Provider.lookupAddress(args.ethAddress);
//   };
//
//   const resolveName = async (args: { name: string }) => {
//     const web3Provider = await invoke(commonServices[WEB3_SERVICE]).getWeb3Instance();
//     return web3Provider.resolveName(args.name);
//   };
//
//   const isEncodedLabelhash = hash => {
//     return hash.startsWith('[') && hash.endsWith(']') && hash.length === 66;
//   };
//   // from @ensdomains/ensjs
//   const validateName = async (name: string) => {
//     const nameArray = name.split('.');
//     const hasEmptyLabels = nameArray.filter(e => e.length < 1).length > 0;
//     if (hasEmptyLabels) throw new Error('Domain cannot have empty labels');
//     const normalizedArray = nameArray.map(label => {
//       return isEncodedLabelhash(label) ? label : normalize(label);
//     });
//     try {
//       return Promise.resolve(normalizedArray.join('.'));
//     } catch (e) {
//       throw e;
//     }
//   };
//
//   // boilerplate for smart contracts
//   const setupContracts = async () => {
//     if (!chainChecked) {
//       const { checkCurrentNetwork } = await invoke(commonServices[WEB3_SERVICE]);
//       await checkCurrentNetwork();
//       chainChecked = true;
//     }
//     try {
//       const web3Provider = await invoke(commonServices[WEB3_SERVICE]).getWeb3Instance();
//       const contractFactory = await invoke(commonServices[WEB3_SERVICE]).getContractFactory();
//       const AkashaRegistrar = await contractFactory.fromSolidity(AkashaRegistrarABI);
//       const ReverseRegistrar = await contractFactory.fromSolidity(ReverseRegistrarABI);
//       const ENS = await contractFactory.fromSolidity(EnsABI);
//       const signer = await web3Provider.getSigner();
//       AkashaRegistrarInstance = await AkashaRegistrar.connect(signer);
//       AkashaRegistrarInstance = await AkashaRegistrarInstance.attach(REGISTRAR_ADDRESS);
//       // get the ens address from subdomain registrar
//       // const ensAddress = await AkashaRegistrarInstance.ens();
//       ENSinstance = await ENS.connect(signer);
//       ENSinstance = await ENSinstance.attach(ENS_ADDRESS);
//       await AkashaRegistrarInstance.deployed();
//       await ENSinstance.deployed();
//       // getting the actual reverse address from registry
//       const reverseAddress = await ENSinstance.owner(REVERSE_STRING);
//       ReverseRegistrarInstance = await ReverseRegistrar.connect(signer);
//       ReverseRegistrarInstance = await ReverseRegistrarInstance.attach(reverseAddress);
//       await ReverseRegistrarInstance.deployed();
//     } catch (e) {
//       log.error(e);
//       AkashaRegistrarInstance = null;
//       ENSinstance = null;
//       ReverseRegistrarInstance = null;
//       chainChecked = false;
//       throw e;
//     }
//   };
//
//   // interact with contracts from ui
//   const getContracts = async () => {
//     return {
//       AkashaRegistrarInstance,
//       ENSinstance,
//       ReverseRegistrarInstance,
//     };
//   };
//
//   return {
//     getContracts,
//     claimName,
//     registerName,
//     resolveAddress,
//     resolveName,
//     isAvailable,
//     validateName,
//   };
// };
//
// export default { service, name: ENS_SERVICE };
