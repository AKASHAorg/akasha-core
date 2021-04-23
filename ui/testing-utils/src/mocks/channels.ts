import { of } from 'rxjs';
const globalChannelMock = {
  pipe: () => ({
    subscribe: () => {
      /* empty */
    },
    unsubscribe: () => {
      /* empty */
    },
  }),
};
const mockObservable = of('test');

export interface ChannelOverrides {
  profileService?: {};
  ipfsService?: {};
  authService?: {};
  ensService?: {};
  web3Service?: {};
}

const getSDKMocks = (overrides: ChannelOverrides) => ({
  auth: {
    authService: {
      getCurrentUser: () => mockObservable,
      ...overrides.authService,
    },
  },
  profiles: {
    profileService: {
      isFollowing: () => mockObservable,
      ...overrides.profileService,
    },
  },
  commons: {
    ipfsService: {
      getSettings: () => mockObservable,
      ...overrides.ipfsService,
    },
    web3Service: {
      checkCurrentNetwork: () => mockObservable,
      ...overrides.web3Service,
    },
  },
  registry: {
    ens: {
      resolveAddress: () => mockObservable,
      ...overrides.ensService,
    },
  },
  posts: {
    tags: {},
  },
});

export { globalChannelMock, getSDKMocks };
