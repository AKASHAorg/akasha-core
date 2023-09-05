import { noop, ReplaySubject } from 'rxjs';

//@Todo: requires explicit annotation because of rxjs
const mockSDK: any = (overrides?: any) => {
  return {
    api: {
      auth: {
        enableSync: noop,
        checkIfSignedUp: () => Promise.resolve(),
        signIn: () => Promise.resolve({ data: { pubKey: '', ethAddress: '', isNewUser: false } }),
        getSession: () => Promise.resolve({ data: { buck: {}, client: {}, user: {} } }) as any,
        getToken: () => Promise.resolve({ data: 'testToken' }),
        getCurrentUser: () =>
          Promise.resolve({ data: { ethAddress: '0x0', pubKey: 'testPubKey' } }),
        signData: () =>
          Promise.resolve({
            data: { serializedData: 'testData', signature: 'testSig', pubKey: 'testPubKey' },
          }),
        signOut: () => Promise.resolve({ data: true }),
        verifySignature: () => Promise.resolve({ data: true }),
        authenticateMutationData: () => Promise.resolve({ signedData: '', token: '' }),
        decryptMessage: () => Promise.resolve(),
        getMessages: () => Promise.resolve(),
        hasNewNotifications: () => Promise.resolve(),
        markMessageAsRead: () => Promise.resolve(),
        deleteMessage: () => Promise.resolve(),
        validateInvite: () => Promise.resolve(),
        connectAddress: () => Promise.resolve(),
        ...(overrides?.auth || {}),
      },
      comments: {
        getComment: () => Promise.resolve(),
        getComments: () => Promise.resolve(),
        addComment: () => Promise.resolve(),
        editComment: () => Promise.resolve(),
        removeComment: () => Promise.resolve(),
        ...(overrides?.comments || {}),
      },
      ens: {
        registerName: () => Promise.resolve(),
        claimName: () => Promise.resolve(),
        userIsOwnerOf: () => Promise.resolve(),
        isAvailable: () => Promise.resolve(),
        resolveAddress: () => Promise.resolve(),
        resolveName: () => Promise.resolve(),
        ...(overrides?.ens || {}),
      },
      entries: {
        getEntry: () => Promise.resolve(),
        getEntries: () => Promise.resolve(),
        postEntry: () => Promise.resolve(),
        editEntry: () => Promise.resolve(),
        removeEntry: () => Promise.resolve(),
        entriesByAuthor: () => Promise.resolve(),
        entriesByTag: () => Promise.resolve(),
        getLinkPreview: () => Promise.resolve(),
        getFeedEntries: () => Promise.resolve(),
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
        getLatestReleaseInfo: () => Promise.resolve(),
        getIntegrationsInfo: () => Promise.resolve(),
        ...(overrides?.icRegistry || {}),
      },
      profile: {
        graphQLDocs: {} as any,
        addProfileProvider: noop,
        makeDefaultProvider: noop,
        registerUserName: () => Promise.resolve(),
        getProfile: () => Promise.resolve(),
        follow: () => Promise.resolve(),
        unFollow: () => Promise.resolve(),
        isFollowing: () => Promise.resolve(),
        saveMediaFile: () =>
          Promise.resolve({
            size: { width: 100, height: 100, naturalWidth: 100, naturalHeight: 100 },
            CID: 'testCID',
          }),
        searchProfiles: () => Promise.resolve(),
        getTrending: () => Promise.resolve(),
        toggleTagSubscription: () => Promise.resolve(),
        getTagSubscriptions: () => Promise.resolve(),
        isSubscribedToTag: () => Promise.resolve(),
        globalSearch: () => Promise.resolve(),
        getFollowers: () => Promise.resolve(),
        getFollowing: () => Promise.resolve(),
        getInterests: () => Promise.resolve(),
        ...(overrides?.profile || {}),
      },
      tags: {
        getTag: () => Promise.resolve(),
        getTags: () => Promise.resolve(),
        searchTags: () => Promise.resolve(),
        createTag: () => Promise.resolve(),
        getTrending: () => Promise.resolve(),
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
        web3: {
          detectInjectedProvider: () => null,
        },
        ipfs: {
          getSettings: () => null,
          catDocument: () => null,
        },
        misc: {
          resolveDID: jest.fn(),
        },
        ...(overrides?.common || {}),
      },
      db: {
        open: () => Promise.resolve(),
        getDb: () => Promise.resolve(),
        getCollection: () => Promise.resolve(),
      },
      gql: { run: () => Promise.resolve() },
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
        create: () => Promise.resolve(),
        getUiStash: () => Promise.resolve(),
        computeKey: () => 'testComputedKey',
      },
      settings: {
        get: () => Promise.resolve(),
        set: () => Promise.resolve(),
        remove: () => Promise.resolve(),
        ...(overrides?.settings || {}),
      },
    },
  };
};

const globalChannelMock = new ReplaySubject();

export { globalChannelMock, mockSDK };
