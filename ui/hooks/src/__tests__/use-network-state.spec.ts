import { renderHook } from '@testing-library/react-hooks';
import { createWrapper } from './utils';
import { mockSDK } from '@akashaproject/af-testing';
import { useNetworkState } from '../use-network-state';
import { of as mockOf } from 'rxjs';

jest.mock(
  '@akashaproject/awf-sdk',
  () => () =>
    mockSDK({
      common: {
        web3: {
          checkCurrentNetwork: () => mockOf({ data: undefined }),
        },
      },
    }),
);

describe('useNetworkState', () => {
  it('should return the network state', async () => {
    const [wrapper] = createWrapper();

    const { result, waitFor } = renderHook(() => useNetworkState(true), { wrapper });
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data.networkNotSupported).toBeFalsy();
  });
});
