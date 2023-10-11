import React from 'react';
import ReactDOM from 'react-dom';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import singleSpaReact from 'single-spa-react';
import FollowProfileButton from '../components/follow-profile-button';
import { withProviders } from '@akashaorg/ui-awf-hooks';
import { RootExtensionProps, ModalNavigationOptions } from '@akashaorg/typings/lib/ui';

type FollowProfileButtonExtensionData = {
  profileID: string;
  isLoggedIn: boolean;
  isFollowing: boolean;
  followId: string;
};

const App = (props: RootExtensionProps<FollowProfileButtonExtensionData>) => {
  const { profileID, isLoggedIn, isFollowing, followId } = props.extensionData;

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    props.navigateToModal({ name: 'login', redirectTo });
  };

  return (
    <FollowProfileButton
      profileID={profileID}
      isLoggedIn={isLoggedIn}
      isFollowing={!!isFollowing}
      followId={followId}
      showLoginModal={showLoginModal}
    />
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(App),
  errorBoundary: (
    error,
    errorInfo,
    props: RootExtensionProps<FollowProfileButtonExtensionData>,
  ) => {
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

export const update = reactLifecycles.update;

export const unmount = reactLifecycles.unmount;
