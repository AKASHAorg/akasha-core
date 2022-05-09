import { renderHook } from '@testing-library/react-hooks';
import { mockSDK } from '@akashaproject/af-testing';
import { createWrapper } from './utils';
import { useMutationListener, useQueryListener } from '../use-query-listener';
import { useMutation, useQuery } from 'react-query';
import { act } from 'react-test-renderer';

jest.mock('@akashaproject/awf-sdk', () => {
  return () => mockSDK({});
});

describe('useQueryListener', () => {
  it('should listen to mutation changes', async () => {
    const [wrapper] = createWrapper();
    const { result: mutationListenerResult } = renderHook(
      () => useMutationListener('mutationKey'),
      {
        wrapper,
      },
    );

    const { result: mutationResult } = renderHook(
      () =>
        useMutation(
          async () => {
            // do nothing
          },
          {
            mutationKey: 'mutationKey',
          },
        ),
      {
        wrapper,
      },
    );
    await act(async () => {
      expect(mutationListenerResult.current).toBeFalsy();
      await mutationResult.current.mutateAsync();
      expect(mutationListenerResult.current.mutationId).toBe(1);
      expect(mutationListenerResult.current.state.failureCount).toBe(0);
    });
  });

  it('should listen to query changes', async () => {
    const [wrapper] = createWrapper();
    const { result: queryListenerResult } = renderHook(() => useQueryListener('queryKey'), {
      wrapper,
    });
    const { result: queryResult, waitFor } = renderHook(() => useQuery('queryKey'), {
      wrapper,
    });
    await act(async () => {
      await waitFor(() => queryResult.current.isFetched, { timeout: 5000 });
      expect(queryListenerResult.current.isFetched).toBeTruthy();
      expect(queryListenerResult.current.data).toBeFalsy();
      expect(queryListenerResult.current.isError).toBeFalsy();
    });
  });
});
