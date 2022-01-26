import { inject, injectable } from 'inversify';
import Web3Connector from '../common/web3.connector';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import Gql from '../gql';
import AWF_Auth from '../auth';
import Settings from '../settings';
import { TYPES } from '@akashaproject/sdk-typings';
import Logging from '../logging';
import { constants as ethersConstants, ethers, utils as ethersUtils } from 'ethers';
import IntegrationRegistryABI from '../contracts/abi/IntegrationRegistry.json';
import { AWF_IIC_REGISTRY } from '@akashaproject/sdk-typings/lib/interfaces/registry';
import { lastValueFrom } from 'rxjs';
import { createFormattedValue } from '../helpers/observable';
import EventBus from '../common/event-bus';
import IpfsConnector from '../common/ipfs.connector';
import { GetLatestRelease, GetIntegrationInfo } from './icRegistry.graphql';

export interface ReleaseInfo {
  integrationID: string;
  id: string;
  name: string;
  version: string;
  integrationType: number;
  links: string;
  sources: string[];
  author: string;
  enabled: boolean;
}

export interface IntegrationInfo {
  id: string;
  name: string;
  author: string;
  integrationType: number;
  latestReleaseId: string;
  enabled: boolean;
}

@injectable()
class AWF_IC_REGISTRY implements AWF_IIC_REGISTRY {
  private readonly _web3: Web3Connector;
  private readonly _ipfs: IpfsConnector;
  private _log: ILogger;
  private _gql: Gql;
  private _auth: AWF_Auth;
  private _settings: Settings;
  private _globalChannel: EventBus;

  private _IntegrationRegistryInstance;

  public readonly INTEGRATION_REGISTRY_ADDRESS = '0xFB6a190732f54d50bE96AaAb57Eb97e824319eB9';
  readonly graphQLDocs = {
    GetLatestRelease,
    GetIntegrationInfo,
  };

  constructor(
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Gql) gql: Gql,
    @inject(TYPES.Auth) auth: AWF_Auth,
    @inject(TYPES.Settings) settings: Settings,
    @inject(TYPES.EventBus) globalChannel: EventBus,
    @inject(TYPES.Web3) web3: Web3Connector,
    @inject(TYPES.IPFS) ipfs: IpfsConnector,
  ) {
    this._log = log.create('AWF_IC_REGISTRY');
    this._gql = gql;
    this._auth = auth;
    this._settings = settings;
    this._globalChannel = globalChannel;
    this._web3 = web3;
    this._ipfs = ipfs;
  }

  #_setupContracts() {
    if (this._IntegrationRegistryInstance) {
      return;
    }
    const signer = this._web3.getSigner();
    if (signer) {
      this._IntegrationRegistryInstance = new ethers.Contract(
        this.INTEGRATION_REGISTRY_ADDRESS,
        IntegrationRegistryABI.abi,
        signer,
      );
    }
  }

  async getIntegrationInfo(integrationId: string) {
    this.#_setupContracts();
    const data = await this._IntegrationRegistryInstance.getPackageInfo(integrationId);
    const response: IntegrationInfo = {
      id: integrationId,
      name: data.integrationName,
      author: data.author,
      latestReleaseId: data.latestReleaseId,
      integrationType: data.integrationType,
      enabled: data.enabled,
    };
    return createFormattedValue(response);
  }

  async getIntegrationReleaseInfo(releaseId: string) {
    this.#_setupContracts();
    const data = await this._IntegrationRegistryInstance.getReleaseData(releaseId);
    const manifestData = await lastValueFrom(
      this._ipfs.catDocument(
        this._ipfs.transformBase16HashToV1(
          // replace 0x prefix with 'f' - base16 CID encoding
          'f' + data.manifestHash.substring(2),
        ),
      ),
    );
    const { links, sources } = JSON.parse(manifestData.data);
    const integrationID = ethersUtils.id(data.integrationName);
    const integrationInfo = await this._IntegrationRegistryInstance.getPackageInfo(
      ethersUtils.id(integrationID),
    );
    const response: ReleaseInfo = {
      id: releaseId,
      name: data.integrationName,
      version: data.version,
      integrationType: data.integrationType,
      links: links,
      sources: this._ipfs.multiAddrToUri(sources),
      integrationID: integrationID,
      author: integrationInfo.author,
      enabled: integrationInfo.enabled,
    };
    return createFormattedValue(response);
  }

  async getIntegrationsCount() {
    this.#_setupContracts();
    const data = await this._IntegrationRegistryInstance.numPackageIds();
    return createFormattedValue({
      totalCount: data.totalCount,
    });
  }

  async getAllIntegrationsIds(offset = 0) {
    this.#_setupContracts();
    const data = await this._IntegrationRegistryInstance.getAllPackageIds(offset);
    return createFormattedValue({
      integrationIds: data.integrationIds.filter(x => x !== ethersConstants.HashZero),
      nextIndex: data.next,
    });
  }

  async getAllIntegrationReleaseIds(integrationName: string, offset = 0) {
    this.#_setupContracts();
    const data = await this._IntegrationRegistryInstance.getAllReleaseIds(integrationName, offset);
    return createFormattedValue({
      releaseIds: data.releaseIds.filter(x => x !== ethersConstants.HashZero),
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

  #_normalizeIDs(opt: { name?: string; id?: string }[]) {
    return opt.map(el => {
      if (el.id) {
        return el.id;
      }
      return ethersUtils.id(el.name);
    });
  }
  getIntegrationsInfo(opt: { name?: string; id?: string }[]) {
    const normalizedIDs = this.#_normalizeIDs(opt);
    return this._gql.run<IntegrationInfo[]>(
      {
        query: GetIntegrationInfo,
        variables: { integrationIDs: normalizedIDs },
        operationName: 'GetIntegrationInfo',
      },
      true,
    );
  }
  getLatestReleaseInfo(opt: { name?: string; id?: string }[]) {
    const normalizedIDs = this.#_normalizeIDs(opt);
    return this._gql.run<ReleaseInfo[]>(
      {
        query: GetLatestRelease,
        variables: { integrationIDs: normalizedIDs },
        operationName: 'GetLatestRelease',
      },
      true,
    );
  }

  public getContracts() {
    return {
      IntegrationRegistryInstance: this._IntegrationRegistryInstance,
    };
  }
}

export default AWF_IC_REGISTRY;
