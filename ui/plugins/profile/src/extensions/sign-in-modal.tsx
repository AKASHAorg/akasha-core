import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { useLoginState, useErrors } from '@akashaproject/ui-awf-hooks';

const { SignInModal, ThemeSelector, lightTheme, darkTheme } = DS;

const SignInModalContainer = (props: RootComponentProps) => {
  const { logger } = props;

  const acceptedTerms = localStorage.getItem('@acceptedTermsAndPrivacy');

  const { t } = useTranslation();
  const location = useLocation();

  const [suggestSignUp, setSuggestSignUp] = React.useState<boolean>(false);

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
    loginActions.login(providerId, !acceptedTerms);
  };

  const loginErrors: string | null = React.useMemo(() => {
    if (errorState && Object.keys(errorState).length) {
      const txt = Object.keys(errorState)
        .filter(key => key.split('.')[0] === 'useLoginState')
        .map(k => {
          if (errorState[k].error.message === 'Profile not found' && !acceptedTerms) {
            setSuggestSignUp(true);
          }
          return errorState[k];
        })
        .reduce((acc, errObj) => `${acc}\n${errObj.error.message}`, '');
      return txt;
    }
    return null;
  }, [errorState]);

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
    errorActions.removeLoginErrors();
  };

  const handleSignUpClick = () => {
    props.navigateToModal({ name: 'signup' });
  };

  return (
    <SignInModal
      onLogin={handleLogin}
      onModalClose={handleModalClose}
      suggestSignUp={suggestSignUp}
      suggestedSignUpFn={handleSignUpClick}
      titleLabel={t('Connect a wallet')}
      metamaskModalHeadline={t('Connecting')}
      metamaskModalMessage={t('Please complete the process in your wallet')}
      error={loginErrors}
    />
  );
};

const Wrapped = (props: RootComponentProps) => (
  <ThemeSelector
    availableThemes={[lightTheme, darkTheme]}
    settings={{ activeTheme: 'Light-Theme' }}
  >
    <Router>
      <SignInModalContainer {...props} />
    </Router>
  </ThemeSelector>
);

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Wrapped,
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
