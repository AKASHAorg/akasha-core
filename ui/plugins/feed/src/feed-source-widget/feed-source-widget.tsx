import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import FSW from './app';

/**
 * This is the plugin's lifecycle logic
 * @todo add more docs!!
 */

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: FSW,
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
