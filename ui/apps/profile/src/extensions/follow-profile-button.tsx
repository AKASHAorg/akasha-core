import React from 'react';
import ReactDOMClient from 'react-dom/client';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import singleSpaReact from 'single-spa-react';
import FollowProfileButton from '../components/follow-profile-button';
import { useRootComponentProps, withProviders } from '@akashaorg/ui-awf-hooks';
import { ModalNavigationOptions, RootExtensionProps } from '@akashaorg/typings/lib/ui';
import { I18nextProvider } from 'react-i18next';

type FollowProfileButtonExtensionData = {
  profileID?: string;
  isLoggedIn: boolean;
  isFollowing: boolean;
  followId: string;
};

const App = (props: RootExtensionProps<FollowProfileButtonExtensionData>) => {
  const { navigateToModal, extensionData } = props;
  const { profileID, isLoggedIn, isFollowing, followId } = extensionData;
  const { getTranslationPlugin } = useRootComponentProps();
  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    navigateToModal({
      name: 'login',
      redirectTo,
    });
  };

  return (
    <I18nextProvider i18n={getTranslationPlugin().i18n}>
      <FollowProfileButton
        profileID={profileID}
        isLoggedIn={isLoggedIn}
        isFollowing={!!isFollowing}
        followId={followId}
        showLoginModal={showLoginModal}
      />
    </I18nextProvider>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient,
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
        title="Error in follow profile button"
        details={error.message}
      />
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const update = reactLifecycles.update;

export const unmount = reactLifecycles.unmount;
