import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import DS from '@akashaproject/design-system';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import { useErrors, withProviders } from '@akashaproject/ui-awf-hooks';
import { ModalNavigationOptions } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { useGetLogin, useLogin } from '@akashaproject/ui-awf-hooks/lib/use-login.new';

const { SignInModal } = DS;

const SignInModalContainer = (props: RootComponentProps) => {
  const { logger } = props;

  const acceptedTerms = React.useMemo(() => {
    return localStorage.getItem('@acceptedTermsAndPrivacy');
  }, []);

  const { t } = useTranslation();

  const [suggestSignUp, setSuggestSignUp] = React.useState<boolean>(false);

  const [errorState, errorActions] = useErrors({ logger });

  const loginQuery = useGetLogin({ onError: errorActions.createError });
  const loginMutation = useLogin(errorActions.createError);

  const handleModalClose = React.useCallback(() => {
    props.singleSpa.navigateToUrl(location.pathname);
  }, [props.singleSpa]);

  React.useEffect(() => {
    if (loginQuery.data.ethAddress) {
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
        setTimeout(() => handleModalClose(), 500);
      }
    }
  }, [loginQuery.data.ethAddress, props, props.navigateToModal, handleModalClose]);

  const handleLogin = (providerId: number) => {
    // loginActions.login(providerId, !acceptedTerms);
    loginMutation.mutate({ selectedProvider: providerId, checkRegistered: !acceptedTerms });
  };

  const loginErrors: string | null = React.useMemo(() => {
    if (errorState && Object.keys(errorState).length) {
      return Object.keys(errorState)
        .filter(key => key.split('.')[0] === 'useLogin')
        .map(k => {
          if (errorState[k].error.message === 'Profile not found' && !acceptedTerms) {
            setSuggestSignUp(true);
          }
          return errorState[k];
        })
        .reduce((acc, errObj) => `${acc}\n${errObj.error.message}`, '');
    }
    return null;
  }, [acceptedTerms, errorState]);

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
      error={loginErrors}
    />
  );
};

const Wrapped = (props: RootComponentProps) => <SignInModalContainer {...props} />;

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

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
