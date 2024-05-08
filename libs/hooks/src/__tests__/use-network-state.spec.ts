import { renderHook } from '@testing-library/react-hooks';
import { createWrapper } from './utils';
import { useNetworkState } from '../use-network-state';

describe('useNetworkState', () => {
  it('should return the network state', async () => {
    const [wrapper] = createWrapper();

    const { result, waitFor } = renderHook(() => useNetworkState(true), { wrapper });
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data?.networkNotSupported).toBeFalsy();
  });
});
