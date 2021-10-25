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
  profileService?: Record<string, unknown>;
  ipfsService?: Record<string, unknown>;
  authService?: Record<string, unknown>;
  ensService?: Record<string, unknown>;
  web3Service?: Record<string, unknown>;
  tagService?: Record<string, unknown>;
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
      getTrending: () => mockObservable,
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
    tags: {
      getTrending: () => mockObservable,
      ...overrides.tagService,
    },
  },
});

export { globalChannelMock, getSDKMocks };
