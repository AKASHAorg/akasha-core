import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';

import { RootExtensionProps } from '@akashaorg/typings/lib/ui';
import { withProviders } from '@akashaorg/ui-awf-hooks';

import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Modal from '@akashaorg/design-system-core/lib/components/Modal';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import menuRoute, { DEV_KEYS } from '../routes';

const DeleteDevKeyModal = (props: RootExtensionProps) => {
  const { extensionData, plugins, singleSpa } = props;

  const [showModal, setShowModal] = useState(true);

  const { t } = useTranslation('app-dev-dashboard');
  const location = useLocation();

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const keyName = React.useMemo(() => {
    if (extensionData.hasOwnProperty('keyName') && typeof extensionData.keyName === 'string') {
      return extensionData.keyName;
    }
  }, [extensionData]);

  // @TODO: needs update
  const deleteKeyMutation = {
    isSuccess: false,
    data: null,
    isError: false,
    error: null,
    mutate: () => null,
  };

  const handleModalClose = () => {
    setShowModal(false);
    singleSpa.navigateToUrl(location.pathname);
  };

  const handleDelete = () => {
    deleteKeyMutation.mutate();

    setShowModal(false);
    navigateTo?.({
      appName: '@akashaorg/app-dev-dashboard',
      getNavigationUrl: () => menuRoute[DEV_KEYS],
    });
  };

  return (
    <Modal
      show={showModal}
      title={{ label: t('Deleting a Dev Key'), variant: 'h5' }}
      actions={[
        { label: 'Cancel', variant: 'secondary', onClick: handleModalClose },
        { label: 'Delete', variant: 'primary', onClick: handleDelete },
      ]}
      onClose={handleModalClose}
    >
      <Text align="center">{`${t('Are you sure you wish to delete')} "${keyName}"?`}</Text>

      {/* <Card padding={16}>
        <Stack spacing="gap-y-3" customStyle="w-[36rem]">
          <Stack justify="center" customStyle="relative">
            <Text variant="h5" align="center" weight="bold">
              {t('Deleting a Dev Key')}
            </Text>
            <Button plain={true} customStyle="absolute right-0" onClick={handleModalClose}>
              <Icon type="XMarkIcon" color="gray" />
            </Button>
          </Stack>

          <Text align="center">{t(`Are you sure you wish to delete "${keyName}"`)}?</Text>

          <Stack align="center" justify="center" spacing="gap-x-4">
            <Button size="sm" variant="secondary" label={t('Cancel')} onClick={handleModalClose} />

            <Button size="sm" variant="primary" label={t('Delete')} onClick={handleDelete} />
          </Stack>
        </Stack>
      </Card> */}
    </Modal>
  );
};

const Wrapped = (props: RootExtensionProps) => (
  <Router>
    <React.Suspense fallback={<></>}>
      <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
        <DeleteDevKeyModal {...props} />
      </I18nextProvider>
    </React.Suspense>
  </Router>
);

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(Wrapped),
  errorBoundary: (err, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(err)}, ${errorInfo}`);
    }
    return (
      <ErrorLoader
        type="script-error"
        title="Error in delete dev key modal"
        details={err.message}
      />
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
