import { inject, injectable } from 'inversify';
import { TYPES } from '@akashaorg/typings/lib/sdk/index.js';
import DB from '../db/index.js';
import Web3Connector from './web3.connector.js';
import EventBus from './event-bus.js';
import Logging from '../logging/index.js';
import Settings from '../settings/index.js';
import Gql from '../gql/index.js';
import pino from 'pino';
import { z } from 'zod';
import { validate } from './validator.js';
import { LitNodeClient, encryptString, decryptToString } from '@lit-protocol/lit-node-client';
import { LitNetwork } from '@lit-protocol/constants';
import {
  createSiweMessageWithRecaps,
  LitAbility,
  LitActionResource,
} from '@lit-protocol/auth-helpers';
import { SessionSigsMap } from '@lit-protocol/types/src/lib/interfaces';

const buildAccessControlConditions = (ethAddress: string, chain: string = 'ethereum') => {
  return [
    {
      contractAddress: '',
      standardContractType: '',
      chain: chain,
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
  private _sessionsSigs: SessionSigsMap | undefined;
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
  protected litNodeClient: LitNodeClient | undefined;
  async connect() {
    if (!this.litNodeClient) {
      this.litNodeClient = new LitNodeClient({
        litNetwork: LitNetwork.DatilDev,
        debug: process.env.NODE_ENV !== 'production',
      });
      await this.litNodeClient.connect();
    }
  }

  async createSession() {
    if (!this.litNodeClient) {
      throw new Error('Lit client not connected');
    }

    const { getLatestBlockhash } = this.litNodeClient;
    // Create a session key and sign it using the authNeededCallback defined above
    this._sessionsSigs = await this.litNodeClient.getSessionSigs({
      expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      chain: 'ethereum',
      resourceAbilityRequests: [
        {
          resource: new LitActionResource('*'),
          ability: LitAbility.LitActionExecution,
        },
      ],
      authNeededCallback: async ({ uri, expiration, resourceAbilityRequests }) => {
        if (!this._web3.state.address) {
          throw new Error('No wallet connected');
        }
        if (!uri) {
          throw new Error('No uri provided');
        }
        if (!expiration) {
          throw new Error('No expiration provided');
        }
        if (!resourceAbilityRequests) {
          throw new Error('No resourceAbilityRequests provided');
        }
        // Prepare the SIWE message for signing
        const toSign = await createSiweMessageWithRecaps({
          uri: uri,
          expiration: expiration,
          resources: resourceAbilityRequests,
          walletAddress: this._web3.state.address,
          nonce: await getLatestBlockhash(),
          litNodeClient: this.litNodeClient,
        });
        const signature = await this._web3.signMessage(toSign);

        // Create an AuthSig using the derived signature, the message, and wallet address
        return {
          sig: signature,
          derivedVia: 'web3.eth.personal.sign',
          signedMessage: toSign,
          address: this._web3.state.address,
        };
      },
    });

    return this._sessionsSigs;
  }

  @validate(z.string().min(2))
  async encryptText(text: string) {
    if (!this.litNodeClient) {
      throw new Error('Lit client not connected');
    }
    const ethAddress = await this._web3.getCurrentEthAddress();
    if (!ethAddress) {
      throw new Error('No eth address connected!');
    }
    const { ciphertext, dataToEncryptHash } = await encryptString(
      {
        accessControlConditions: buildAccessControlConditions(ethAddress, 'ethereum') as never,
        dataToEncrypt: text,
      },
      this.litNodeClient,
    );

    return {
      ciphertext,
      dataToEncryptHash,
    };
  }
  @validate(z.string().min(2), z.string())
  async decryptText(ciphertext: string, dataToEncryptHash: string) {
    if (!this.litNodeClient) {
      throw new Error('Lit client not connected');
    }
    const ethAddress = await this._web3.getCurrentEthAddress();
    if (!ethAddress) {
      throw new Error('No eth address connected!');
    }
    const decrypted = await decryptToString(
      {
        accessControlConditions: buildAccessControlConditions(ethAddress) as never,
        chain: this._web3.network,
        sessionSigs: this._sessionsSigs,
        ciphertext,
        dataToEncryptHash,
      },
      this.litNodeClient,
    );

    return { data: decrypted };
  }

  async disconnect() {
    if (this.litNodeClient) {
      await this.litNodeClient.disconnect();
      this.litNodeClient = undefined;
    }
  }
}
