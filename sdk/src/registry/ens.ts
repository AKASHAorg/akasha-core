import { inject, injectable } from 'inversify';
import Web3Connector from '../common/web3.connector';
import { ENS_EVENTS, AWF_IENS, TYPES, ILogger } from '@akashaorg/typings/sdk';
import Gql from '../gql';
import AWF_Auth from '../auth';
import Settings from '../settings';
import Logging from '../logging';
import { normalize } from 'eth-ens-namehash';
import { ContractFactory } from 'ethers';
import AkashaRegistrarABI from '../contracts/abi/AkashaRegistrar.json';
import ReverseRegistrarABI from '../contracts/abi/ReverseRegistrar.json';
import EnsABI from '../contracts/abi/ENS.json';
import { lastValueFrom } from 'rxjs';
import { createFormattedValue, createObservableStream } from '../helpers/observable';
import EventBus from '../common/event-bus';
import { concatAll, map, tap } from 'rxjs/operators';
import IpfsConnector from '../common/ipfs.connector';
import { IsUserNameAvailable } from '../profiles/profile.graphql';
import Stash from '../stash/index';

export const isEncodedLabelHash = hash => {
  return hash.startsWith('[') && hash.endsWith(']') && hash.length === 66;
};

export const validateName = (name: string) => {
  const nameArray = name.split('.');
  const hasEmptyLabels = nameArray.filter(e => e.length < 1).length > 0;
  if (hasEmptyLabels) throw new Error('Domain cannot have empty labels');
  const normalizedArray = nameArray.map(label => {
    return isEncodedLabelHash(label) ? label : normalize(label);
  });
  return normalizedArray.join('.');
};

@injectable()
class AWF_ENS implements AWF_IENS {
  private readonly _web3: Web3Connector;
  private readonly _ipfs: IpfsConnector;
  private _log: ILogger;
  private _gql: Gql;
  private _auth: AWF_Auth;
  private _settings: Settings;
  private _globalChannel: EventBus;
  private _stash: Stash;
  private _chainChecked = false;
  //private _AkashaRegistrarInstance;
  private _ReverseRegistrarInstance;
  private _ENSinstance;

  // public readonly REGISTRAR_ADDRESS = '0x9005a15eb865e8378e5cb9f45e8849ef1eC4F90B';
  // public readonly RESOLVER_ADDRESS = '0xf6305c19e814d2a75429Fd637d01F7ee0E77d615';
  // public readonly ENS_ADDRESS = '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e';
  // public readonly REVERSE_STRING =
  //   '0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2';

  constructor(
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Gql) gql: Gql,
    @inject(TYPES.Auth) auth: AWF_Auth,
    @inject(TYPES.Settings) settings: Settings,
    @inject(TYPES.EventBus) globalChannel: EventBus,
    @inject(TYPES.Web3) web3: Web3Connector,
    @inject(TYPES.IPFS) ipfs: IpfsConnector,
    @inject(TYPES.Stash) stash: Stash,
  ) {
    this._log = log.create('AWF_ENS');
    this._gql = gql;
    this._auth = auth;
    this._settings = settings;
    this._globalChannel = globalChannel;
    this._web3 = web3;
    this._ipfs = ipfs;
    this._stash = stash;
  }

  registerName(name: string) {
    return createObservableStream(this._registerName(name));
  }

  private async _registerName(name: string) {
    this._log.warn(`_registerName is deprecated`);
    return Promise.reject('Method not supported.');
    // const validatedName = validateName(name);
    // const available = await this.isAvailable(validatedName);
    // if (!available) {
    //   throw new Error('Subdomain already taken!');
    // }
    // const isOwner = await this.userIsOwnerOf(validatedName);
    // if (!isOwner.data) {
    //   const registerTx = await this._AkashaRegistrarInstance.register(
    //     validatedName,
    //     this.RESOLVER_ADDRESS,
    //   );
    //   // @emits ENS_EVENTS.REGISTER
    //   this._globalChannel.next({
    //     data: { tx: registerTx.toString() },
    //     event: ENS_EVENTS.REGISTER,
    //     args: { name },
    //   });
    //   await registerTx.wait();
    // }
    // return this._claimName(validatedName);
  }

  claimName(name: string) {
    return createObservableStream(this._claimName(name)).pipe(
      tap(ev => {
        // @emits ENS_EVENTS.CLAIM
        this._globalChannel.next({
          data: ev.data,
          event: ENS_EVENTS.CLAIM,
          args: { name },
        });
      }),
    );
  }

  // set the returned name for address lookup
  private async _claimName(name: string) {
    this._log.warn(`_claimName is deprecated`);
    return Promise.reject('Method not supported.');
    // if (!this._ReverseRegistrarInstance) {
    //   await this.setupContracts();
    // }
    // const validatedName = validateName(name);
    // return this._ReverseRegistrarInstance.setName(`${validatedName}.akasha.eth`);
  }

  async userIsOwnerOf(name: string) {
    // const curUser = await lastValueFrom(this._auth.getCurrentUser());
    // if (curUser?.data.ethAddress) {
    //   const resolved = await this.resolveName(`${name}.akasha.eth`);
    //   if (resolved.data === curUser.data.ethAddress) {
    //     return createFormattedValue(true);
    //   }
    // }
    return createFormattedValue(true);
  }

  isAvailable(name: string) {
    // if (!this._chainChecked) {
    //   await this.setupContracts();
    // }
    // const isOwner = await this.userIsOwnerOf(name);
    // if (isOwner.data) {
    //   return createFormattedValue(true);
    // }
    // const result = await this._ENSinstance.isAvailable(name);
    const validatedName = validateName(name);
    return this._auth.authenticateMutationData({ userName: validatedName }).pipe(
      map(res => {
        return this._gql.run<{ isUserNameAvailable: boolean }>(
          {
            query: IsUserNameAvailable,
            variables: { userName: validatedName },
            operationName: 'IsUserNameAvailable',
            context: {
              headers: {
                Authorization: `Bearer ${res.token.data}`,
                Signature: res.signedData.data.signature,
              },
            },
          },
          true,
        );
      }),
      concatAll(),
    );
  }

  /**
   * Returns ENS name associated with the ethereum address
   */
  async resolveAddress(ethAddress: string) {
    if (!this._chainChecked) {
      await this.setupContracts();
    }
    const uiStash = this._stash.getUiStash();
    const key = `ens:resolveAddress:${ethAddress}`;
    let ensName;
    if (uiStash.has(key)) {
      ensName = uiStash.get(key);
    } else {
      ensName = await this._web3.provider.lookupAddress(ethAddress);
      uiStash.set(key, ensName);
    }

    return createFormattedValue(ensName);
  }

  /**
   * Returns eth address associated with the ens name
   */
  async resolveName(name: string) {
    if (!this._chainChecked) {
      await this.setupContracts();
    }
    const uiStash = this._stash.getUiStash();
    const key = `ens:resolveName:${name}`;
    let ensAddress;
    if (uiStash.has(key)) {
      ensAddress = uiStash.get(key);
    } else {
      ensAddress = await this._web3.provider.resolveName(name);
      uiStash.set(key, ensAddress);
    }
    return createFormattedValue(ensAddress);
  }

  public async setupContracts() {
    if (!this._chainChecked && this._web3.provider) {
      await lastValueFrom(this._web3.checkCurrentNetwork());
      this._chainChecked = true;
    }
    //const AkashaRegistrar = await ContractFactory.fromSolidity(AkashaRegistrarABI);
    // const ReverseRegistrar = await ContractFactory.fromSolidity(ReverseRegistrarABI);
    // const ENS = await ContractFactory.fromSolidity(EnsABI);
    // const signer = this._web3.getSigner();
    // this._AkashaRegistrarInstance = await AkashaRegistrar.connect(signer);
    // this._AkashaRegistrarInstance = await this._AkashaRegistrarInstance.attach(
    //   this.REGISTRAR_ADDRESS,
    // );
    // get the ens address from subdomain registrar
    // const ensAddress = await AkashaRegistrarInstance.ens();
    // this._ENSinstance = await ENS.connect(signer);
    // this._ENSinstance = await this._ENSinstance.attach(this.ENS_ADDRESS);
    // await this._AkashaRegistrarInstance.deployed();
    // await this._ENSinstance.deployed();
    // // getting the actual reverse address from registry
    // const reverseAddress = await this._ENSinstance.owner(this.REVERSE_STRING);
    // this._ReverseRegistrarInstance = await ReverseRegistrar.connect(signer);
    // this._ReverseRegistrarInstance = await this._ReverseRegistrarInstance.attach(reverseAddress);
    // await this._ReverseRegistrarInstance.deployed();
  }

  public getContracts() {
    return {
      //AkashaRegistrarInstance: this._AkashaRegistrarInstance,
      ENSinstance: this._ENSinstance,
      ReverseRegistrarInstance: this._ReverseRegistrarInstance,
    };
  }
}

export default AWF_ENS;
