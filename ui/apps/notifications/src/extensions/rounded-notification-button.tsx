import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import { useRootComponentProps, withProviders } from '@akashaorg/ui-awf-hooks';
import {
  NotificationEvents,
  type RootComponentProps,
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

const NotificationIcon = ({ snoozeNotifications, hasNewNotifications }) => {
  if (snoozeNotifications) {
    return <BellSnoozeIcon />;
  }
  return hasNewNotifications ? <BellAlertIcon /> : <BellIcon />;
};

const RoundedNotificationButton = () => {
  const { getRoutingPlugin, uiEvents } = useRootComponentProps();
  const navigateTo = React.useRef(getRoutingPlugin().navigateTo);
  const uiEventsRef = React.useRef(uiEvents);
  const [snoozeNotifications, setSnoozeNotifications] = React.useState(false);

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

  return (
    <Button
      icon={
        <NotificationIcon snoozeNotifications={snoozeNotifications} hasNewNotifications={false} />
      }
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
  errorBoundary: (err, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }
    return <Icon icon={<ExclamationTriangleIcon />} />;
  },
});
