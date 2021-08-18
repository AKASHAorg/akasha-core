import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import App from './App';
import { withProviders } from '@akashaproject/ui-awf-hooks';
import { setupI18next } from '../i18n';

/**
 * This is the plugin's lifecycle logic
 * @todo add more docs!!
 */

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(App),
  errorBoundary: (err, errInfo, props) => {
    if (props.logger) {
      props.logger.error(err, errInfo);
    }
    return <></>;
  },
});

export const bootstrap = props => {
  return setupI18next({
    logger: props.logger,
    namespace: props.name.replace('@akashaproject/', ''),
  });
};

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
