import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import App from './App';
import DS from '@akashaproject/design-system';
import { ThemeWrapper, withProviders } from '@akashaproject/ui-awf-hooks';

const { ErrorLoader } = DS;

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(App),
  errorBoundary: (error, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
    }
    return (
      <ThemeWrapper {...props}>
        <ErrorLoader
          type="script-error"
          title="Error in app-center plugin"
          details={error.message}
        />
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
