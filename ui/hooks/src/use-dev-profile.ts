import { useQuery } from 'react-query';
import getSDK from '@akashaorg/awf-sdk';
import { logError } from './utils/error-handler';

export const DEV_DASHBOARD_KEY = 'DevDashboard';

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
