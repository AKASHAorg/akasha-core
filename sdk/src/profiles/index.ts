import { BUCKET_THREAD_NAME, PROFILE_MEDIA_FILES } from './constants';
import { inject, injectable } from 'inversify';
import Web3Connector from '../common/web3.connector';
import { TYPES, DataProviderInput, PROFILE_EVENTS } from '@akashaorg/typings/sdk';
import Gql from '../gql';
import AWF_Auth from '../auth';
import Logging from '../logging';
import { lastValueFrom, throwError } from 'rxjs';
import { resizeImage } from '../helpers/img';
import Settings from '../settings';
import EventBus from '../common/event-bus';
import pino from 'pino';
import { UserProfile, UserProfileFragmentDataFragment } from '../gql/api';
// tslint:disable-next-line:no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
const urlSource = require('ipfs-utils/src/files/url-source');

@injectable()
class AWF_Profile {
  private readonly _web3: Web3Connector;
  private _log: pino.Logger;
  private _gql: Gql;
  private _auth: AWF_Auth;
  private _settings: Settings;
  private _globalChannel: EventBus;
  public readonly TagSubscriptions = '@TagSubscriptions';

  constructor(
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Gql) gql: Gql,
    @inject(TYPES.Auth) auth: AWF_Auth,
    @inject(TYPES.Settings) settings: Settings,
    @inject(TYPES.EventBus) globalChannel: EventBus,
  ) {
    this._log = log.create('AWF_Profile');
    this._gql = gql;
    this._auth = auth;
    this._settings = settings;
    this._globalChannel = globalChannel;
  }

  /**
   * Mutation request to add a profile provider to the profile object
   * @param opt
   */
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
   * @param opt
   */
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
   * @param userName
   */
  async registerUserName(userName: string) {
    if (userName.length < 3) {
      return throwError(() => {
        return new Error('Subdomain must have at least 3 characters');
      });
    }
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
   * @param opt
   */
  async getProfile(opt: { ethAddress?: string; pubKey?: string }) {
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
    return resp;
  }

  /**
   *
   * @param pubKey
   */
  async follow(pubKey: string) {
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
   * @param pubKey
   */
  async unFollow(pubKey: string) {
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
   * @param opt
   */
  async isFollowing(opt: { follower: string; following: string }) {
    return this._gql.getAPI().IsFollowing({ follower: opt.follower, following: opt.following });
  }

  /**
   *
   * @param data
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
  }) {
    let file;
    let path;
    if (!data.isUrl && !data.name) {
      throw new Error('Must specify a name for the media file');
    }
    if (data.isUrl) {
      const source = urlSource(data.content);
      const arr = [];

      for await (const entry of source.content) {
        arr.push(entry);
      }
      path = data.name ? data.name : source.path;
      file = new File(arr, path, { type: 'image/*' });
    } else {
      file = data.content;
      path = data.name;
    }
    const sess = await lastValueFrom(this._auth.getSession());
    const buck = sess.data.buck;
    const { root } = await buck.getOrCreate(PROFILE_MEDIA_FILES, {
      threadName: BUCKET_THREAD_NAME,
    });
    if (!root) {
      throw new Error('Failed to open bucket');
    }
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
    const buckPath = `ewa/${path}/${resized.size.width}x${resized.size.height}`;
    const bufferImage: ArrayBuffer = await resized.image.arrayBuffer();
    this._log.info(buckPath);
    try {
      const currentPath = await buck.listPath(root.key, buckPath);
      if (currentPath) {
        for await (const remaining of buck.pullPath(root.key, buckPath)) {
          this._log.info('chunk ' + remaining.length.toString());
        }
      }
    } catch (e) {
      this._log.info(e?.message);
    }

    const upload = await buck.pushPath(root.key, buckPath, {
      path: buckPath,
      content: new Uint8Array(bufferImage),
    });
    const cid = upload.path.cid.toString();
    const dataFinal: DataProviderInput = {
      property: buckPath,
      provider: PROFILE_MEDIA_FILES,
      value: cid,
    };
    const auth = await this._auth.authenticateMutationData(
      dataFinal as unknown as Record<string, unknown>[],
    );
    await this._gql.getAPI().SaveMetaData(
      { data: dataFinal },
      {
        Authorization: `Bearer ${auth.token}`,
        Signature: auth.signedData.signature.toString(),
      },
    );

    return { CID: cid, size: resized.size, blob: resized.image };
  }

  /**
   *
   * @param name
   */
  async searchProfiles(name: string) {
    return this._gql.getAPI().SearchProfiles({ name: name });
  }

  /**
   *
   */
  async getTrending() {
    return this.searchProfiles('');
  }

  /**
   *
   * @param tagName
   */
  async toggleTagSubscription(tagName: string) {
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
    const currUser = await this._auth.getCurrentUser();
    return this.getInterests(currUser.pubKey);
  }

  /**
   *
   * @param tagName
   */
  async isSubscribedToTag(tagName: string) {
    const res = await this.getTagSubscriptions();
    if (!res || !res?.getInterests?.length) {
      return false;
    }
    const el = res.getInterests.indexOf(tagName);
    return el !== -1;
  }

  /**
   *
   * @param keyword
   */
  async globalSearch(keyword: string) {
    return this._gql.getAPI().GlobalSearch({ keyword: keyword });
  }

  /**
   *
   * @param pubKey
   * @param limit
   * @param offset
   */
  async getFollowers(pubKey: string, limit: number, offset?: number) {
    return this._gql.getAPI().GetFollowers({ pubKey, limit, offset });
  }

  /**
   *
   * @param pubKey
   * @param limit
   * @param offset
   */
  async getFollowing(pubKey: string, limit: number, offset?: number) {
    return this._gql.getAPI().GetFollowing({ pubKey, limit, offset });
  }

  /**
   * Retrieve subscription list
   * @param pubKey
   */
  async getInterests(pubKey: string) {
    return this._gql.getAPI().GetInterests({ pubKey });
  }
}

export default AWF_Profile;
