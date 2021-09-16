import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { useErrors, withProviders } from '@akashaproject/ui-awf-hooks';
import getSDK from '@akashaproject/awf-sdk';
import { lastValueFrom } from 'rxjs';
import { ModalNavigationOptions } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { useGetLogin } from '@akashaproject/ui-awf-hooks/lib/use-login.new';

const { SignUpModal } = DS;

const SignUpModalContainer = (props: RootComponentProps) => {
  const { t } = useTranslation();

  const sdk = getSDK();

  const { logger } = props;

  const [inviteToken, setInviteToken] = React.useState<string | null>(null);
  const [, errorActions] = useErrors({ logger });

  const loginQuery = useGetLogin({ onError: errorActions.createError });

  const [inviteTokenForm, setinviteTokenForm] = React.useState<{
    submitted: boolean;
    submitting: boolean;
    success: boolean;
    hasError: boolean;
    errorMsg: string;
  }>({
    submitted: false,
    submitting: false,
    success: false,
    hasError: false,
    errorMsg: '',
  });
  const [termsState, setTermsState] = React.useState<{
    waitForCheckTerms: boolean;
    checkedTermsValues: string[];
    acceptedTerms: boolean;
  }>({
    waitForCheckTerms: true,
    checkedTermsValues: [],
    acceptedTerms: false,
  });

  const handleSignUpModalClose = React.useCallback(() => {
    props.singleSpa.navigateToUrl(location.pathname);
    _handleModalClose();
    errorActions.removeLoginErrors();
  }, []);

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
        setTimeout(() => handleSignUpModalClose(), 500);
      }
    }
  }, [loginQuery.data?.ethAddress, props, props.navigateToModal, handleSignUpModalClose]);

  const _handleModalClose = () => {
    setInviteToken(null);
  };

  const onInputTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setinviteTokenForm({
      submitted: false,
      submitting: false,
      success: false,
      hasError: false,
      errorMsg: '',
    });
    setInviteToken(e.target.value);
  };
  const triggerInviteValidation = () => {
    if (inviteToken?.length && inviteToken?.length === 24) {
      checkIsValidToken();
    }
  };
  const checkIsValidToken = () => {
    setinviteTokenForm({
      submitted: false,
      submitting: true,
      success: false,
      hasError: false,
      errorMsg: '',
    });
    lastValueFrom(sdk.api.auth.validateInvite(inviteToken))
      .then(() => {
        setinviteTokenForm({
          submitted: true,
          submitting: false,
          success: true,
          hasError: false,
          errorMsg: '',
        });
      })
      .catch((err: Error) => {
        setinviteTokenForm({
          submitted: true,
          submitting: false,
          success: false,
          hasError: true,
          errorMsg: err.message,
        });
      });
  };

  const validateTokenFn = (e: MouseEvent) => {
    e.preventDefault();
    checkIsValidToken();
  };

  const onCheckedTermsValues = (e: { value: string[] }) => {
    setTermsState(prevState => {
      return {
        ...prevState,
        checkedTermsValues: e.value,
      };
    });
  };
  const onAcceptTerms = () => {
    setTermsState(prevState => {
      return {
        ...prevState,
        acceptedTerms: true,
      };
    });
    localStorage.setItem('@acceptedTermsAndPrivacy', new Date().toISOString());
    props.navigateToModal({ name: 'signin', redirectTo: props.activeModal.redirectTo });
  };
  const activateAcceptButton = () => {
    setTermsState(prevState => {
      return {
        ...prevState,
        waitForCheckTerms: !(termsState.checkedTermsValues.length === 2),
      };
    });
  };
  React.useEffect(() => {
    setInviteToken(localStorage.getItem('@signUpToken'));
  }, []);
  React.useEffect(triggerInviteValidation, [inviteToken]);
  React.useEffect(activateAcceptButton, [termsState.checkedTermsValues]);

  return (
    <SignUpModal
      inviteToken={inviteToken}
      submitted={inviteTokenForm.submitted}
      submitting={inviteTokenForm.submitting}
      success={inviteTokenForm.success}
      hasError={inviteTokenForm.hasError}
      errorMsg={inviteTokenForm.errorMsg}
      onModalClose={handleSignUpModalClose}
      subtitleLabel={t('Please enter your invitation code')}
      headerLabel={t('Sign Up')}
      onChange={onInputTokenChange}
      validateTokenFn={validateTokenFn}
      onAcceptTerms={onAcceptTerms}
      onCheckedTermsValues={onCheckedTermsValues}
      waitForCheckTerms={termsState.waitForCheckTerms}
      checkedTermsValues={termsState.checkedTermsValues}
      acceptedTerms={termsState.acceptedTerms}
    />
  );
};

const Wrapped = (props: RootComponentProps) => (
  <Router>
    <React.Suspense fallback={<></>}>
      <SignUpModalContainer {...props} />
    </React.Suspense>
  </Router>
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

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
