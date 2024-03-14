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
import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import {
  RootExtensionProps,
  MenuItemAreaType,
  NotificationEvents,
  type NotificationEvent,
  NotificationTypes,
} from '@akashaorg/typings/lib/ui';

const SnackBarNotification: React.FC<RootExtensionProps> = () => {
  const { uiEvents, getRoutingPlugin } = useRootComponentProps();
  const [message, setMessage] = useState('');
  const [appTitle, setAppTitle] = useState(null);
  const [messageType, setMessageType] = useState(NotificationTypes.Success);

  const [routeData, setRouteData] = useState(null);
  const mutationEvents = useListenForMutationEvents();

  const [messageUuid, setMessageUuid] = useState('');

  let timeoutHandle;

  if (message) {
    timeoutHandle = setTimeout(() => {
      setMessage('');
    }, 8000);
  }

  React.useEffect(() => {
    if (!message) {
      setMessageType(NotificationTypes.Success);
      setMessageUuid('');
      setAppTitle(null);
    }
  }, [message]);

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

  React.useEffect(() => {
    if (mutationEvents) {
      const { messageObj, appid, success, pending } = mutationEvents;

      if (messageUuid !== appid) {
        clearTimeout(timeoutHandle);

        setMessageUuid(appid);
        setMessage('');
        setAppTitle(messageObj?.app);
      }
      if (pending && messageObj?.pending) {
        setMessage(messageObj?.pending);
        setMessageType(NotificationTypes.Info);
      }
      if (success && messageObj?.success) {
        setMessage(messageObj?.success);
        setMessageType(NotificationTypes.Success);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutationEvents]);

  useEffect(() => {
    const eventsSub = uiEvents.pipe(filterEvent(NotificationEvents.ShowNotification)).subscribe({
      next: (eventInfo: NotificationEvent) => {
        if (eventInfo.data && hasOwn(eventInfo.data, 'message')) {
          setMessage(eventInfo.data.message);
          setMessageType(eventInfo.data.type);
        }
      },
    });

    return () => {
      if (eventsSub) {
        eventsSub.unsubscribe();
      }
    };
  }, []);

  const dismissHandler = () => {
    setMessage('');
    setMessageType(NotificationTypes.Success);
  };

  const findAppIcon = (appName: string) => {
    return defaultInstalledApps?.find(app => app.name === appName);
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
      {message && (
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
              message
            )
          }
          description={appTitle ? message : null}
          type={messageType}
          handleDismiss={dismissHandler}
        />
      )}
    </Stack>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: withProviders(SnackBarNotification),
  errorBoundary: (error, errorInfo, props: RootExtensionProps) => {
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

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
