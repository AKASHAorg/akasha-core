import { useCallback, useEffect, useRef, useState } from 'react';
import getSDK from '@akashaorg/awf-sdk';
import { GQL_EVENTS } from '@akashaorg/typings/lib/sdk';
import { logError } from './utils/error-handler';

/**
 * Hook to mark a notification as read
 * pass the messageId to the mutate function
 * @example useMarkAsRead hook
 * ```typescript
 * const markAsReadQuery = useMarkAsRead();
 *
 * markAsReadQuery.mutate('message id');
 * ```
 */
export function useMarkAsRead() {
  const sdk = getSDK();
  const [data, setData] = useState<boolean | null>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback((messageId: string) => {
    setIsLoading(true);
    const markMessageAsReadApiCall = async () => {
      try {
        const resp = await sdk.api.auth.markMessageAsRead(messageId);
        if (resp) {
          setData(resp);
          setIsLoading(false);
          setIsSuccess(true);
          /*  add other logic when real data become available */
        }
      } catch (err) {
        logError('useNotifications.markAsRead', err);
        setError(err);
        setIsError(true);
        setData(null);
      }
    };

    markMessageAsReadApiCall();
  }, []);

  return { mutate, data, isLoading, error, isSuccess, isError };
}

const checkNewNotifications = async () => {
  const sdk = getSDK();
  const res = await sdk.api.auth.hasNewNotifications();
  return res.data;
};

/**
 * Hook to check for new notifications
 * @example useCheckNewNotifications hook
 * ```typescript
 * const checkNewNotificationsQuery = useCheckNewNotifications('logged-in-user-eth-address');
 *
 * const hasNewNotifications = checkNewNotificationsQuery.data;
 * ```
 */
export function useCheckNewNotifications(did: string) {
  const [data, setData] = useState<boolean>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await checkNewNotifications();
        if (res) {
          setData(res);
          setError(null);
          setIsLoading(false);
        } else {
          setData(null);
          setIsLoading(false);
        }
      } catch (err) {
        setError(err);
        logError('useNotifications.checkNewNotifications', err);
        setIsLoading(false);
      }
    };

    if (did) {
      fetchData();
    }
  }, [did]);

  return { data, isLoading, error };
}

/**
 * Hook to listen for mutation events
 * @example useListenForMutationEvents hook
 * ```typescript
 * const mutationEvent = useListenForMutationEvents();
 *
 * const { messageObj, appid, success, pending } = mutationEvent;
 * ```
 */
export function useListenForMutationEvents() {
  const [data, setData] = useState(null);

  const sdk = getSDK();

  const messageObj = useRef(null);
  const uuid = useRef('');

  useEffect(() => {
    const subSDK = sdk.api.globalChannel.subscribe({
      next: (eventData: {
        data: { uuid: string; [key: string]: unknown };
        event: GQL_EVENTS.MUTATION;
      }) => {
        if (eventData.event === GQL_EVENTS.MUTATION) {
          const currentUuid = eventData.data.uuid;

          if (currentUuid !== uuid.current) {
            uuid.current = currentUuid;
            messageObj.current = sdk.services.gql.consumeMutationNotificationObject(currentUuid);
          }
          setData({ ...eventData.data, messageObj: messageObj.current, appid: uuid.current });
        }
      },
    });
    return () => {
      if (subSDK) {
        subSDK.unsubscribe();
      }
    };
  }, []);
  return data;
}
