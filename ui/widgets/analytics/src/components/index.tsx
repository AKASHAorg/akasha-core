import singleSpaReact from 'single-spa-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { withProviders } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';
import CookieWidget from './cookie-widget';

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(CookieWidget),
  renderType: 'createRoot',
  errorBoundary: (err, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(err)}, ${errorInfo}`);
    }
    return <div>!</div>;
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
