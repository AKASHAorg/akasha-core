import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import EthereumIcon from './icons/ethereum-icon';

const {
  styled,
  Box,
  ModalRenderer,
  EthProviderListModal,
  EthProviderModal,
  Icon,
  Text,
  IconLink,
  createGlobalStyle,
} = DS;
interface LoginModalProps {
  slotId: string;
  onLogin: (providerId: number) => void;
  showModal: boolean;
  onModalClose: () => void;
  channels: any;
  globalChannel: any;
  logger: any;
}

const METAMASK_PROVIDER = 'metamask';
const WALLETCONNECT_PROVIDER = 'walletconnect';

const ETH_PROVIDERS = {
  [METAMASK_PROVIDER]: 2,
  [WALLETCONNECT_PROVIDER]: 3,
};
export interface IEthProviderIllustrationProps {
  providerIcon: React.ReactElement;
}
const IconCircleBg = styled.div`
  border-radius: 50%;
  background: ${props => props.theme.colors.border};
  width: 64px;
  height: 64px;
  text-align: center;
  padding: 14px 12px;
`;
const HorizontalDashedLine = styled.div`
  border-bottom: 1px dashed ${props => props.theme.colors.border};
  height: 1px;
  flex: 1;
`;
const EthProviderModalIllustration: React.FC<IEthProviderIllustrationProps> = props => (
  <Box direction="row" align="center" justify="center" margin="1.5em 0">
    <Box
      alignContent="between"
      justify="between"
      style={{ maxWidth: '67%', width: '100%', alignItems: 'center' }}
      direction="row"
    >
      <IconCircleBg>{props.providerIcon}</IconCircleBg>
      <HorizontalDashedLine />
      <EthereumIcon />
    </Box>
  </Box>
);
const LoginModal: React.FC<LoginModalProps> = props => {
  const { showModal, onModalClose, onLogin } = props;
  const [modalState, setModalState] = React.useState<{ selectedProvider: string | null }>({
    selectedProvider: null,
  });

  const { t } = useTranslation();
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
              title: t('MetaMask'),
              description: t('Connect to your MetaMask wallet'),
            },
            {
              id: WALLETCONNECT_PROVIDER,
              logo: <Icon type="walletconnect" size="xl" />,
              title: t('WalletConnect'),
              description: t('Scan with WalletConnect'),
            },
          ]}
          footer={
            <Text textAlign="center" margin={{ top: '1em' }} style={{ userSelect: 'none' }}>
              <>{t('What is a wallet? How do i get an Ethereum address?')}</>
              <IconLink
                onClick={() => {
                  /* @TODO: do something! */
                }}
                icon={<Icon type="media" />}
                label={t('See Video Tutorial') as string}
                padded={true}
              />
            </Text>
          }
        />
      )}
      {showModal && modalState.selectedProvider === METAMASK_PROVIDER && (
        <EthProviderModal
          illustration={
            <EthProviderModalIllustration providerIcon={<Icon type="metamask" size="lg" />} />
          }
          headLine={t('Just a few more steps! We are almost there…')}
          message={t('Approve the message in your Web3 wallet to continue')}
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
