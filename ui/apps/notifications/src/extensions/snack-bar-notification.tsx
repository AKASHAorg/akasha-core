import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import singleSpaReact from 'single-spa-react';
import { withProviders, filterEvents, hasOwn } from '@akashaorg/ui-awf-hooks';
import { RootExtensionProps, UIEventData, EventTypes } from '@akashaorg/typings/ui';
import Snackbar, { SnackBarType } from '@akashaorg/design-system-core/lib/components/Snackbar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

const SnackBarNotification = (props: RootExtensionProps) => {
  const { uiEvents } = props;
  const [message, setMessage] = useState('');

  if (message) {
    setTimeout(() => {
      setMessage('');
    }, 4000);
  }

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
  };

  return (
    <Stack customStyle={'-mt-12 md:mt-4 z-50 w-full'}>
      {message && (
        <Snackbar title={message} type={'success' as SnackBarType} handleDismiss={dismissHandler} />
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
