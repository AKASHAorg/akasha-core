import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Walletconnect } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import Web3ConnectCard from './web3-connect-card';
import { CONNECT, WEB3MODAL } from '../../routes';

const ChooseProvider: React.FC<unknown> = () => {
  const { t } = useTranslation('app-auth-ewa');
  const { getRoutingPlugin } = useRootComponentProps();

  const routingPlugin = useRef(getRoutingPlugin());

  const handleProviderClick = () => {
    // this is required because of the backend
    localStorage.setItem('@acceptedTermsAndPrivacy', JSON.stringify(true));

    routingPlugin.current?.navigateTo({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: appRoutes =>
        `${appRoutes[CONNECT]}${appRoutes[WEB3MODAL]}${
          location.search ? `${location.search}` : ''
        }`,
    });
  };

  return (
    <Stack testId="providers-list" spacing="gap-y-6">
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
          iconColor="self-color"
          boxBgColor="transparent"
          iconSize={{ width: 40, height: 40 }}
          boxSize={{ width: 40, height: 40 }}
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
