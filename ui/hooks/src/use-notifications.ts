import { useMutation, useQuery, useQueryClient } from 'react-query';

import getSDK from '@akashaorg/awf-sdk';
import { IMessage } from '@akashaorg/typings/sdk';

import { logError } from './utils/error-handler';
import { buildProfileMediaLinks } from './utils/media-utils';

export const NOTIFICATIONS_KEY = 'Notifications';
export const HAS_NEW_NOTIFICATIONS_KEY = 'Has_New_Notifications';

const getNotifications = async () => {
  const sdk = getSDK();
  const getMessagesResp = await sdk.api.auth.getMessages({});
  const messages = getMessagesResp.data.map(async message => {
    const pubKey = message.body.value.author || message.body.value.follower;
    if (pubKey) {
      let populatedMessage;
      const profile = await sdk.api.profile.getProfile({ pubKey });
      const profileData = buildProfileMediaLinks(profile.data);
      if (message.body.value.author === profileData.pubKey) {
        populatedMessage = {
          ...message,
          body: { ...message.body, value: { ...message.body.value, author: profileData } },
        };
      }
      if (message.body.value.follower === profileData.pubKey) {
        populatedMessage = {
          ...message,
          body: { ...message.body, value: { ...message.body.value, follower: profileData } },
        };
      }
      return populatedMessage;
    }
  });
  return Promise.all(messages);
};

/**
 * Hook to get a user's notifications
 * @example useFetchNotifications hook
 * ```typescript
 * const fetchNotificationsQuery = useFetchNotifications('logged-in-user-eth-address');
 *
 * const notifications = fetchNotificationsQuery.data;
 * ```
 */
export function useFetchNotifications(loggedEthAddress: string) {
  return useQuery([NOTIFICATIONS_KEY], () => getNotifications(), {
    enabled: !!loggedEthAddress,
    keepPreviousData: true,
    onError: (err: Error) => logError('useNotifications.getNotifications', err),
  });
}

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
      await queryClient.cancelQueries(NOTIFICATIONS_KEY);

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
