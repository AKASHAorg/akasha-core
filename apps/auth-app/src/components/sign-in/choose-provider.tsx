import * as React from 'react';
import DS from '@akashaproject/design-system';
import { EthProviders } from '@akashaproject/sdk-typings/lib/interfaces';
import { useTranslation } from 'react-i18next';
import { INJECTED_PROVIDERS } from '@akashaproject/sdk-typings/lib/interfaces/common';

const { Box, Web3ConnectButton } = DS;

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
  const { t } = useTranslation();

  const handleProviderClick = (provider: EthProviders) => () => {
    onProviderSelect(provider);
  };

  if (selectedProvider !== EthProviders.None && providerIsConnected) {
    return null;
  }

  return (
    <Box direction="column">
      {injectedProvider && (
        <Box margin={{ vertical: 'xsmall' }}>
          <Web3ConnectButton
            leftIconType={injectedProvider.details.iconType}
            titleLabel={injectedProvider.details.titleLabel}
            subtitleLabel={t(injectedProvider.details.subtitleLabel)}
            handleClick={handleProviderClick(EthProviders.Web3Injected)}
            tagLabel={t('auto-detected')}
          />
        </Box>
      )}
      <Box margin={{ vertical: 'xsmall' }}>
        <Web3ConnectButton
          leftIconType="walletconnect"
          subtitleLabel={`${t(
            'The wallet you are using must allow switching the Ethereum network to Rinkeby',
          )}.`}
          titleLabel={`${t('Scan with')} WalletConnect`}
          handleClick={handleProviderClick(EthProviders.WalletConnect)}
        />
      </Box>
      <Box margin={{ vertical: 'xsmall' }}>
        <Web3ConnectButton
          titleLabel={t('Email or Social Login')}
          subtitleLabel={`${t(
            'Use this option to sign up using email, Google, Twitter, Discord, Github, Apple, or one of many other social networks',
          )}.`}
          handleClick={handleProviderClick(EthProviders.Torus)}
          leftIconType="key"
        />
      </Box>
    </Box>
  );
};

export default ChooseProvider;
