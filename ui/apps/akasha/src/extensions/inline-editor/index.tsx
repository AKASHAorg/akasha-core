import React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';

import { RootExtensionProps } from '@akashaorg/typings/lib/ui';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { withProviders } from '@akashaorg/ui-awf-hooks';
import { I18nextProvider } from 'react-i18next';
import { InlineEditor } from './inline-editor';

const Wrapped = (props: RootExtensionProps) => {
  return (
    <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
      <InlineEditor {...props} />
    </I18nextProvider>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(Wrapped),
  errorBoundary: (err, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }

    return <ErrorLoader type="script-error" title="Error in inline editor" details={err.message} />;
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
