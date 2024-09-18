import React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOMClient from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { useRootComponentProps, withProviders } from '@akashaorg/ui-awf-hooks';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { IModalNavigationOptions, IRootExtensionProps } from '@akashaorg/typings/lib/ui';
import FollowProfileButton from '../components/follow-profile-button';
import { FollowButtonProps } from '../components/follow-profile-button/follow-button';

type FollowProfileButtonExtensionData = Pick<FollowButtonProps, 'profileID' | 'customizeButton'>;

const Index = (props: IRootExtensionProps<FollowProfileButtonExtensionData>) => {
  const { navigateToModal, extensionData } = props;
  const { profileID, customizeButton } = extensionData;
  const { getTranslationPlugin } = useRootComponentProps();
  const showLoginModal = (redirectTo?: { modal: IModalNavigationOptions }) => {
    navigateToModal({
      name: 'login',
      redirectTo,
    });
  };

  return (
    <I18nextProvider i18n={getTranslationPlugin().i18n}>
      <FollowProfileButton
        profileID={profileID}
        showLoginModal={showLoginModal}
        customizeButton={customizeButton}
      />
    </I18nextProvider>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: withProviders(Index),
  errorBoundary: (
    error,
    errorInfo,
    props: IRootExtensionProps<FollowProfileButtonExtensionData>,
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
