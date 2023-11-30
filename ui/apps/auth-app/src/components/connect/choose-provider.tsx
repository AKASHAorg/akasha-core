import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
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

  const termsUrl = routingPlugin.current?.getUrlForApp({
    appName: '@akashaorg/app-legal',
    getNavigationUrl: appRoutes => appRoutes.termsOfService,
  });

  const privacyUrl = routingPlugin.current?.getUrlForApp({
    appName: '@akashaorg/app-legal',
    getNavigationUrl: appRoutes => appRoutes.privacyPolicy,
  });

  const cocUrl = routingPlugin.current?.getUrlForApp({
    appName: '@akashaorg/app-legal',
    getNavigationUrl: appRoutes => appRoutes.codeOfConduct,
  });

  const renderAnchor = (url: string, title: string) => (
    <Anchor href={url} title={title} weight="bold">
      {title}
    </Anchor>
  );

  return (
    <Stack testId="providers-list" spacing="gap-y-16">
      <Text variant="h5" align="center">
        {`✨ ${t('Welcome to AKASHA World')} ✨`}
      </Text>

      <Stack spacing="gap-y-4">
        <Text variant="subtitle2" color={{ light: 'grey4', dark: 'grey7' }}>
          {t('Connect your wallet')}
        </Text>

        <Web3ConnectCard
          leftIconType={<Walletconnect />}
          subtitleLabel={t('Connect with Web3Modal')}
          titleLabel="Web3Modal"
          handleClick={handleProviderClick}
          iconColor="self-color"
          boxBgColor="transparent"
          iconSize={{ width: 40, height: 40 }}
          boxSize={{ width: 40, height: 40 }}
        />
      </Stack>

      <Stack spacing="gap-y-4">
        <Divider />
        <Text align="center" variant="footnotes2" color={{ light: 'grey4', dark: 'grey7' }}>
          {t('By connecting to AKASHA world, you agree to our ')}
          {renderAnchor(termsUrl, t('Terms & Conditions,'))}{' '}
          {renderAnchor(privacyUrl, t('Privacy Policy'))} {t('and')}{' '}
          {renderAnchor(cocUrl, t('Code of Conduct'))}
        </Text>
      </Stack>
    </Stack>
  );
};

export default ChooseProvider;
