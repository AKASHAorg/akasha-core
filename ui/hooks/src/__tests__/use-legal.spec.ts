import { renderHook } from '@testing-library/react-hooks';
import { mockSDK } from '@akashaorg/af-testing';
import { createWrapper } from './utils';
import { of as mockOf } from 'rxjs';
import { useLegalDoc } from '../use-legal';
import { LEGAL_DOCS } from '@akashaorg/ui-awf-typings';

jest.mock('@akashaorg/awf-sdk', () => {
  return () =>
    mockSDK({
      common: {
        ipfs: {
          getLegalDoc: () => mockOf({ data: 'This is illegal text doc' }),
        },
      },
    });
});
describe('useInviteTokenValidation', () => {
  it('should check if token is valid', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(() => useLegalDoc(LEGAL_DOCS.TERMS_OF_USE), {
      wrapper,
    });
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data).toBe('This is illegal text doc');
  });
});
