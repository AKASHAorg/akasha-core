import { Colors, NotificationTypes } from '@akashaorg/typings/lib/ui';

export function getColorLight(type: NotificationTypes): Colors {
  switch (type) {
    case (NotificationTypes.Alert, NotificationTypes.Error):
      return 'errorLight';
    case NotificationTypes.Caution:
      return 'warningLight';
    case NotificationTypes.Success:
      return 'success';
    case NotificationTypes.Info:
      return 'secondaryLight';
  }
}

export function getColorDark(type: NotificationTypes): Colors {
  switch (type) {
    case (NotificationTypes.Alert, NotificationTypes.Error):
      return 'errorDark';
    case NotificationTypes.Caution:
      return 'warningDark';
    case NotificationTypes.Success:
      return 'success';
    case NotificationTypes.Info:
      return 'secondaryDark';
  }
}
