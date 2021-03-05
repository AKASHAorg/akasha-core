import * as React from 'react';
import { createGlobalStyle } from 'styled-components';
import { ModalRenderer } from '../common/modal-renderer';
import { EthProviderListModal, EthProviderModal, EthProviderModalIllustration } from '../index';
import { Icon } from '../../Icon';
import ViewportSizeProvider, { useViewportSize } from '../../Providers/viewport-dimension';

export interface LoginModalProps {
  slotId: string;
  onLogin: (providerId: number) => void;
  showModal: boolean;
  onModalClose: () => void;
  titleLabel: string;
  /**
   * text to be displayed when the user selects to login with metamask
   */
  metamaskModalHeadline: string;
  /**
   * additional message to be displayed when the user selects to login with metamask
   */
  metamaskModalMessage: string;
  error: string | null;
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
    metamaskModalHeadline,
    metamaskModalMessage,
    titleLabel,
  } = props;

  const { size } = useViewportSize();

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
    // close the modal in the state, because we
    // are no longer in control of the wallet connect modal
    setModalState({
      selectedProvider: null,
    });
    onModalClose();
  };
  const handleProviderModalClose = () => {
    setModalState({
      selectedProvider: null,
    });
    onModalClose();
  };

  return (
    <ViewportSizeProvider>
      <ModalRenderer slotId={props.slotId}>
        {showModal && !modalState.selectedProvider && (
          <EthProviderListModal
            titleLabel={titleLabel}
            onProviderClick={handleProviderClick}
            onModalClose={handleProvidersModalClose}
            providers={[
              {
                id: METAMASK_PROVIDER,
                logo: <Icon type="metamask" size="md" />,
                title: 'MetaMask',
                description: 'Connect your MetaMask wallet',
              },
              {
                id: WALLETCONNECT_PROVIDER,
                logo: <Icon type="walletconnect" size="md" />,
                title: 'WalletConnect',
                description: 'Scan with WalletConnect',
              },
            ]}
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
            error={props.error}
            isMobile={size === 'small'}
          />
        )}
        {showModal && modalState.selectedProvider === WALLETCONNECT_PROVIDER && (
          <WalletConnectModalTrigger onLogin={handleWalletConnectLogin} />
        )}
      </ModalRenderer>
    </ViewportSizeProvider>
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
