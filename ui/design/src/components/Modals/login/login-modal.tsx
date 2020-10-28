import * as React from 'react';
import { createGlobalStyle } from 'styled-components';
import { Box, Text } from 'grommet';
import { ModalRenderer } from '../common/modal-renderer';
import { EthProviderListModal, EthProviderModal, EthProviderModalIllustration } from '../index';
// import { IconLink } from '../../Buttons';
import { TextIcon } from '../../TextIcon';
import { Icon } from '../../Icon';

export interface LoginModalProps {
  slotId: string;
  onLogin: (providerId: number) => void;
  showModal: boolean;
  onModalClose: () => void;
  /**
   * placed at the bottom of the provider list modal
   */
  tutorialLinkLabel: string;
  /**
   * handler for tutorial link (tutorialLinkLabel) click
   */
  onTutorialLinkClick: () => void;
  /**
   * text to be displayed when the user selects to login with metamask
   */
  metamaskModalHeadline: string;
  /**
   * additional message to be displayed when the user selects to login with metamask
   */
  metamaskModalMessage: string;
  /**
   * helpText to be displayed at the bottom of the providerList
   * modal
   */
  helpText: string;
}

const METAMASK_PROVIDER = 'metamask';
const WALLETCONNECT_PROVIDER = 'walletconnect';

const ETH_PROVIDERS = {
  [METAMASK_PROVIDER]: 2,
  [WALLETCONNECT_PROVIDER]: 3,
};

const LoginModal: React.FC<LoginModalProps> = props => {
  const {
    showModal,
    onModalClose,
    onLogin,
    tutorialLinkLabel,
    onTutorialLinkClick,
    helpText,
    metamaskModalHeadline,
    metamaskModalMessage,
  } = props;
  const [modalState, setModalState] = React.useState<{ selectedProvider: string | null }>({
    selectedProvider: null,
  });

  const handleProviderClick = (providerId: string) => {
    setModalState({
      selectedProvider: providerId,
    });
  };
  const handleProvidersModalClose = () => {
    setModalState({
      selectedProvider: null,
    });
    onModalClose();
  };
  const handleMetamaskLogin = () => {
    onLogin(ETH_PROVIDERS[METAMASK_PROVIDER]);
  };
  const handleWalletConnectLogin = () => {
    onLogin(ETH_PROVIDERS[WALLETCONNECT_PROVIDER]);
  };
  const handleProviderModalClose = () => {
    setModalState({
      selectedProvider: null,
    });
    onModalClose();
  };

  return (
    <ModalRenderer slotId={props.slotId}>
      {showModal && !modalState.selectedProvider && (
        <EthProviderListModal
          onProviderClick={handleProviderClick}
          onModalClose={handleProvidersModalClose}
          providers={[
            {
              id: METAMASK_PROVIDER,
              logo: <Icon type="metamask" size="xl" />,
              title: 'MetaMask',
              description: 'Connect to your MetaMask wallet',
            },
            {
              id: WALLETCONNECT_PROVIDER,
              logo: <Icon type="walletconnect" size="xl" />,
              title: 'WalletConnect',
              description: 'Scan with WalletConnect',
            },
          ]}
          footer={
            <Box
              direction="row"
              align="center"
              justify="center"
              pad={{ top: 'xsmall' }}
              gap="xsmall"
            >
              <Text textAlign="center" style={{ userSelect: 'none' }}>
                {helpText}
              </Text>
              <TextIcon
                onClick={onTutorialLinkClick}
                iconType="media"
                label={tutorialLinkLabel}
                clickable={true}
              />
            </Box>
          }
        />
      )}
      {showModal && modalState.selectedProvider === METAMASK_PROVIDER && (
        <EthProviderModal
          illustration={
            <EthProviderModalIllustration providerIcon={<Icon type="metamask" size="lg" />} />
          }
          headLine={metamaskModalHeadline}
          message={metamaskModalMessage}
          onLogin={handleMetamaskLogin}
          onModalClose={handleProviderModalClose}
        />
      )}
      {showModal && modalState.selectedProvider === WALLETCONNECT_PROVIDER && (
        <WalletConnectModalTrigger onLogin={handleWalletConnectLogin} />
      )}
    </ModalRenderer>
  );
};

export interface IWalletConnectModalProps {
  onLogin: () => void;
}

const GlobalStyle = createGlobalStyle`
  #walletconnect-wrapper {
    position: absolute;
    .walletconnect-modal__base {
      top: 0;
      transform: none;
      margin-top: 2em;
    }
  }
`;

const WalletConnectModalTrigger: React.FC<IWalletConnectModalProps> = props => {
  React.useEffect(() => {
    props.onLogin();
  }, []);

  return <GlobalStyle />;
};

export default LoginModal;
