import { Buffer } from 'buffer';
import { inject, injectable } from 'inversify';
import {
  ENTRY_EVENTS,
  TYPES,
  PostToPublishSchema,
  TagNameSchema,
  EntryIDSchema,
  PubKeySchema,
  DataProviderInputSchema,
  PostToPublish,
  EntryID,
  PubKey,
} from '@akashaorg/typings/sdk';
import { DataProviderInput } from '@akashaorg/typings/sdk/graphql-types';
import Gql from '../gql';
import AWF_Auth from '../auth';
import Logging from '../logging';
import EventBus from '../common/event-bus';
import pino from 'pino';
import { z } from 'zod';
import { validate } from '../common/validator';
import { throwError } from '../common/error-handling';

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
  //
  // /**
  //  *
  //  * @param entryId
  //  */
  // @validate(EntryIDSchema)
  // async getEntry(entryId: string) {
  //   const res = await this._auth.getCurrentUser();
  //   return this._gql.getAPI().GetEntry({ id: entryId, pubKey: res?.id });
  // }
  //
  // /**
  //  *
  //  * @param opt
  //  */
  // @validate(z.object({ offset: EntryIDSchema.optional(), limit: z.number() }))
  // async getEntries(opt: { offset?: EntryID; limit: number }) {
  //   const res = await this._auth.getCurrentUser();
  //   return this._gql.getAPI().GetEntries({ offset: opt.offset, limit: opt.limit, pubKey: res?.id });
  // }
  //
  // /**
  //  *
  //  * @param opt
  //  */
  // @validate(z.object({ data: z.array(DataProviderInputSchema), post: PostToPublishSchema }))
  // async postEntry(opt: { data: DataProviderInput[]; post: PostToPublish }) {
  //   const textContent = opt.data.find(e => e.property === 'textContent');
  //   if (!textContent) {
  //     throwError('Cannot post entry without content', ['sdk', 'entry', 'postEntry']);
  //     return;
  //   }
  //   textContent.value = Buffer.from(textContent.value).toString('base64');
  //   const auth = await this._auth.authenticateMutationData(
  //     opt.data as unknown as Record<string, unknown>[],
  //   );
  //   const newEntry = await this._gql.getAPI().CreateEntry(
  //     { content: opt.data, post: opt.post },
  //     {
  //       Authorization: `Bearer ${auth.token}`,
  //       Signature: auth.signedData.signature.toString(),
  //     },
  //   );
  //   // @emits ENTRY_EVENTS.CREATE
  //   this._globalChannel.next({
  //     data: newEntry,
  //     event: ENTRY_EVENTS.CREATE,
  //     args: opt,
  //   });
  //   return newEntry;
  // }
  //
  // /**
  //  * Update an existing entry
  //  * @param opt
  //  */
  // @validate(
  //   z.object({
  //     entryID: EntryIDSchema,
  //     data: z.array(DataProviderInputSchema),
  //     post: z.object({ title: z.string().optional(), tags: z.array(z.string()).optional() }),
  //   }),
  // )
  // async editEntry(opt: {
  //   entryID: EntryID;
  //   data: DataProviderInput[];
  //   post: { title?: string; tags?: string[]; quotes?: string[]; mentions?: string[] };
  // }) {
  //   const textContent = opt.data.find(e => e.property === 'textContent');
  //   if (!textContent) {
  //     throwError('Edited post does not have content', ['sdk', 'entry', 'editEntry']);
  //     return;
  //   }
  //   textContent.value = Buffer.from(textContent.value).toString('base64');
  //   const auth = await this._auth.authenticateMutationData(
  //     opt.data as unknown as Record<string, unknown>[],
  //   );
  //   const editEntry = await this._gql.getAPI().EditEntry(
  //     { content: opt.data, post: opt.post, id: opt.entryID },
  //     {
  //       Authorization: `Bearer ${auth.token}`,
  //       Signature: auth.signedData.signature.toString(),
  //     },
  //   );
  //   // @emits ENTRY_EVENTS.EDIT
  //   this._globalChannel.next({
  //     data: editEntry,
  //     event: ENTRY_EVENTS.EDIT,
  //     args: opt,
  //   });
  //   return editEntry;
  // }
  //
  // @validate(z.object({ pubKey: PubKeySchema, offset: z.number().optional(), limit: z.number() }))
  // async entriesByAuthor(opt: { pubKey: PubKey; offset?: number; limit: number }) {
  //   const currentUser = await this._auth.getCurrentUser();
  //   return this._gql.getAPI().GetPostsByAuthor({
  //     author: opt.pubKey,
  //     offset: opt.offset,
  //     limit: opt.limit,
  //     pubKey: currentUser?.id,
  //   });
  // }
  //
  // /**
  //  *
  //  * @param opt
  //  */
  // @validate(z.object({ name: TagNameSchema, offset: z.number().optional(), limit: z.number() }))
  // async entriesByTag(opt: { name: string; offset?: number; limit: number }) {
  //   const currentUser = await this._auth.getCurrentUser();
  //   return this._gql.getAPI().GetPostsByTag({
  //     tag: opt.name,
  //     offset: opt.offset,
  //     limit: opt.limit,
  //     pubKey: currentUser?.id,
  //   });
  // }
  //
  // /**
  //  * Remove an entry's content by ID
  //  * @param entryID
  //  */
  // @validate(EntryIDSchema)
  // async removeEntry(entryID: EntryID) {
  //   const auth = await this._auth.authenticateMutationData(entryID);
  //   const removedEntry = await this._gql.getAPI().RemoveEntry(
  //     { id: entryID },
  //     {
  //       Authorization: `Bearer ${auth.token}`,
  //       Signature: auth.signedData.signature.toString(),
  //     },
  //   );
  //   // @emits ENTRY_EVENTS.REMOVE
  //   this._globalChannel.next({
  //     data: removedEntry,
  //     event: ENTRY_EVENTS.REMOVE,
  //     args: { entryID },
  //   });
  //   return removedEntry;
  // }
  //
  // /**
  //  * @param link
  //  */
  // @validate(z.string())
  // async getLinkPreview(link: string) {
  //   const auth = await this._auth.authenticateMutationData({ link });
  //   return this._gql.getAPI().GetLinkPreview(
  //     { link: link },
  //     {
  //       Authorization: `Bearer ${auth.token}`,
  //       Signature: auth.signedData.signature.toString(),
  //     },
  //   );
  // }
  //
  // @validate(z.object({ offset: z.number().optional(), limit: z.number() }))
  // async getFeedEntries(opt: { offset?: number; limit: number }) {
  //   const token = await this._auth.getToken();
  //   if (!token) {
  //     throw new Error('Must be authenticated in order to access the personalized feed api.');
  //   }
  //   return this._gql.getAPI().GetCustomFeed(
  //     {
  //       offset: opt.offset,
  //       limit: opt.limit,
  //     },
  //     { Authorization: `Bearer ${token}` },
  //   );
  // }
}

export default AWF_Entry;
