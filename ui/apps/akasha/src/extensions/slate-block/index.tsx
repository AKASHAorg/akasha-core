import * as React from 'react';
import { SlateEditorBlock } from './slate-editor-block';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { withProviders } from '@akashaorg/ui-awf-hooks';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import {
  BlockInstanceMethods,
  ContentBlockRootProps,
  RootComponentProps,
} from '@akashaorg/typings/lib/ui';

const SlateBlockExtension = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  return <SlateEditorBlock {...props} />;
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders<ContentBlockRootProps>(SlateBlockExtension),
  errorBoundary: (err, errorInfo, props: RootComponentProps & ContentBlockRootProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }

    return <ErrorLoader type="script-error" title="Error in slate-block" details={err.message} />;
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
