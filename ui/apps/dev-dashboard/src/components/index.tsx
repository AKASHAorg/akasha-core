import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';

import { withProviders } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/typings/lib/ui';

import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';

import App from './App';

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: withProviders(App),
  errorBoundary: (error, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
    }
    return (
      <ErrorLoader type="script-error" title="Error in dev dashboard app" details={error.message} />
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
