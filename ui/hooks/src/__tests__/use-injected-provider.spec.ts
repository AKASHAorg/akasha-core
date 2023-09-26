import { renderHook } from '@testing-library/react-hooks';
import { useInjectedProvider } from '../use-injected-provider';
import { useRequiredNetwork } from '../use-network-state';
import { createWrapper } from './utils';

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
    expect(result.current.data?.name).toBe('goerli');
  });
});
