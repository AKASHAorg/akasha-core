import { useMutation, useQuery, useQueryClient } from 'react-query';
import { lastValueFrom, forkJoin, catchError, of } from 'rxjs';
import getSDK from '@akashaproject/awf-sdk';
import { getMediaUrl } from './utils/media-utils';
import { logError } from './utils/error-handler';
import { IMessage } from '@akashaproject/sdk-typings/lib/interfaces/auth';

export const NOTIFICATIONS_KEY = 'Notifications';
export const HAS_NEW_NOTIFICATIONS_KEY = 'Has_New_Notifications';

const getNotifications = async () => {
  const sdk = getSDK();
  const getMessagesResp = await lastValueFrom(sdk.api.auth.getMessages({}));

  const getProfilesCalls = getMessagesResp.data.map(message => {
    const pubKey = message.body.value.author || message.body.value.follower;
    if (pubKey) {
      return sdk.api.profile.getProfile({ pubKey }).pipe(
        catchError(err => {
          logError('useNotifications.getNotifications.getProfileCalls', err);
          return of(null);
        }),
      );
    }
  });
  const profilesResp = await lastValueFrom(forkJoin(getProfilesCalls));

  let completeMessages = [];
  profilesResp
    ?.filter(res => res?.data)
    .map(profileResp => {
      const { avatar, coverImage, ...other } = profileResp.data?.resolveProfile;
      const images: { avatar: string | null; coverImage: string | null } = {
        avatar: null,
        coverImage: null,
      };
      if (avatar) {
        images.avatar = getMediaUrl(avatar);
      }
      if (coverImage) {
        images.coverImage = getMediaUrl(coverImage);
      }
      const profileData = { ...images, ...other };
      completeMessages = getMessagesResp.data?.map(message => {
        if (message.body.value.author === profileData.pubKey) {
          message.body.value.author = profileData;
        }
        if (message.body.value.follower === profileData.pubKey) {
          message.body.value.follower = profileData;
        }
        return message;
      });
    });
  return completeMessages;
};

/**
 * Hook to get a user's notifications
 * @param loggedEthAddress - currently logged in user's eth address
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
 */
export function useMarkAsRead() {
  const sdk = getSDK();
  const queryClient = useQueryClient();
  return useMutation(messageId => lastValueFrom(sdk.api.auth.markMessageAsRead(messageId)), {
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
  const res = await lastValueFrom(sdk.api.auth.hasNewNotifications());
  return res.data;
};

/**
 * Hook to check for new notifications
 * @param loggedEthAddress - currently logged in user's eth address
 */
export function useCheckNewNotifications(loggedEthAddress: string) {
  return useQuery([HAS_NEW_NOTIFICATIONS_KEY], () => checkNewNotifications(), {
    enabled: !!loggedEthAddress,
    keepPreviousData: true,
    onError: (err: Error) => logError('useNotifications.checkNewNotifications', err),
  });
}
