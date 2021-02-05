import * as React from 'react';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import { getMediaUrl } from './use-profile';
import { switchMap, filter } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

export interface UseNotificationsActions {
  getMessages: () => void;
  markMessageAsRead: (messageId: string) => void;
}

export interface UseNotificationsProps {
  onError?: (error: IAkashaError) => void;
  globalChannel: any;
  authService: any;
  ipfsService: any;
  profileService: any;
  loggedEthAddress?: string | null;
}

/* A hook to get notifications and mark them as read */
export const useNotifications = (
  props: UseNotificationsProps,
): [
  {
    notifications: any[];
    isFetching: boolean;
  },
  UseNotificationsActions,
] => {
  const {
    onError,
    globalChannel,
    authService,
    ipfsService,
    profileService,
    loggedEthAddress,
  } = props;
  const [notificationsState, setNotificationsState] = React.useState<{
    notifications: any[];
    isFetching: boolean;
  }>({
    notifications: [],
    isFetching: false,
  });

  React.useEffect(() => {
    if (loggedEthAddress) {
      actions.getMessages();
    }
  }, [loggedEthAddress]);

  const handleSubscribe = (payload: any) => {
    const { data, channelInfo } = payload;
    if (data) {
      setNotificationsState((prev: any) => {
        return {
          ...prev,
          notifications: prev.notifications.filter((notif: any) => {
            return notif.id !== channelInfo.args;
          }),
        };
      });
    }
  };

  const handleError = (err: Error) => {
    if (onError) {
      onError({
        errorKey: 'useNotifications.globalNotifications',
        error: err,
        critical: false,
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
    call.subscribe(handleSubscribe, handleError);
    return () => call.unsubscribe();
  }, []);

  const actions: UseNotificationsActions = {
    getMessages() {
      try {
        setNotificationsState(prev => {
          return {
            ...prev,
            isFetching: true,
          };
        });
        const getMessagesCall = authService.getMessages(null);
        const ipfsGatewayCall = ipfsService.getSettings(null);
        const obs = forkJoin([ipfsGatewayCall, getMessagesCall]);
        obs
          .pipe(
            // call ipfsgateway and getMessages
            switchMap((resp: any) =>
              forkJoin([
                // pass the response of the first call along
                of(resp),
                // get profile data for each profile in the getMessages response
                ...resp[1].data.map((message: any) => {
                  const pubKey = message.body.value.author || message.body.value.follower;
                  if (pubKey) {
                    return profileService.getProfile({ pubKey });
                  }
                }),
              ]),
            ),
          )
          .subscribe((resp: any) => {
            if (!resp.length) {
              return;
            }
            // get the initial call response data
            const [gatewayResp, messagesResp] = resp[0];
            // get the profile data responses
            const profileDataResp = resp.slice(1);

            // add the profile data to the message value author/follower
            let completeMessages: any = [];
            profileDataResp?.map((profileResp: any) => {
              const { avatar, coverImage, ...other } = profileResp.data.resolveProfile;
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
            setNotificationsState({ isFetching: false, notifications: completeMessages });
          });
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
      try {
        const call = authService.markMessageAsRead(messageId);
        call.subscribe((resp: any) => {
          if (resp.data) {
            setNotificationsState((prev: any) => {
              return {
                ...prev,
                notifications: prev.notifications.filter((notif: any) => {
                  return notif.id !== messageId;
                }),
              };
            });
          }
        });
      } catch (ex) {
        if (onError) {
          onError({
            errorKey: 'useNotifications.markMessageAsRead',
            error: ex,
            critical: false,
          });
        }
      }
    },
  };

  return [notificationsState, actions];
};

export default useNotifications;
