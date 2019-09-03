import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import App from './App';

/**
 * This is the plugin's lifecycle logic
 * @todo add more docs!!
 */

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
});

const loadTranslations = async (props: any) => {
  const defaultNS = props.i18nConfig.ns || props.name;
  return await props.i18n.loadNamespaces([...props.i18nConfig.loadNS, defaultNS]);
};

export const bootstrap = [loadTranslations, reactLifecycles.bootstrap];

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
