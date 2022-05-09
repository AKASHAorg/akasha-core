import { inject, injectable } from 'inversify';
import Web3Connector from '../common/web3.connector';
import { ILogger } from '@akashaorg/sdk-typings/lib/interfaces/log';
import Gql from '../gql';
import AWF_Auth from '../auth';
import Settings from '../settings';
import { TYPES } from '@akashaorg/sdk-typings';
import Logging from '../logging';
import { constants as ethersConstants, ethers, utils as ethersUtils } from 'ethers';
import IntegrationRegistryABI from '../contracts/abi/IntegrationRegistry.json';
import {
  AWF_IIC_REGISTRY,
  AWF_APP_BUILD_MANIFEST,
  AWF_APP_SOURCE_MANIFEST,
  IntegrationInfo,
  ReleaseInfo,
} from '@akashaorg/sdk-typings/lib/interfaces/registry';
import { lastValueFrom } from 'rxjs';
import { createFormattedValue } from '../helpers/observable';
import EventBus from '../common/event-bus';
import IpfsConnector from '../common/ipfs.connector';
import { GetLatestRelease, GetIntegrationInfo } from './icRegistry.graphql';

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

  public readonly INTEGRATION_REGISTRY_ADDRESS = process.env.INTEGRATION_REGISTRY_ADDRESS;
  public readonly MANIFEST_FILE = 'manifest.json';
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

  async getIntegrationReleaseInfo(releaseId: string, integrationId?: string) {
    this.#_setupContracts();
    const data = await this._IntegrationRegistryInstance.getReleaseData(releaseId);
    const manifestData = await lastValueFrom(
      this._ipfs.catDocument<AWF_APP_BUILD_MANIFEST>(
        this._ipfs.transformBase16HashToV1(
          // replace 0x prefix with 'f' - base16 CID encoding
          'f' + data.manifestHash.substring(2),
        ),
        true,
      ),
    );
    const { links, sources } = manifestData.data;
    const integrationID = integrationId || ethersUtils.id(data.integrationName);
    const integrationInfo = await this._IntegrationRegistryInstance.getPackageInfo(integrationID);
    const ipfsSources = this._ipfs.multiAddrToUri(sources);
    let manifest: { data?: AWF_APP_SOURCE_MANIFEST };
    if (ipfsSources.length) {
      manifest = await lastValueFrom(
        this._ipfs.catDocument<AWF_APP_SOURCE_MANIFEST>(
          `${ipfsSources[0]}/${this.MANIFEST_FILE}`,
          true,
        ),
      );
      ipfsSources[0] = `${ipfsSources[0]}/${manifest.data.mainFile}`;
    }
    const response: ReleaseInfo = {
      id: releaseId,
      name: integrationInfo.integrationName,
      version: data.version,
      integrationType: integrationInfo.integrationType,
      links: links,
      sources: ipfsSources,
      integrationID: integrationID,
      author: integrationInfo.author,
      enabled: integrationInfo.enabled,
      manifestData: manifest.data,
      createdAt: data.createdAt?.toNumber(),
    };
    return createFormattedValue(response);
  }

  // on chain call for latest version info
  async getLatestVersionInfo(integration: { name?: string; id?: string }) {
    const integrationID = integration.id || ethers.utils.id(integration.name);
    const info = await this.getIntegrationInfo(integrationID);
    return this.getIntegrationReleaseInfo(info.data.latestReleaseId, integrationID);
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
    return this._gql.run<{ getIntegrationInfo: IntegrationInfo[] }>(
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
    return this._gql.run<{ getLatestRelease: ReleaseInfo[] }>(
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
