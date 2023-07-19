import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';

import { RootComponentProps } from '@akashaorg/typings/ui';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { withProviders } from '@akashaorg/ui-awf-hooks';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import SidebarComponent from './components/sidebar-component';

const Widget: React.FC<RootComponentProps> = props => {
  return (
    <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
      <Router>
        <SidebarComponent {...props} />
      </Router>
    </I18nextProvider>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(Widget),
  errorBoundary: (error, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
    }
    return (
      <ErrorLoader type="script-error" title="Error in sidebar widget" details={error.message} />
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
