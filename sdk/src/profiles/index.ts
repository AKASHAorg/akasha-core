import { inject, injectable } from 'inversify';
import {
  TYPES,
  PROFILE_EVENTS,
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
import Gql from '../gql';
import AWF_Auth from '../auth';
import Logging from '../logging';
import { resizeImage } from '../helpers/img';
import EventBus from '../common/event-bus';
import pino from 'pino';
import { UserProfileFragmentDataFragment } from '@akashaorg/typings/sdk/graphql-operation-types';
import { DataProviderInput } from '@akashaorg/typings/sdk/graphql-types';
import { createFormattedValue } from '../helpers/observable';
import IpfsConnector from '../common/ipfs.connector';
import { z } from 'zod';
import { validate } from '../common/validator';
import { throwError } from '../common/error-handling';
// tslint:disable-next-line:no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
const urlSource = require('ipfs-utils/src/files/url-source');

@injectable()
class AWF_Profile {
  private _log: pino.Logger;
  private _gql: Gql;
  private _auth: AWF_Auth;
  private _globalChannel: EventBus;
  private _ipfs: IpfsConnector;
  public readonly TagSubscriptions = '@TagSubscriptions';

  constructor(
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Gql) gql: Gql,
    @inject(TYPES.Auth) auth: AWF_Auth,
    @inject(TYPES.EventBus) globalChannel: EventBus,
    @inject(TYPES.IPFS) ipfs: IpfsConnector,
  ) {
    this._log = log.create('AWF_Profile');
    this._gql = gql;
    this._auth = auth;
    this._globalChannel = globalChannel;
    this._ipfs = ipfs;
  }

  /**
   * Mutation request to add a profile provider to the profile object
   * @param opt - DataProviderInput
   */
  @validate(z.array(DataProviderInputSchema))
  async addProfileProvider(opt: DataProviderInput[]) {
    const auth = await this._auth.authenticateMutationData(
      opt as unknown as Record<string, unknown>[],
    );
    const newProfileProvider = await this._gql.getAPI().AddProfileProvider(
      { data: opt },
      {
        Authorization: `Bearer ${auth.token}`,
        Signature: auth.signedData.signature.toString(),
      },
    );
    // @emits PROFILE_EVENTS.ADD_PROVIDER
    this._globalChannel.next({
      data: newProfileProvider,
      event: PROFILE_EVENTS.ADD_PROVIDER,
      args: opt,
    });
    return newProfileProvider;
  }

  /**
   *
   * @param opt - DataProviderInput
   */
  @validate(z.array(DataProviderInputSchema))
  async makeDefaultProvider(opt: DataProviderInput[]) {
    const auth = await this._auth.authenticateMutationData(
      opt as unknown as Record<string, unknown>[],
    );
    const makeDefaultProvider = await this._gql.getAPI().MakeDefaultProvider(
      { data: opt },
      {
        Authorization: `Bearer ${auth.token}`,
        Signature: auth.signedData.signature.toString(),
      },
    );
    // @emits PROFILE_EVENTS.DEFAULT_PROVIDER
    this._globalChannel.next({
      data: makeDefaultProvider,
      event: PROFILE_EVENTS.DEFAULT_PROVIDER,
      args: opt,
    });
    return makeDefaultProvider;
  }

  /**
   *
   * @param userName - Username
   */
  @validate(UsernameSchema)
  async registerUserName(userName: Username) {
    z.string().min(3).parse(userName);
    const auth = await this._auth.authenticateMutationData(userName);
    const registerUserName = await this._gql.getAPI().RegisterUsername(
      { name: userName },
      {
        Authorization: `Bearer ${auth.token}`,
        Signature: auth.signedData.signature.toString(),
      },
    );
    // @emits PROFILE_EVENTS.REGISTER_USERNAME
    this._globalChannel.next({
      data: registerUserName,
      event: PROFILE_EVENTS.REGISTER_USERNAME,
      args: { userName },
    });
    return registerUserName;
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
    let resp: UserProfileFragmentDataFragment;
    if (opt.pubKey) {
      const tmp = await this._gql.getAPI().ResolveProfile({ pubKey: opt.pubKey });
      resp = tmp.resolveProfile;
    } else if (opt.ethAddress) {
      const tmp = await this._gql.getAPI().GetProfile({ ethAddress: opt.ethAddress });
      resp = tmp.getProfile;
    } else {
      throw new Error('Must provide ethAddress or pubKey value');
    }
    return createFormattedValue(resp);
  }

  /**
   *
   * @param pubKey - public key
   */
  @validate(PubKeySchema)
  async follow(pubKey: PubKey) {
    const auth = await this._auth.authenticateMutationData(pubKey);
    const followResult = await this._gql.getAPI().Follow(
      { pubKey: pubKey },
      {
        Authorization: `Bearer ${auth.token}`,
        Signature: auth.signedData.signature.toString(),
      },
    );
    // @emits PROFILE_EVENTS.FOLLOW
    this._globalChannel.next({
      data: followResult,
      event: PROFILE_EVENTS.FOLLOW,
      args: { pubKey },
    });
    return followResult;
  }

  /**
   *
   * @param pubKey - public key
   */
  @validate(PubKeySchema)
  async unFollow(pubKey: PubKey) {
    const auth = await this._auth.authenticateMutationData(pubKey);
    const unFollowResult = await this._gql.getAPI().UnFollow(
      { pubKey: pubKey },
      {
        Authorization: `Bearer ${auth.token}`,
        Signature: auth.signedData.signature.toString(),
      },
    );
    // @emits PROFILE_EVENTS.UNFOLLOW
    this._globalChannel.next({
      data: unFollowResult,
      event: PROFILE_EVENTS.UNFOLLOW,
      args: { pubKey },
    });
    return unFollowResult;
  }

  /**
   *
   * @param opt - object - follower and following public keys
   */
  @validate(z.object({ follower: PubKeySchema, following: PubKeySchema }))
  async isFollowing(opt: { follower: PubKey; following: PubKey }) {
    return this._gql.getAPI().IsFollowing({ follower: opt.follower, following: opt.following });
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
    return this._gql.getAPI().SearchProfiles({ name: name });
  }

  /**
   *
   */
  async getTrending() {
    return this._gql.getAPI().SearchProfiles({ name: '' });
  }

  /**
   *
   * @param tagName - tag name
   */
  @validate(TagNameSchema)
  async toggleTagSubscription(tagName: TagName) {
    const auth = await this._auth.authenticateMutationData({ sub: tagName });
    const toggledTag = await this._gql.getAPI().ToggleInterestSub(
      { sub: tagName },
      {
        Authorization: `Bearer ${auth.token}`,
        Signature: auth.signedData.signature.toString(),
      },
    );
    // @emits PROFILE_EVENTS.TAG_SUBSCRIPTION
    this._globalChannel.next({
      data: { status: toggledTag },
      event: PROFILE_EVENTS.TAG_SUBSCRIPTION,
      args: { tagName },
    });
    return toggledTag;
  }

  /**
   *
   */
  async getTagSubscriptions() {
    try {
      const currUser = await this._auth.getCurrentUser();
      if (currUser && currUser.id) {
        const result = await this.getInterests(currUser.id);
        return createFormattedValue(result?.data);
      }
      throwError('User not authenticated', ['sdk', 'profile', 'getTagSubscriptions']);
    } catch (e) {
      throwError(`Error getting tag subscriptions: ${(e as Error).message}`, [
        'sdk',
        'profile',
        'getTagSubscriptions',
      ]);
    }
  }

  /**
   *
   * @param tagName - tag name
   */
  @validate(TagNameSchema)
  async isSubscribedToTag(tagName: TagName) {
    try {
      const res = await this.getTagSubscriptions();
      if (!res || !res?.data?.getInterests?.length) {
        return false;
      }
      const el = res.data.getInterests.indexOf(tagName);
      return el !== -1;
    } catch (e) {
      throwError(`Error getting tag subscriptions: ${(e as Error).message}`, [
        'sdk',
        'profile',
        'isSubscribedToTag',
        tagName,
      ]);
    }
  }

  /**
   *
   * @param keyword - keyword to search for
   */
  @validate(z.string().min(3))
  async globalSearch(keyword: string) {
    try {
      return this._gql.getAPI().GlobalSearch({ keyword: keyword });
    } catch (e) {
      throwError(`Error getting global search: ${(e as Error).message}`, [
        'sdk',
        'profile',
        'globalSearch',
        keyword,
      ]);
    }
  }

  /**
   *
   * @param pubKey - public key of the user
   * @param limit - number of followers to return
   * @param offset - offset to start from
   */
  @validate(z.string(), z.number(), z.number().optional())
  async getFollowers(pubKey: string, limit: number, offset?: number) {
    try {
      const resp = await this._gql.getAPI().GetFollowers({ pubKey, limit, offset });
      return createFormattedValue(resp);
    } catch (e) {
      throwError(`Cannot get followers: ${(e as Error).message}`, [
        'sdk',
        'profiles',
        'getFollowers',
        pubKey,
      ]);
    }
  }

  /**
   *
   * @param pubKey - public key of the user
   * @param limit - number of following to return
   * @param offset - offset to start from
   */
  @validate(z.string(), z.number(), z.number().optional())
  async getFollowing(pubKey: string, limit: number, offset?: number) {
    try {
      const resp = await this._gql.getAPI().GetFollowing({ pubKey, limit, offset });
      return createFormattedValue(resp);
    } catch (e) {
      throwError(`Cannot get following: ${(e as Error).message}`, [
        'sdk',
        'profiles',
        'getFollowing',
        pubKey,
      ]);
    }
  }

  /**
   * Retrieve subscription list
   * @param pubKey - public key of the user
   */
  @validate(z.string())
  async getInterests(pubKey: string) {
    try {
      const resp = await this._gql.getAPI().GetInterests({ pubKey });
      return createFormattedValue(resp);
    } catch (e) {
      throwError(`Cannot get interests: ${(e as Error).message}`, [
        'sdk',
        'profiles',
        'getInterests',
        pubKey,
      ]);
    }
  }
}

export default AWF_Profile;
