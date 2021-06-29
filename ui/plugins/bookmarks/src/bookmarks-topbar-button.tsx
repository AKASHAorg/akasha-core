import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { rootRoute } from './routes';

const BookmarksTopbarButton = (props: RootComponentProps) => {
  return <button onClick={() => props.singleSpa.navigateToUrl(rootRoute)}>Bookmarks</button>;
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: BookmarksTopbarButton,
  errorBoundary: (err, errorInfo, props) => {
    if (props.logger) {
      props.logger('Error: %s; Info: %s', err, errorInfo);
    }
    return <div>!</div>;
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
