import { renderHook } from '@testing-library/react-hooks';
import { mockSDK } from '@akashaorg/af-testing';
import { of as mockOf } from 'rxjs';
import { createWrapper } from './utils';
import { useGetProfile, useGetProfileByEthAddress } from '../use-profile';
import { mockProfile } from '../__mocks__/profiles';
import * as moderation from '../use-moderation';
import { mockCheckModerationStatus } from '../__mocks__/moderation';

jest.mock('@akashaorg/awf-sdk', () => {
  return () =>
    mockSDK({
      profile: {
        getProfile: () => mockOf({ data: { getProfile: mockProfile } }),
      },
      common: {
        ipfs: {
          buildIpfsLinks: () => 'link',
        },
      },
    });
});

describe('useProfile', () => {
  beforeAll(() => {
    const mock = jest.spyOn(moderation, 'checkStatus');
    mock.mockReturnValue(new Promise(resolve => resolve(mockCheckModerationStatus)));
  });

  it('should get profile', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(() => useGetProfile(mockProfile.pubKey), {
      wrapper,
    });
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data.name).toBe('Tetrarcha');
    expect(result.current.data.pubKey).toBeTruthy();
  });

  it('should get profile by eth address', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(
      () => useGetProfileByEthAddress(mockProfile.ethAddress),
      {
        wrapper,
      },
    );
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data.name).toBe('Tetrarcha');
    expect(result.current.data.pubKey).toBeTruthy();
  });
});
