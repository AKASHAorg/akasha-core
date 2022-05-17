import { renderHook } from '@testing-library/react-hooks';
import { mockSDK } from '@akashaorg/af-testing';
import { createWrapper } from './utils';
import { of as mockOf } from 'rxjs';
import { mockSearchProfiles } from '../__mocks__/profiles';
import { useMentionSearch } from '../use-mentions';

jest.mock('@akashaorg/awf-sdk', () => {
  return () =>
    mockSDK({
      profile: {
        searchProfiles: () => mockOf({ data: { searchProfiles: mockSearchProfiles } }),
      },
      common: {
        ipfs: {
          buildIpfsLinks: () => 'link',
        },
      },
    });
});

describe('useMentions', () => {
  it('should check if load mentiones correctly', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(() => useMentionSearch('test'), {
      wrapper,
    });
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data).toHaveLength(4);
    expect(result.current.data[0].avatar.url).toBeDefined();
    expect(result.current.data[0].avatar.fallbackUrl).toBeDefined();
    expect(result.current.data[0].coverImage.url).toBeDefined();
    expect(result.current.data[0].coverImage.fallbackUrl).toBeDefined();
  });
});
