import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import Widget from './Sidebar-widget';
import { withProviders } from '@akashaproject/ui-awf-hooks';
import { setupI18next } from '../i18n';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(Widget),
});

export const bootstrap = (props: RootComponentProps) => {
  return setupI18next({
    logger: props.logger,
    // must be the same as the one in ../../i18next.parser.config.js
    namespace: 'ui-widget-sidebar',
  });
};

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
