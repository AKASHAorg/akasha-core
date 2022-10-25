import { inject, injectable } from 'inversify';
import { TYPES, TAG_EVENTS } from '@akashaorg/typings/sdk';
import Web3Connector from '../common/web3.connector';
import Logging from '../logging';
import Gql from '../gql';
import AWF_Auth from '../auth';
import EventBus from '../common/event-bus';
import pino from 'pino';

@injectable()
class AWF_Tags {
  private readonly _web3: Web3Connector;
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
    this._log = log.create('AWF_Tags');
    this._gql = gql;
    this._auth = auth;
    this._globalChannel = globalChannel;
  }

  /**
   *
   * @param tagName
   */
  async getTag(tagName: string) {
    return this._gql.getAPI().GetTag({ name: tagName });
  }

  /**
   *
   * @param opt
   */
  async getTags(opt: { offset?: string; limit: number }) {
    return this._gql.getAPI().GetTags({ offset: opt.offset || '', limit: opt.limit || 5 });
  }

  /**
   *
   * @param name
   */
  async searchTags(name: string) {
    return this._gql.getAPI().SearchTags({ name: name });
  }

  /**
   *
   * @param tagName
   */
  async createTag(tagName: string) {
    const auth = await this._auth.authenticateMutationData(tagName);
    const newTag = await this._gql.getAPI().CreateTag(
      { name: tagName },
      {
        Authorization: `Bearer ${auth.token}`,
        Signature: auth.signedData.signature.toString(),
      },
    );
    // @emits TAG_EVENTS.CREATE
    this._globalChannel.next({
      data: newTag,
      event: TAG_EVENTS.CREATE,
      args: { tagName },
    });
    return newTag;
  }

  /**
   * Returns most recent used tags
   */
  getTrending() {
    return this.searchTags('');
  }
}

export default AWF_Tags;
