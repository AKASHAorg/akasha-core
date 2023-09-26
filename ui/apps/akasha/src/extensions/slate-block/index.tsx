import * as React from 'react';
import { RootExtensionProps } from '@akashaorg/typings/lib/ui';
import { I18nextProvider } from 'react-i18next';
import { SlateEditorBlock } from './slate-editor-block';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { useRootComponentProps, withProviders } from '@akashaorg/ui-awf-hooks';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';

const SlateBlockExtension = (props: RootExtensionProps) => {
  const { getTranslationPlugin } = useRootComponentProps();
  return (
    <I18nextProvider i18n={getTranslationPlugin().i18n}>
      <SlateEditorBlock />
    </I18nextProvider>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(SlateBlockExtension),
  errorBoundary: (err, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }

    return <ErrorLoader type="script-error" title="Error in slate-block" details={err.message} />;
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
