import { inject, injectable } from 'inversify';
import {
  TYPES,
  TagName,
  TagNameSchema,
  PubKey,
  PubKeySchema,
  DataProviderInputSchema,
  Username,
  UsernameSchema,
  EthAddress,
  EthAddressSchema,
} from '@akashaorg/typings/sdk';
import AWF_Auth from '../auth';
import Logging from '../logging';
import { resizeImage } from '../helpers/img';
import EventBus from '../common/event-bus';
import pino from 'pino';
import { DataProviderInput } from '@akashaorg/typings/sdk/graphql-types';
import { createFormattedValue } from '../helpers/observable';
import IpfsConnector from '../common/ipfs.connector';
import { z } from 'zod';
import { validate } from '../common/validator';
import { throwError } from '../common/error-handling';
import GqlNew from '../gql/index.new';
import { GetProfilesQueryVariables } from '@akashaorg/typings/sdk/graphql-operation-types-new';
import { ProfileInput } from '@akashaorg/typings/sdk/graphql-types-new';
// tslint:disable-next-line:no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
const urlSource = require('ipfs-utils/src/files/url-source');

@injectable()
class AWF_Profile {
  private _log: pino.Logger;
  private _gql: GqlNew;
  private _auth: AWF_Auth;
  private _globalChannel: EventBus;
  private _ipfs: IpfsConnector;
  public readonly TagSubscriptions = '@TagSubscriptions';

  constructor(
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Auth) auth: AWF_Auth,
    @inject(TYPES.EventBus) globalChannel: EventBus,
    @inject(TYPES.IPFS) ipfs: IpfsConnector,
    @inject(TYPES.GqlNew) gql: GqlNew,
  ) {
    this._log = log.create('AWF_Profile');
    this._auth = auth;
    this._globalChannel = globalChannel;
    this._ipfs = ipfs;
    this._gql = gql;
  }

  async createProfile(profileData: ProfileInput) {
    try {
      const result = await this._gql.getAPI().CreateProfile({
        i: {
          content: {
            ...profileData,
            createdAt: new Date().toISOString(),
          },
        },
      });
      if (!result.createProfile) {
        return throwError('Failed to create profile.', ['sdk', 'profile', 'createProfile']);
      }
      return createFormattedValue(result.createProfile.document);
    } catch (err) {
      throwError(`Failed to create profile: ${(err as Error).message}`, [
        'sdk',
        'profile',
        'createProfile',
      ]);
    }
  }

  async getProfiles(opt?: GetProfilesQueryVariables) {
    const options = opt || {};
    if (!opt) {
      options['last'] = 5;
    }
    try {
      const result = await this._gql.getAPI().GetProfiles(options);
      if (!result) {
        return throwError('Failed to get profiles.', ['sdk', 'profile', 'getProfiles']);
      }
      return createFormattedValue(result);
    } catch (err) {
      throwError(`Failed to get profiles: ${(err as Error).message}`, [
        'sdk',
        'profile',
        'getProfiles',
      ]);
    }
  }

  async getMyProfile() {
    try {
      const result = await this._gql.getAPI().GetMyProfile();
      if (!result.viewer) {
        return throwError('Failed to get my profile.', ['sdk', 'profile', 'getMyProfile']);
      }
      return createFormattedValue(result.viewer.profile);
    } catch (err) {
      throwError(`Failed to get my profile: ${(err as Error).message}`, [
        'sdk',
        'profile',
        'getMyProfile',
      ]);
    }
  }

  /**
   * Mutation request to add a profile provider to the profile object
   * @param opt - DataProviderInput
   */
  @validate(z.array(DataProviderInputSchema))
  async addProfileProvider(opt: DataProviderInput[]) {
    throwError('Deprecated', ['sdk', 'profile', 'addProfileProvider']);
  }

  /**
   *
   * @param opt - DataProviderInput
   */
  @validate(z.array(DataProviderInputSchema))
  async makeDefaultProvider(opt: DataProviderInput[]) {
    throwError('Deprecated', ['sdk', 'profile', 'makeDefaultProvider']);
  }

  /**
   *
   * @param userName - Username
   */
  @validate(UsernameSchema)
  async registerUserName(userName: Username) {
    throwError('Deprecated', ['sdk', 'profile', 'registerUserName']);
  }

  /**
   *
   * @param opt - object - ethAddress or pubKey
   */
  @validate(
    z.object({
      ethAddress: EthAddressSchema.optional(),
      pubKey: PubKeySchema.optional(),
    }),
  )
  async getProfile(opt: { ethAddress?: EthAddress; pubKey?: PubKey }) {
    throwError('Not implemented', ['sdk', 'profile', 'getProfile']);
  }

  /**
   *
   * @param pubKey - public key
   */
  @validate(PubKeySchema)
  async follow(pubKey: PubKey) {
    throwError('Not implemented', ['sdk', 'profile', 'follow']);
  }

  /**
   *
   * @param pubKey - public key
   */
  @validate(PubKeySchema)
  async unFollow(pubKey: PubKey) {
    throwError('Not implemented', ['sdk', 'profile', 'unFollow']);
  }

  /**
   *
   * @param opt - object - follower and following public keys
   */
  @validate(z.object({ follower: PubKeySchema, following: PubKeySchema }))
  async isFollowing(opt: { follower: PubKey; following: PubKey }) {
    throwError('Not implemented', ['sdk', 'profile', 'isFollowing']);
  }

  /**
   *
   * @param data - media file data
   */
  async saveMediaFile(data: {
    content: Buffer | ArrayBuffer | string | any;
    isUrl?: boolean;
    name?: string;
    config?: {
      quality?: number;
      maxWidth: number;
      maxHeight: number;
      autoRotate?: boolean;
      mimeType?: string;
    };
    email?: string; // temporary workaround until space delegation works
  }) {
    let file;
    let path;
    if (!data.isUrl && !data.name) {
      throw new Error('Must specify a name for the media file');
    }
    if (data.isUrl) {
      const source = urlSource(data.content);
      const arr: BlobPart[] = [];

      for await (const entry of source.content) {
        arr.push(entry);
      }
      path = data.name ? data.name : source.path;
      file = new File(arr, path, { type: 'image/*' });
    } else {
      file = data.content;
      path = data.name;
    }
    //const sess = await this._auth.getSession();
    if (!data.config) {
      data.config = {
        maxWidth: 640,
        maxHeight: 640,
        autoRotate: false,
      };
    }
    const resized = await resizeImage({
      file,
      config: data.config,
    });
    // const buckPath = `ewa/${path}/${resized.size.width}x${resized.size.height}`;
    // const bufferImage: ArrayBuffer = await resized.image.arrayBuffer();
    const CID = await this._ipfs.uploadFile(resized.image, data.email);
    const cid: string = CID.toString();
    return { CID: cid, size: resized.size, blob: resized.image };
  }

  /**
   *
   * @param name - name to search for
   */
  @validate(z.string().min(3))
  async searchProfiles(name: string) {
    throwError('Deprecated', ['sdk', 'profile', 'searchProfiles']);
  }

  /**
   *
   */
  async getTrending() {
    throwError('Deprecated', ['sdk', 'profile', 'getTrending']);
  }

  /**
   *
   * @param tagName - tag name
   */
  @validate(TagNameSchema)
  async toggleTagSubscription(tagName: TagName) {
    throwError('Not implemented', ['sdk', 'profile', 'toggleTagSubscription']);
  }

  /**
   *
   */
  async getTagSubscriptions() {
    throwError('Not implemented', ['sdk', 'profile', 'getTagSubscriptions']);
  }

  /**
   *
   * @param tagName - tag name
   */
  @validate(TagNameSchema)
  async isSubscribedToTag(tagName: TagName) {
    throwError('Not implemented', ['sdk', 'profile', 'isSubscribedToTag']);
  }

  /**
   *
   * @param keyword - keyword to search for
   */
  @validate(z.string().min(3))
  async globalSearch(keyword: string) {
    throwError('Deprecated', ['sdk', 'profile', 'globalSearch']);
  }

  /**
   *
   * @param pubKey - public key of the user
   * @param limit - number of followers to return
   * @param offset - offset to start from
   */
  @validate(z.string(), z.number(), z.number().optional())
  async getFollowers(pubKey: string, limit: number, offset?: number) {
    throwError('Not implemented', ['sdk', 'profiles', 'getFollowers']);
  }

  /**
   *
   * @param pubKey - public key of the user
   * @param limit - number of following to return
   * @param offset - offset to start from
   */
  @validate(z.string(), z.number(), z.number().optional())
  async getFollowing(pubKey: string, limit: number, offset?: number) {
    throwError('Not implemented', ['sdk', 'profiles', 'getFollowing']);
  }

  /**
   * Retrieve subscription list
   * @param pubKey - public key of the user
   */
  @validate(z.string())
  async getInterests(pubKey: string) {
    throwError('Not implemented', ['sdk', 'profiles', 'getInterests']);
  }
}

export default AWF_Profile;
