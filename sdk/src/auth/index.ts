import { AUTH_MESSAGE, authStatus, SwActionType } from './constants';
import {
  Buckets,
  Client,
  InboxListOptions,
  PrivateKey,
  Status,
  UserAuth,
  Users,
  Filecoin,
} from '@textile/hub';
import { GetProfile } from '../profiles/profile.graphql';
import { generatePrivateKey, loginWithChallenge } from './hub.auth';
import { inject, injectable } from 'inversify';
import { TYPES } from '@akashaproject/sdk-typings';
import DB from '../db';
import { AWF_IAuth, EthProviders } from '@akashaproject/sdk-typings/lib/interfaces';
import Web3Connector from '../common/web3.connector';
import EventBus from '../common/event-bus';
import Logging from '../logging';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import Settings from '../settings';

import Gql from '../gql';
import { map, tap } from 'rxjs/operators';
import { forkJoin, from, lastValueFrom } from 'rxjs';
import { AUTH_EVENTS } from '@akashaproject/sdk-typings/lib/interfaces/events';
import hash from 'object-hash';
import { Buffer } from 'buffer';
import { PublicKey } from '@textile/threaddb';
import { CurrentUser } from '@akashaproject/sdk-typings/lib/interfaces/common';
import { createObservableStream } from '../helpers/observable';
import { executeOnSW } from './helpers';

@injectable()
export default class AWF_Auth implements AWF_IAuth {
  #identity: PrivateKey;
  private hubClient: Client;
  private hubUser: Users;
  private buckClient: Buckets;
  private fil: Filecoin;
  private auth: UserAuth;
  private _db: DB;
  private readonly _web3: Web3Connector;
  private _globalChannel: EventBus;
  private _log: ILogger;
  private _settings: Settings;
  private _gql: Gql;
  private channel: BroadcastChannel;
  private sessKey;
  private inboxWatcher;
  private currentUser: CurrentUser;
  private _lockSignIn: boolean;
  #signedAuthMessage: string;
  #tokenGenerator: () => Promise<UserAuth>;
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
  ) {
    this._db = db;
    this._web3 = web3;
    this._globalChannel = globalChannel;
    this._log = log.create('AWF_Auth');
    this._settings = settings;
    this._gql = gql;
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
            this.channel.postMessage({ response, type: this.SYNC_RESPONSE });
          }
        } else if (type === this.SYNC_RESPONSE) {
          const { response } = event.data;
          if (response && response.identity.key !== this.sessKey) {
            this._log.info('syncing session');
            this.currentUser = null;
            this._getCurrentUser().then(data => this._log.info('logged in'));
          }
        } else if (type === this.SIGN_OUT_EVENT && this.currentUser) {
          this._signOut().then(_ => {
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
   * @param ethAddress
   */
  checkIfSignedUp(ethAddress: string) {
    const variables = { ethAddress: ethAddress };
    const check = this._gql.run<{ errors?: never }>(
      {
        query: GetProfile,
        variables: variables,
        operationName: 'GetProfile',
      },
      false,
    );
    return check.pipe(
      tap(response => {
        if (!response.data || response.data?.errors) {
          const err = new Error('This ethereum key is not registered');
          err.name = 'UserNotRegistered';
          throw err;
        }
      }),
    );
  }

  signIn(args: { provider?: EthProviders; checkRegistered: boolean; resumeSignIn?: boolean }) {
    const normalisedArgs = Object.assign({}, { checkRegistered: true }, args);
    return createObservableStream(this._signIn(normalisedArgs));
  }

  private async _signIn(
    args: { provider?: EthProviders; checkRegistered: boolean; resumeSignIn?: boolean } = {
      provider: EthProviders.Web3Injected,
      checkRegistered: true,
    },
  ): Promise<CurrentUser & { isNewUser: boolean }> {
    let currentProvider: number = args.provider;
    if (!args.resumeSignIn) {
      if (this._lockSignIn) {
        return;
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
        currentProvider = +localStorage.getItem(this.providerKey); // cast to int
      } else {
        if (currentProvider === EthProviders.WalletConnect) {
          this._log.info('using wc bridge');
          localStorage.removeItem('walletconnect');
        }
      }
      try {
        const address = await this._connectAddress(currentProvider);
        const localUser = localStorage.getItem(this.currentUserKey);
        this.sessKey = `@identity:${address.toLowerCase()}:${currentProvider}`;
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
        if (args.checkRegistered) {
          await lastValueFrom(this.checkIfSignedUp(address));
        }
        this._log.info(`using eth address ${address}`);
        if (sessValue) {
          const rawKey: { value?: string } = await executeOnSW(
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
        throw e;
      }
    }
    await this.#_setupHubClient();
    const swResponse = await executeOnSW({
      type: SwActionType.ENCRYPT,
      value: this.#identity.toString(),
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
      await lastValueFrom(this._db.open(2));
    }
    this._globalChannel.next({
      data: this.currentUser,
      event: AUTH_EVENTS.READY,
    });
    this._lockSignIn = false;
    return Object.assign(this.currentUser, authStatus);
  }

  async _connectAddress(provider: EthProviders) {
    this._globalChannel.next({
      data: {},
      event: AUTH_EVENTS.CONNECT_ADDRESS,
    });
    await this._web3.connect(provider);
    await lastValueFrom(this._web3.checkCurrentNetwork());
    const resp = await lastValueFrom(this._web3.getCurrentAddress());
    this._globalChannel.next({
      data: { address: resp.data },
      event: AUTH_EVENTS.CONNECT_ADDRESS_SUCCESS,
    });
    return resp.data;
  }

  connectAddress(provider: EthProviders) {
    return createObservableStream(this._connectAddress(provider));
  }

  signAuthMessage() {
    return createObservableStream(this.#_signAuthMessage());
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
    return createObservableStream(this.#_signComposedMessage());
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
    return createObservableStream(this.#_signTokenMessage());
  }
  async #_signTokenMessage() {
    if (!this.#identity) {
      throw new Error('Composed message was not signed!');
    }
    this.#tokenGenerator = loginWithChallenge(this.#identity, this._web3);
    this._globalChannel.next({
      data: {},
      event: AUTH_EVENTS.SIGN_TOKEN_MESSAGE,
    });
    this.auth = await this.#tokenGenerator();
    this._globalChannel.next({
      data: {},
      event: AUTH_EVENTS.SIGN_TOKEN_MESSAGE_SUCCESS,
    });
  }

  async #_setupHubClient() {
    if (!this.#tokenGenerator) {
      throw new Error('Token message was not signed!');
    }
    const pubKey = this.#identity.public.toString();
    const address = await lastValueFrom(this._web3.getCurrentAddress());
    const userAuth = loginWithChallenge(this.#identity, this._web3);
    this.hubClient = Client.withUserAuth(userAuth, process.env.AUTH_ENDPOINT);
    this.hubUser = Users.withUserAuth(userAuth);
    this.buckClient = Buckets.withUserAuth(userAuth);
    this.fil = Filecoin.withUserAuth(userAuth);
    await this.hubUser.getToken(this.#identity);
    await this.hubUser.setupMailbox();
    const mailboxID = await this.hubUser.getMailboxID();
    this.inboxWatcher = await this.hubUser.watchInbox(mailboxID, ev => {
      if (ev?.message?.body && ev?.message?.readAt === 0) {
        this._globalChannel.next({
          data: { emit: true },
          event: AUTH_EVENTS.NEW_NOTIFICATIONS,
        });
      }
    });
    await this.fil.getToken(this.#identity);
    const timeoutApi = new Promise<never[]>(resolve => {
      setTimeout(resolve, 15000, [null]);
    });
    const [filAddress] = await Promise.race([this.fil.addresses(), timeoutApi]);
    this.currentUser = {
      pubKey,
      ethAddress: address.data,
      filAddress: filAddress?.address,
    };
  }
  /**
   * Returns current session objects for textile
   */
  getSession() {
    return createObservableStream<{
      buck: Buckets;
      client: Client;
      user: Users;
    }>(this._getSession());
  }

  private async _getSession() {
    if (!localStorage.getItem(this.providerKey)) {
      throw new Error('No previous session found');
    }

    if (!this.#identity) {
      await this.signIn({ provider: EthProviders.None, checkRegistered: false });
    }

    return {
      client: this.hubClient,
      user: this.hubUser,
      buck: this.buckClient,
    };
  }

  /**
   * Generate a textile access token
   */
  getToken() {
    return createObservableStream<string>(this._getToken());
  }

  private async _getToken() {
    const session = await lastValueFrom(this.getSession());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const isExpired = session.data.client.context?.isExpired;
    if (!isExpired && this.auth) {
      return this.auth.token;
    }
    this.auth = await this.#tokenGenerator();
    return this.auth.token;
  }

  /**
   * Returns the currently logged in user object
   * It will try to login if there is a previous session detected
   */
  getCurrentUser() {
    return createObservableStream(this._getCurrentUser());
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
  signOut() {
    return createObservableStream<boolean>(this._signOut());
  }

  private async _signOut() {
    sessionStorage.clear();
    localStorage.removeItem(this.sessKey);
    localStorage.removeItem(this.providerKey);
    localStorage.removeItem(this.currentUserKey);
    this.#identity = null;
    this.hubClient = null;
    this.hubUser = null;
    this.inboxWatcher = null;
    this.buckClient = null;
    this.auth = null;
    this.currentUser = null;
    if (this.channel) {
      this.channel.postMessage({ type: this.SIGN_OUT_EVENT });
    }
    await this._web3.disconnect();
    return true;
  }

  /**
   * Sign data with the identity key
   * @param data
   * @param base64Format
   */
  signData(
    data: Record<string, unknown> | string | Record<string, unknown>[],
    base64Format = false,
  ) {
    return createObservableStream(this._signData(data, base64Format));
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
   * @param args
   */
  verifySignature(args: {
    pubKey: string;
    data: Uint8Array | string | Record<string, unknown>;
    signature: Uint8Array | string;
  }) {
    return createObservableStream(this._verifySignature(args));
  }

  private async _verifySignature(args: {
    pubKey: string;
    data: Uint8Array | string | Record<string, unknown>;
    signature: Uint8Array | string;
  }) {
    const pub = PublicKey.fromString(args.pubKey);
    let sig: Uint8Array;
    if (args.signature instanceof Uint8Array) {
      sig = args.signature;
    } else {
      const str = Buffer.from(args.signature, 'base64');
      sig = Uint8Array.from(str);
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
   * @param data
   */
  authenticateMutationData(data: Record<string, unknown> | string | Record<string, unknown>[]) {
    const token = from(this.getToken());
    const signedData = from(this.signData(data, true));
    return forkJoin([token, signedData]).pipe(
      map(result => ({ token: result[0], signedData: result[1] })),
    );
  }

  /**
   * Allows decryption of privately sent messages to the current identity
   * @param message
   */
  decryptMessage(message) {
    return createObservableStream<{
      body: Record<string, any>;
      from: string;
      readAt: number;
      createdAt: number;
      id: string;
    }>(this._decryptMessage(message));
  }

  private async _decryptMessage(message) {
    const decryptedBody = await this.#identity.decrypt(message.body);
    let body;
    try {
      body = JSON.parse(new TextDecoder().decode(decryptedBody));
    } catch (e) {
      this._log.warn(e);
    }
    const { from, readAt, createdAt, id } = message;
    return { body, from, readAt, createdAt, id };
  }

  /**
   * Returns all the inbox messages from Textile Users
   * @param args
   */
  getMessages(args: InboxListOptions) {
    return createObservableStream<
      {
        body: Record<string, any>;
        from: string;
        readAt: number;
        createdAt: number;
        id: string;
      }[]
    >(this._getMessages(args));
  }

  private async _getMessages(args: InboxListOptions) {
    const limit = args?.limit || 50;
    const messages = await this.hubUser.listInboxMessages(
      Object.assign({}, { status: Status.UNREAD, limit: limit }, args),
    );
    const readMessagesLimit = limit - messages.length;
    const readMessages =
      readMessagesLimit > 0
        ? await this.hubUser.listInboxMessages(
            Object.assign({}, { status: Status.ALL, limit: limit }, args),
          )
        : [];
    const combinedMessages = messages
      .concat(readMessages)
      .sort((a, b) => b.createdAt - a.createdAt);
    const inbox = [];
    const uniqueMessages = new Map();
    for (const messageObj of combinedMessages) {
      if (messageObj.from !== process.env.EWA_MAILSENDER) {
        continue;
      }
      uniqueMessages.set(messageObj.id, messageObj);
    }
    for (const message of uniqueMessages.values()) {
      const decryptedObj = await this._decryptMessage(message);
      inbox.push(Object.assign({}, decryptedObj, { read: decryptedObj.readAt > 0 }));
    }
    uniqueMessages.clear();
    return inbox.slice();
  }

  /**
   * Checks the Textile Users inbox and looks for specific
   * notification message type
   */
  hasNewNotifications() {
    return createObservableStream(this._hasNewNotifications());
  }

  private async _hasNewNotifications() {
    const limit = 1;
    const messages = await this.hubUser.listInboxMessages({ status: Status.UNREAD, limit: limit });
    const newMessage = messages.find(rec => rec.from === process.env.EWA_MAILSENDER);
    return !!newMessage;
  }

  markMessageAsRead(messageId: string) {
    return createObservableStream(this._markMessageAsRead(messageId)).pipe(
      tap(() => {
        this._globalChannel.next({
          data: { messageId },
          event: AUTH_EVENTS.MARK_MSG_READ,
        });
      }),
    );
  }

  /**
   *
   * @param messageId
   */
  private async _markMessageAsRead(messageId: string) {
    await this.hubUser.readInboxMessage(messageId);
    return true;
  }

  deleteMessage(messageId: string) {
    return createObservableStream(this._deleteMessage(messageId));
  }

  /**
   *
   * @param messageId
   */
  private async _deleteMessage(messageId: string) {
    await this.hubUser.deleteInboxMessage(messageId);
    return true;
  }

  validateInvite(inviteCode: string) {
    return createObservableStream(this._validateInvite(inviteCode));
  }

  /**
   *
   * @param inviteCode
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
