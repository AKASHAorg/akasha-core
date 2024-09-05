import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import { useRootComponentProps, withProviders } from '@akashaorg/ui-awf-hooks';
import {
  NotificationEvents,
  type IRootComponentProps,
  type UIEventData,
} from '@akashaorg/typings/lib/ui';
import {
  BellAlertIcon,
  BellIcon,
  BellSnoozeIcon,
  ExclamationTriangleIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Button from '@akashaorg/design-system-core/lib/components/Button';

const RoundedNotificationButton = () => {
  const { getCorePlugins, uiEvents } = useRootComponentProps();
  const navigateTo = React.useRef(getCorePlugins().routing.navigateTo);
  const uiEventsRef = React.useRef(uiEvents);
  const [snoozeNotifications, setSnoozeNotifications] = React.useState(false);
  // Not implemented yet.
  const hasNewNotifications = false;
  // check if snooze notification option has already been set
  React.useEffect(() => {
    if (window.localStorage) {
      setSnoozeNotifications(JSON.parse(localStorage.getItem('notifications-snoozed')));
    }
  }, []);

  React.useEffect(() => {
    const eventsSub = uiEventsRef.current.subscribe({
      next: (eventInfo: UIEventData) => {
        if (eventInfo.event == NotificationEvents.SnoozeNotifications) {
          setSnoozeNotifications(true);
        }
        if (eventInfo.event == NotificationEvents.UnsnoozeNotifications) {
          setSnoozeNotifications(false);
        }
      },
    });

    return () => {
      if (eventsSub) {
        eventsSub.unsubscribe();
      }
    };
  }, []);

  const handleNotificationClick = React.useCallback(() => {
    navigateTo.current({
      appName: '@akashaorg/app-notifications',
      getNavigationUrl: () => '/',
    });
  }, []);

  const notificationIcon = React.useMemo(() => {
    if (snoozeNotifications) {
      return <BellSnoozeIcon />;
    }
    return hasNewNotifications ? <BellAlertIcon /> : <BellIcon />;
  }, [hasNewNotifications, snoozeNotifications]);

  return (
    <Button
      iconOnly={true}
      icon={notificationIcon}
      onClick={handleNotificationClick}
      greyBg={true}
      variant="primary"
    />
  );
};

export const { bootstrap, mount, unmount } = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: withProviders(RoundedNotificationButton),
  errorBoundary: (err, errorInfo, props: IRootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }
    return <Icon icon={<ExclamationTriangleIcon />} />;
  },
});
