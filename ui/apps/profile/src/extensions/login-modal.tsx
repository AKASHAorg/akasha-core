import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';

import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Modal from '@akashaorg/design-system-core/lib/components/Modal';

import { RootExtensionProps } from '@akashaorg/typings/lib/ui';
import { useRootComponentProps, withProviders } from '@akashaorg/ui-awf-hooks';

const LoginModal = (props: RootExtensionProps) => {
  const { t } = useTranslation('app-profile');
  const location = useLocation();
  const { getRoutingPlugin } = useRootComponentProps();
  const [showModal, setShowModal] = useState(true);

  const handleModalClose = () => {
    window.history.replaceState(null, null, location.pathname);
    setShowModal(false);
  };

  const handleConnectClick = () => {
    getRoutingPlugin().navigateTo?.(
      {
        appName: '@akashaorg/app-auth-ewa',
        getNavigationUrl: appRoutes => {
          const redirectTo = new URLSearchParams(location.search).get('redirectTo');
          return `${appRoutes.Connect}?${new URLSearchParams({
            redirectTo: redirectTo || location.pathname + location.search,
          }).toString()}`;
        },
      },
      true,
    );
    setShowModal(false);
  };

  return (
    <Modal
      show={showModal}
      title={{ label: t('AKASHA World'), variant: 'h6' }}
      actions={[
        { label: t('Cancel'), variant: 'secondary', onClick: handleModalClose },
        { label: t('Connect'), variant: 'primary', onClick: handleConnectClick },
      ]}
      onClose={handleModalClose}
      customStyle="py-4 px-6 md:px-24"
    >
      <Stack align="center" fullWidth={true} spacing="gap-y-2">
        <Text variant="body1" align="center">
          {t('To continue you need an AKASHA World account')}
        </Text>
      </Stack>
    </Modal>
  );
};

const Wrapped = (props: RootExtensionProps) => {
  const { getTranslationPlugin } = useRootComponentProps();
  return (
    <Router>
      <I18nextProvider i18n={getTranslationPlugin().i18n}>
        <LoginModal {...props} />
      </I18nextProvider>
    </Router>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(Wrapped),
  errorBoundary: (err, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(err)}, ${errorInfo}`);
    }
    return <ErrorLoader type="script-error" title="Error in login modal" details={err.message} />;
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
