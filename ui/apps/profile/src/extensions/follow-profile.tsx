import React from 'react';
import ReactDOM from 'react-dom';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import FollowProfile from '../components/follow-profile';
import singleSpaReact from 'single-spa-react';
import { withProviders, ThemeWrapper } from '@akashaorg/ui-awf-hooks';
import { RootExtensionProps } from '@akashaorg/typings/ui';

const App = (props: RootExtensionProps) => {
  const { profileId, isIconButton } = props.extensionData;
  return (
    <FollowProfile
      profileId={String(profileId)}
      isIconButton={!!isIconButton}
      navigateTo={props.plugins['@akashaorg/app-routing']?.routing?.navigateTo}
    />
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(App),
  errorBoundary: (error, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
    }
    return (
      <ThemeWrapper {...props}>
        <ErrorLoader
          type="script-error"
          title="Error in share profile modal"
          details={error.message}
        />
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
