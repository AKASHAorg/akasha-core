import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { RootExtensionProps } from '@akashaorg/typings/ui';
import DS from '@akashaorg/design-system';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { withProviders, ThemeWrapper } from '@akashaorg/ui-awf-hooks';
import menuRoute, { DEV_KEYS } from '../routes';

const { BasicCardBox, Box, Button, ModalContainer, Text, Icon, ErrorLoader } = DS;

const DeleteDevKeyModal = (props: RootExtensionProps) => {
  const { t } = useTranslation('app-profile');
  const location = useLocation();

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };

  const handleDelete = () => {
    /** do the delete */

    props.plugins['@akashaorg/app-routing']?.routing?.navigateTo?.({
      appName: '@akashaorg/app-profile',
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
            {t('Are you sure you wish to delete this key')}
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
  ReactDOM,
  rootComponent: withProviders(Wrapped),
  renderType: 'createRoot',
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
