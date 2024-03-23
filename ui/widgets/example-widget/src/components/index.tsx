import React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOMClient from 'react-dom/client';
import { withProviders } from '@akashaorg/ui-awf-hooks';
import type { RootComponentProps } from '@akashaorg/typings/lib/ui';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import ExampleWidget from './example-widget';

export const { bootstrap, mount, unmount } = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: withProviders(ExampleWidget),
  errorBoundary: (error, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${error.message} -> ${errorInfo.componentStack}`);
    }
    return (
      <ErrorLoader type="script-error" title="Error in layout widget" details={error.message} />
    );
  },
});
