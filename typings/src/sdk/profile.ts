import { DataProviderInput } from './common';

interface AWF_IProfile {
  graphQLDocs: {
    RegisterUsername: any;
    SearchProfiles: any;
    Follow: any;
    MakeDefaultProvider: any;
    GlobalSearch: any;
    UnFollow: any;
    AddProfileProvider: any;
    ResolveProfile: any;
    IsFollowing: any;
    GetProfile: any;
    SaveMetaData: any;
  };

  /**
   *
   * @param opt
   */
  addProfileProvider(opt: DataProviderInput[]): unknown;

  /**
   *
   * @param opt
   */
  makeDefaultProvider(opt: DataProviderInput[]): unknown;

  /**
   *
   * @param userName
   */
  registerUserName(userName: string): unknown;

  /**
   *
   * @param opt
   */
  getProfile(opt: { fields?: string[]; ethAddress?: string; pubKey?: string }): unknown;

  /**
   *
   * @param ethAddress
   */
  follow(ethAddress: string): unknown;

  /**
   *
   * @param ethAddress
   */
  unFollow(ethAddress: string): unknown;

  /**
   *
   * @param opt
   */
  isFollowing(opt: { follower: string; following: string }): unknown;

  /**
   *
   * @param data
   */
  saveMediaFile(data: {
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
  }): Promise<{
    size: { width: number; height: number; naturalWidth: number; naturalHeight: number };
    CID: string;
  }>;

  /**
   *
   * @param name
   */
  searchProfiles(name: string): unknown;

  /**
   *
   */
  getTrending(): unknown;

  /**
   *
   * @param tagName
   */
  toggleTagSubscription(tagName: string): void;

  /**
   *
   */
  getTagSubscriptions(): unknown;

  /**
   *
   * @param tagName
   */
  isSubscribedToTag(tagName: string): unknown;

  /**
   *
   * @param keyword
   */
  globalSearch(keyword: string): unknown;

  /**
   *
   * @param pubKey
   * @param limit
   * @param offset
   */
  getFollowers(pubKey: string, limit: number, offset?: number): unknown;

  /**
   *
   * @param pubKey
   * @param limit
   * @param offset
   */
  getFollowing(pubKey: string, limit: number, offset?: number): unknown;

  /**
   *
   * @param pubKey
   */
  getInterests(pubKey: string): unknown;
}

export default AWF_IProfile;
