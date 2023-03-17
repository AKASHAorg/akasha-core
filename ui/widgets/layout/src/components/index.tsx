import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';

import { RootComponentProps } from '@akashaorg/typings/ui';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { ThemeWrapper, withProviders } from '@akashaorg/ui-awf-hooks';

import LayoutWidget from './layout-widget';

// import whyDidYouRender from '@welldone-software/why-did-you-render';

// if (process.env.NODE_ENV !== 'production') {
//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//   });
// }

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(LayoutWidget),
  renderType: 'createRoot',
  errorBoundary: (error, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
    }
    return (
      <ThemeWrapper {...props}>
        <ErrorLoader type="script-error" title="Error in layout widget" details={error.message} />
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
