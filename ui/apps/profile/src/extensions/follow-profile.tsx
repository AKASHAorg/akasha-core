import React from 'react';
import ReactDOM from 'react-dom';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import FollowProfile from '../components/follow-profile';
import singleSpaReact from 'single-spa-react';
import { withProviders } from '@akashaorg/ui-awf-hooks';
import { RootExtensionProps, ModalNavigationOptions } from '@akashaorg/typings/ui';

const App = (props: RootExtensionProps) => {
  const { profileId, isIconButton } = props.extensionData;

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    props.navigateToModal({ name: 'login', redirectTo });
  };
  return (
    <FollowProfile
      profileId={String(profileId)}
      isIconButton={!!isIconButton}
      showLoginModal={showLoginModal}
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
      <ErrorLoader
        type="script-error"
        title="Error in share profile modal"
        details={error.message}
      />
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
