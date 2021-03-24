import * as React from 'react';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import { getMediaUrl } from './utils/media-utils';
import { filter } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { createErrorHandler } from './utils/error-handler';

export interface UseNotificationsActions {
  getMessages: () => void;
  markMessageAsRead: (messageId: string) => void;
  hasNewNotifications: () => void;
}

export interface UseNotificationsProps {
  onError?: (error: IAkashaError) => void;
  globalChannel: any;
  authService: any;
  ipfsService: any;
  profileService: any;
  loggedEthAddress?: string | null;
}

export interface UseNotificationsState {
  notifications: any[];
  isFetching: boolean;
  hasNewNotifications: boolean;
}

/* A hook to get notifications and mark them as read */
export const useNotifications = (
  props: UseNotificationsProps,
): [UseNotificationsState, UseNotificationsActions] => {
  const { onError, globalChannel, authService, ipfsService, profileService } = props;
  const [notificationsState, setNotificationsState] = React.useState<UseNotificationsState>({
    notifications: [],
    isFetching: true,
    hasNewNotifications: false,
  });

  const handleSubscribe = (payload: any) => {
    const { data, channelInfo } = payload;
    if (data) {
      setNotificationsState((prev: any) => {
        return {
          ...prev,
          notifications: prev.notifications.map((notif: any) => {
            if (notif.id === channelInfo.args) {
              return { ...notif, read: true };
            }
            return notif;
          }),
        };
      });
    }
  };

  // this is used to sync notification state between different components using the hook
  React.useEffect(() => {
    const call = globalChannel.pipe(
      filter((payload: any) => {
        return (
          payload.channelInfo.method === 'markMessageAsRead' &&
          payload.channelInfo.servicePath.includes('AUTH_SERVICE')
        );
      }),
    );
    call.subscribe(
      handleSubscribe,
      createErrorHandler('useNotifications.globalNotifications', false, onError),
    );
    return () => call.unsubscribe();
  }, []);

  const actions: UseNotificationsActions = {
    async getMessages() {
      try {
        const getMessagesCall = authService.getMessages(null);
        const ipfsGatewayCall = ipfsService.getSettings(null);
        const initialResp: any = await forkJoin([ipfsGatewayCall, getMessagesCall]).toPromise();
        const getProfilesCalls = initialResp[1].data.map((message: any) => {
          const pubKey = message.body.value.author || message.body.value.follower;
          if (pubKey) {
            return profileService.getProfile({ pubKey });
          }
        });
        const profilesResp: any = await forkJoin(getProfilesCalls).toPromise();

        const [gatewayResp, messagesResp] = initialResp;

        let completeMessages: any = [];
        profilesResp
          ?.filter((res: any) => res.data)
          .map((profileResp: any) => {
            const { avatar, coverImage, ...other } = profileResp.data?.resolveProfile;
            const images: { avatar: string | null; coverImage: string | null } = {
              avatar: null,
              coverImage: null,
            };
            if (avatar) {
              images.avatar = getMediaUrl(gatewayResp.data, avatar);
            }
            if (coverImage) {
              images.coverImage = getMediaUrl(gatewayResp.data, coverImage);
            }
            const profileData = { ...images, ...other };
            completeMessages = messagesResp.data?.map((message: any) => {
              if (message.body.value.author === profileData.pubKey) {
                message.body.value.author = profileData;
              }
              if (message.body.value.follower === profileData.pubKey) {
                message.body.value.follower = profileData;
              }
              return message;
            });
          });
        setNotificationsState(prev => ({
          ...prev,
          isFetching: false,
          notifications: completeMessages,
        }));
      } catch (ex) {
        if (onError) {
          onError({
            errorKey: 'useNotifications.getMessages',
            error: ex,
            critical: false,
          });
        }
      }
    },
    markMessageAsRead(messageId) {
      const call = authService.markMessageAsRead(messageId);
      call.subscribe((resp: any) => {
        if (resp.data) {
          setNotificationsState((prev: any) => {
            return {
              ...prev,
              notifications: prev.notifications.map((notif: any) => {
                if (notif.id === messageId) {
                  return { ...notif, read: true };
                }
                return notif;
              }),
            };
          });
        }
      }, createErrorHandler('useNotifications.markMessageAsRead', false, onError));
    },
    hasNewNotifications() {
      const call = authService.hasNewNotifications(null);
      call.subscribe((resp: any) => {
        if (resp.data) {
          setNotificationsState((prev: any) => {
            return {
              ...prev,
              hasNewNotifications: resp.data,
            };
          });
        }
      }, createErrorHandler('useNotifications.hasNewNotifications', false, onError));
    },
  };

  return [notificationsState, actions];
};

export default useNotifications;
