import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { useLoginState, useErrors } from '@akashaproject/ui-awf-hooks';
import getSDK from '@akashaproject/awf-sdk';
import { BrowserRouter as Router } from 'react-router-dom';

const { LoginModal, ThemeSelector, lightTheme, darkTheme } = DS;

const SignUpModal = (props: RootComponentProps) => {
  const { t } = useTranslation();
  const location = useLocation();

  const sdk = getSDK();

  const { logger } = props;

  const [suggestSignUp, setSuggestSignUp] = React.useState<boolean>(false);
  const [showSignUpModal, setshowSignUpModal] = React.useState<{
    inviteToken: string | null;
    status: boolean;
  }>({
    inviteToken: null,
    status: false,
  });
  const [errorState, errorActions] = useErrors({ logger });

  const [loginState, loginActions] = useLoginState({
    onError: errorActions.createError,
  });

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

  const handleLogin = (provider: 2 | 3) => {
    loginActions.login(provider, !showSignUpModal?.status);
  };

  const loginErrors: string | null = React.useMemo(() => {
    if (errorState && Object.keys(errorState).length) {
      const txt = Object.keys(errorState)
        .filter(key => key.split('.')[0] === 'useLoginState')
        .map(k => {
          if (errorState[k].error.name === 'UserNotRegistered') {
            setSuggestSignUp(true);
          }
          return errorState[k];
        })
        .reduce((acc, errObj) => `${acc}\n${errObj.error.message}`, '');
      return txt;
    }
    return null;
  }, [errorState]);

  React.useEffect(() => {
    if (loginState.ethAddress) {
      setTimeout(() => handleLoginModalClose(), 500);
    }
  }, [loginState.ethAddress]);

  const _handleModalClose = () => {
    setshowSignUpModal({
      inviteToken: null,
      status: false,
    });
    setSuggestSignUp(false);
    errorActions.removeLoginErrors();
  };
  const handleSignUpClick = () => {
    const state = {
      inviteToken: localStorage.getItem('@signUpToken'),
      status: true,
    };
    setshowSignUpModal(state);
    if (showSignUpModal.inviteToken) {
      triggerInviteValidation();
    }
  };

  const onInputTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setinviteTokenForm({
      submitted: false,
      submitting: false,
      success: false,
      hasError: false,
      errorMsg: '',
    });
    setshowSignUpModal({
      inviteToken: e.target.value,
      status: true,
    });
  };
  const triggerInviteValidation = () => {
    if (showSignUpModal.inviteToken?.length && showSignUpModal.inviteToken.length === 24) {
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
    sdk.api.auth
      .validateInvite(showSignUpModal.inviteToken)
      .toPromise()
      .then((_: any) => {
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
  const validateTokenFn = (e: any) => {
    e.preventDefault();
    checkIsValidToken();
  };
  const onCheckedTermsValues = (e: any) => {
    setTermsState(prevState => {
      return {
        ...prevState,
        checkedTermsValues: e.value,
      };
    });
  };
  const onAcceptTerms = (_: any) => {
    setTermsState(prevState => {
      return {
        ...prevState,
        acceptedTerms: true,
      };
    });
    localStorage.setItem('@acceptedTermsAndPrivacy', new Date().toISOString());
  };
  const activateAcceptButton = () => {
    setTermsState(prevState => {
      return {
        ...prevState,
        waitForCheckTerms: !(termsState.checkedTermsValues.length === 2),
      };
    });
  };
  React.useEffect(triggerInviteValidation, [showSignUpModal]);
  React.useEffect(activateAcceptButton, [termsState.checkedTermsValues]);

  const handleLoginModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
    _handleModalClose();
    errorActions.removeLoginErrors();
  };

  return (
    <LoginModal
      slotId={props.layoutConfig.modalSlotId}
      onLogin={handleLogin}
      showSignUpModal={showSignUpModal}
      onInputTokenChange={onInputTokenChange}
      validateTokenFn={validateTokenFn}
      submitted={inviteTokenForm.submitted}
      submitting={inviteTokenForm.submitting}
      success={inviteTokenForm.success}
      hasError={inviteTokenForm.hasError}
      errorMsg={inviteTokenForm.errorMsg}
      onModalClose={handleLoginModalClose}
      subtitleLabel={t('Please enter your invitation code')}
      headerLabel={t('Sign Up')}
      titleLabel={t('Connect a wallet')}
      metamaskModalHeadline={t('Connecting')}
      metamaskModalMessage={t('Please complete the process in your wallet')}
      error={loginErrors}
      onAcceptTerms={onAcceptTerms}
      onCheckedTermsValues={onCheckedTermsValues}
      waitForCheckTerms={termsState.waitForCheckTerms}
      checkedTermsValues={termsState.checkedTermsValues}
      acceptedTerms={termsState.acceptedTerms}
      suggestSignUp={suggestSignUp}
      suggestedSignUpFn={handleSignUpClick}
    />
  );
};

const Wrapped = (props: RootComponentProps) => (
  <ThemeSelector
    availableThemes={[lightTheme, darkTheme]}
    settings={{ activeTheme: 'Light-Theme' }}
  >
    <Router>
      <SignUpModal {...props} />
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
