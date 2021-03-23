import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { useErrors, useLoginState } from '@akashaproject/ui-awf-hooks';

const { LoginCTAWidgetCard, LoginModal, useViewportSize } = DS;

export interface ILoginWidgetProps {
  sdkModules: any;
  logger: any;
  globalChannel?: any;
  layoutConfig: {
    modalSlotId: string;
  };
}

const LoginWidget: React.FC<ILoginWidgetProps> = props => {
  const { t } = useTranslation();

  const { size } = useViewportSize();

  const [errorState, errorActions] = useErrors({ logger: props.logger });
  const [loginState, loginActions] = useLoginState({
    profileService: props.sdkModules.profiles.profileService,
    ipfsService: props.sdkModules.commons.ipfsService,
    authService: props.sdkModules.auth.authService,
    globalChannel: props.globalChannel,
    onError: errorActions.createError,
  });

  const loginErrors: string | null = React.useMemo(() => {
    if (errorState && Object.keys(errorState).length) {
      const txt = Object.keys(errorState)
        .filter(key => key.split('.')[0] === 'useLoginState')
        .map(k => errorState![k])
        .reduce((acc, errObj) => `${acc}\n${errObj.error.message}`, '');
      return txt;
    }
    return null;
  }, [errorState]);

  const [loginModal, setLoginModal] = React.useState(false);
  const [showSignUpModal, setshowSignUpModal] = React.useState<{
    inviteToken: string | null;
    status: boolean;
  }>({
    inviteToken: null,
    status: false,
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
  const handleLoginModalOpen = () => {
    setLoginModal(true);
  };

  const handleLogin = (provider: 2 | 3) => {
    loginActions.login(provider);
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
    setLoginModal(true);
  };
  const handleLoginModalClose = () => {
    setshowSignUpModal({
      inviteToken: null,
      status: false,
    });
    setLoginModal(false);
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
    props.sdkModules.auth.authService
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
  React.useEffect(triggerInviteValidation, [showSignUpModal]);
  if (loginState.ethAddress) {
    return null;
  }

  return (
    <>
      <LoginCTAWidgetCard
        title={`🚀 ${t(' Enter your world of Ethereum!')}`}
        textContent={t(
          'Connect an Ethereum address from your wallet to open a new world of interactions!',
        )}
        signInLabel={t('Sign In')}
        signUpLabel={t('Sign Up')}
        onLoginClick={handleLoginModalOpen}
        onSignUpClick={handleSignUpClick}
        inlineActions={size !== 'small'}
      />
      <LoginModal
        slotId={props.layoutConfig.modalSlotId}
        onLogin={handleLogin}
        onModalClose={handleLoginModalClose}
        showModal={loginModal}
        showSignUpModal={showSignUpModal}
        onInputTokenChange={onInputTokenChange}
        validateTokenFn={validateTokenFn}
        submitted={inviteTokenForm.submitted}
        submitting={inviteTokenForm.submitting}
        success={inviteTokenForm.success}
        hasError={inviteTokenForm.hasError}
        errorMsg={inviteTokenForm.errorMsg}
        titleLabel={t('Connect a wallet')}
        metamaskModalHeadline={t('Connecting')}
        metamaskModalMessage={t('Please complete the process in your wallet')}
        error={loginErrors}
      />
    </>
  );
};

export default LoginWidget;
