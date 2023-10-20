import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOMClient from 'react-dom/client';
import { withProviders } from '@akashaorg/ui-awf-hooks';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import {
  BlockInstanceMethods,
  ContentBlockModes,
  ContentBlockRootProps,
  RootComponentProps,
} from '@akashaorg/typings/lib/ui';
import { ImageEditorBlock } from './image-editor-block';
import { ImageReadonlyBlock } from './image-readonly-block';

const ImageBlockExtension = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  if (props.blockInfo.mode === ContentBlockModes.EDIT) return <ImageEditorBlock {...props} />;
  if (props.blockInfo.mode === ContentBlockModes.READONLY) return <ImageReadonlyBlock {...props} />;
};

export const { bootstrap, mount, unmount } = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: withProviders<ContentBlockRootProps>(ImageBlockExtension),
  errorBoundary: (err, errorInfo, props: RootComponentProps & ContentBlockRootProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }

    return <ErrorLoader type="script-error" title="Error in slate-block" details={err.message} />;
  },
});
