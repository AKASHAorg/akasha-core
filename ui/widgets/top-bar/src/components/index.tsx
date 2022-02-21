import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import Widget from './topbar-widget';
import { withProviders } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import DS from '@akashaproject/design-system';

const { Icon, ThemeSelector, lightTheme, darkTheme } = DS;

const reactLifecycles = singleSpaReact<RootComponentProps>({
  React,
  ReactDOM,
  rootComponent: withProviders(Widget),
  errorBoundary: (error, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
    }
    return (
      <ThemeSelector
        availableThemes={[lightTheme, darkTheme]}
        settings={{ activeTheme: 'LightTheme' }}
      >
        <Icon type="error" size="lg" />
      </ThemeSelector>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
