import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import App from './App';
import { withProviders } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

import DS from '@akashaproject/design-system';
const { ErrorLoader, ThemeSelector, darkTheme, lightTheme } = DS;

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(App),
  errorBoundary: (error, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
    }
    return (
      <ThemeSelector
        availableThemes={[lightTheme, darkTheme]}
        settings={{ activeTheme: 'LightTheme' }}
      >
        <ErrorLoader type="script-error" title="Error in trending widget" details={error.message} />
      </ThemeSelector>
    );
  },
});

export const bootstrap = async (props: RootComponentProps) => {
  await props.i18next.loadNamespaces(['ui-widget-topbar']);
  return Promise.resolve();
};

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
