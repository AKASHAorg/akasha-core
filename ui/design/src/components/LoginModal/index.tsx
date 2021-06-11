import * as React from 'react';
import { Button } from 'grommet';
import { createGlobalStyle } from 'styled-components';

import EthProviderModal from './eth-provider-modal';
import EthProviderListModal from './eth-provider-list-modal';
import EthProviderModalIllustration from './eth-provider-modal-illustration';

import Icon from '../Icon';
import ErrorLoader from '../ErrorLoader';
import { ModalRenderer } from './modal-renderer';
import { ModalContainer } from './fullscreen-modal-container';
import ViewportSizeProvider, { useViewportSize } from '../Providers/viewport-dimension';

export interface LoginModalProps {
  slotId: string;
  onLogin: (providerId: number) => void;
  showModal: boolean;
  showSignUpModal?: {
    inviteToken: string | null;
    status: boolean;
  };
  onInputTokenChange?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  validateTokenFn?: (ev: any) => void;
  submitted?: boolean;
  submitting?: boolean;
  success?: boolean;
  hasError?: boolean;
  errorMsg?: string;
  onModalClose: () => void;
  titleLabel: string;
  subtitleLabel?: string;
  headerLabel?: string;
  acceptedTerms?: boolean;
  checkedTermsValues?: string[];
  onAcceptTerms?: (ev: any) => void;
  onCheckedTermsValues?: (ev: any) => void;
  waitForCheckTerms?: boolean;
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

const LoginModal: React.FC<LoginModalProps> = props => {
  const {
    showModal,
    showSignUpModal,
    onModalClose,
    onLogin,
    metamaskModalHeadline,
    metamaskModalMessage,
    titleLabel,
    onInputTokenChange,
    validateTokenFn,
    submitted,
    submitting,
    success,
    hasError,
    errorMsg,
    subtitleLabel,
    headerLabel,
    acceptedTerms,
    checkedTermsValues,
    onAcceptTerms,
    onCheckedTermsValues,
    waitForCheckTerms,
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
      <ModalRenderer slotId={props.slotId}>
        {showModal && !modalState.selectedProvider && (
          <EthProviderListModal
            titleLabel={titleLabel}
            subtitleLabel={subtitleLabel}
            headerLabel={headerLabel}
            onProviderClick={handleProviderClick}
            onModalClose={handleProvidersModalClose}
            showSignUp={showSignUpModal}
            onChange={onInputTokenChange}
            submitted={submitted}
            submitting={submitting}
            success={success}
            hasError={hasError}
            errorMsg={errorMsg}
            acceptedTerms={acceptedTerms}
            validateTokenFn={validateTokenFn}
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
            checkedTermsValues={checkedTermsValues}
            onAcceptTerms={onAcceptTerms}
            onCheckedTermsValues={onCheckedTermsValues}
            waitForCheckTerms={waitForCheckTerms}
          />
        )}
        {suggestSignUp && showModal && !showSignUpModal?.status && (
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
        {showModal && !suggestSignUp && modalState.selectedProvider === METAMASK_PROVIDER && (
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
        {showModal && !suggestSignUp && modalState.selectedProvider === WALLETCONNECT_PROVIDER && (
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
