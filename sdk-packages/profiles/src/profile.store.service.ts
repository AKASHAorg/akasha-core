import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { runGQL } from '@akashaproject/sdk-runtime/lib/gql.network.client';
import { LinkedProperty, PROFILE_MEDIA_FILES, PROFILE_STORE } from './constants';
import authServices, { AUTH_SERVICE } from '@akashaproject/sdk-auth/lib/constants';
import commonServices, { IMAGE_UTILS_SERVICE } from '@akashaproject/sdk-common/lib/constants';
// tslint:disable-next-line:no-var-requires
const urlSource = require('ipfs-utils/src/files/url-source');

const service: AkashaService = (invoke, log) => {
  const addProfileProvider = async (opt: LinkedProperty[]) => {
    const token = await invoke(authServices[AUTH_SERVICE]).getToken();
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
        },
      },
    });
    return result.data;
  };

  const makeDefaultProvider = async (opt: LinkedProperty[]) => {
    const token = await invoke(authServices[AUTH_SERVICE]).getToken();
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
        },
      },
    });
    return result.data;
  };

  const registerUserName = async (opt: { userName: string }) => {
    const token = await invoke(authServices[AUTH_SERVICE]).getToken();
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
        },
      },
    });
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
    const result = await runGQL({
      query: query,
      variables: variables,
      operationName: operationName,
    });
    return result.data;
  };

  const follow = async (opt: { ethAddress: string }) => {
    const token = await invoke(authServices[AUTH_SERVICE]).getToken();
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
        },
      },
    });
    return result.data;
  };

  const unFollow = async (opt: { ethAddress: string }) => {
    const token = await invoke(authServices[AUTH_SERVICE]).getToken();
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
        },
      },
    });
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
    const { root } = await buck.getOrCreate(PROFILE_MEDIA_FILES);
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
    const upload = await buck.pushPath(root.key, buckPath, {
      path: buckPath,
      content: resized.image,
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
    await runGQL({
      query: mutation,
      variables: { data: dataFinal },
      operationName: 'SaveMetaData',
      context: {
        headers: {
          Authorization: `Bearer ${token}`,
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
    const result = await runGQL({
      query: query,
      variables: { name: opt.name },
      operationName: 'SearchProfiles',
    });
    return result.data;
  };

  const getTrending = async () => {
    return searchProfiles({ name: '' });
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
  };
};

export default { service, name: PROFILE_STORE };
