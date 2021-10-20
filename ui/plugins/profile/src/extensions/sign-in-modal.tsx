import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { withProviders } from '@akashaproject/ui-awf-hooks';
import { ModalNavigationOptions } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { useGetLogin, useLogin } from '@akashaproject/ui-awf-hooks/lib/use-login.new';
import i18n, { setupI18next } from '../i18n';

const { SignInModal } = DS;

const SignInModalContainer = (props: RootComponentProps) => {
  const acceptedTerms = React.useMemo(() => {
    return localStorage.getItem('@acceptedTermsAndPrivacy');
  }, []);

  const { t } = useTranslation();

  const [suggestSignUp, setSuggestSignUp] = React.useState<boolean>(false);
  const [errorMessages, setErrorMessages] = React.useState<string[]>([]);

  const loginErrorHandler = React.useCallback(
    error => {
      // @TODO: find a way to avoid this
      if (error.message === 'Profile not found' && !acceptedTerms) {
        setSuggestSignUp(true);
      }
      setErrorMessages(prev => [...prev, error.message]);
    },
    [acceptedTerms],
  );

  const loginQuery = useGetLogin();
  const loginMutation = useLogin(loginErrorHandler);

  const handleModalClose = React.useCallback(() => {
    setSuggestSignUp(false);
    props.singleSpa.navigateToUrl(location.pathname);
    loginMutation.reset();
  }, [props.singleSpa, loginMutation]);

  React.useEffect(() => {
    if (loginQuery.data?.ethAddress) {
      if (
        props.activeModal.hasOwnProperty('redirectTo') &&
        typeof props.activeModal.redirectTo === 'object'
      ) {
        const navigationOptions = props.activeModal.redirectTo;
        if (navigationOptions.hasOwnProperty('name')) {
          // after the validations above it is safe to pass it as ModalNavigationOptions type
          props.navigateToModal(navigationOptions as ModalNavigationOptions);
        }
      } else {
        handleModalClose();
      }
    }
  }, [loginQuery.data?.ethAddress, props, props.navigateToModal, handleModalClose]);

  const handleLogin = (providerId: number) => {
    // loginActions.login(providerId, !acceptedTerms);
    loginMutation.mutate({ selectedProvider: providerId, checkRegistered: !acceptedTerms });
  };

  const handleSignUpClick = () => {
    props.navigateToModal({ name: 'signup', redirectTo: props.activeModal.redirectTo });
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
      error={errorMessages.join('\n')}
    />
  );
};

const Wrapped = (props: RootComponentProps) => (
  <React.Suspense fallback={<></>}>
    <I18nextProvider i18n={i18n}>
      <SignInModalContainer {...props} />
    </I18nextProvider>
  </React.Suspense>
);

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(Wrapped),
  errorBoundary: (err, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(err)}, ${errorInfo}`);
    }
    return <div>!</div>;
  },
});

export const bootstrap = (props: RootComponentProps) => {
  return setupI18next({
    logger: props.logger,
    // must be the same as the one in ../../i18next.parser.config.js
    namespace: 'ui-plugin-profile',
  });
};

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
