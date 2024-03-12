import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import getSDK from '@akashaorg/awf-sdk';
import { IMessage, GQL_EVENTS } from '@akashaorg/typings/lib/sdk';

import { logError } from './utils/error-handler';

export const NOTIFICATIONS_KEY = 'Notifications';
export const HAS_NEW_NOTIFICATIONS_KEY = 'Has_New_Notifications';

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
  const queryClient = useQueryClient();
  return useMutation(messageId => sdk.api.auth.markMessageAsRead(messageId), {
    // When mutate is called:
    onMutate: async (messageId: string) => {
      await queryClient.cancelQueries([NOTIFICATIONS_KEY]);

      // Snapshot the previous value
      const previousNotifs: IMessage[] = queryClient.getQueryData([NOTIFICATIONS_KEY]);
      const updated = previousNotifs.map(notif => {
        if (notif.id === messageId) {
          return { ...notif, read: true };
        }
        return notif;
      });
      const previousCheckNotifs: boolean = queryClient.getQueryData([HAS_NEW_NOTIFICATIONS_KEY]);
      queryClient.setQueryData([NOTIFICATIONS_KEY], updated);
      queryClient.setQueryData([HAS_NEW_NOTIFICATIONS_KEY], false);

      return { previousNotifs, previousCheckNotifs };
    },
    onError: (err, variables, context) => {
      if (context?.previousNotifs) {
        queryClient.setQueryData([NOTIFICATIONS_KEY], context.previousNotifs);
      }
      if (context?.previousCheckNotifs) {
        queryClient.setQueryData([HAS_NEW_NOTIFICATIONS_KEY], context.previousCheckNotifs);
      }
      logError('useNotifications.markAsRead', err as Error);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries([NOTIFICATIONS_KEY]);
    },
  });
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
export function useCheckNewNotifications(loggedEthAddress: string) {
  return useQuery([HAS_NEW_NOTIFICATIONS_KEY], () => checkNewNotifications(), {
    enabled: !!loggedEthAddress,
    keepPreviousData: true,
    onError: (err: Error) => logError('useNotifications.checkNewNotifications', err),
  });
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
