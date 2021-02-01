import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { useErrors, useLoginState } from '@akashaproject/ui-awf-hooks';

const { LoginCTAWidgetCard, LoginModal } = DS;

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

  const handleLoginModalOpen = () => {
    setLoginModal(true);
  };

  const handleLogin = (provider: 2 | 3) => {
    loginActions.login(provider);
  };

  const handleLoginModalClose = () => {
    setLoginModal(false);
  };

  const handleTutorialLinkClick = () => {
    /* goto tutorials */
  };

  if (loginState.ethAddress) {
    return null;
  }

  return (
    <>
      <LoginCTAWidgetCard
        title={`🚀 ${t('Enter your world of Ethereum!')}`}
        textContent={t(
          'Connect an Ethereum address from your wallet to open a new world of interactions!',
        )}
        connectLabel={t('Sign Up')}
        onLoginClick={handleLoginModalOpen}
        inlineActions={true}
      />
      <LoginModal
        slotId={props.layoutConfig.modalSlotId}
        onLogin={handleLogin}
        onModalClose={handleLoginModalClose}
        showModal={loginModal}
        tutorialLinkLabel={t('Tutorial')}
        metamaskModalHeadline={t('Connecting')}
        metamaskModalMessage={t('Please complete the process in your wallet')}
        onTutorialLinkClick={handleTutorialLinkClick}
        helpText={t('What is a wallet? How do i get an Ethereum address?')}
        error={loginErrors}
      />
    </>
  );
};

export default LoginWidget;
