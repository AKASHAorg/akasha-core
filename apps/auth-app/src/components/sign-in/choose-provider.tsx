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
    };
  };
  onProviderSelect: (provider: EthProviders) => void;
}

const ChooseProvider: React.FC<ChooseProviderProps> = props => {
  const { selectedProvider, injectedProvider, onProviderSelect } = props;
  const { t } = useTranslation();

  const handleProviderClick = (provider: EthProviders) => () => {
    onProviderSelect(provider);
  };

  if (selectedProvider !== EthProviders.None) {
    return null;
  }

  return (
    <Box direction="column">
      {injectedProvider && (
        <Box margin={{ vertical: 'xsmall' }}>
          <Web3ConnectButton
            leftIconType={injectedProvider.details.iconType}
            titleLabel={injectedProvider.details.titleLabel}
            handleClick={handleProviderClick(EthProviders.Web3Injected)}
          />
        </Box>
      )}
      <Box margin={{ vertical: 'xsmall' }}>
        <Web3ConnectButton
          leftIconType="walletconnect"
          titleLabel={`${t('Scan with')} WalletConnect`}
          handleClick={handleProviderClick(EthProviders.WalletConnect)}
        />
      </Box>
      <Box margin={{ vertical: 'xsmall' }}>
        <Web3ConnectButton
          titleLabel={t('Email or Social Login')}
          handleClick={handleProviderClick(EthProviders.Torus)}
          leftIconType="key"
        />
      </Box>
    </Box>
  );
};

export default ChooseProvider;
