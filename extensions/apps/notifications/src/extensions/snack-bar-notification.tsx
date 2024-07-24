import React, { useState, useEffect, useMemo } from 'react';
import ReactDOMClient from 'react-dom/client';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import singleSpaReact from 'single-spa-react';
import {
  withProviders,
  hasOwn,
  useRootComponentProps,
  useListenForMutationEvents,
  filterEvent,
} from '@akashaorg/ui-awf-hooks';
import {
  IRootExtensionProps,
  MenuItemAreaType,
  NotificationEvents,
  type NotificationEvent,
  NotificationTypes,
} from '@akashaorg/typings/lib/ui';
import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

const SnackBarNotification: React.FC<IRootExtensionProps> = () => {
  const { uiEvents, getRoutingPlugin } = useRootComponentProps();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ctaLabel, setCTALabel] = useState('');
  const [appTitle, setAppTitle] = useState(null);
  const [dismissable, setDismissable] = useState(true);
  const [notifType, setNotifType] = useState(NotificationTypes.Success);

  const [routeData, setRouteData] = useState(null);
  const mutationEvents = useListenForMutationEvents();

  const [currentAppId, setCurrentAppId] = useState('');

  let timeoutHandle;

  if (title) {
    timeoutHandle = setTimeout(() => {
      setTitle('');
    }, 8000);
  }

  useEffect(() => {
    if (!title) {
      setNotifType(NotificationTypes.Success);
      setDescription('');
      setCurrentAppId('');
      setAppTitle(null);
    }
  }, [title]);

  const routing = getRoutingPlugin();

  useEffect(() => {
    let sub;
    if (routing) {
      sub = routing.routeObserver.subscribe({
        next: routeData => {
          setRouteData({ ...routeData.byArea });
        },
      });
    }
    return () => {
      if (sub) {
        sub.unsubscribe();
      }
    };
  }, [routing]);

  const defaultInstalledApps = useMemo(() => {
    return routeData?.[MenuItemAreaType.AppArea];
  }, [routeData]);

  useEffect(() => {
    if (mutationEvents) {
      const { messageObj, appid, success, pending } = mutationEvents;

      if (currentAppId !== appid) {
        clearTimeout(timeoutHandle);
        setCurrentAppId(appid);
        setTitle('');
        setAppTitle(messageObj?.app);
      }
      if (pending && messageObj?.pending) {
        setTitle(messageObj?.pending);
        setNotifType(NotificationTypes.Info);
      }
      if (success && messageObj?.success) {
        setTitle(messageObj?.success);
        setNotifType(NotificationTypes.Success);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutationEvents]);

  useEffect(() => {
    const eventsSub = uiEvents.pipe(filterEvent(NotificationEvents.ShowNotification)).subscribe({
      next: (eventInfo: NotificationEvent) => {
        if (eventInfo.data && hasOwn(eventInfo.data, 'title')) {
          setTitle(eventInfo.data.title);
          setNotifType(eventInfo.data.type);
        }
        if (eventInfo.data && hasOwn(eventInfo.data, 'description')) {
          setDescription(eventInfo.data.description);
        }
        if (eventInfo.data && hasOwn(eventInfo.data, 'ctaLabel')) {
          setCTALabel(eventInfo.data.ctaLabel);
        }
        if (eventInfo.data && hasOwn(eventInfo.data, 'dismissable')) {
          setDismissable(eventInfo.data.dismissable);
        }
      },
    });

    return () => {
      if (eventsSub) {
        eventsSub.unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismissHandler = () => {
    setTitle('');
    setNotifType(NotificationTypes.Success);
  };

  const findAppIcon = (appName: string) => {
    return defaultInstalledApps?.find(({ name }) => name === appName);
  };

  const icon = (
    <AppIcon
      size="xs"
      accentColor={true}
      placeholderIcon={findAppIcon(appTitle)?.logo?.value ?? null}
    />
  );

  return (
    <Stack customStyle="z-50" fullWidth>
      {title && (
        <Snackbar
          title={
            appTitle ? (
              <Stack
                direction="row"
                align="center"
                justify="center"
                spacing="gap-x-2"
                padding={'pb-4'}
              >
                {findAppIcon(appTitle) && icon} {findAppIcon(appTitle)?.label}
              </Stack>
            ) : (
              title
            )
          }
          description={appTitle ? title : description}
          type={notifType}
          dismissable={dismissable}
          ctaLabel={ctaLabel}
          handleDismiss={dismissHandler}
          handleCTAClick={() => ({})}
        />
      )}
    </Stack>
  );
};

export const { bootstrap, mount, unmount } = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: withProviders(SnackBarNotification),
  errorBoundary: (error, errorInfo, props: IRootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
    }
    return (
      <ErrorLoader
        type="script-error"
        title="Error in snackbar notification extension"
        details={error.message}
      />
    );
  },
});
