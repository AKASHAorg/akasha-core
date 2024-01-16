import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import App from './app';
import { RootComponentProps } from '@akashaorg/typings/lib/ui';
import { useRootComponentProps, withProviders } from '@akashaorg/ui-awf-hooks';

const RootComponent = () => {
  const { baseRouteName } = useRootComponentProps();
  return <App baseRouteName={baseRouteName} />;
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(RootComponent),
  errorBoundary: (error, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
    }
    return <ErrorLoader type="script-error" title="Error in profile app" details={error.message} />;
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
