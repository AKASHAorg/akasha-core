import * as React from 'react';
import DS from '@akashaorg/design-system';
import { Share } from 'grommet-icons';

import { EthProviders, INJECTED_PROVIDERS } from '@akashaorg/typings/sdk';
import { useTranslation } from 'react-i18next';

const {
  Box,
  Web3ConnectCard,
  HorizontalDivider,
  Accordion,
  AccordionPanel,
  Heading,
  Text,
  Icon,
  Anchor,
} = DS;

interface ChooseProviderProps {
  selectedProvider: EthProviders;
  injectedProvider: {
    name: INJECTED_PROVIDERS;
    details: {
      iconType?: string;
      titleLabel?: string;
      subtitleLabel?: string;
    };
  };
  onProviderSelect: (provider: EthProviders) => void;
  providerIsConnected: boolean;
}

const ChooseProvider: React.FC<ChooseProviderProps> = props => {
  const { selectedProvider, injectedProvider, onProviderSelect, providerIsConnected } = props;
  const { t } = useTranslation('app-auth-ewa');

  const handleProviderClick = (provider: EthProviders) => () => {
    onProviderSelect(provider);
  };

  if (selectedProvider !== EthProviders.None && providerIsConnected) {
    return null;
  }

  return (
    <Box direction="column" pad="small" style={{ width: '100%' }}>
      <Heading level="5" size="small" textAlign="start" margin={{ bottom: '0.5rem' }}>
        {t('Web3 Wallets')}
      </Heading>
      <Accordion background={{ dark: 'dark-4', light: 'light-0' }}>
        <AccordionPanel
          style={{}}
          label={
            <Text color="secondaryText" style={{ width: '100%' }}>
              What is a wallet?
            </Text>
          }
        >
          <Text margin={{ bottom: '1rem' }}>
            {`${t(
              'A web3 wallet is simply a digital wallet that can be used to store digital assets',
            )}. ${t('These digital assets include Non-fungible tokens (NFTs)')}. ${t(
              'it’s also a tool that allows people to interact with Dapps and pltaforms like AKASHA world with out storing any personal data.',
            )} `}
          </Text>
          <HorizontalDivider />
          <Box
            flex={true}
            direction="column"
            pad="small"
            justify="center"
            align="center"
            margin="auto"
          >
            <Heading
              level="6"
              size="small"
              textAlign="center"
              margin={{ top: '1rem', bottom: 'none' }}
            >
              {t('Get your own wallet')}
            </Heading>
            <Box
              flex={true}
              direction="row"
              justify="center"
              align="center"
              margin={{ bottom: '0.5rem' }}
            >
              <Icon type="metamask" color="initial" size={'md'} plain={true} />
              <Anchor
                size="medium"
                href={'https://metamask.io/'}
                label={' Get a Metamask Wallet '}
                target={'_blank'}
                margin={{ left: '0.5rem', right: '0.5rem' }}
              />
              <Share color="plain" size="medium" />
            </Box>
          </Box>
        </AccordionPanel>
      </Accordion>
      {injectedProvider.name !== INJECTED_PROVIDERS.NOT_DETECTED && (
        <Box margin={{ vertical: 'xsmall' }}>
          <Web3ConnectCard
            leftIconType={injectedProvider.details.iconType}
            titleLabel={injectedProvider.details.titleLabel}
            subtitleLabel={t('{{ injectedProviderSubtitleLabel }}', {
              injectedProviderSubtitleLabel: injectedProvider.details.subtitleLabel,
            })}
            iconBackground="lightpink"
            handleClick={handleProviderClick(EthProviders.Web3Injected)}
          />
        </Box>
      )}
      <Box margin={{ vertical: 'xsmall' }}>
        <Web3ConnectCard
          leftIconType="walletconnect"
          subtitleLabel={t('Scan with WalletConnect')}
          titleLabel={t('WalletConnect')}
          iconBackground="#52a4fc"
          handleClick={handleProviderClick(EthProviders.WalletConnect)}
        />
      </Box>
    </Box>
  );
};

export default ChooseProvider;
