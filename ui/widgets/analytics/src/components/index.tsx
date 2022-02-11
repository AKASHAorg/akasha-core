import singleSpaReact from 'single-spa-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { withProviders } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import CookieWidget from './cookie-widget';

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(CookieWidget),
  errorBoundary: (err, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(err)}, ${errorInfo}`);
    }
    return <div>!</div>;
  },
});

export const bootstrap = async (props: RootComponentProps) => {
  await props.i18next.loadNamespaces(['ui-widget-analytics']);
  return Promise.resolve();
};

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
