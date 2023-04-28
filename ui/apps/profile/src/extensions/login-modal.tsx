import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { I18nextProvider, useTranslation } from 'react-i18next';

import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import ModalContainer from '@akashaorg/design-system-core/lib/components/ModalContainer';

import { RootExtensionProps } from '@akashaorg/typings/ui';
import { withProviders } from '@akashaorg/ui-awf-hooks';

const LoginModal = (props: RootExtensionProps) => {
  const { t } = useTranslation('app-profile');
  const location = useLocation();

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };

  const handleConnectClick = () => {
    props.plugins['@akashaorg/app-routing']?.routing?.navigateTo?.({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: appRoutes => {
        const redirectTo = new URLSearchParams(location.search).get('redirectTo');
        return `${appRoutes.Connect}?${new URLSearchParams({
          redirectTo: redirectTo || location.pathname,
        }).toString()}`;
      },
    });
  };

  return (
    <ModalContainer onModalClose={handleModalClose}>
      <BasicCardBox style="py-3 px-6 md:px-24">
        <Box customStyle={`flex flex-row justify-end`}>
          <button onClick={handleModalClose}>
            <Icon type="XMarkIcon" color={{ light: 'grey7', dark: 'grey4' }} />
          </button>
        </Box>

        <Box customStyle="flex flex-col items-center" data-testid="modal-card-login">
          <Box customStyle="flex flex-col items-center w-full gap-y-2">
            <Text variant="h6">{t('Ethereum World')}</Text>
            <Text variant="body1" align="center">
              {t('To continue you need an Ethereum World account')}
            </Text>
          </Box>
          <Box customStyle="flex flex-row items-center justify-center gap-x-2 w-full pt-4">
            <Button onClick={handleModalClose} label={t('Cancel')} />
            <Button onClick={handleConnectClick} label={t('Connect')} variant="primary" />
          </Box>
        </Box>
      </BasicCardBox>
    </ModalContainer>
  );
};

const Wrapped = (props: RootExtensionProps) => (
  <Router>
    <React.Suspense fallback={<></>}>
      <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
        <LoginModal {...props} />
      </I18nextProvider>
    </React.Suspense>
  </Router>
);

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(Wrapped),
  renderType: 'createRoot',
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
