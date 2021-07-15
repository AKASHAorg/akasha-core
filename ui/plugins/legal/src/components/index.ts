import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import App from './App';
import { withProviders } from '@akashaproject/ui-awf-hooks';

/**
 * This is the plugin's lifecycle logic
 * @todo add more docs!!
 */

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(App),
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
