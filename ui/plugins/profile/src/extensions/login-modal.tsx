import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const { Box, Button, ModalContainer, ModalRenderer } = DS;

const LoginModal = (props: RootComponentProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };

  const handleSignInClick = () => {
    props.navigateToModal({ name: 'signin' });
  };

  const handleSignUpClick = () => {
    props.navigateToModal({ name: 'signup' });
  };

  return (
    <ModalRenderer slotId={props.layoutConfig.modalSlotId}>
      <ModalContainer onModalClose={handleModalClose}>
        <Box direction="row" align="center" gap="small" fill="horizontal">
          <Button onClick={handleSignInClick} label={t('Sign In')} fill="horizontal" />
          <Button
            primary={true}
            onClick={handleSignUpClick}
            label={t('Sign Up')}
            fill="horizontal"
          />
        </Box>
      </ModalContainer>
    </ModalRenderer>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: LoginModal,
  errorBoundary: (err, errorInfo, props) => {
    if (props.logger) {
      props.logger('Error: %s; Info: %s', err, errorInfo);
    }
    return <div>!</div>;
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
