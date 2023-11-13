import { authStatus, SwActionType } from './constants';
import { inject, injectable } from 'inversify';
import {
  AUTH_EVENTS,
  CurrentUser,
  EthAddress,
  EthAddressSchema,
  EthProviders,
  EthProvidersSchema,
  IMessage,
  InviteCode,
  InviteCodeSchema,
  PubKey,
  PubKeySchema,
  TYPES,
} from '@akashaorg/typings/lib/sdk';
import DB from '../db';
import Web3Connector from '../common/web3.connector';
import EventBus from '../common/event-bus';
import Logging from '../logging';
import Settings from '../settings';

import Gql from '../gql';
import { createFormattedValue } from '../helpers/observable';
import { executeOnSW } from './helpers';
import pino from 'pino';
import Lit from '../common/lit';
import CeramicService from '../common/ceramic';
import { z } from 'zod';
import { validate } from '../common/validator';
import { DIDSession } from 'did-session';
import type { DagJWS } from 'dids';
import type { JWE } from 'did-jwt';

// in memory atm
const devKeys: { pubKey: string; addedAt: string; name?: string }[] = [];

/**
 * # sdk.api.auth
 *
 * Authentication module
 *
 */

@injectable()
class AWF_Auth {
  private _db: DB;
  private readonly _web3: Web3Connector;
  private _globalChannel: EventBus;
  private _log: pino.Logger;
  private _settings: Settings;
  private _gql: Gql;
  private _lit: Lit;
  private _ceramic: CeramicService;
  private channel?: BroadcastChannel;
  private sessKey;
  private inboxWatcher;
  private currentUser?: CurrentUser;
  private _lockSignIn?: boolean;

  #_didSession?: DIDSession;

  public readonly waitForAuth = 'waitForAuth';
  public readonly providerKey = '@providerType';
  public readonly currentUserKey = '@currentUserType';
  public readonly SYNC_REQUEST = '@sync_request';
  public readonly SYNC_RESPONSE = '@sync_response';
  public readonly SYNC_CHANNEL = '@sync_data';
  public readonly SIGN_OUT_EVENT = '@sign_out';
  public readonly encoder = new TextEncoder();

  constructor(
    @inject(TYPES.Db) db: DB,
    @inject(TYPES.Web3) web3: Web3Connector,
    @inject(TYPES.EventBus) globalChannel: EventBus,
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Settings) settings: Settings,
    @inject(TYPES.Gql) gql: Gql,
    @inject(TYPES.Lit) lit: Lit,
    @inject(TYPES.Ceramic) ceramic: CeramicService,
  ) {
    this._db = db;
    this._web3 = web3;
    this._globalChannel = globalChannel;
    this._log = log.create('AWF_Auth');
    this._settings = settings;
    this._gql = gql;
    this._lit = lit;
    this._ceramic = ceramic;
    this.enableSync();
  }

  /**
   * enable key sync between opened tabs
   */
  enableSync() {
    if ('BroadcastChannel' in self) {
      this.channel = new BroadcastChannel(this.SYNC_CHANNEL);
      this.channel.postMessage({ type: this.SYNC_REQUEST });
      this.channel.onmessage = event => {
        const { type } = event.data;
        if (type === this.SYNC_REQUEST) {
          if (this.currentUser) {
            const response = {
              [this.providerKey]: localStorage.getItem(this.providerKey),
              [this.currentUserKey]: localStorage.getItem(this.currentUserKey),
              identity: { key: this.sessKey },
            };
            this.channel?.postMessage({ response, type: this.SYNC_RESPONSE });
          }
        } else if (type === this.SYNC_RESPONSE) {
          const { response } = event.data;
          if (response && response.identity.key !== this.sessKey) {
            this._log.info('syncing session');
            this.currentUser = undefined;
            this._getCurrentUser().then(() => this._log.info('logged in'));
          }
        } else if (type === this.SIGN_OUT_EVENT && this.currentUser) {
          this._signOut().then(() => {
            const response = {
              data: null,
              event: AUTH_EVENTS.SIGN_OUT,
            };
            this._globalChannel.next(response);
            this._log.info('signed-out');
          });
        }
      };
    }
  }

  /**
   * Verifies if an ethereum address is already registered
   * Throws an UserNotRegistered error for addresses that are not registered
   * @param ethAddress - the eth address
   */
  @validate(EthAddressSchema)
  async checkIfSignedUp(ethAddress: EthAddress) {
    // const variables = { ethAddress };
    // const prof = await this._gql.getAPI().GetProfile(variables);
    // return !!prof?.getProfile?.pubKey;
    // @Todo: replace this when ready
    return true;
  }

  @validate(
    z.object({
      provider: z.optional(EthProvidersSchema),
      checkRegistered: z.boolean({
        required_error: 'checkRegistered flag is required',
      }),
      resumeSignIn: z.optional(
        z.boolean({
          invalid_type_error: 'resumeSignIn must be a boolean',
        }),
      ),
    }),
  )
  async signIn(args: {
    provider?: EthProviders;
    checkRegistered: boolean;
    resumeSignIn?: boolean;
  }) {
    const normalisedArgs = Object.assign({}, { checkRegistered: true }, args);
    const user = await this._signIn(normalisedArgs);
    return createFormattedValue(user);
  }

  private async _signIn(
    args: { provider?: EthProviders; checkRegistered: boolean; resumeSignIn?: boolean } = {
      provider: EthProviders.Web3Injected,
      checkRegistered: true,
    },
  ): Promise<(CurrentUser & { isNewUser: boolean }) | null> {
    let currentProvider = args.provider as EthProviders;
    if (!args.resumeSignIn) {
      if (this._lockSignIn) {
        return null;
      }
      if (this.currentUser) {
        this._log.warn(`Already signed in!`);
        return Promise.resolve(Object.assign({}, this.currentUser, authStatus));
      }
      this._lockSignIn = true;
      if (args.provider === EthProviders.None) {
        if (!localStorage.getItem(this.providerKey)) {
          throw new Error('The provider must have a wallet/key in order to authenticate.');
        }
        const providerKey = localStorage.getItem(this.providerKey);
        if (providerKey) {
          currentProvider = +providerKey; // cast to int
        }
      } else {
        if (currentProvider === EthProviders.WalletConnect) {
          this._log.info('using wc bridge');
          // localStorage.removeItem('walletconnect');
        }
      }
      try {
        const address = await this._connectAddress(currentProvider);
        const localUser = localStorage.getItem(this.currentUserKey);
        const chainNameSpace = 'eip155';
        const chainId = this._web3.networkId[this._web3.network];
        const chainIdNameSpace = `${chainNameSpace}:${chainId}`;
        this.sessKey = `@identity:${chainIdNameSpace}:${address?.toLowerCase()}:${currentProvider}`;
        const sessValue = localStorage.getItem(this.sessKey);
        if (localUser && sessValue) {
          const tmpSession = JSON.parse(localUser);
          if (address && tmpSession?.ethAddress === address?.toLowerCase()) {
            this._globalChannel.next({
              data: tmpSession,
              event: AUTH_EVENTS.SIGN_IN,
            });
          } else {
            // prevent check bypass on account switch
            args.checkRegistered = true;
          }
        }
        if (args.checkRegistered && address) {
          await this.checkIfSignedUp(address);
        }
        this._log.info(`using eth address ${address}`);
        if (sessValue) {
          const sessionKey = await executeOnSW<{ value?: string }>(
            Object.assign(
              {
                type: SwActionType.DECRYPT,
              },
              JSON.parse(sessValue),
            ),
          );
          if (sessionKey?.value) {
            this.#_didSession = await this._ceramic.restoreSession(sessionKey.value);
          }
        }

        if (!this._ceramic.hasSession()) {
          this.#_didSession = await this._ceramic.connect();
        }
        this.currentUser = {
          id: this.#_didSession?.id,
          ethAddress: address?.toLowerCase(),
        };
        // await this.#_signTokenMessage();
      } catch (e) {
        this._lockSignIn = false;
        this.#_didSession = undefined;
        localStorage.removeItem(this.sessKey);
        localStorage.removeItem(this.providerKey);
        localStorage.removeItem(this.currentUserKey);
        this._log.error(e);
        await this._web3.disconnect();
        throw e;
      }
    }
    if (!this.#_didSession) {
      throw new Error('DID session could not be initialised!');
    }

    const swResponse = await executeOnSW({
      type: SwActionType.ENCRYPT,
      value: this.#_didSession.serialize(),
    });
    if (swResponse) {
      localStorage.setItem(this.sessKey, JSON.stringify(swResponse));
    }
    localStorage.setItem(this.providerKey, currentProvider.toString());
    localStorage.setItem(this.currentUserKey, JSON.stringify(this.currentUser));

    if (this.channel) {
      const response = {
        [this.providerKey]: localStorage.getItem(this.providerKey),
        identity: { key: this.sessKey },
        [this.currentUserKey]: localStorage.getItem(this.currentUserKey),
      };
      this.channel.postMessage({ response, type: this.SYNC_RESPONSE });
    }

    this._globalChannel.next({
      data: this.currentUser,
      event: AUTH_EVENTS.SIGN_IN,
    });

    this._db.create(`af-beta-${this.#_didSession.id}`);
    await this._gql.resetCache();

    this._globalChannel.next({
      data: this.currentUser,
      event: AUTH_EVENTS.READY,
    });
    this._lockSignIn = false;
    return Object.assign({}, this.currentUser, authStatus);
  }

  @validate(EthProvidersSchema)
  async _connectAddress(provider: EthProviders) {
    this._globalChannel.next({
      data: {},
      event: AUTH_EVENTS.CONNECT_ADDRESS,
    });
    await this._web3.connect(provider);
    await this._web3.checkCurrentNetwork();
    const resp = await this._web3.getCurrentEthAddress();
    this._globalChannel.next({
      data: { address: resp },
      event: AUTH_EVENTS.CONNECT_ADDRESS_SUCCESS,
    });
    return resp;
  }

  @validate(EthProvidersSchema)
  async connectAddress(provider: EthProviders) {
    return this._connectAddress(provider);
  }

  /**
   * Returns current session objects for textile
   */
  async getSession() {
    const session = await this._getSession();
    return createFormattedValue(session);
  }

  private async _getSession() {
    if (!localStorage.getItem(this.providerKey)) {
      throw new Error('No previous session found');
    }

    if (!this.currentUser) {
      await this.signIn({ provider: EthProviders.None, checkRegistered: false });
    }

    return this.currentUser;
  }

  /**
   * Returns the currently logged-in user object
   * It will try to log in if there is a previous session detected
   */
  async getCurrentUser() {
    return this._getCurrentUser();
  }

  private async _getCurrentUser(): Promise<null | CurrentUser> {
    if (this.currentUser) {
      return Promise.resolve(this.currentUser);
    }
    if (!localStorage.getItem(this.providerKey)) {
      return Promise.resolve(null);
    }
    const localUser = localStorage.getItem(this.currentUserKey);

    if (localUser) {
      this._globalChannel.next({
        data: { emit: true },
        event: AUTH_EVENTS.WAIT_FOR_AUTH,
      });
    }
    return this._signIn({ provider: EthProviders.None, checkRegistered: false });
  }

  /**
   * Destroy all the session objects
   */
  async signOut() {
    return createFormattedValue(await this._signOut());
  }

  private async _signOut() {
    sessionStorage.clear();
    localStorage.removeItem(this.sessKey);
    localStorage.removeItem(this.providerKey);
    localStorage.removeItem(this.currentUserKey);
    this.inboxWatcher = null;
    this.currentUser = undefined;
    if (this.channel) {
      this.channel.postMessage({ type: this.SIGN_OUT_EVENT });
    }
    await this._web3.disconnect();
    await this._lit.disconnect();
    await this._ceramic.disconnect();
    await this._gql.resetCache();
    return true;
  }

  async signData(
    data: Record<string, unknown> | string | Record<string, unknown>[],
    base64Format = false,
  ) {
    return Promise.resolve({
      signature: 'fakeSignature',
    });
  }

  /**
   * Sign data with the identity key
   * @param data -
   */
  @validate(z.record(z.unknown()).or(z.string()))
  async signDataWithDID(data: Record<string, unknown> | string) {
    return this._signData(data);
  }

  private async _signData(data: Record<string, unknown> | string) {
    if (!this.#_didSession) {
      throw new Error('No DID session found!');
    }
    return this.#_didSession.did.createJWS(data);
  }

  @validate(z.string().min(16))
  async prepareIndexedID(id: string) {
    const payload = { ID: id };
    const jws = await this._signData(payload);
    return { jws: jws, capability: this.#_didSession?.did.capability}
  }

  async verifyDIDSignature(args: string | DagJWS) {
    return this._verifySignature(args);
  }

  private async _verifySignature(args: string | DagJWS) {
    return this.#_didSession?.did.verifyJWS(args);
  }

  /**
   * Utility method for sending mutation graphql requests
   * @param data - mutation data
   */
  @validate(
    z
      .record(z.unknown())
      .or(z.string())
      .or(z.array(z.record(z.unknown()))),
  )
  async authenticateMutationData(
    data: Record<string, unknown> | string | Record<string, unknown>[],
  ) {
    this._log.warn('Deprecated method');
    return {
      token: 'fakeToken',
      signedData: {
        signature: 'fakeSignature',
      },
    };
  }

  /**
   * Allows decryption of privately sent messages to the current identity
   * @param message - the message
   */

  /*decryptMessage(message) {
    return createObservableStream<{
      body: Record<string, any>;
      from: string;
      to: string;
      readAt: number;
      createdAt: number;
      id: string;
    }>(this._decryptMessage(message));
  }*/

  /**
   *
   * @param to - DID of the recipient
   * @param message - body text to be encrypted
   */
  async createEncryptedMessage(to: string, message: string): Promise<JWE> {
    if (!this.#_didSession) {
      throw new Error('No DID session found!');
    }

    const encoder = new TextEncoder();
    return this.#_didSession.did.createJWE(encoder.encode(message), [to]);
  }

  // validate an encrypted message from cli
  @validate(z.string())
  async validateDevKeyFromBase64Message(message: string) {
    throw new Error('Deprecated method');
    // const decodedMessage = Buffer.from(message, 'base64');
    // const decodedMessageArray = Uint8Array.from(decodedMessage);
    // const decryptedMessage = await this.#identity?.decrypt(decodedMessageArray);
    // let body: {
    //   sub: string; // public key to be added
    //   aud: string; // public key of the account to add the key
    //   iat: string; // creation timestamp
    //   sig: string; // signature of base64encoded object {sub, aud, iat}
    // };
    // try {
    //   body = JSON.parse(new TextDecoder().decode(decryptedMessage));
    // } catch (e) {
    //   this._log.warn(e);
    //   throw new Error('The message format is not valid!');
    // }
    // if (!body.sub || !body.aud || !body.iat || !body.sig) {
    //   throw new Error('The message is missing claims data!');
    // }
    // if (body.aud !== this?.currentUser?.pubKey) {
    //   throw new Error(`This message was generated for a different pubKey ${body.aud}!`);
    // }
    // if (devKeys.some(e => e.pubKey === body.sub)) {
    //   throw new Error('This key was already added.');
    // }
    // const issDate = new Date(body.iat);
    // //set expiration after 1 day
    // issDate.setDate(issDate.getDate() + 1);
    // const currentDate = new Date();
    // if (currentDate > issDate) {
    //   throw new Error('The message has expired');
    // }
    // const arrayOfClaims = new TextEncoder().encode(
    //   JSON.stringify({ sub: body.sub, aud: body.aud, iat: body.iat }),
    // );
    // const encodedSig = Buffer.from(body.sig, 'base64');
    // const devPubKey = PublicKey.fromString(body.sub);
    // const isValidRequest = await devPubKey.verify(arrayOfClaims, Uint8Array.from(encodedSig));
    // if (!isValidRequest) {
    //   throw new Error('The message could not be verified!');
    // }
    // return {
    //   pubKey: body.sub,
    //   currentDate: currentDate.toISOString(),
    //   expirationDate: issDate.toISOString(),
    //   body,
    // };
  }

  /**
   * validate and add pubKey to the dev account
   * @param message - encrypted message with claims info
   * @param name - human-readable string to identify the key
   */
  @validate(z.string(), z.string().optional())
  async addDevKeyFromBase64Message(message: string, name?: string) {
    const validatedMsg = await this.validateDevKeyFromBase64Message(message);
    devKeys.push({
      pubKey: '',
      addedAt: new Date().toISOString(),
      name,
    });
  }

  // returns all the dev public keys
  // @Todo: connect it with the actual api
  async getDevKeys() {
    return Promise.resolve(devKeys);
  }

  // @Todo: connect it to the api when ready
  @validate(PubKeySchema)
  async removeDevKey(pubKey: PubKey) {
    const index = devKeys.findIndex(e => e.pubKey === pubKey);
    if (index !== -1) {
      devKeys.splice(index, 1);
    }
  }

  private async _decryptMessage<T>(message: JWE): Promise<T> {
    const decryptedBody = await this.#_didSession?.did.decryptJWE(message);
    let body;
    try {
      body = JSON.parse(new TextDecoder().decode(decryptedBody));
    } catch (e) {
      this._log.warn(e);
    }
    return body as T;
  }

  static serializeMessage(content) {
    try {
      const stringifyContent = JSON.stringify(content);
      const encoder = new TextEncoder();
      return encoder.encode(stringifyContent);
    } catch (e) {
      return undefined;
    }
  }

  @validate(z.string(), z.unknown())
  async sendMessage(to: string, content: unknown) {
    const serializedMessage = AWF_Auth.serializeMessage(content);
    if (!serializedMessage) {
      throw new Error('Content is not serializable');
    }
    return createFormattedValue({});
  }

  /**
   * Returns all the inbox messages from Textile Users
   * @param args - InboxListOptions
   */
  async getMessages(args?: { limit?: number }): Promise<{ data: IMessage[] }> {
    return createFormattedValue(await this._getMessages(args));
  }

  private async _getMessages(args?: { limit?: number }) {
    const limit = args?.limit || 50;
    return [].slice(0, limit);
  }

  // pubKey seek does not work
  // @Todo: workaround pubKey filtering
  async getConversation(_pubKey: string) {
    const limit = 10000;
    return createFormattedValue([].slice(0, limit));
  }

  /**
   * Checks the Textile Users inbox and looks for specific
   * notification message type
   */
  async hasNewNotifications() {
    const hasNewNotifications = await this._hasNewNotifications();
    return createFormattedValue(hasNewNotifications);
  }

  private async _hasNewNotifications() {
    return false;
  }

  @validate(z.string())
  async markMessageAsRead(messageId: string) {
    const marked = await this._markMessageAsRead(messageId);
    this._globalChannel.next({
      data: { messageId },
      event: AUTH_EVENTS.MARK_MSG_READ,
    });
    return marked;
  }

  /**
   *
   * @param _messageId - message id to mark as read
   */
  @validate(z.string())
  private async _markMessageAsRead(_messageId: string) {
    return true;
  }

  @validate(InviteCodeSchema)
  async validateInvite(inviteCode: InviteCode) {
    return this._validateInvite(inviteCode);
  }

  /**
   *
   * @param inviteCode - invitation code received by email
   */
  private async _validateInvite(inviteCode: InviteCode) {
    // no need for invitation codes atm
    return true;

    // const response = await fetch(`${process.env.INVITATION_ENDPOINT}/${inviteCode}`, {
    //   method: 'POST',
    // });
    // if (response.ok) {
    //   localStorage.setItem('@signUpToken', inviteCode);
    //   return true;
    // }
    // if (response.status === 403) {
    //   throw new Error('Sorry, this code has already been used. Please try another one.');
    // }
    //
    // throw new Error('Sorry, this code is not valid. Please try again.');
  }

  async getToken() {
    return Promise.resolve('fakeToken');
  }
}

export default AWF_Auth;
