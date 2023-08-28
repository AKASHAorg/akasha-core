import { renderHook } from '@testing-library/react-hooks';
import { mockSDK } from '@akashaorg/af-testing';
// @ts-ignore
import { useInjectedProvider } from '../use-injected-provider';
// @ts-ignore
import { useRequiredNetwork } from '../use-network-state';
// @ts-ignore
import { createWrapper } from './utils';

jest.mock('@akashaorg/awf-sdk', () => {
  return () =>
    mockSDK({
      common: {
        web3: {
          detectInjectedProvider: () => ({ data: 'MetaMask' }),
          getRequiredNetwork: () => {
            return { data: { name: 'goerli', chainId: 5 } };
          },
        },
      },
    });
});

describe('useInjectedProvider', () => {
  it('should inject provider correctly', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(() => useInjectedProvider(), {
      wrapper,
    });
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data).toBe('MetaMask');
  });

  it('should return correct required network', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(() => useRequiredNetwork(), {
      wrapper,
    });
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data.name).toBe('goerli');
  });
});
