import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import { setupI18next } from '../i18n';
import LayoutWidget from './layout-widget';
import DS from '@akashaproject/design-system';

const { ErrorLoader } = DS;

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: LayoutWidget,
  errorBoundary: (error, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(error, errorInfo);
    }
    return (
      <ErrorLoader type="script-error" title="Error in layout widget" details={error.message} />
    );
  },
});

export const bootstrap = (props: RootComponentProps) => {
  return setupI18next({
    logger: props.logger,
    // must be the same as the one in ../../i18next.parser.config.js
    namespace: 'ui-widget-layout',
  });
};

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
