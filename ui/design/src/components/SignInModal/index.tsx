import * as React from 'react';
import { Button } from 'grommet';
import { createGlobalStyle } from 'styled-components';

import EthProviderModal from './eth-provider-modal';
import EthProviderListModal from './eth-provider-list-modal';
import EthProviderModalIllustration from './eth-provider-modal-illustration';

import Icon from '../Icon';
import ErrorLoader from '../ErrorLoader';
import { ModalContainer } from './fullscreen-modal-container';
import ViewportSizeProvider, { useViewportSize } from '../Providers/viewport-dimension';

export interface SignInModalProps {
  onLogin: (providerId: number) => void;
  onModalClose: () => void;
  titleLabel: string;
  subtitleLabel?: string;
  headerLabel?: string;
  suggestSignUp?: boolean;
  suggestedSignUpFn?: () => void;
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

const SignInModal: React.FC<SignInModalProps> = props => {
  const {
    onModalClose,
    onLogin,
    metamaskModalHeadline,
    metamaskModalMessage,
    titleLabel,
    suggestSignUp,
    suggestedSignUpFn,
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

  const handleSignUpClick = () => {
    handleProviderModalClose();
    if (suggestedSignUpFn) {
      suggestedSignUpFn();
    }
  };

  return (
    <ViewportSizeProvider>
      <>
        {!modalState.selectedProvider && (
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
        {suggestSignUp && (
          <ModalContainer onModalClose={handleProviderModalClose}>
            <ErrorLoader
              type="not-registered"
              title={'No account associated with this Ethereum address'}
              details={'Please sign up to create an Ethereum World account'}
              style={{ padding: '1em 3em' }}
            >
              <Button
                primary={true}
                label={'Sign Up'}
                style={{ borderRadius: '3px', color: '#fff' }}
                onClick={handleSignUpClick}
              />
            </ErrorLoader>
          </ModalContainer>
        )}
        {!suggestSignUp && modalState.selectedProvider === METAMASK_PROVIDER && (
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
        {!suggestSignUp && modalState.selectedProvider === WALLETCONNECT_PROVIDER && (
          <WalletConnectModalTrigger onLogin={handleWalletConnectLogin} />
        )}
      </>
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

export default SignInModal;
