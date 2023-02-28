import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';

import DS from '@akashaorg/design-system-core';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { ThemeWrapper, withProviders } from '@akashaorg/ui-awf-hooks';

import Widget from './Sidebar-widget';

const { ErrorLoader } = DS;

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(Widget),
  renderType: 'createRoot',
  errorBoundary: (error, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
    }
    return (
      <ThemeWrapper {...props}>
        <ErrorLoader type="script-error" title="Error in sidebar widget" details={error.message} />
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
