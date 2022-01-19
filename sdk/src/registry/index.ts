import { inject, injectable } from 'inversify';
import Web3Connector from '../common/web3.connector';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import Gql from '../gql';
import AWF_Auth from '../auth';
import Settings from '../settings';
import { TYPES } from '@akashaproject/sdk-typings';
import Logging from '../logging';
import { normalize } from 'eth-ens-namehash';
import { ContractFactory, constants as ethersConstants, utils as ethersUtils } from 'ethers';
import AkashaRegistrarABI from '../contracts/abi/AkashaRegistrar.json';
import ReverseRegistrarABI from '../contracts/abi/ReverseRegistrar.json';
import IntegrationRegistryABI from '../contracts/abi/IntegrationRegistry.json';
import EnsABI from '../contracts/abi/ENS.json';
import { AWF_IENS } from '@akashaproject/sdk-typings/lib/interfaces/registry';
import { lastValueFrom } from 'rxjs';
import { createFormattedValue, createObservableStream } from '../helpers/observable';
import EventBus from '../common/event-bus';
import { tap } from 'rxjs/operators';
import { ENS_EVENTS } from '@akashaproject/sdk-typings/lib/interfaces/events';

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
  private _log: ILogger;
  private _gql: Gql;
  private _auth: AWF_Auth;
  private _settings: Settings;
  private _globalChannel: EventBus;
  private _chainChecked = false;
  private _AkashaRegistrarInstance;
  private _ReverseRegistrarInstance;
  private _ENSinstance;

  private _IntegrationRegistryInstance;

  public readonly REGISTRAR_ADDRESS = '0x9005a15eb865e8378e5cb9f45e8849ef1eC4F90B';
  public readonly RESOLVER_ADDRESS = '0xf6305c19e814d2a75429Fd637d01F7ee0E77d615';
  public readonly ENS_ADDRESS = '0x00000000000c2e074ec69a0dfb2997ba6c7d2e1e';
  public readonly REVERSE_STRING =
    '0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2';

  public readonly INTEGRATION_REGISTRY_ADDRESS = '0x5E49595D7B3593a61Ed8e947c2cC23091cAB8BfC';
  constructor(
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Gql) gql: Gql,
    @inject(TYPES.Auth) auth: AWF_Auth,
    @inject(TYPES.Settings) settings: Settings,
    @inject(TYPES.EventBus) globalChannel: EventBus,
    @inject(TYPES.Web3) web3: Web3Connector,
  ) {
    this._log = log.create('AWF_ENS');
    this._gql = gql;
    this._auth = auth;
    this._settings = settings;
    this._globalChannel = globalChannel;
    this._web3 = web3;
  }

  registerName(name: string) {
    return createObservableStream(this._registerName(name));
  }

  private async _registerName(name: string) {
    const validatedName = validateName(name);
    const available = await this.isAvailable(validatedName);
    if (!available) {
      throw new Error('Subdomain already taken!');
    }
    const isOwner = await this.userIsOwnerOf(validatedName);
    if (!isOwner.data) {
      const registerTx = await this._AkashaRegistrarInstance.register(
        validatedName,
        this.RESOLVER_ADDRESS,
      );
      // @emits ENS_EVENTS.REGISTER
      this._globalChannel.next({
        data: { tx: registerTx.toString() },
        event: ENS_EVENTS.REGISTER,
        args: { name },
      });
      await registerTx.wait();
    }
    return this._claimName(validatedName);
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
    if (!this._ReverseRegistrarInstance) {
      await this.setupContracts();
    }
    const validatedName = validateName(name);
    return this._ReverseRegistrarInstance.setName(`${validatedName}.akasha.eth`);
  }

  async userIsOwnerOf(name: string) {
    const curUser = await lastValueFrom(this._auth.getCurrentUser());
    if (curUser?.data.ethAddress) {
      const resolved = await this.resolveName(`${name}.akasha.eth`);
      if (resolved.data === curUser.data.ethAddress) {
        return createFormattedValue(true);
      }
    }
    return createFormattedValue(false);
  }

  async isAvailable(name: string) {
    if (!this._AkashaRegistrarInstance) {
      await this.setupContracts();
    }
    const isOwner = await this.userIsOwnerOf(name);
    if (isOwner.data) {
      return createFormattedValue(true);
    }
    const result = await this._AkashaRegistrarInstance.isAvailable(name);
    return createFormattedValue(result);
  }

  async resolveAddress(ethAddress: string) {
    if (!this._AkashaRegistrarInstance) {
      await this.setupContracts();
    }
    const address = await this._web3.provider.lookupAddress(ethAddress);
    return createFormattedValue(address);
  }

  async resolveName(name: string) {
    const result = await this._web3.provider.resolveName(name);
    return createFormattedValue(result);
  }

  public async setupContracts() {
    if (!this._chainChecked && this._web3.provider) {
      await lastValueFrom(this._web3.checkCurrentNetwork());
      this._chainChecked = true;
    }
    const AkashaRegistrar = await ContractFactory.fromSolidity(AkashaRegistrarABI);
    const ReverseRegistrar = await ContractFactory.fromSolidity(ReverseRegistrarABI);
    const IntegrationRegistry = await ContractFactory.fromSolidity(IntegrationRegistryABI);
    const ENS = await ContractFactory.fromSolidity(EnsABI);
    const signer = this._web3.getSigner();
    this._AkashaRegistrarInstance = await AkashaRegistrar.connect(signer);
    this._AkashaRegistrarInstance = await this._AkashaRegistrarInstance.attach(
      this.REGISTRAR_ADDRESS,
    );
    // get the ens address from subdomain registrar
    // const ensAddress = await AkashaRegistrarInstance.ens();
    this._ENSinstance = await ENS.connect(signer);
    this._ENSinstance = await this._ENSinstance.attach(this.ENS_ADDRESS);
    await this._AkashaRegistrarInstance.deployed();
    await this._ENSinstance.deployed();
    // getting the actual reverse address from registry
    const reverseAddress = await this._ENSinstance.owner(this.REVERSE_STRING);
    this._ReverseRegistrarInstance = await ReverseRegistrar.connect(signer);
    this._ReverseRegistrarInstance = await this._ReverseRegistrarInstance.attach(reverseAddress);
    await this._ReverseRegistrarInstance.deployed();

    this._IntegrationRegistryInstance = await IntegrationRegistry.attach(
      this.INTEGRATION_REGISTRY_ADDRESS,
    ).connect(signer);
  }

  async getIntegrationInfo(packageId: string) {
    const data = await this._IntegrationRegistryInstance.getPackageInfo(packageId);
    return createFormattedValue({
      integrationName: data.integrationName,
      author: data.author,
      latestReleaseId: data.latestReleaseId,
      enabled: data.latestReleaseId,
    });
  }

  async getIntegrationReleaseInfo(releaseId: string) {
    const data = await this._IntegrationRegistryInstance.getReleaseData(releaseId);
    return createFormattedValue({
      integrationName: data.integrationName,
      version: data.version,
      manifestHash: data.manifestHash,
    });
  }

  async getIntegrationsCount() {
    const data = await this._IntegrationRegistryInstance.numPackageIds();
    return createFormattedValue({
      totalCount: data.totalCount,
    });
  }

  async getAllIntegrationsIds(offset = 0) {
    const data = await this._IntegrationRegistryInstance.getAllPackageIds(offset);
    return createFormattedValue({
      integrationIds: data.packageIds.filter(x => x !== ethersConstants.HashZero),
      nextIndex: data.next,
    });
  }

  async getIntegrationId(name: string) {
    const data = ethersUtils.id(name);
    return Promise.resolve(createFormattedValue({ id: data }));
  }

  async getIntegrationReleaseId(name: string, version: string) {
    const data = ethersUtils.id(name + version);
    return Promise.resolve(createFormattedValue({ id: data }));
  }

  public getContracts() {
    return {
      AkashaRegistrarInstance: this._AkashaRegistrarInstance,
      ENSinstance: this._ENSinstance,
      ReverseRegistrarInstance: this._ReverseRegistrarInstance,
      IntegrationRegistryInstance: this._IntegrationRegistryInstance,
    };
  }
}

export default AWF_ENS;
