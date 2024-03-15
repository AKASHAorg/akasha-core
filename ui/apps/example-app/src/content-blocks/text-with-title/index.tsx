import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOMClient from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { useRootComponentProps, withProviders } from '@akashaorg/ui-awf-hooks';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';

import {
  BlockInstanceMethods,
  ContentBlockModes,
  ContentBlockRootProps,
  RootComponentProps,
} from '@akashaorg/typings/lib/ui';

import TextBlockEditor from './text-block-editor';
import TextBlockRenderer from './text-block-renderer';

const TextBlock = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  const { getTranslationPlugin } = useRootComponentProps();
  return (
    <I18nextProvider i18n={getTranslationPlugin().i18n}>
      {props.blockInfo.mode === ContentBlockModes.EDIT && <TextBlockEditor {...props} />}
      {props.blockInfo.mode === ContentBlockModes.READONLY && <TextBlockRenderer {...props} />}
    </I18nextProvider>
  );
};

export const { bootstrap, mount, unmount } = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: withProviders<ContentBlockRootProps>(TextBlock),
  errorBoundary: (err, errorInfo, props: RootComponentProps & ContentBlockRootProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }

    return <ErrorLoader type="script-error" title="Error in text-block" details={err.message} />;
  },
});
