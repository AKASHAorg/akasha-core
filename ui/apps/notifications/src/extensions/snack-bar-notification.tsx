import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import singleSpaReact from 'single-spa-react';
import {
  withProviders,
  filterEvents,
  hasOwn,
  useRootComponentProps,
  useListenForMutationEvents,
} from '@akashaorg/ui-awf-hooks';
import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import Snackbar, { SnackBarType } from '@akashaorg/design-system-core/lib/components/Snackbar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import {
  RootExtensionProps,
  UIEventData,
  EventTypes,
  MenuItemAreaType,
} from '@akashaorg/typings/lib/ui';

const SnackBarNotification = (_: RootExtensionProps) => {
  const { uiEvents, plugins } = useRootComponentProps();
  const [message, setMessage] = useState('');
  const [appTitle, setAppTitle] = useState(null);
  const [messageType, setMessageType] = useState('success');

  const [routeData, setRouteData] = useState(null);
  const mutationEvents = useListenForMutationEvents();

  const [messageUuid, setMessageUuid] = useState('');

  let timeoutHandle;

  if (message) {
    timeoutHandle = setTimeout(() => {
      setMessage('');
    }, 4000);
  }

  React.useEffect(() => {
    if (!message) {
      setMessageType('success');
      setMessageUuid('');
      setAppTitle(null);
    }
  }, [message]);

  const routing = plugins['@akashaorg/app-routing']?.routing;

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
        setMessageType('info');
      }
      if (success && messageObj?.success) {
        setMessage(messageObj?.success);
        setMessageType('success');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutationEvents]);

  useEffect(() => {
    const eventsSub = uiEvents.pipe(filterEvents([EventTypes.ShowNotification])).subscribe({
      next: (eventInfo: UIEventData) => {
        if (eventInfo.event === EventTypes.ShowNotification) {
          if (eventInfo.data && hasOwn(eventInfo.data, 'message')) {
            setMessage(eventInfo.data.message as string);
          }
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
    setMessageType('success');
  };

  const findAppIcon = (appName: string) => {
    return defaultInstalledApps?.find(app => app.name === appName);
  };

  const icon = (
    <AppIcon
      size="md"
      accentColor={true}
      placeholderIconType={findAppIcon(appTitle)?.logo?.value ?? null}
    />
  );

  return (
    <Stack customStyle={'-mt-12 md:mt-4 z-50 w-full'}>
      {message && (
        <Snackbar
          title={
            <Stack direction="row" align="center" justify="center" spacing="gap-x-2">
              {appTitle && findAppIcon(appTitle) && icon} {findAppIcon(appTitle)?.label}
            </Stack>
          }
          description={message}
          type={messageType as SnackBarType}
          handleDismiss={dismissHandler}
        />
      )}
    </Stack>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(SnackBarNotification),
  errorBoundary: (error, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
    }
    return (
      <ErrorLoader
        type="script-error"
        title="Error in share profile modal"
        details={error.message}
      />
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
