import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import useGlobalLogin from '@akashaproject/ui-awf-hooks/lib/use-global-login';
import { LearnMoreTutorial } from './tutorial-modal';
import LoginWidgetIllustration from './icons/login-widget-illustration';
import { useLoginState } from '../state';

const { ModalRenderer, LoginCTAWidgetCard, LoginModal } = DS;

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
  const [state, actions] = useLoginState(props.sdkModules, props.globalChannel, props.logger);

  useGlobalLogin(
    props.globalChannel,
    data => {
      actions.updateData({
        ethAddress: data.ethAddress,
        pubKey: data.pubKey,
      });
    },
    err => {
      props.logger.error('[login-widget.tsx]: useGlobalLogin err: %j', err);
      // @TODO: handle this error!
    },
  );

  const handleTutorialModalOpen = () => {
    actions.setLearnMoreVisibility({ isVisible: true });
  };

  const handleTutorialModalClose = () => {
    actions.setLearnMoreVisibility({ isVisible: false });
  };

  const handleLoginModalOpen = () => {
    actions.setShowLoginModal({ isVisible: true });
  };
  const handleLogin = (provider: 2 | 3) => {
    actions.authorize(provider);
  };

  const handleLoginModalClose = () => {
    actions.setShowLoginModal({ isVisible: false });
  };

  const handleTutorialLinkClick = () => {
    /* goto tutorials */
  };

  if (state.data.ethAddress) {
    return null;
  }

  return (
    <>
      <LoginCTAWidgetCard
        image={
          <img
            src={LoginWidgetIllustration}
            style={{ width: '100%' }}
            title={t('Connect an Ethereum address')}
          />
        }
        title={`🚀 ${t('Enter your world of Ethereum!')}`}
        textContent={t(
          'Connect an Ethereum address from your wallet to open a new world of interactions!',
        )}
        learnMoreLabel={t('Learn More')}
        connectLabel={t('Sign Up')}
        onLearnMoreClick={handleTutorialModalOpen}
        onLoginClick={handleLoginModalOpen}
      />

      <LoginModal
        slotId={props.layoutConfig.modalSlotId}
        onLogin={handleLogin}
        onModalClose={handleLoginModalClose}
        showModal={state.data.showLoginModal}
        tutorialLinkLabel={t('Tutorial')}
        metamaskModalHeadline={t('Connecting')}
        metamaskModalMessage={t('Please complete the process in your wallet')}
        onTutorialLinkClick={handleTutorialLinkClick}
        helpText={t('What is a wallet? How do i get an Ethereum address?')}
      />

      {state.data.learnMoreVisibility && (
        <ModalRenderer slotId={props.layoutConfig.modalSlotId}>
          <LearnMoreTutorial
            onModalClose={handleTutorialModalClose}
            slides={[
              {
                title: `👨‍🚀👩‍🚀 ${t('Create your own profile on ethereum' + '.' + 'world')}`,
                content: t(
                  'Customize your appearance with 3Box and Ethereum Name Service Integrations',
                ),
              },
              { title: 'Test Title', content: 'Test Content' },
            ]}
          />
        </ModalRenderer>
      )}
    </>
  );
};

export default LoginWidget;
