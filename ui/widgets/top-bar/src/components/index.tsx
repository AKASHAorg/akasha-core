import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import Widget from './topbar-widget';
import { ThemeWrapper, withProviders } from '@akashaproject/ui-awf-hooks';
import { setupI18next } from '../i18n';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import DS from '@akashaproject/design-system';

const { Icon } = DS;

const reactLifecycles = singleSpaReact<RootComponentProps>({
  React,
  ReactDOM,
  rootComponent: withProviders(Widget),
  errorBoundary: (error, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
    }
    return (
      <ThemeWrapper {...props}>
        <Icon type="error" size="lg" />
      </ThemeWrapper>
    );
  },
});

export const bootstrap = (props: RootComponentProps) => {
  return setupI18next({
    logger: props.logger,
    // must be the same as the one in ../../i18next.parser.config.js
    namespace: 'ui-widget-topbar',
  });
};

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
