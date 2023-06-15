import { renderHook } from '@testing-library/react-hooks';
import { mockSDK } from '@akashaorg/af-testing';
// @ts-ignore
import { useInjectedProvider } from '../use-injected-provider';
// @ts-ignore
import { useRequiredNetwork } from '../use-network-state';

jest.mock('@akashaorg/awf-sdk', () => {
  return () =>
    mockSDK({
      common: {
        web3: {
          detectInjectedProvider: () => ({ data: 'MetaMask' }),
          getRequiredNetworkName: () => {
            return { data: 'Rinkeby' };
          },
        },
      },
    });
});

describe('useInjectedProvider', () => {
  it('should inject provider correctly', async () => {
    const { result, waitFor } = renderHook(() => useInjectedProvider());
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data).toBe('MetaMask');
  });

  it('should return correct required network', async () => {
    const { result, waitFor } = renderHook(() => useRequiredNetwork());
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data.name).toBe('goerli');
  });
});
