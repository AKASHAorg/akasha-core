import { AUTH_MESSAGE, authStatus, SwActionType } from './constants';
import { InboxListOptions, PrivateKey, UserAuth } from '@textile/hub';
import { generatePrivateKey, loginWithChallenge } from './hub.auth';
import { inject, injectable } from 'inversify';
import {
  AUTH_EVENTS,
  CurrentUser,
  EthAddress,
  EthAddressSchema,
  EthProviders,
  EthProvidersSchema,
  IMessage,
  PubKeySchema,
  TYPES,
} from '@akashaorg/typings/sdk';
import DB from '../db';
import Web3Connector from '../common/web3.connector';
import EventBus from '../common/event-bus';
import Logging from '../logging';
import Settings from '../settings';

import Gql from '../gql';
import hash from 'object-hash';
import { Buffer } from 'buffer';
import { PublicKey } from '@textile/threaddb';
import { createFormattedValue } from '../helpers/observable';
import { executeOnSW } from './helpers';
import pino from 'pino';
import Lit from '../auth-v2/lit';
import CeramicService from '../auth-v2/ceramic';
import { z } from 'zod';
import { validate } from '../common/validator';

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
  #identity?: PrivateKey;
  private auth?: UserAuth;
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
  #signedAuthMessage?: string;
  tokenGenerator?: () => Promise<UserAuth>;
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
    const variables = { ethAddress };
    const prof = await this._gql.getAPI().GetProfile(variables);
    return !!prof?.getProfile?.pubKey;
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
        this.sessKey = `@identity:${address?.toLowerCase()}:${currentProvider}`;
        const sessValue = localStorage.getItem(this.sessKey);
        if (localUser && sessValue) {
          const tmpSession = JSON.parse(localUser);
          if (address && tmpSession?.ethAddress === address) {
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
          const rawKey = await executeOnSW<{ value?: string }>(
            Object.assign(
              {
                type: SwActionType.DECRYPT,
              },
              JSON.parse(sessValue),
            ),
          );
          if (rawKey?.value) {
            this.#identity = PrivateKey.fromString(rawKey.value);
          }
        }
        if (!this.#identity) {
          await this.#_signAuthMessage();
          await new Promise(res => setTimeout(res, 600));
          await this.#_signComposedMessage();
        }
        await this.#_signTokenMessage();
      } catch (e) {
        this._lockSignIn = false;
        localStorage.removeItem(this.sessKey);
        localStorage.removeItem(this.providerKey);
        localStorage.removeItem(this.currentUserKey);
        this._log.error(e);
        await this._web3.disconnect();
        throw e;
      }
    }
    await this.#_setupHubClient();
    const swResponse = await executeOnSW({
      type: SwActionType.ENCRYPT,
      value: this.#identity?.toString(),
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

    if (this.currentUser?.pubKey) {
      this._db.create(`awf-alpha-user-${this.currentUser.pubKey.slice(-8)}`);
      // // not working atm
      // const remote = await db.remote.setUserAuth(userAuth);
      // remote.config.metadata.set('x-textile-thread-name', db.dexie.name);
      // remote.config.metadata.set('x-textile-thread', db.id);
      // await remote.authorize(identity);
      await this._db.open(3);
    }
    this._globalChannel.next({
      data: this.currentUser,
      event: AUTH_EVENTS.READY,
    });
    this._lockSignIn = false;
    //await this._lit.connect();
    //await this._ceramic.connect();
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

  async signAuthMessage() {
    return this.#_signAuthMessage();
  }
  async #_signAuthMessage(): Promise<void> {
    this._globalChannel.next({
      data: {},
      event: AUTH_EVENTS.SIGN_AUTH_MESSAGE,
    });
    this.#signedAuthMessage = await this._web3.signMessage(AUTH_MESSAGE);
    this._globalChannel.next({
      data: {},
      event: AUTH_EVENTS.SIGN_AUTH_MESSAGE_SUCCESS,
    });
  }

  signComposedMessage() {
    return this.#_signComposedMessage();
  }
  async #_signComposedMessage() {
    if (!this.#signedAuthMessage) {
      throw new Error('Auth message was not signed!');
    }
    this._globalChannel.next({
      data: {},
      event: AUTH_EVENTS.SIGN_COMPOSED_MESSAGE,
    });
    this.#identity = await generatePrivateKey(this._web3, this.#signedAuthMessage);
    this._globalChannel.next({
      data: {},
      event: AUTH_EVENTS.SIGN_COMPOSED_MESSAGE_SUCCESS,
    });
    this.#signedAuthMessage = undefined;
  }

  signTokenMessage() {
    return this.#_signTokenMessage();
  }
  async #_signTokenMessage() {
    if (!this.#identity) {
      throw new Error('Composed message was not signed!');
    }
    this.tokenGenerator = loginWithChallenge(this.#identity, this._web3);
    this._globalChannel.next({
      data: {},
      event: AUTH_EVENTS.SIGN_TOKEN_MESSAGE,
    });
    this.auth = await this.tokenGenerator();
    this._globalChannel.next({
      data: {},
      event: AUTH_EVENTS.SIGN_TOKEN_MESSAGE_SUCCESS,
    });
  }

  async #_setupHubClient() {
    if (!this.tokenGenerator) {
      throw new Error('Token message was not signed!');
    }
    const pubKey = this.#identity?.public.toString();
    const address = await this._web3.getCurrentEthAddress();
    // const userAuth = loginWithChallenge(this.#identity, this._web3);

    // refresh textile api tokens every 20min
    setInterval(async () => {
      await this.#_refreshTextileToken();
    }, 1000 * 60 * 20);

    this.currentUser = {
      pubKey,
      ethAddress: address ?? undefined,
    };
  }

  /*
   * Force creation of a new jwt for textile buckets and mailboxes
   */
  async #_refreshTextileToken() {
    // empty
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

    if (!this.#identity) {
      await this.signIn({ provider: EthProviders.None, checkRegistered: false });
    }

    return {};
  }

  /**
   * Generate a textile access token
   */
  async getToken() {
    return this._getToken();
  }

  private async _getToken() {
    const session = await this.getSession();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const isExpired = session.data.client.context?.isExpired;
    if (!isExpired && this.auth) {
      return this.auth.token;
    }
    if (this.tokenGenerator) {
      this.auth = await this.tokenGenerator();
      return this.auth.token;
    }
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
    this.#identity = undefined;
    this.inboxWatcher = null;
    this.auth = undefined;
    this.currentUser = undefined;
    if (this.channel) {
      this.channel.postMessage({ type: this.SIGN_OUT_EVENT });
    }
    await this._web3.disconnect();
    await this._lit.disconnect();
    await this._ceramic.disconnect();
    return true;
  }

  /**
   * Sign data with the identity key
   * @param data -
   * @param base64Format - set to true if the data is base64 encoded
   */
  async signData(
    data: Record<string, unknown> | string | Record<string, unknown>[],
    base64Format = false,
  ) {
    return this._signData(data, base64Format);
  }

  private async _signData(
    data: Record<string, unknown> | string | Record<string, unknown>[],
    base64Format = false,
  ) {
    if (!this.#identity) {
      throw new Error('No identity key found!');
    }
    let serializedData;
    if (typeof data === 'object') {
      serializedData = hash(data);
    }
    serializedData = this.encoder.encode(serializedData);
    let sig: Uint8Array | string = await this.#identity.sign(serializedData);
    if (base64Format) {
      sig = Buffer.from(sig).toString('base64');
    }
    return { serializedData, signature: sig, pubKey: this.#identity.public.toString() };
  }

  /**
   * Verify if a signature was made by a specific Public Key
   * @param args - object containing the signature, the serialized data and the public key
   */
  @validate(
    z.object({
      pubKey: PubKeySchema,
      data: z.union([z.string(), z.record(z.unknown()), z.instanceof(Uint8Array)]),
      signature: z.union([z.string(), z.instanceof(Uint8Array)]),
    }),
  )
  async verifySignature(args: {
    pubKey: string;
    data: Uint8Array | string | Record<string, unknown>;
    signature: Uint8Array | string;
  }) {
    return this._verifySignature(args);
  }

  private async _verifySignature(args: {
    pubKey: string;
    data: Uint8Array | string | Record<string, unknown>;
    signature: Uint8Array | string;
  }) {
    const pub = PublicKey.fromString(args.pubKey);
    let sig: Uint8Array;
    if (!(args.signature instanceof Uint8Array)) {
      const str = Buffer.from(args.signature, 'base64');
      sig = Uint8Array.from(str);
    } else {
      sig = args.signature;
    }
    let serializedData;
    if (args.data instanceof Uint8Array) {
      return pub.verify(args.data, sig);
    }
    if (typeof args.data === 'object') {
      serializedData = hash(args.data);
    }
    serializedData = this.encoder.encode(serializedData);
    return pub.verify(serializedData, sig);
  }

  /**
   * Utility method for sending mutation graphql requests
   * @param data - mutation data
   */
  async authenticateMutationData(
    data: Record<string, unknown> | string | Record<string, unknown>[],
  ) {
    const token = await this._getToken();
    const signedData = await this._signData(data, true);
    return {
      token,
      signedData,
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
   * @param to - public key of the recipient
   * @param message - body text to be encrypted
   * @param base64Format - if the payload result should be in base64
   */
  async createEncryptedMessage(to: string, message: string, base64Format = true) {
    const recipient = PublicKey.fromString(to);
    const encoder = new TextEncoder();
    const encrypted = await recipient.encrypt(encoder.encode(message));
    if (base64Format) {
      return { to, base64Format, payload: Buffer.from(encrypted).toString('base64') };
    }
    return { to, base64Format, payload: encrypted };
  }

  // validate an encrypted message from cli
  async validateDevKeyFromBase64Message(message: string) {
    const decodedMessage = Buffer.from(message, 'base64');
    const decodedMessageArray = Uint8Array.from(decodedMessage);
    const decryptedMessage = await this.#identity?.decrypt(decodedMessageArray);
    let body: {
      sub: string; // public key to be added
      aud: string; // public key of the account to add the key
      iat: string; // creation timestamp
      sig: string; // signature of base64encoded object {sub, aud, iat}
    };
    try {
      body = JSON.parse(new TextDecoder().decode(decryptedMessage));
    } catch (e) {
      this._log.warn(e);
      throw new Error('The message format is not valid!');
    }
    if (!body.sub || !body.aud || !body.iat || !body.sig) {
      throw new Error('The message is missing claims data!');
    }
    if (body.aud !== this?.currentUser?.pubKey) {
      throw new Error(`This message was generated for a different pubKey ${body.aud}!`);
    }
    if (devKeys.some(e => e.pubKey === body.sub)) {
      throw new Error('This key was already added.');
    }
    const issDate = new Date(body.iat);
    //set expiration after 1 day
    issDate.setDate(issDate.getDate() + 1);
    const currentDate = new Date();
    if (currentDate > issDate) {
      throw new Error('The message has expired');
    }
    const arrayOfClaims = new TextEncoder().encode(
      JSON.stringify({ sub: body.sub, aud: body.aud, iat: body.iat }),
    );
    const encodedSig = Buffer.from(body.sig, 'base64');
    const devPubKey = PublicKey.fromString(body.sub);
    const isValidRequest = await devPubKey.verify(arrayOfClaims, Uint8Array.from(encodedSig));
    if (!isValidRequest) {
      throw new Error('The message could not be verified!');
    }
    return {
      pubKey: body.sub,
      currentDate: currentDate.toISOString(),
      expirationDate: issDate.toISOString(),
      body,
    };
  }

  /**
   * validate and add pubKey to the dev account
   * @param message - encrypted message with claims info
   * @param name - human-readable string to identify the key
   */
  async addDevKeyFromBase64Message(message: string, name?: string) {
    const validatedMsg = await this.validateDevKeyFromBase64Message(message);
    devKeys.push({
      pubKey: validatedMsg.pubKey,
      addedAt: validatedMsg.currentDate,
      name,
    });
  }

  // returns all the dev public keys
  // @Todo: connect it with the actual api
  async getDevKeys() {
    return Promise.resolve(devKeys);
  }

  // @Todo: connect it to the api when ready
  async removeDevKey(pubKey: string) {
    const index = devKeys.findIndex(e => e.pubKey === pubKey);
    if (index !== -1) {
      devKeys.splice(index, 1);
    }
  }
  private async _decryptMessage(message) {
    const decryptedBody = await this.#identity?.decrypt(message.body);
    let body;
    try {
      body = JSON.parse(new TextDecoder().decode(decryptedBody));
    } catch (e) {
      this._log.warn(e);
    }
    const { from, to, readAt, createdAt, id } = message;
    return { body, from, to, readAt, createdAt, id };
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

  async sendMessage(to: string, content: unknown) {
    const _toPubKey = PublicKey.fromString(to);
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
  async getMessages(args: InboxListOptions): Promise<{ data: IMessage[] }> {
    return createFormattedValue(await this._getMessages(args));
  }

  private async _getMessages(args: InboxListOptions) {
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
    const limit = 1;
    return false;
  }

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
  private async _markMessageAsRead(_messageId: string) {
    return true;
  }

  async validateInvite(inviteCode: string) {
    return this._validateInvite(inviteCode);
  }

  /**
   *
   * @param inviteCode - invitation code received by email
   */
  private async _validateInvite(inviteCode: string) {
    const response = await fetch(`${process.env.INVITATION_ENDPOINT}/${inviteCode}`, {
      method: 'POST',
    });
    if (response.ok) {
      localStorage.setItem('@signUpToken', inviteCode);
      return true;
    }
    if (response.status === 403) {
      throw new Error('Sorry, this code has already been used. Please try another one.');
    }

    throw new Error('Sorry, this code is not valid. Please try again.');
  }
}

export default AWF_Auth;
