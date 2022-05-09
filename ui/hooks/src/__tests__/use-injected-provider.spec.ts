import { renderHook } from '@testing-library/react-hooks';
import { mockSDK } from '@akashaproject/af-testing';
import { createWrapper } from './utils';
import { useInjectedProvider, useRequiredNetworkName } from '../use-injected-provider';
import { of as mockOf } from 'rxjs';

jest.mock('@akashaproject/awf-sdk', () => {
  return () =>
    mockSDK({
      common: {
        web3: {
          detectInjectedProvider: () => mockOf({ data: 'MetaMask' }),
          getRequiredNetworkName: () => mockOf({ data: 'Rinkeby' }),
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
    expect(result.current.data.details.subtitleLabel).toMatch(/We recommend using MetaMask/);
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
