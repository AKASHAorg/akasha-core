import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import App from './app';
import { withProviders } from '@akashaproject/ui-awf-hooks';
import { setupI18next } from '../i18n';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

/**
 * This is the plugin's lifecycle logic
 * @todo add more docs!!
 */

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(App),
  errorBoundary: (error, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(error, errorInfo);
    }
    return <>Error in moderation app </>;
  },
});

export const bootstrap = (props: RootComponentProps) => {
  return setupI18next({
    logger: props.logger,
    // must be the same as the one in ../../i18next.parser.config.js
    namespace: 'app-moderation-ewa',
  });
};

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
