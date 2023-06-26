import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';

import DS from '@akashaorg/design-system';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { RootExtensionProps } from '@akashaorg/typings/ui';
import { withProviders, ThemeWrapper, useDeleteDevKey } from '@akashaorg/ui-awf-hooks';

import menuRoute, { DEV_KEYS } from '../routes';

const { BasicCardBox, Box, Button, ModalContainer, Text, Icon } = DS;

const DeleteDevKeyModal = (props: RootExtensionProps) => {
  const { extensionData } = props;

  const { t } = useTranslation('app-dev-dashboard');
  const location = useLocation();

  const pubKey = React.useMemo(() => {
    if (extensionData.hasOwnProperty('pubKey') && typeof extensionData.pubKey === 'string') {
      return extensionData.pubKey;
    }
  }, [extensionData]);

  const keyName = React.useMemo(() => {
    if (extensionData.hasOwnProperty('keyName') && typeof extensionData.keyName === 'string') {
      return extensionData.keyName;
    }
  }, [extensionData]);

  const deleteKeyMutation = useDeleteDevKey();

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };

  const handleDelete = () => {
    deleteKeyMutation.mutate(pubKey);

    props.plugins['@akashaorg/app-routing']?.routing?.navigateTo?.({
      appName: '@akashaorg/app-dev-dashboard',
      getNavigationUrl: () => menuRoute[DEV_KEYS],
    });
  };

  return (
    <ModalContainer onModalClose={handleModalClose} innerStyle={{ maxWidth: '90%' }}>
      <BasicCardBox pad={{ vertical: 'large', horizontal: 'medium' }}>
        <Box width="36rem" gap="medium">
          <Box direction="row" justify="center" fill="horizontal" style={{ position: 'relative' }}>
            <Text weight="bold" size="large">
              {t('Delete a Dev Key')}
            </Text>
            <Icon
              type="close"
              color="gray"
              onClick={handleModalClose}
              style={{ position: 'absolute', right: '0.4rem' }}
              clickable
            />
          </Box>
          <Text color="gray" size="large" textAlign="center">
            {t('Are you sure you wish to delete this key')}:{' '}
            <Text size="large" weight="bold">
              {keyName}
            </Text>
          </Text>
          <Box
            direction="row"
            alignSelf="center"
            gap="small"
            fill="horizontal"
            style={{ maxWidth: '12rem' }}
          >
            <Button
              onClick={handleModalClose}
              label={t('Cancel')}
              fill="horizontal"
              hoverIndicator="accentText"
            />
            <Button primary={true} onClick={handleDelete} label={t('Delete')} fill="horizontal" />
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
      <ThemeWrapper {...props}>
        <ErrorLoader
          type="script-error"
          title="Error in delete dev key modal"
          details={err.message}
        />
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
