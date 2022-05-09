import { renderHook } from '@testing-library/react-hooks';
import { mockSDK } from '@akashaproject/af-testing';
import { createWrapper } from './utils';
import { of as mockOf } from 'rxjs';
import {
  useGetIntegrationId,
  useGetIntegrationInfo,
  useGetIntegrationsCount,
  useGetIntegrationsInfo,
} from '../use-integration-registry';
import { mockIntegrationInfo } from '../__mocks__/integration-registry';

jest.mock('@akashaproject/awf-sdk', () => {
  return () =>
    mockSDK({
      icRegistry: {
        getIntegrationInfo: async () => ({ data: mockIntegrationInfo }),
        getIntegrationsInfo: () => mockOf({ data: [mockIntegrationInfo] }),
        getIntegrationsCount: async () => ({ data: 5 }),
        getIntegrationId: async () => ({ data: 'abcd' }),
      },
    });
});

describe('useIntegrationRegistry', () => {
  it('should get integration info correctly', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(() => useGetIntegrationInfo('abcd'), {
      wrapper,
    });
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data.id).toBe('abcd');
    expect(result.current.data.latestReleaseId).toBe('a123dsa');
  });

  it('should get integrations info correctly', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(
      () => useGetIntegrationsInfo([{ name: 'a' }, { name: 'b' }]),
      {
        wrapper,
      },
    );
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data[0].id).toBe('abcd');
    expect(result.current.data[0].latestReleaseId).toBe('a123dsa');
  });

  it('should return correct integrations count', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(() => useGetIntegrationsCount(), {
      wrapper,
    });
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data).toBe(5);
  });

  it('should return correct integration id', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(() => useGetIntegrationId('someintegration'), {
      wrapper,
    });
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data).toBe('abcd');
  });
});
