import { useMutation, useQuery } from 'react-query';
import { lastValueFrom } from 'rxjs';
import getSDK from '@akashaorg/awf-sdk';

import { logError } from './utils/error-handler';

export const DEV_DASHBOARD_KEY = 'DevDashboard';

type SignMessagePayload = {
  message: string | Record<string, unknown> | Record<string, unknown>[];
};

type VerifySignaturePayload = {
  pubKey: string;
  data: string | Record<string, unknown> | Uint8Array;
  signature: string;
};

const validateMessage = async (message: string) => {
  const sdk = getSDK();
  const res = await sdk.api.auth.validateDevKeyFromBase64Message(message);
  return res;
};

/**
 * Hook to validate generated base64 message
 *
 * ```typescript
 * const validateQuery = useValidateMessage('some base64 message string', true);

 * console.log(validateQuery.data)
 * ```
 */
export function useValidateMessage(message: string, enabled: boolean) {
  return useQuery([DEV_DASHBOARD_KEY, 'validate_message'], () => validateMessage(message), {
    enabled,
    keepPreviousData: true,
    onError: (err: Error) => logError('useDevDashboard.validateMessage', err),
  });
}

const addDevKeyFromMessage = async ({
  message,
  messageName,
}: {
  message: string;
  messageName?: string;
}) => {
  const sdk = getSDK();
  const res = await sdk.api.auth.addDevKeyFromBase64Message(message, messageName);
  return res;
};

/**
 * Hook to add dev key from message
 *
 * ```typescript
 * const addKeyQuery = useAddDevKeyFromMessage({message: 'some base64 message string', messageName: 'some message name'}, true);
 * ```
 */
export function useAddDevKeyFromMessage(
  value: { message: string; messageName?: string },
  enabled: boolean,
) {
  return useQuery([DEV_DASHBOARD_KEY, 'add_key'], () => addDevKeyFromMessage(value), {
    enabled,
    keepPreviousData: true,
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

const deleteDevKey = async (pubKey: string) => {
  const sdk = getSDK();
  await sdk.api.auth.removeDevKey(pubKey);
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
  return useMutation((pubKey: string) => deleteDevKey(pubKey));
}

const signMessage = async ({ message }: SignMessagePayload) => {
  const sdk = getSDK();
  const res = await lastValueFrom(sdk.api.auth.signData(message, true));

  return res.data;
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
  return useMutation(({ message }: SignMessagePayload) => signMessage({ message }));
}

const verifySignature = async (payload: VerifySignaturePayload) => {
  const sdk = getSDK();
  const res = await lastValueFrom(sdk.api.auth.verifySignature(payload));

  return res;
};

/**
 * Hook to verify a signature
 *
 * ```typescript
 * const verifySignatureMutation = useVerifySignature();

 * verifySignatureMutation.mutate({pubKey: 'bbabcbaa243103inr3u2mab3wivqjjq56kiuwcejcenvwzcmjilwnirecba', message: 'original message', signature: 'some signature to be veriftied'})
 * ```
 */
export function useVerifySignature() {
  return useMutation((payload: VerifySignaturePayload) => verifySignature(payload));
}
