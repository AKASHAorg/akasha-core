import React from 'react';
import { useTranslation } from 'react-i18next';

import { Image } from '@akashaorg/ui/lib/akasha-components/image';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Walletconnect } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import routes, { CONNECT, WEB3MODAL } from '../../routes';
import { useNavigate } from '@tanstack/react-router';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';

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
    <Stack data-testid="providers-list" spacing={4}>
      <Text variant="h5" align="center">
        {`✨ ${t('Welcome to AKASHA World')} ✨`}
      </Text>

      <Stack className="self-center h-44 w-44">
        <Image src="/images/auth.webp" />
      </Stack>

      <Stack spacing={2} className="md:px-2">
        <Text variant="subtitle2" color={{ light: 'grey4', dark: 'grey7' }}>
          {t('Connect your wallet')}
        </Text>

        <Card
          className="p-2 select-none hover:secondary border-accent w-full cursor-pointer"
          onClick={handleProviderClick}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Walletconnect width={58} height={58} />
            <Stack spacing={2}>
              <Text variant="h6">{t('Web3Modal')}</Text>
              <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey7' }}>
                {t('Connect your wallet using MetaMask, WalletConnect, Coinbase etc ...')}
              </Text>
            </Stack>
          </Stack>
        </Card>
      </Stack>

      <Stack className="md:px-4">
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
