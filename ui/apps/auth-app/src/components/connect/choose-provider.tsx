import * as React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Accordion from '@akashaorg/design-system-core/lib/components/Accordion';
import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Web3ConnectCard from './web3-connect-card';
import { useTranslation } from 'react-i18next';
import { IconType, RootComponentProps } from '@akashaorg/typings/ui';
import { EthProviders, INJECTED_PROVIDERS } from '@akashaorg/typings/sdk';

export type ChooseProviderProps = {
  injectedProvider: {
    name: INJECTED_PROVIDERS;
    iconType?: IconType;
    titleLabel?: string;
    subtitleLabel?: string;
  };
  onProviderSelect: (provider: EthProviders) => void;
  plugins: RootComponentProps['plugins'];
};

const ChooseProvider: React.FC<ChooseProviderProps> = props => {
  const { injectedProvider, plugins, onProviderSelect } = props;
  const { t } = useTranslation('app-auth-ewa');

  const routingPlugin = React.useRef(plugins['@akashaorg/app-routing']?.routing);

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

  const handleProviderClick = (provider: EthProviders) => {
    onProviderSelect(provider);
  };

  return (
    <Stack testId="providers-list" spacing="gap-y-4">
      <Text variant="h5" align="center">
        {`✨ ${t('Welcome to AKASHA World')} ✨`}
      </Text>

      <Text
        variant="subtitle2"
        weight="light"
        align="center"
        color={{ light: 'grey4', dark: 'grey7' }}
      >
        {t('Choose a way to connect')}
      </Text>

      <Stack spacing="gap-y-4">
        <Text variant="h6">{t('Web3 Wallets')}</Text>

        <Accordion
          headerDivider={true}
          titleNode={
            <Text variant="footnotes2" weight="normal" color={{ light: 'black', dark: 'grey7' }}>
              {t('What is a wallet?')}
            </Text>
          }
          contentNode={
            <Stack spacing="gap-y-4">
              <Text variant="button-sm" weight="normal" customStyle="p-2">
                {t(
                  'A web3 wallet is simply a digital wallet that can be used to store digital assets. These digital assets include Non-fungible tokens (NFTs).',
                )}
                {t(
                  "It's also a tool that allows people to interact with Dapps and platforms like AKASHA world with out storing any personal data.",
                )}
              </Text>

              <Divider />

              <Text variant="button-md" align="center" weight="bold">
                {t('Get your own wallet')}
              </Text>

              <Stack direction="row" align="center" justify="center" spacing="gap-x-2">
                <AppIcon
                  placeholderIconType="metamask"
                  background={{ gradient: 'gradient-to-b', from: 'orange-50', to: 'orange-200' }}
                  size="sm"
                  radius={4}
                  iconColor="self-color"
                />

                <Anchor
                  title={t('Get a MetaMask Wallet')}
                  href="https://metamask.io"
                  target="_blank"
                >
                  <Stack direction="row" align="center" spacing="gap-x-2">
                    <Text
                      variant="button-sm"
                      weight="bold"
                      color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                    >
                      {t('Get MetaMask Wallet')}
                    </Text>

                    <Icon type="ArrowTopRightOnSquareIcon" size="md" accentColor />
                  </Stack>
                </Anchor>
              </Stack>
            </Stack>
          }
        />

        <Stack spacing="gap-y-2">
          {injectedProvider.name !== INJECTED_PROVIDERS.NOT_DETECTED && (
            <Web3ConnectCard
              leftIconType={injectedProvider.iconType}
              titleLabel={injectedProvider.titleLabel}
              subtitleLabel={injectedProvider.subtitleLabel}
              handleClick={() => handleProviderClick(EthProviders.Web3Injected)}
              iconColor={
                injectedProvider.name === INJECTED_PROVIDERS.METAMASK ? 'self-color' : undefined
              }
              boxBgColor={
                injectedProvider.name === INJECTED_PROVIDERS.METAMASK
                  ? { gradient: 'gradient-to-b', from: 'orange-50', to: 'orange-200' }
                  : undefined
              }
              iconSize={
                injectedProvider.name === INJECTED_PROVIDERS.METAMASK
                  ? { width: 32, height: 32 }
                  : { width: 40, height: 40 }
              }
              boxSize={{ width: 40, height: 40 }}
            />
          )}

          <Web3ConnectCard
            leftIconType="walletconnect"
            subtitleLabel={t('Scan with WalletConnect')}
            titleLabel="WalletConnect"
            handleClick={() => handleProviderClick(EthProviders.WalletConnect)}
            iconColor="self-color"
            boxBgColor="transparent"
            iconSize={{ width: 40, height: 40 }}
            boxSize={{ width: 40, height: 40 }}
          />
        </Stack>
      </Stack>

      <Divider />

      <Text
        align="center"
        variant="footnotes2"
        weight="normal"
        color={{ light: 'grey4', dark: 'grey7' }}
      >
        {t('By connecting to AKASHA world, you agree to our ')}

        <Anchor href={termsUrl} title={t('Terms & Conditions')} weight="bold">
          {t('Terms & Conditions')}
        </Anchor>
        {', '}
        <Anchor href={privacyUrl} title={t('Privacy Policy')} weight="bold">
          {t('Privacy Policy')}
        </Anchor>
        {', and '}
        <Anchor href={cocUrl} title={t('Code of Conduct')} weight="bold">
          {t('Code of Conduct')}
        </Anchor>

        {'.'}
      </Text>
    </Stack>
  );
};

export default ChooseProvider;
