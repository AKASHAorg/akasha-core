import React from 'react';
import ReactDOM from 'react-dom';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import singleSpaReact from 'single-spa-react';
import FollowProfileButton from '../components/follow-profile-button';
import { withProviders } from '@akashaorg/ui-awf-hooks';
import { RootExtensionProps, ModalNavigationOptions } from '@akashaorg/typings/lib/ui';

const App = (props: RootExtensionProps) => {
  const { profileId, isLoggedIn, isFollowing, followId } = props.extensionData;

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    props.navigateToModal({ name: 'login', redirectTo });
  };
  return (
    <FollowProfileButton
      profileId={String(profileId)}
      isLoggedIn={!!isLoggedIn}
      isFollowing={!!isFollowing}
      followId={String(followId)}
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
