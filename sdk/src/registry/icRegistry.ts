import { inject, injectable } from 'inversify';
import Web3Connector from '../common/web3.connector';
import {
  TYPES,
  IntegrationIdSchema,
  AWF_APP_BUILD_MANIFEST,
  IntegrationId,
  IntegrationInfo,
  IntegrationReleaseIdSchema,
  IntegrationNameSchema,
  IntegrationName,
  ReleaseInfo,
} from '@akashaorg/typings/lib/sdk';
import { ManifestInfo } from '@akashaorg/typings/lib/sdk/graphql-types';
import Gql from '../gql';
import AWF_Auth from '../auth';
import Settings from '../settings';
import Logging from '../logging';
import { constants as ethersConstants, ethers, utils as ethersUtils } from 'ethers';
import IntegrationRegistryABI from '../contracts/abi/IntegrationRegistry.json';
import { createFormattedValue } from '../helpers/observable';
import EventBus from '../common/event-bus';
import IpfsConnector from '../common/ipfs.connector';
import pino from 'pino';
import { validate } from '../common/validator';
import { z } from 'zod';
import { throwError } from '../common/error-handling';

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

  public readonly INTEGRATION_REGISTRY_ADDRESS = process.env.INTEGRATION_REGISTRY_ADDRESS as string;
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
  @validate(IntegrationIdSchema)
  async getIntegrationInfo(integrationId: IntegrationId): Promise<IntegrationInfo> {
    this.#_setupContracts();
    const data = await this._IntegrationRegistryInstance.getPackageInfo(integrationId);
    return {
      id: integrationId,
      name: data.integrationName,
      author: data.author,
      latestReleaseId: data.latestReleaseId,
      integrationType: data.integrationType,
      enabled: data.enabled,
    };
  }

  @validate(IntegrationReleaseIdSchema, IntegrationIdSchema.optional())
  async getIntegrationReleaseInfo(releaseId: string, integrationId?: string): Promise<ReleaseInfo> {
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
    let manifest: ManifestInfo;

    const response: Partial<ReleaseInfo> = {
      id: releaseId,
      name: integrationInfo.integrationName,
      version: data.version,
      integrationType: integrationInfo.integrationType,
      links: links,
      integrationID: integrationID,
      author: integrationInfo.author,
      enabled: integrationInfo.enabled,
      createdAt: data.createdAt?.toNumber(),
    };

    if (ipfsSources.length) {
      try {
        manifest = await this._ipfs.catDocument<ManifestInfo>(
          `${ipfsSources[0]}/${this.MANIFEST_FILE}`,
          true,
        );
        ipfsSources[0] = `${ipfsSources[0]}/${manifest.mainFile}`;
        response.sources = ipfsSources;
        response.manifestData = manifest;
        return response as ReleaseInfo;
      } catch (e) {
        throwError(`Failed to get manifest data: ${(e as Error).message}`, [
          'sdk',
          'registry',
          'getIntegrationReleaseInfo',
          releaseId,
        ]);
      }
    }
    // @todo: maybe better to throw error here since we don't have sources?
    return response as ReleaseInfo;
  }

  // on chain call for latest version info
  @validate(z.object({ name: IntegrationNameSchema, id: IntegrationIdSchema }).partial())
  async getLatestVersionInfo(integration: { name?: IntegrationName; id?: IntegrationId }) {
    const integrationID = integration.id || ethers.utils.id(integration.name || '');
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

  @validate(z.number().optional())
  async getAllIntegrationsIds(offset = 0) {
    this.#_setupContracts();
    const data = await this._IntegrationRegistryInstance.getAllPackageIds(offset);
    return createFormattedValue({
      integrationIds: data.integrationIds.filter(x => x !== ethersConstants.HashZero),
      nextIndex: data.next,
    });
  }

  @validate(IntegrationNameSchema, z.number().optional())
  async getAllIntegrationReleaseIds(integrationName: IntegrationName, offset = 0) {
    this.#_setupContracts();
    const data = await this._IntegrationRegistryInstance.getAllReleaseIds(integrationName, offset);
    return createFormattedValue({
      releaseIds: data.releaseIds.filter(x => x !== ethersConstants.HashZero),
      nextIndex: data.next,
    });
  }

  @validate(IntegrationNameSchema)
  async getIntegrationId(name: IntegrationName) {
    const data = ethersUtils.id(name);
    return Promise.resolve(createFormattedValue({ id: data }));
  }
  @validate(IntegrationNameSchema, z.string())
  async getIntegrationReleaseId(name: IntegrationName, version: string) {
    const data = ethersUtils.id(name + version);
    return Promise.resolve(createFormattedValue({ id: data }));
  }

  @validate(z.array(z.object({ name: IntegrationNameSchema, id: IntegrationIdSchema }).partial()))
  _normalizeIDs(opt: { name?: IntegrationName; id?: IntegrationId }[]) {
    return opt.map(el => {
      if (el.id) {
        return el.id;
      }
      return ethersUtils.id(el.name || '');
    });
  }
  // @validate(z.array(z.object({ name: IntegrationNameSchema, id: IntegrationIdSchema }).partial()))
  // async getIntegrationsInfo(opt: { name?: string; id?: string }[]) {
  //   const normalizedIDs = this._normalizeIDs(opt);
  //   // return this._gql.getAPI().GetIntegrationInfo({ integrationIDs: normalizedIDs });
  //   return Promise.resolve({});
  // }
  // }
  // @validate(z.array(z.object({ name: IntegrationNameSchema, id: IntegrationIdSchema }).partial()))
  // async getLatestReleaseInfo(opt: { name?: string; id?: string }[]) {
  //   const normalizedIDs = this._normalizeIDs(opt);
  //   // return this._gql.getAPI().GetLatestRelease({ integrationIDs: normalizedIDs })normalizedIDs;
  //   return Promise.resolve();
  // }
  //
  // public getContracts() {
  //   return {
  //     IntegrationRegistryInstance: this._IntegrationRegistryInstance,
  //   };
  // }
}

export default AWF_IC_REGISTRY;
