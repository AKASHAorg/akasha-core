import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { gqlStash, runGQL } from '@akashaproject/sdk-runtime/lib/gql.network.client';
import {
  BUCKET_THREAD_NAME,
  LinkedProperty,
  PROFILE_MEDIA_FILES,
  PROFILE_STORE,
} from './constants';
import authServices, { AUTH_SERVICE } from '@akashaproject/sdk-auth/lib/constants';
import commonServices, { IMAGE_UTILS_SERVICE } from '@akashaproject/sdk-common/lib/constants';
import dbServices, { DB_SETTINGS_ATTACHMENT } from '@akashaproject/sdk-db/lib/constants';
// tslint:disable-next-line:no-var-requires
const urlSource = require('ipfs-utils/src/files/url-source');

const service: AkashaService = (invoke, log) => {
  const addProfileProvider = async (opt: LinkedProperty[]) => {
    const token = await invoke(authServices[AUTH_SERVICE]).getToken();
    const { signData } = await invoke(authServices[AUTH_SERVICE]);
    const signedData = await signData(opt, true);
    const mutation = `
  mutation AddProfileProvider($data: [DataProviderInput]) {
       addProfileProvider(data: $data)
  }`;
    const result = await runGQL({
      query: mutation,
      variables: { data: opt },
      operationName: 'AddProfileProvider',
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
          Signature: signedData.signature,
        },
      },
    });
    if (result.errors) {
      log.error(result.errors);
      throw new Error('Saving this profile provider has failed.');
    }
    return result.data;
  };

  const makeDefaultProvider = async (opt: LinkedProperty[]) => {
    const token = await invoke(authServices[AUTH_SERVICE]).getToken();
    const { signData } = await invoke(authServices[AUTH_SERVICE]);
    const signedData = await signData(opt, true);
    const mutation = `
  mutation MakeDefaultProvider($data: [DataProviderInput]) {
       makeDefaultProvider(data: $data)
  }`;
    const result = await runGQL({
      query: mutation,
      variables: { data: opt },
      operationName: 'MakeDefaultProvider',
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
          Signature: signedData.signature,
        },
      },
    });
    if (result.errors) {
      log.error(result.errors);
      throw new Error('Saving this default profile provider has failed.');
    }
    return result.data;
  };

  const registerUserName = async (opt: { userName: string }) => {
    if (opt.userName.length < 3) {
      throw new Error('Subdomain must have at least 3 characters');
    }
    const token = await invoke(authServices[AUTH_SERVICE]).getToken();
    const { signData } = await invoke(authServices[AUTH_SERVICE]);
    const signedData = await signData(opt.userName, true);
    const mutation = `
  mutation RegisterUsername($name: String!) {
       registerUserName(name: $name)
  }`;
    const result = await runGQL({
      query: mutation,
      variables: { name: opt.userName },
      operationName: 'RegisterUsername',
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
          Signature: signedData.signature,
        },
      },
    });
    if (result.errors) {
      log.error(result.errors);
      throw new Error('Saving this username has failed.');
    }
    return result.data;
  };

  const getProfile = async (opt: { fields?: string[]; ethAddress?: string; pubKey?: string }) => {
    const defaultFields = [
      'pubKey',
      'description',
      'creationDate',
      'avatar',
      'userName',
      'name',
      'coverImage',
      'ethAddress',
      'totalPosts',
      'totalFollowers',
      'totalFollowing',
    ];
    const fields = opt.fields ? opt.fields : defaultFields;
    let query;
    let variables;
    let operationName;
    if (opt.pubKey) {
      query = `
  query ResolveProfile($pubKey: String!) {
       resolveProfile(pubKey: $pubKey) {
         ${fields.join(' ')}
         providers{
          provider
          property
          value
         }
         default{
          provider
          property
          value
         }
       }
      }`;
      variables = { pubKey: opt.pubKey };
      operationName = 'ResolveProfile';
    } else if (opt.ethAddress) {
      query = `
  query GetProfile($ethAddress: String!) {
       getProfile(ethAddress: $ethAddress) {
         ${fields.join(' ')}
         providers{
          provider
          property
          value
         }
         default{
          provider
          property
          value
         }
       }
      }`;
      variables = { ethAddress: opt.ethAddress };
      operationName = 'GetProfile';
    } else {
      return Promise.reject('Must provide ethAddress of pubKey value');
    }
    const result = await runGQL(
      {
        query: query,
        variables: variables,
        operationName: operationName,
      },
      true,
    );
    return result.data;
  };

  const follow = async (opt: { ethAddress: string }) => {
    const token = await invoke(authServices[AUTH_SERVICE]).getToken();
    const { signData } = await invoke(authServices[AUTH_SERVICE]);
    const signedData = await signData(opt.ethAddress, true);
    const mutation = `
  mutation Follow($ethAddress: String!) {
       follow(ethAddress: $ethAddress)
  }`;
    const result = await runGQL({
      query: mutation,
      variables: { ethAddress: opt.ethAddress },
      operationName: 'Follow',
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
          Signature: signedData.signature,
        },
      },
    });
    gqlStash.clear();
    return result.data;
  };

  const unFollow = async (opt: { ethAddress: string }) => {
    const token = await invoke(authServices[AUTH_SERVICE]).getToken();
    const { signData } = await invoke(authServices[AUTH_SERVICE]);
    const signedData = await signData(opt.ethAddress, true);
    const mutation = `
  mutation UnFollow($ethAddress: String!) {
       unFollow(ethAddress: $ethAddress)
  }`;
    const result = await runGQL({
      query: mutation,
      variables: { ethAddress: opt.ethAddress },
      operationName: 'UnFollow',
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
          Signature: signedData.signature,
        },
      },
    });
    gqlStash.clear();
    return result.data;
  };

  const isFollowing = async (opt: { follower: string; following: string }) => {
    const query = `
  query IsFollowing($follower: String!, $following: String!) {
       isFollowing(follower: $follower, following: $following)
      }`;
    const result = await runGQL({
      query: query,
      variables: { follower: opt.follower, following: opt.following },
      operationName: 'IsFollowing',
    });

    return result.data;
  };
  const saveMediaFile = async (data: {
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
  }) => {
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
    const { buck } = await invoke(authServices[AUTH_SERVICE]).getSession();
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
    const resized = await invoke(commonServices[IMAGE_UTILS_SERVICE]).resizeImage({
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
    const token = await invoke(authServices[AUTH_SERVICE]).getToken();
    const mutation = `
  mutation SaveMetaData($data: DataProviderInput) {
       saveMetaData(data: $data)
  }`;
    const dataFinal: LinkedProperty = {
      property: buckPath,
      provider: PROFILE_MEDIA_FILES,
      value: upload.path.cid.toString(),
    };
    const { signData } = await invoke(authServices[AUTH_SERVICE]);
    const signedData = await signData(dataFinal, true);
    await runGQL({
      query: mutation,
      variables: { data: dataFinal },
      operationName: 'SaveMetaData',
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
          Signature: signedData.signature,
        },
      },
    });

    return { CID: cid, size: resized.size };
  };
  const searchProfiles = async (opt: { name: string }) => {
    const query = `
    query SearchProfiles($name: String!) {
         searchProfiles(name: $name) {
             name
             userName
             pubKey
             avatar
             description
             coverImage
             ethAddress
             creationDate
             totalPosts
             totalFollowers
             totalFollowing
         }
       }`;
    const result = await runGQL(
      {
        query: query,
        variables: { name: opt.name },
        operationName: 'SearchProfiles',
      },
      true,
    );
    return result.data;
  };

  const getTrending = async () => {
    return searchProfiles({ name: '' });
  };
  const TagSubscriptions = '@TagSubscriptions';
  const toggleTagSubscription = async (tagName: string): Promise<boolean> => {
    const rec = await invoke(dbServices[DB_SETTINGS_ATTACHMENT]).get({
      moduleName: TagSubscriptions,
    });
    if (!rec || !rec?.services?.length) {
      await invoke(dbServices[DB_SETTINGS_ATTACHMENT]).put({
        moduleName: TagSubscriptions,
        services: [[tagName]],
      });
      return true;
    }
    const index = rec.services[0].indexOf(tagName);
    index !== -1 ? rec.services[0].splice(index, 1) : rec.services[0].push(tagName);
    await invoke(dbServices[DB_SETTINGS_ATTACHMENT]).put(rec);
    return index === -1;
  };
  const getTagSubscriptions = async () => {
    const rec = await invoke(dbServices[DB_SETTINGS_ATTACHMENT]).get({
      moduleName: TagSubscriptions,
    });
    return rec?.services[0];
  };

  const isSubscribedToTag = async (tagName: string) => {
    const rec = await invoke(dbServices[DB_SETTINGS_ATTACHMENT]).get({
      moduleName: TagSubscriptions,
    });
    if (!rec) {
      return false;
    }
    return rec.services[0].indexOf(tagName) !== -1;
  };

  const globalSearch = async (keyword: string) => {
    const query = `
    query GlobalSearch($keyword: String!) {
      globalSearch(keyword: $keyword){
        posts{id}
        profiles{id}
        tags{id name totalPosts}
        comments{id}
      }
    }`;
    const result = await runGQL(
      {
        query: query,
        variables: { keyword: keyword },
        operationName: 'GlobalSearch',
      },
      true,
    );
    return result.data;
  };
  return {
    addProfileProvider,
    saveMediaFile,
    makeDefaultProvider,
    getProfile,
    registerUserName,
    follow,
    unFollow,
    isFollowing,
    searchProfiles,
    getTrending,
    toggleTagSubscription,
    getTagSubscriptions,
    isSubscribedToTag,
    globalSearch,
  };
};

export default { service, name: PROFILE_STORE };
