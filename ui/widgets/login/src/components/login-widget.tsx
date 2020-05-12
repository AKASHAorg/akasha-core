import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import LoginCTACard from './login-cta-card';
import { Modal } from './modal-container';
import { ProvidersListModal } from './providers-list-modal';
import { authorize, getJWT } from '../services/login-service';
import { MetamaskAuthModal } from './metamask-auth-modal';
import { WalletConnectAuthModal } from './walletconnect-auth-modal';
import { LearnMoreTutorial } from './tutorial-modal';
import MetamaskIcon from './icons/metamask-icon';
import WalletConnectIcon from './icons/walletconnect-icon';
import LoginWidgetIllustration from './icons/login-widget-illustration';
import EthereumIcon from './icons/ethereum-icon';

const { IconLink, Icon, Text, styled, Box } = DS;

const METAMASK_PROVIDER = 'metamask';
const WALLETCONNECT_PROVIDER = 'walletconnect';

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
const MetamaskAuthModalIllustration: React.FC = () => (
  <Box direction="row" align="center" justify="center" margin="1.5em 0">
    <Box
      alignContent="between"
      justify="between"
      style={{ maxWidth: '67%', width: '100%', alignItems: 'center' }}
      direction="row"
    >
      <IconCircleBg>
        <MetamaskIcon width="40" height="36" />
      </IconCircleBg>
      <HorizontalDashedLine />
      <EthereumIcon />
    </Box>
  </Box>
);

const LoginWidget: React.FC<ILoginWidgetProps> = props => {
  const { t } = useTranslation();
  const [jwtToken, setJwtToken] = React.useState(null);
  const [providerListVisibility, setProviderListVisibility] = React.useState(false);
  const [learnMoreVisibility, setLearnMoreVisibility] = React.useState(false);
  const [selectedProvider, setSelectedProvider] = React.useState<string | null>(null);

  React.useEffect(() => {
    getJWT({ setJwtToken, authModule: props.sdkModules.auth, logger: props.logger });
  }, []);

  const handleLearnMore = () => {
    setLearnMoreVisibility(true);
  };

  const handleLoginSelect = () => {
    setProviderListVisibility(true);
  };

  const handleMetamaskLogin = () => {
    authorize({ setJwtToken, authModule: props.sdkModules.auth, logger: props.logger });
  };

  const handleProvidersModalClose = () => {
    setProviderListVisibility(false);
  };

  const handleTutorialModalClose = () => {
    setLearnMoreVisibility(false);
  };

  const handleProviderClick = (providerId: string) => {
    setProviderListVisibility(false);
    setSelectedProvider(providerId);
  };
  const handleMetamaskLoginClose = () => {
    setSelectedProvider(null);
  };

  if (jwtToken) {
    return null;
  }

  return (
    <>
      <LoginCTACard
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
        onLearnMoreClick={handleLearnMore}
        onLoginClick={handleLoginSelect}
      />
      <Modal slotId={props.layoutConfig.modalSlotId}>
        {providerListVisibility && (
          <ProvidersListModal
            onProviderClick={handleProviderClick}
            onModalClose={handleProvidersModalClose}
            providers={[
              {
                id: METAMASK_PROVIDER,
                logo: <MetamaskIcon />,
                title: t('MetaMask'),
                description: t('Connect to your MetaMask wallet'),
              },
              {
                id: WALLETCONNECT_PROVIDER,
                logo: <WalletConnectIcon />,
                title: t('WalletConnect'),
                description: t('Scan with WalletConnect'),
              },
            ]}
            footer={
              <Text textAlign="center" margin={{ top: '1em' }} style={{ userSelect: 'none' }}>
                <>{t('What is a wallet? How do i get an Ethereum address?')}</>
                <VideoTutorialLink
                  onClick={() => {}}
                  icon={<Icon type="media" />}
                  label={t('See Video Tutorial') as string}
                  padded={true}
                />
              </Text>
            }
          />
        )}
        {learnMoreVisibility && (
          <LearnMoreTutorial
            onModalClose={handleTutorialModalClose}
            slides={[
              {
                title: `👨‍🚀👩‍🚀 ${t('Create your own profile on ethereum.world')}`,
                content: t(
                  'Customize your appearance with 3Box and Ethereum Name Service Integrations',
                ),
              },
              { title: 'Test Title', content: 'Test Content' },
            ]}
          />
        )}
        {selectedProvider === METAMASK_PROVIDER && (
          <MetamaskAuthModal
            illustration={<MetamaskAuthModalIllustration />}
            headLine={t('Just a few more steps! We are almost there…')}
            message={t('Approve the message in your Web3 wallet to continue.')}
            onLogin={handleMetamaskLogin}
            onModalClose={handleMetamaskLoginClose}
          />
        )}
        {selectedProvider === WALLETCONNECT_PROVIDER && <WalletConnectAuthModal />}
      </Modal>
    </>
  );
};

export default LoginWidget;
