import { Buffer } from 'buffer';
import { inject, injectable } from 'inversify';
import { ENTRY_EVENTS, TYPES } from '@akashaorg/typings/sdk';
import { DataProviderInput } from '@akashaorg/typings/sdk/graphql-types';
import Gql from '../gql';
import AWF_Auth from '../auth';
import Logging from '../logging';
import EventBus from '../common/event-bus';
import pino from 'pino';

@injectable()
class AWF_Entry {
  private _log: pino.Logger;
  private _gql: Gql;
  private _auth: AWF_Auth;
  private _globalChannel: EventBus;

  constructor(
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Gql) gql: Gql,
    @inject(TYPES.Auth) auth: AWF_Auth,
    @inject(TYPES.EventBus) globalChannel: EventBus,
  ) {
    this._log = log.create('AWF_Entry');
    this._gql = gql;
    this._auth = auth;
    this._globalChannel = globalChannel;
  }

  /**
   *
   * @param entryId
   */
  async getEntry(entryId: string) {
    const res = await this._auth.getCurrentUser();
    return this._gql.getAPI().GetEntry({ id: entryId, pubKey: res?.pubKey });
  }

  /**
   *
   * @param opt
   */
  async getEntries(opt: { offset?: string; limit: number }) {
    const res = await this._auth.getCurrentUser();
    return this._gql
      .getAPI()
      .GetEntries({ offset: opt.offset, limit: opt.limit, pubKey: res?.pubKey });
  }

  /**
   *
   * @param opt
   */
  async postEntry(opt: {
    data: DataProviderInput[];
    post: { title?: string; tags?: string[]; quotes?: string[]; mentions?: string[] };
  }) {
    const textContent = opt.data.find(e => e.property === 'textContent');
    textContent.value = Buffer.from(textContent.value).toString('base64');
    const auth = await this._auth.authenticateMutationData(
      opt.data as unknown as Record<string, unknown>[],
    );
    const newEntry = await this._gql.getAPI().CreateEntry(
      { content: opt.data, post: opt.post },
      {
        Authorization: `Bearer ${auth.token}`,
        Signature: auth.signedData.signature.toString(),
      },
    );
    // @emits ENTRY_EVENTS.CREATE
    this._globalChannel.next({
      data: newEntry,
      event: ENTRY_EVENTS.CREATE,
      args: opt,
    });
    return newEntry;
  }

  /**
   * Update an existing entry
   * @param opt
   */
  async editEntry(opt: {
    entryID: string;
    data: DataProviderInput[];
    post: { title?: string; tags?: string[]; quotes?: string[]; mentions?: string[] };
  }) {
    const textContent = opt.data.find(e => e.property === 'textContent');
    textContent.value = Buffer.from(textContent.value).toString('base64');
    const auth = await this._auth.authenticateMutationData(
      opt.data as unknown as Record<string, unknown>[],
    );
    const editEntry = await this._gql.getAPI().EditEntry(
      { content: opt.data, post: opt.post, id: opt.entryID },
      {
        Authorization: `Bearer ${auth.token}`,
        Signature: auth.signedData.signature.toString(),
      },
    );
    // @emits ENTRY_EVENTS.EDIT
    this._globalChannel.next({
      data: editEntry,
      event: ENTRY_EVENTS.EDIT,
      args: opt,
    });
    return editEntry;
  }

  async entriesByAuthor(opt: { pubKey: string; offset?: number; limit: number }) {
    const currentUser = await this._auth.getCurrentUser();
    return this._gql.getAPI().GetPostsByAuthor({
      author: opt.pubKey,
      offset: opt.offset,
      limit: opt.limit,
      pubKey: currentUser?.pubKey,
    });
  }

  /**
   *
   * @param opt
   */
  async entriesByTag(opt: { name: string; offset?: number; limit: number }) {
    const currentUser = await this._auth.getCurrentUser();
    return this._gql.getAPI().GetPostsByTag({
      tag: opt.name,
      offset: opt.offset,
      limit: opt.limit,
      pubKey: currentUser?.pubKey,
    });
  }

  /**
   * Remove an entry's content by ID
   * @param entryID
   */
  async removeEntry(entryID: string) {
    const auth = await this._auth.authenticateMutationData(entryID);
    const removedEntry = await this._gql.getAPI().RemoveEntry(
      { id: entryID },
      {
        Authorization: `Bearer ${auth.token}`,
        Signature: auth.signedData.signature.toString(),
      },
    );
    // @emits ENTRY_EVENTS.REMOVE
    this._globalChannel.next({
      data: removedEntry,
      event: ENTRY_EVENTS.REMOVE,
      args: { entryID },
    });
    return removedEntry;
  }

  /**
   * @param link
   */
  async getLinkPreview(link: string) {
    const auth = await this._auth.authenticateMutationData({ link });
    return this._gql.getAPI().GetLinkPreview(
      { link: link },
      {
        Authorization: `Bearer ${auth.token}`,
        Signature: auth.signedData.signature.toString(),
      },
    );
  }

  async getFeedEntries(opt: { offset?: number; limit: number }) {
    const token = await this._auth.getToken();
    if (!token) {
      throw new Error('Must be authenticated in order to access the personalized feed api.');
    }
    return this._gql.getAPI().GetCustomFeed(
      {
        offset: opt.offset,
        limit: opt.limit,
      },
      { Authorization: `Bearer ${token}` },
    );
  }
}

export default AWF_Entry;
