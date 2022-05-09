import { renderHook } from '@testing-library/react-hooks';
import { mockSDK } from '@akashaproject/af-testing';
import { createWrapper } from './utils';
import { of as mockOf } from 'rxjs';
import { useIsValidToken } from '../use-invite-token-validation';

jest.mock('@akashaproject/awf-sdk', () => {
  return () =>
    mockSDK({
      auth: {
        validateInvite: () => mockOf({ data: true }),
      },
    });
});

describe('useInviteTokenValidation', () => {
  it('should check if token is valid', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(
      () => useIsValidToken({ inviteToken: 'abcd', enabler: true }),
      {
        wrapper,
      },
    );
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data).toBeTruthy();
  });
});
