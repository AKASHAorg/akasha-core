import { IAwfSDK } from '@akashaproject/sdk-typings';
import { noop, of, ReplaySubject } from 'rxjs';

interface SdkOverrides {
  auth?: Partial<IAwfSDK['api']['auth']>;
  comments?: Partial<IAwfSDK['api']['comments']>;
  globalChannel?: ReplaySubject<any>;
  ens?: Partial<IAwfSDK['api']['ens']>;
  profile?: Partial<IAwfSDK['api']['profile']>;
  entries?: Partial<IAwfSDK['api']['entries']>;
  icRegistry?: Partial<IAwfSDK['api']['icRegistry']>;
  tags?: Partial<IAwfSDK['api']['tags']>;
  appSettings?: Partial<IAwfSDK['services']['appSettings']>;
}

const mockSDK = (overrides?: SdkOverrides) => {
  return {
    api: {
      auth: {
        enableSync: noop,
        checkIfSignedUp: () => of(),
        signIn: () => of({ data: { pubKey: '', ethAddress: '', isNewUser: false } }),
        getSession: () => of({ data: { buck: {}, client: {}, user: {} } }) as any,
        getToken: () => of({ data: 'testToken' }),
        getCurrentUser: () => of({ data: { ethAddress: '0x0', pubKey: 'testPubKey' } }),
        signData: () =>
          of({
            data: { serializedData: 'testData', signature: 'testSig', pubKey: 'testPubKey' },
          }),
        signOut: () => of({ data: true }),
        verifySignature: () => of({ data: true }),
        authenticateMutationData: () => of({ signedData: '', token: '' }),
        decryptMessage: () => of(),
        getMessages: () => of(),
        hasNewNotifications: () => of(),
        markMessageAsRead: () => of(),
        deleteMessage: () => of(),
        validateInvite: () => of(),
        connectAddress: () => of(),
        ...(overrides?.auth || {}),
      },
      comments: {
        getComment: () => of(),
        getComments: () => of(),
        addComment: () => of(),
        editComment: () => of,
        removeComment: () => of(),
        ...(overrides?.comments || {}),
      },
      ens: {
        registerName: () => of(),
        claimName: () => of(),
        userIsOwnerOf: () => Promise.resolve(),
        isAvailable: () => Promise.resolve(),
        resolveAddress: () => Promise.resolve(),
        resolveName: () => Promise.resolve(),
        ...(overrides?.ens || {}),
      },
      entries: {
        getEntry: () => of(),
        getEntries: () => of(),
        postEntry: () => of(),
        editEntry: () => of(),
        removeEntry: () => of(),
        entriesByAuthor: () => of(),
        entriesByTag: () => of(),
        getLinkPreview: () => of(),
        getFeedEntries: () => of(),
        ...(overrides?.entries || {}),
      },
      globalChannel: overrides?.globalChannel ?? new ReplaySubject(),
      icRegistry: {
        getIntegrationInfo: () => Promise.resolve(),
        getIntegrationReleaseInfo: () => Promise.resolve(),
        getIntegrationsCount: () => Promise.resolve(),
        getAllIntegrationsIds: () => Promise.resolve(),
        getAllIntegrationReleaseIds: () => Promise.resolve(),
        getIntegrationId: () => Promise.resolve(),
        getIntegrationReleaseId: () => Promise.resolve(),
        getLatestReleaseInfo: () => of(),
        getIntegrationsInfo: () => of(),
        ...(overrides?.icRegistry || {}),
      },
      profile: {
        graphQLDocs: {} as any,
        addProfileProvider: noop,
        makeDefaultProvider: noop,
        registerUserName: () => of(),
        getProfile: () => of(),
        follow: () => of(),
        unFollow: () => of(),
        isFollowing: () => of(),
        saveMediaFile: () =>
          Promise.resolve({
            size: { width: 100, height: 100, naturalWidth: 100, naturalHeight: 100 },
            CID: 'testCID',
          }),
        searchProfiles: () => of(),
        getTrending: () => of(),
        toggleTagSubscription: () => of(),
        getTagSubscriptions: () => of(),
        isSubscribedToTag: () => of(),
        globalSearch: () => of(),
        getFollowers: () => of(),
        getFollowing: () => of(),
        getInterests: () => of(),
        ...(overrides?.profile || {}),
      },
      tags: {
        getTag: () => of(),
        getTags: () => of(),
        searchTags: () => of(),
        createTag: () => of(),
        getTrending: () => of(),
        ...(overrides?.tags || {}),
      },
    },
    services: {
      appSettings: {
        get: () => Promise.resolve(),
        getAll: () => Promise.resolve(),
        install: () => Promise.resolve(true),
        uninstall: () => Promise.resolve(),
        ...(overrides?.appSettings || {}),
      },
      common: {
        web3: {} as any,
        ipfs: {} as any,
      },
      db: {
        open: () => of(),
        getDb: () => of(),
        getCollection: () => of(),
      },
      gql: { run: () => of() },
      log: {
        create: () => ({
          info: console.info,
          error: console.error,
          warn: console.warn,
          debug: console.debug,
          setLevel: noop,
        }),
      },
      stash: {
        create: () => of(),
        getUiStash: () => of(),
        computeKey: () => 'testComputedKey',
      },
      settings: {
        get: () => of(),
        set: () => of(),
        remove: () => of(),
      },
    },
  };
};

const globalChannelMock = new ReplaySubject();

export { globalChannelMock, mockSDK };
