import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import Widget from './Sidebar-widget';

/**
 * This is the plugin's lifecycle logic
 * @todo add more docs!!
 */

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Widget
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
