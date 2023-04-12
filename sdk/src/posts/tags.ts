import { inject, injectable } from 'inversify';
import { TYPES, TAG_EVENTS, TagNameSchema, TagName } from "@akashaorg/typings/sdk";
import Web3Connector from '../common/web3.connector';
import Logging from '../logging';
import Gql from '../gql';
import AWF_Auth from '../auth';
import EventBus from '../common/event-bus';
import pino from 'pino';
import { z } from 'zod';
import { validate } from '../common/validator';
import { throwError } from '../common/error-handling';
import { createFormattedValue } from '../helpers/observable';

@injectable()
class AWF_Tags {
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
  @validate(TagNameSchema)
  async getTag(tagName: string) {
    try {
      const result = await this._gql.getAPI().GetTag({ name: tagName });
      return createFormattedValue(result);
    } catch (err) {
      throwError(`Cannot get tag: ${(err as Error).message}`, ['sdk', 'tags', 'getTag', tagName]);
    }
  }

  /**
   *
   * @param opt
   */
  @validate(z.object({ offset: TagNameSchema, limit: z.number() }))
  async getTags(opt: { offset?: TagName; limit: number }) {
    return this._gql.getAPI().GetTags({ offset: opt.offset || '', limit: opt.limit || 5 });
  }

  /**
   *
   * @param name
   */
  @validate(TagNameSchema)
  async searchTags(name: TagName) {
    return this._gql.getAPI().SearchTags({ name: name });
  }

  /**
   *
   * @param tagName
   */
  @validate(TagNameSchema)
  async createTag(tagName: TagName) {
    z.string().min(3).parse(tagName);
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
    return this._gql.getAPI().SearchTags({ name: '' });
  }
}

export default AWF_Tags;
