import { inject, injectable } from 'inversify';
import Web3Connector from '../common/web3.connector';
import { TYPES } from '@akashaorg/typings/sdk';
import Gql from '../gql';
import AWF_Auth from '../auth';
import Settings from '../settings';
import Logging from '../logging';
import { constants as ethersConstants, ethers, utils as ethersUtils } from 'ethers';
import IntegrationRegistryABI from '../contracts/abi/IntegrationRegistry.json';
import { lastValueFrom } from 'rxjs';
import { createFormattedValue } from '../helpers/observable';
import EventBus from '../common/event-bus';
import IpfsConnector from '../common/ipfs.connector';
import pino from 'pino';
import {
  AWF_APP_BUILD_MANIFEST,
  AWF_APP_SOURCE_MANIFEST,
  IntegrationInfo,
  ReleaseInfo,
} from '@akashaorg/typings/sdk/registry';

@injectable()
class AWF_IC_REGISTRY {
  private readonly _web3: Web3Connector;
  private readonly _ipfs: IpfsConnector;
  private _log: pino.Logger;
  private _gql: Gql;
  private _auth: AWF_Auth;
  private _settings: Settings;
  private _globalChannel: EventBus;

  private _IntegrationRegistryInstance;

  public readonly INTEGRATION_REGISTRY_ADDRESS = process.env.INTEGRATION_REGISTRY_ADDRESS;
  public readonly MANIFEST_FILE = 'manifest.json';

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
    return {
      id: integrationId,
      name: data.integrationName,
      author: data.author,
      latestReleaseId: data.latestReleaseId,
      integrationType: data.integrationType,
      enabled: data.enabled,
    } as IntegrationInfo;
  }

  async getIntegrationReleaseInfo(releaseId: string, integrationId?: string) {
    this.#_setupContracts();
    const data = await this._IntegrationRegistryInstance.getReleaseData(releaseId);
    const manifestData = await this._ipfs.catDocument<AWF_APP_BUILD_MANIFEST>(
      this._ipfs.transformBase16HashToV1(
        // replace 0x prefix with 'f' - base16 CID encoding
        'f' + data.manifestHash.substring(2),
      ),
      true,
    );
    const { links, sources } = manifestData;
    const integrationID = integrationId || ethersUtils.id(data.integrationName);
    const integrationInfo = await this._IntegrationRegistryInstance.getPackageInfo(integrationID);
    const ipfsSources = this._ipfs.multiAddrToUri(sources);
    let manifest: AWF_APP_SOURCE_MANIFEST;
    if (ipfsSources.length) {
      manifest = await this._ipfs.catDocument<AWF_APP_SOURCE_MANIFEST>(
        `${ipfsSources[0]}/${this.MANIFEST_FILE}`,
        true,
      );
      ipfsSources[0] = `${ipfsSources[0]}/${manifest.mainFile}`;
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
      manifestData: manifest,
      createdAt: data.createdAt?.toNumber(),
    };
    return response;
  }

  // on chain call for latest version info
  async getLatestVersionInfo(integration: { name?: string; id?: string }) {
    const integrationID = integration.id || ethers.utils.id(integration.name);
    const info = await this.getIntegrationInfo(integrationID);
    return this.getIntegrationReleaseInfo(info.latestReleaseId, integrationID);
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
  async getIntegrationsInfo(opt: { name?: string; id?: string }[]) {
    const normalizedIDs = this.#_normalizeIDs(opt);
    return this._gql.getAPI().GetIntegrationInfo({ integrationIDs: normalizedIDs });
  }

  getLatestReleaseInfo(opt: { name?: string; id?: string }[]) {
    const normalizedIDs = this.#_normalizeIDs(opt);
    return this._gql.getAPI().GetLatestRelease({ integrationIDs: normalizedIDs });
  }

  public getContracts() {
    return {
      IntegrationRegistryInstance: this._IntegrationRegistryInstance,
    };
  }
}

export default AWF_IC_REGISTRY;
