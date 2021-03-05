import * as React from 'react';
export interface INotificationsPopover {
  className?: string;
  onClickNotification: () => void;
  dataSource: INotification[];
  target: React.RefObject<any>;
  closePopover: () => void;
}
export interface INotification {
  ethAddress: string;
  user: string;
  userAvatar: string;
  time: string;
  action: string;
}
declare const NotificationsPopover: React.FC<INotificationsPopover>;
export { NotificationsPopover };
