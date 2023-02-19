import { renderHook } from '@testing-library/react-hooks';
import { mockSDK } from '@akashaorg/af-testing';
import { createWrapper } from './utils';
import { useInjectedProvider, useRequiredNetworkName } from '../use-injected-provider';

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
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(() => useInjectedProvider(), {
      wrapper,
    });
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data.name).toBe('MetaMask');
    expect(result.current.data.details.iconType).toBe('metamask');
    expect(result.current.data.details.subtitleLabel).toMatch(/Connect using your MetaMask wallet/);
  });

  it('should return correct required network', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(() => useRequiredNetworkName(), {
      wrapper,
    });
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data).toBe('Rinkeby');
  });
});
