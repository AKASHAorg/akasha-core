import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import getSDK from '@akashaorg/awf-sdk';

import { logError } from './utils/error-handler';

export const DEV_DASHBOARD_KEY = 'DevDashboard';

type AddDevKeyPayload = {
  message: string;
  messageName?: string;
};

type SignMessagePayload = {
  message: string | Record<string, unknown> | Record<string, unknown>[];
};

type VerifySignaturePayload = {
  did: string;
  data: string | Record<string, unknown> | Uint8Array;
  signature: string;
};

const validateMessage = async (message: string) => {
  const sdk = getSDK();
  const res: any = await sdk.api.auth.validateDevKeyFromBase64Message(message);
  return res;
};

/**
 * Hook to validate generated base64 message
 *
 * ```typescript
 * const validateMutation = useValidateMessage();

 * validateMutation.mutate('some base64 message string')
 * ```
 */
export function useValidateMessage() {
  return useMutation((message: string) => validateMessage(message), {
    onError: (err: Error) => logError('useDevDashboard.validateMessage', err),
  });
}

const addDevKeyFromMessage = async ({ message, messageName }: AddDevKeyPayload) => {
  const sdk = getSDK();
  const res = await sdk.api.auth.addDevKeyFromBase64Message(message, messageName);
  return res;
};

/**
 * Hook to add dev key from message
 *
 * ```typescript
 * const addKeyMutation = useAddDevKeyFromMessage();

 * addKeyMutation.mutate({message: 'some base64 message string', messageName: 'some message name'})
 * ```
 */
export function useAddDevKeyFromMessage() {
  const queryClient = useQueryClient();

  return useMutation((payload: AddDevKeyPayload) => addDevKeyFromMessage(payload), {
    onSuccess: () => queryClient.invalidateQueries([DEV_DASHBOARD_KEY, 'get_keys']),
    onError: (err: Error) => logError('useDevDashboard.addDevKeyFromMessage', err),
  });
}

const getDevKeys = async () => {
  const sdk = getSDK();
  const res = await sdk.api.auth.getDevKeys();
  return res;
};

/**
 * Hook to get dev keys
 *
 * ```typescript
 * const getKeysQuery = useGetDevKeys(true);

 * console.log(getKeysQuery.data)
 * ```
 */
export function useGetDevKeys(enabled: boolean) {
  return useQuery([DEV_DASHBOARD_KEY, 'get_keys'], () => getDevKeys(), {
    enabled,
    keepPreviousData: true,
    onError: (err: Error) => logError('useDevDashboard.getDevKeys', err),
  });
}

const deleteDevKey = async (profileId: string) => {
  const sdk = getSDK();
  await sdk.api.auth.removeDevKey(profileId);
  return 'successfully deleted!';
};

/**
 * Hook to delete a dev key
 *
 * ```typescript
 * const deleteKeyMutation = useDeleteDevKey();

 * deleteKeyMutation.mutate('bbabcbaa243103inr3u2mab3wivqjjq56kiuwcejcenvwzcmjilwnirecba')
 * ```
 */
export function useDeleteDevKey() {
  const queryClient = useQueryClient();

  return useMutation((profileId: string) => deleteDevKey(profileId), {
    onSuccess: () => queryClient.invalidateQueries([DEV_DASHBOARD_KEY, 'get_keys']),
    onError: (err: Error) => logError('useDevDashboard.deleteDevKey', err),
  });
}

const signMessage = async ({ message }: SignMessagePayload) => {
  const sdk = getSDK();
  return sdk.api.auth.signData(message, true);
};

/**
 * Hook to sign a message
 *
 * ```typescript
 * const signMessageMutation = useSignMessage();

 * signMessageMutation.mutate({ message: 'some message to be signed' })
 * ```
 */
export function useSignMessage() {
  return useMutation(({ message }: SignMessagePayload) => signMessage({ message }), {
    onError: (err: Error) => logError('useDevDashboard.signMessage', err),
  });
}

const verifySignature = async (payload: VerifySignaturePayload) => {
  const sdk = getSDK();
  return Promise.resolve(false); // stubbed
};

/**
 * Hook to verify a signature
 *
 * ```typescript
 * const verifySignatureMutation = useVerifySignature();

 * verifySignatureMutation.mutate({profileId: 'bbabcbaa243103inr3u2mab3wivqjjq56kiuwcejcenvwzcmjilwnirecba', message: 'original message', signature: 'some signature to be verified'})
 * ```
 */
export function useVerifySignature() {
  return useMutation((payload: VerifySignaturePayload) => verifySignature(payload), {
    onError: (err: Error) => logError('useDevDashboard.verifySignature', err),
  });
}
