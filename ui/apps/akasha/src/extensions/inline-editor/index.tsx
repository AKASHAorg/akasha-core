import React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { RootExtensionProps } from '@akashaorg/typings/lib/ui';
import { withProviders, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { I18nextProvider } from 'react-i18next';
import { InlineEditor } from './inline-editor';
import { ReflectionEditorProps } from '../../components/reflection-editor';

const Wrapped = (props: RootExtensionProps<ReflectionEditorProps>) => {
  const { getTranslationPlugin } = useRootComponentProps();
  return (
    <I18nextProvider i18n={getTranslationPlugin().i18n}>
      <InlineEditor {...props} />
    </I18nextProvider>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(Wrapped),
  errorBoundary: (err, errorInfo, props: RootExtensionProps<ReflectionEditorProps>) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }

    return <ErrorLoader type="script-error" title="Error in inline editor" details={err.message} />;
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
