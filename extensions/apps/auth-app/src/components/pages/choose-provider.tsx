import React from 'react';
import { useTranslation } from 'react-i18next';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Walletconnect } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import Web3ConnectCard from '@akashaorg/design-system-components/lib/components/Web3ConnectCard';
import routes, { CONNECT, WEB3MODAL } from '../../routes';
import { useNavigate } from '@tanstack/react-router';

const ChooseProvider: React.FC<unknown> = () => {
  const { t } = useTranslation('app-auth-ewa');

  const navigate = useNavigate();

  const handleProviderClick = () => {
    // this is required because of the backend
    localStorage.setItem('@acceptedTermsAndPrivacy', JSON.stringify(true));

    navigate({
      to: `${routes[CONNECT]}${routes[WEB3MODAL]}${location.search ? `${location.search}` : ''}`,
    });
  };

  return (
    <Stack dataTestId="providers-list" spacing="gap-y-6">
      <Text variant="h5" align="center">
        {`✨ ${t('Welcome to AKASHA World')} ✨`}
      </Text>

      <Stack alignSelf="center" customStyle="h-40 w-40">
        <Image customStyle="object-contain" src="/images/auth.webp" />
      </Stack>

      <Stack spacing="gap-y-2" customStyle="md:px-4">
        <Text variant="subtitle2" color={{ light: 'grey4', dark: 'grey7' }}>
          {t('Connect your wallet')}
        </Text>

        <Web3ConnectCard
          leftIconType={<Walletconnect />}
          subtitleLabel={t('Connect your wallet using MetaMask, WalletConnect, Coinbase etc ...')}
          titleLabel="Web3Modal"
          handleClick={handleProviderClick}
        />
      </Stack>

      <Stack customStyle="md:px-4">
        <Text
          align="center"
          variant="button-sm"
          color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
        >
          {t('Powered by Web3Modal')}
        </Text>
      </Stack>
    </Stack>
  );
};

export default ChooseProvider;
