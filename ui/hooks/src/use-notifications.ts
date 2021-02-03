import * as React from 'react';
import { IAkashaError } from '@akashaproject/ui-awf-typings';

export interface UseNotificationsActions {
  getMessages: () => void;
  markMessageAsRead: (messageId: string) => void;
}

export interface UseNotificationsProps {
  onError?: (error: IAkashaError) => void;
  authService: any;
  loggedEthAddress?: string | null;
}

/* A hook to get notifications and mark them as read */
export const useNotifications = (props: UseNotificationsProps): [any, UseNotificationsActions] => {
  const { onError, authService, loggedEthAddress } = props;
  const [notificationsState, setNotificationsState] = React.useState<any>([]);

  React.useEffect(() => {
    if (loggedEthAddress) {
      actions.getMessages();
    }
  }, [loggedEthAddress]);

  const actions: UseNotificationsActions = {
    getMessages() {
      try {
        const call = authService.getMessages(null);
        call.subscribe((resp: any) => {
          if (resp.data) {
            setNotificationsState(resp.data);
          }
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
            setNotificationsState((prev: any) =>
              prev.filter((notif: any) => {
                return parseInt(notif.Id, 10) !== parseInt(messageId, 10);
              }),
            );
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
