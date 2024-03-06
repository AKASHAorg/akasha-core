import LitJsSdk from '@lit-protocol/sdk-browser';
import { inject, injectable } from 'inversify';
import { TYPES } from '@akashaorg/typings/lib/sdk';
import DB from '../db/index';
import Web3Connector from './web3.connector';
import EventBus from './event-bus';
import Logging from '../logging/index';
import Settings from '../settings/index';
import Gql from '../gql/index';
import pino from 'pino';
import { z } from 'zod';
import { validate } from './validator';

const buildAccessControlConditions = (ethAddress: string) => {
  return [
    {
      conditionType: 'evmBasic',
      contractAddress: '',
      standardContractType: '',
      chain: 'ethereum',
      method: '',
      parameters: [':userAddress'],
      returnValueTest: {
        comparator: '=',
        value: ethAddress,
      },
    },
  ];
};
@injectable()
export default class Lit {
  private _db: DB;
  private readonly _web3: Web3Connector;
  private _globalChannel: EventBus;
  private _log: pino.Logger;
  private _settings: Settings;
  private _gql: Gql;
  constructor(
    @inject(TYPES.Db) db: DB,
    @inject(TYPES.Web3) web3: Web3Connector,
    @inject(TYPES.EventBus) globalChannel: EventBus,
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Settings) settings: Settings,
    @inject(TYPES.Gql) gql: Gql,
  ) {
    this._db = db;
    this._web3 = web3;
    this._globalChannel = globalChannel;
    this._log = log.create('AWF_Lit');
    this._settings = settings;
    this._gql = gql;
  }
  protected litNodeClient;
  async connect() {
    if (!this.litNodeClient) {
      this.litNodeClient = new LitJsSdk.LitNodeClient();
      await this.litNodeClient.connect();
    }
  }

  @validate(z.string().min(2))
  async encryptText(text: string) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({
      chain: this._web3.network,
      chainId: this._web3.networkId[this._web3.network],
    });
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(text);
    const ethAddress = await this._web3.getCurrentEthAddress();
    if (!ethAddress) {
      throw new Error('No eth address connected!');
    }
    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions: buildAccessControlConditions(ethAddress),
      symmetricKey,
      authSig,
      chain: this._web3.network,
    });

    return {
      encryptedString,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, 'base16'),
    };
  }
  @validate(z.string().min(2), z.string())
  async decryptText(encryptedString: string, encryptedSymmetricKey: string) {
    if (!this.litNodeClient) {
      await this.connect();
    }
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: this._web3.network });
    const ethAddress = await this._web3.getCurrentEthAddress();
    if (!ethAddress) {
      throw new Error('No eth address connected!');
    }
    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions: buildAccessControlConditions(ethAddress),
      toDecrypt: encryptedSymmetricKey,
      chain: this._web3.network,
      authSig,
    });

    return LitJsSdk.decryptString(encryptedString, symmetricKey);
  }

  async disconnect() {
    if (this.litNodeClient) {
      await LitJsSdk.disconnectWeb3();
      this.litNodeClient = undefined;
    }
  }
}
