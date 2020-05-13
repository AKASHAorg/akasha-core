import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { LearnMoreTutorial } from './tutorial-modal';
import LoginWidgetIllustration from './icons/login-widget-illustration';
import EthereumIcon from './icons/ethereum-icon';
import { useLoginState } from '../state';

const {
  IconLink,
  Icon,
  Text,
  styled,
  Box,
  ModalRenderer,
  LoginCTAWidgetCard,
  EthProviderListModal,
  EthProviderModal,
  createGlobalStyle,
} = DS;

const METAMASK_PROVIDER = 'metamask';
const WALLETCONNECT_PROVIDER = 'walletconnect';

const ETH_PROVIDERS = {
  [METAMASK_PROVIDER]: 2,
  [WALLETCONNECT_PROVIDER]: 3,
};

const VideoTutorialLink = styled(IconLink)`
  vertical-align: top;
`;

export interface ILoginWidgetProps {
  sdkModules: any;
  logger: any;
  layoutConfig: {
    modalSlotId?: string;
  };
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

export interface IEthProviderIllustrationProps {
  providerIcon: React.ReactElement;
}

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

const LoginWidget: React.FC<ILoginWidgetProps> = props => {
  const { t } = useTranslation();
  const [state, actions] = useLoginState(props.sdkModules, props.logger);

  const handleLearnMore = () => {
    actions.setLearnMoreVisibility({ isVisible: true });
  };

  const handleLoginSelect = () => {
    actions.setProviderListVisibility({ isVisible: true });
  };

  const handleMetamaskLogin = () => {
    actions.authorize(ETH_PROVIDERS[METAMASK_PROVIDER]);
  };

  const handleWalletConnectLogin = () => {
    actions.authorize(ETH_PROVIDERS[WALLETCONNECT_PROVIDER]);
  };

  const handleProvidersModalClose = () => {
    actions.setProviderListVisibility({ isVisible: false });
  };

  const handleTutorialModalClose = () => {
    actions.setLearnMoreVisibility({ isVisible: false });
  };

  const handleProviderClick = (
    providerId: typeof METAMASK_PROVIDER | typeof WALLETCONNECT_PROVIDER,
  ) => {
    actions.setProviderListVisibility({ isVisible: false });
    actions.setSelectedProvider({ selectedProvider: providerId });
  };
  const handleProviderModalClose = () => {
    actions.setSelectedProvider({ selectedProvider: null });
  };

  if (state.data.jwtToken) {
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
        connectLabel={t('Connect Address')}
        onLearnMoreClick={handleLearnMore}
        onLoginClick={handleLoginSelect}
      />
      <ModalRenderer slotId={props.layoutConfig.modalSlotId}>
        {state.data.providerListVisibility && (
          <EthProviderListModal
            onProviderClick={handleProviderClick}
            onModalClose={handleProvidersModalClose}
            providers={[
              {
                id: METAMASK_PROVIDER,
                logo: <Icon type="metamask" size="xxl" />,
                title: t('MetaMask'),
                description: t('Connect to your MetaMask wallet'),
              },
              {
                id: WALLETCONNECT_PROVIDER,
                logo: <Icon type="walletconnect" size="xxl" />,
                title: t('WalletConnect'),
                description: t('Scan with WalletConnect'),
              },
            ]}
            footer={
              <Text textAlign="center" margin={{ top: '1em' }} style={{ userSelect: 'none' }}>
                <>{t('What is a wallet? How do i get an Ethereum address?')}</>
                <VideoTutorialLink
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
        {state.data.learnMoreVisibility && (
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
        )}
        {state.data.selectedProvider === METAMASK_PROVIDER && (
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
        {state.data.selectedProvider === WALLETCONNECT_PROVIDER && (
          <WalletConnectModalTrigger onLogin={handleWalletConnectLogin} />
        )}
      </ModalRenderer>
    </>
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
export default LoginWidget;
