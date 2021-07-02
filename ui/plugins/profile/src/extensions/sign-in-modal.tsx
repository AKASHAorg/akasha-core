import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useLoginState, useErrors } from '@akashaproject/ui-awf-hooks';

const { LoginModal } = DS;

const SignInModal = (props: RootComponentProps) => {
  const { logger } = props;

  const { t } = useTranslation();
  const location = useLocation();

  const [errorState, errorActions] = useErrors({ logger });

  const [loginState, loginActions] = useLoginState({
    onError: errorActions.createError,
  });

  React.useEffect(() => {
    if (loginState.ethAddress) {
      handleModalClose();
    }
  }, [loginState.ethAddress]);

  const handleLogin = (providerId: number) => {
    loginActions.login(providerId);
  };

  const loginErrors: string | null = React.useMemo(() => {
    if (errorState && Object.keys(errorState).length) {
      const txt = Object.keys(errorState)
        .filter(key => key.split('.')[0] === 'useLoginState')
        .map(k => errorState[k])
        .reduce((acc, errObj) => `${acc}\n${errObj.error.message}`, '');
      return txt;
    }
    return null;
  }, [errorState]);

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
    errorActions.removeLoginErrors();
  };

  return (
    <LoginModal
      slotId={props.layoutConfig.modalSlotId}
      onLogin={handleLogin}
      onModalClose={handleModalClose}
      titleLabel={t('Connect a wallet')}
      metamaskModalHeadline={t('Connecting')}
      metamaskModalMessage={t('Please complete the process in your wallet')}
      error={loginErrors}
    />
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: SignInModal,
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
