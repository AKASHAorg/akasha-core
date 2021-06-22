import * as React from 'react';
import { IAkashaError } from '@akashaproject/ui-awf-typings';
import getSDK from '@akashaproject/awf-sdk';
import { events } from '@akashaproject/sdk-typings';
import { getMediaUrl } from './utils/media-utils';
import { forkJoin, lastValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { createErrorHandler } from './utils/error-handler';

export interface UseNotificationsActions {
  /**
   * get current inbox messages of the user
   */
  getMessages: () => void;
  /**
   * mark a message as read, does not delete from inbox
   * @param messageId - id of the message
   */
  markMessageAsRead: (messageId: string) => void;
  /**
   * check if there are new unread messages in the user's inbox
   */
  hasNewNotifications: () => void;
}

export interface UseNotificationsProps {
  onError?: (error: IAkashaError) => void;
  loggedEthAddress?: string | null;
}

export interface INotificationsState {
  notifications: any[];
  isFetching: boolean;
  hasNewNotifications: boolean;
  hasNewNotificationsQuery: boolean;
  markAsReadQuery: string | null;
}

const initialNotificationsState: INotificationsState = {
  notifications: [],
  isFetching: false,
  hasNewNotifications: false,
  hasNewNotificationsQuery: false,
  markAsReadQuery: null,
};

export type INotificationsAction =
  | { type: 'GET_NOTIFICATIONS' }
  | {
      type: 'GET_NOTIFICATIONS_SUCCESS';
      payload: any[];
    }
  | { type: 'MARK_MESSAGE_AS_READ'; payload: string }
  | {
      type: 'MARK_MESSAGE_AS_READ_SUCCESS';
      payload: { data: boolean; messageId: string };
    }
  | { type: 'HAS_NEW_NOTIFICATIONS' }
  | { type: 'HAS_NEW_NOTIFICATIONS_SUCCESS'; payload: boolean };

const NotificationsStateReducer = (state: INotificationsState, action: INotificationsAction) => {
  switch (action.type) {
    case 'GET_NOTIFICATIONS':
      return { ...state, isFetching: true };
    case 'GET_NOTIFICATIONS_SUCCESS': {
      return {
        ...state,
        isFetching: false,
        notifications: action.payload,
      };
    }
    case 'MARK_MESSAGE_AS_READ':
      return { ...state, markAsReadQuery: action.payload };
    case 'MARK_MESSAGE_AS_READ_SUCCESS':
      if (action.payload) {
        let readCounter = 0;
        const readNotifs = state.notifications.map((notif: any) => {
          if (notif.read) {
            readCounter++;
          }
          if (notif.id === state.markAsReadQuery) {
            return { ...notif, read: true };
          }
          return notif;
        });
        // check for new notifications when last notification gets read
        if (readCounter >= state.notifications.length - 1) {
          return {
            ...state,
            markAsReadQuery: null,
            notifications: readNotifs,
            hasNewNotificationsQuery: true,
          };
        }

        return { ...state, markAsReadQuery: null, notifications: readNotifs };
      }
      return { ...state, markAsReadQuery: null };
    case 'HAS_NEW_NOTIFICATIONS': {
      return {
        ...state,
        hasNewNotificationsQuery: true,
      };
    }
    case 'HAS_NEW_NOTIFICATIONS_SUCCESS': {
      return {
        ...state,
        hasNewNotificationsQuery: false,
        hasNewNotifications: action.payload,
      };
    }

    default:
      throw new Error('[UseNotificationsReducer] action is not defined!');
  }
};

/* A hook to get notifications and mark them as read */
export const useNotifications = (
  props: UseNotificationsProps,
): [INotificationsState, UseNotificationsActions] => {
  const { onError } = props;

  const sdk = getSDK();

  const [notificationsState, dispatch] = React.useReducer(
    NotificationsStateReducer,
    initialNotificationsState,
  );

  const handleSubscribeMarkAsRead = (payload: any) => {
    const { data, channelInfo } = payload;
    if (data) {
      dispatch({
        type: 'MARK_MESSAGE_AS_READ_SUCCESS',
        payload: { data, messageId: channelInfo.args },
      });
    }
  };

  const handleSubscribeHasNewNotifs = (payload: any) => {
    const { data } = payload;
    dispatch({ type: 'HAS_NEW_NOTIFICATIONS_SUCCESS', payload: data });
  };

  // this is used to sync notification state between different components using the hook
  React.useEffect(() => {
    const callMarkAsRead = sdk.api.globalChannel.pipe(
      filter(payload => {
        return payload.event === events.AUTH_EVENTS.MARK_MESSAGE_AS_READ;
      }),
    );
    const callMarkAsReadSub = callMarkAsRead.subscribe({
      next: handleSubscribeMarkAsRead,
      error: createErrorHandler('useNotifications.globalMarkAsRead', false, onError),
    });

    const callHasNewNotifs = sdk.api.globalChannel.pipe(
      filter(payload => {
        return payload.event === events.AUTH_EVENTS.NEW_NOTIFICATIONS;
      }),
    );
    const callHasNewNotifsSub = callHasNewNotifs.subscribe({
      next: handleSubscribeHasNewNotifs,
      error: createErrorHandler('useNotifications.globalHasNewNotifications', false, onError),
    });
    return () => {
      callMarkAsReadSub.unsubscribe();
      callHasNewNotifsSub.unsubscribe();
    };
  }, []);

  async function fetchNotifications() {
    try {
      const getMessagesCall = sdk.api.auth.getMessages({});
      const ipfsGatewayCall = sdk.services.common.ipfs.getSettings();
      const initialResp: any = await lastValueFrom(forkJoin({ ipfsGatewayCall, getMessagesCall }));
      const getProfilesCalls = initialResp.getMessagesCall.data.map((message: any) => {
        const pubKey = message.body.value.author || message.body.value.follower;
        if (pubKey) {
          return sdk.api.profile.getProfile({ pubKey });
        }
      });
      const profilesResp: any = await lastValueFrom(forkJoin(getProfilesCalls));

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
            images.avatar = getMediaUrl(initialResp.ipfsGatewayCall.data, avatar);
          }
          if (coverImage) {
            images.coverImage = getMediaUrl(initialResp.ipfsGatewayCall.data, coverImage);
          }
          const profileData = { ...images, ...other };
          completeMessages = initialResp.getMessagesCall.data?.map((message: any) => {
            if (message.body.value.author === profileData.pubKey) {
              message.body.value.author = profileData;
            }
            if (message.body.value.follower === profileData.pubKey) {
              message.body.value.follower = profileData;
            }
            return message;
          });
        });
      dispatch({ type: 'GET_NOTIFICATIONS_SUCCESS', payload: completeMessages });
    } catch (ex) {
      if (onError) {
        onError({
          errorKey: 'useNotifications.getMessages',
          error: ex,
          critical: false,
        });
      }
    }
  }

  React.useEffect(() => {
    if (notificationsState.isFetching) {
      fetchNotifications();
    }
    return;
  }, [notificationsState.isFetching]);

  React.useEffect(() => {
    const payload = notificationsState.markAsReadQuery;
    if (payload) {
      const call = sdk.api.auth.markMessageAsRead(payload);
      const callSub = call.subscribe({
        next: (resp: any) => {
          dispatch({
            type: 'MARK_MESSAGE_AS_READ_SUCCESS',
            payload: { data: resp.data, messageId: payload },
          });
        },
        error: createErrorHandler('useNotifications.markMessageAsRead', false, onError),
      });
      return () => callSub.unsubscribe();
    }
    return;
  }, [notificationsState.markAsReadQuery]);

  React.useEffect(() => {
    if (notificationsState?.hasNewNotificationsQuery) {
      const call = authService.hasNewNotifications(null);
      const callSub = call.subscribe({
        next: (resp: any) => {
          dispatch({ type: 'HAS_NEW_NOTIFICATIONS_SUCCESS', payload: resp.data });
        },
        error: createErrorHandler('useNotifications.hasNewNotifications', false, onError),
      });
      return () => callSub.unsubscribe();
    }
    return;
  }, [notificationsState?.hasNewNotificationsQuery]);

  const actions: UseNotificationsActions = {
    getMessages() {
      dispatch({ type: 'GET_NOTIFICATIONS' });
    },
    markMessageAsRead(messageId) {
      dispatch({ type: 'MARK_MESSAGE_AS_READ', payload: messageId });
    },
    hasNewNotifications() {
      dispatch({ type: 'HAS_NEW_NOTIFICATIONS' });
    },
  };

  return [notificationsState, actions];
};

export default useNotifications;
