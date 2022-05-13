import { renderHook } from '@testing-library/react-hooks';
import { mockSDK } from '@akashaorg/af-testing';
import { createWrapper } from './utils';
import { of as mockOf } from 'rxjs';
import { useAppDescription } from '../index';

jest.mock('@akashaorg/awf-sdk', () => {
  return () =>
    mockSDK({
      common: {
        ipfs: {
          catDocument: () => mockOf({ data: 'This is app description.' }),
        },
      },
    });
});
describe('useAppDescription', () => {
  it('should check if return app docs', async () => {
    const [wrapper] = createWrapper();
    const { result, waitFor } = renderHook(
      () => useAppDescription('ipfs://bafkreibjqqfztqi6ueyz277tllvandhuuwhsd7vywvlcokiy2pxcjizokq'),
      {
        wrapper,
      },
    );
    await waitFor(() => result.current.isFetched, { timeout: 5000 });
    expect(result.current.data).toBe('This is app description.');
  });
});
