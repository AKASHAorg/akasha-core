import { of as mockOf } from 'rxjs';
import { mockNotifications, mockNotificationsProfiles } from './src/__mocks__/notifications';

/**
 * sdk mock for Hooks package.
 * Include only methods needed for the hooks tests
 */
jest.mock('@akashaorg/core-sdk', () => () => ({
  api: {
    auth: {
      getMessages: () => Promise.resolve({ data: mockNotifications }),
      markMessageAsRead: () => Promise.resolve({ data: true }),
      hasNewNotifications: () => ({ data: true }),
    },
    profile: {
      getProfile: () => Promise.resolve(mockNotificationsProfiles[0]),
    },
  },
  services: {
    common: {
      ipfs: {
        getLegalDoc: () => Promise.resolve('This is illegal text doc'),
      },
      web3: {
        checkCurrentNetwork: () => mockOf({ data: undefined }),
        detectInjectedProvider: () => ({ data: 'MetaMask' }),
        getRequiredNetwork: () => {
          return { data: { name: 'sepolia', chainId: 11155111 } };
        },
      },
    },
  },
}));
