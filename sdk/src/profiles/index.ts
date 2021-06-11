import { BUCKET_THREAD_NAME, PROFILE_MEDIA_FILES } from './constants';
import { inject, injectable } from 'inversify';
import Web3Connector from '../common/web3.connector';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import Gql from '../gql';
import AWF_Auth from '../auth';
import {
  AddProfileProvider,
  MakeDefaultProvider,
  RegisterUsername,
  ResolveProfile,
  GetProfile,
  Follow,
  UnFollow,
  IsFollowing,
  SaveMetaData,
  SearchProfiles,
  GlobalSearch,
} from './profile.graphql';
import { TYPES } from '@akashaproject/sdk-typings';
import Logging from '../logging';
import { DataProviderInput } from '@akashaproject/sdk-typings/lib/interfaces/common';
import { concatAll, map } from 'rxjs/operators';
import { lastValueFrom, throwError } from 'rxjs';
import { resizeImage } from '../helpers/img';
import Settings from '../settings';
// tslint:disable-next-line:no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
const urlSource = require('ipfs-utils/src/files/url-source');

@injectable()
export default class AWF_Profile {
  private readonly _web3: Web3Connector;
  private _log: ILogger;
  private _gql: Gql;
  private _auth: AWF_Auth;
  private _settings: Settings;
  public readonly TagSubscriptions = '@TagSubscriptions';
  public readonly graphQLDocs = {
    AddProfileProvider,
    MakeDefaultProvider,
    RegisterUsername,
    ResolveProfile,
    GetProfile,
    Follow,
    UnFollow,
    IsFollowing,
    SaveMetaData,
    SearchProfiles,
    GlobalSearch,
  };

  constructor(
    @inject(TYPES.Log) log: Logging,
    @inject(TYPES.Gql) gql: Gql,
    @inject(TYPES.Auth) auth: AWF_Auth,
    @inject(TYPES.Settings) settings: Settings,
  ) {
    this._log = log.create('AWF_Profile');
    this._gql = gql;
    this._auth = auth;
    this._settings = settings;
  }

  /**
   *
   * @param opt
   */
  public addProfileProvider(opt: DataProviderInput[]) {
    return this._auth.authenticateMutationData((opt as unknown) as Record<string, unknown>[]).pipe(
      map(res => {
        return this._gql.run({
          query: AddProfileProvider,
          variables: { data: opt },
          operationName: 'AddProfileProvider',
          context: {
            headers: {
              Authorization: `Bearer ${res.token}`,
              Signature: res.signedData.signature,
            },
          },
        });
      }),
      concatAll(),
    );
  }

  /**
   *
   * @param opt
   */
  public makeDefaultProvider(opt: DataProviderInput[]) {
    return this._auth.authenticateMutationData((opt as unknown) as Record<string, unknown>[]).pipe(
      map(res => {
        return this._gql.run({
          query: MakeDefaultProvider,
          variables: { data: opt },
          operationName: 'MakeDefaultProvider',
          context: {
            headers: {
              Authorization: `Bearer ${res.token}`,
              Signature: res.signedData.signature,
            },
          },
        });
      }),
      concatAll(),
    );
  }

  /**
   *
   * @param userName
   */
  public registerUserName(userName: string) {
    if (userName.length < 3) {
      return throwError(() => {
        return new Error('Subdomain must have at least 3 characters');
      });
    }

    return this._auth.authenticateMutationData(userName).pipe(
      map(res => {
        return this._gql.run({
          query: RegisterUsername,
          variables: { name: userName },
          operationName: 'RegisterUsername',
          context: {
            headers: {
              Authorization: `Bearer ${res.token}`,
              Signature: res.signedData.signature,
            },
          },
        });
      }),
      concatAll(),
    );
  }

  /**
   *
   * @param opt
   */
  public getProfile(opt: { fields?: string[]; ethAddress?: string; pubKey?: string }) {
    let query, variables, operationName;
    if (opt.pubKey) {
      query = ResolveProfile;
      variables = { pubKey: opt.pubKey };
      operationName = 'ResolveProfile';
    } else if (opt.ethAddress) {
      query = GetProfile;
      variables = { ethAddress: opt.ethAddress };
      operationName = 'GetProfile';
    } else {
      return throwError(() => {
        return new Error('Must provide ethAddress of pubKey value');
      });
    }
    return this._gql.run(
      {
        query: query,
        variables: variables,
        operationName: operationName,
      },
      true,
    );
  }

  /**
   *
   * @param ethAddress
   */
  public follow(ethAddress: string) {
    return this._auth.authenticateMutationData(ethAddress).pipe(
      map(res => {
        this._gql.clearCache();
        return this._gql.run({
          query: Follow,
          variables: { ethAddress: ethAddress },
          operationName: 'Follow',
          context: {
            headers: {
              Authorization: `Bearer ${res.token}`,
              Signature: res.signedData.signature,
            },
          },
        });
      }),
      concatAll(),
    );
  }

  /**
   *
   * @param ethAddress
   */
  public unFollow(ethAddress: string) {
    return this._auth.authenticateMutationData(ethAddress).pipe(
      map(res => {
        this._gql.clearCache();
        return this._gql.run({
          query: UnFollow,
          variables: { ethAddress: ethAddress },
          operationName: 'UnFollow',
          context: {
            headers: {
              Authorization: `Bearer ${res.token}`,
              Signature: res.signedData.signature,
            },
          },
        });
      }),
      concatAll(),
    );
  }

  /**
   *
   * @param opt
   */
  public isFollowing(opt: { follower: string; following: string }) {
    return this._gql.run(
      {
        query: IsFollowing,
        variables: { follower: opt.follower, following: opt.following },
        operationName: 'IsFollowing',
      },
      true,
    );
  }

  /**
   *
   * @param data
   */
  public async saveMediaFile(data: {
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
      for await (const src of urlSource(data.content)) {
        file = src.content;
        path = data.name ? data.name : src.path;
      }
    } else {
      file = data.content;
      path = data.name;
    }
    const { buck } = await this._auth.getSession();
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
      };
    }
    const resized = await resizeImage({
      file,
      config: data.config,
    });
    const buckPath = `ewa/${path}/${resized.size.width}x${resized.size.height}`;
    const bufferImage: ArrayBuffer = await resized.image.arrayBuffer();
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

    await lastValueFrom(
      this._auth.authenticateMutationData((dataFinal as unknown) as Record<string, unknown>[]).pipe(
        map(res => {
          this._gql.clearCache();
          return this._gql.run({
            query: SaveMetaData,
            variables: { data: dataFinal },
            operationName: 'SaveMetaData',
            context: {
              headers: {
                Authorization: `Bearer ${res.token}`,
                Signature: res.signedData.signature,
              },
            },
          });
        }),
        concatAll(),
      ),
    );

    return { CID: cid, size: resized.size };
  }

  /**
   *
   * @param name
   */
  public searchProfiles(name: string) {
    return this._gql.run(
      {
        query: SearchProfiles,
        variables: { name: name },
        operationName: 'SearchProfiles',
      },
      true,
    );
  }

  /**
   *
   */
  public getTrending() {
    return this.searchProfiles('');
  }

  /**
   *
   * @param tagName
   */
  public toggleTagSubscription(tagName: string) {
    this._settings.get(this.TagSubscriptions).pipe(
      map((rec: any) => {
        if (!rec.data || !rec.data?._id) {
          return this._settings.set(this.TagSubscriptions, [[tagName, true]]);
        }
        const el = rec.data.options.find(r => r[0] === tagName);
        if (!el) {
          rec.data.options.push([tagName, true]);
        } else {
          el[1] = !el[1];
        }
        return this._settings.set(this.TagSubscriptions, rec.data.options);
      }),
      concatAll(),
    );
  }

  /**
   *
   */
  public getTagSubscriptions() {
    return this._settings.get(this.TagSubscriptions).pipe(
      map((rec: any) => {
        return rec.data.options;
      }),
    );
  }

  /**
   *
   * @param tagName
   */
  public isSubscribedToTag(tagName: string) {
    return this.getTagSubscriptions().pipe(
      map(res => {
        if (!res || !res.length) {
          return false;
        }
        const el = res.find(r => r[0] === tagName);
        if (!el) {
          return false;
        }
        return el[1];
      }),
    );
  }

  /**
   *
   * @param keyword
   */
  public globalSearch(keyword: string) {
    return this._gql.run(
      {
        query: GlobalSearch,
        variables: { keyword: keyword },
        operationName: 'GlobalSearch',
      },
      true,
    );
  }
}
