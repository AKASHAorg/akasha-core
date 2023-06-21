import * as React from 'react';
import { EthProviders, INJECTED_PROVIDERS } from '@akashaorg/typings/sdk';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Accordion from '@akashaorg/design-system-core/lib/components/Accordion';
import { useTranslation } from 'react-i18next';
// import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Web3ConnectCard from './web3-connect-card';
import { IconType, RootComponentProps } from '@akashaorg/typings/ui';
import BoxedIcon from './boxed-icon';

interface ChooseProviderProps {
  injectedProvider: {
    name: INJECTED_PROVIDERS;
    iconType?: IconType;
    titleLabel?: string;
    subtitleLabel?: string;
  };
  onProviderSelect: (provider: EthProviders) => void;
  plugins: RootComponentProps['plugins'];
}

const ChooseProvider: React.FC<ChooseProviderProps> = props => {
  const { injectedProvider, onProviderSelect } = props;
  const { t } = useTranslation('app-auth-ewa');

  const routingPlugin = React.useRef(props.plugins['@akashaorg/app-routing']?.routing);

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
    <Box data-testid="providers-list">
      <Text variant="button-lg" align="center" as="h3">
        {`✨ ${t('Welcome to AKASHA World')} ✨`}
      </Text>
      <Text variant="button-sm" weight="normal" align="center">
        {t('Choose a way to connect')}
      </Text>
      <Box customStyle="mt-4 mb-2">
        <Text variant="button-lg" weight="bold">
          {t('Web3 Wallets')}
        </Text>
        <Accordion
          customStyle="mb-2"
          titleNode={
            <Text variant="button-md" weight="normal">
              {t('What is a wallet?')}
            </Text>
          }
          contentNode={
            <>
              <Text variant="button-sm" weight="normal">
                {t(
                  'A web3 wallet is simply a digital wallet that can be used to store digital assets. These digital assets include Non-fungible tokens (NFTs).',
                )}
                {t(
                  "It's also a tool that allows people to interact with Dapps and platforms like AKASHA world with out storing any personal data.",
                )}
              </Text>
              <hr className="my-4" />
              <Box>
                <Text variant="button-md" align="center" weight="bold">
                  {t('Get your own wallet')}
                </Text>
                <Box customStyle="flex flex-row items-center justify-center">
                  <BoxedIcon
                    iconType="metamask"
                    iconSize="sm"
                    boxSize={6}
                    background="bg(white dark:white)"
                    iconColor="self-color"
                    round="rounded-md"
                  />
                  <Anchor
                    title={t('Get a MetaMask Wallet')}
                    href="https://metamask.io"
                    target="_blank"
                  >
                    <Box customStyle="flex flex-row">
                      <Text variant="button-md" customStyle="mx-1">
                        {t('Get MetaMask Wallet')}
                      </Text>
                      <Icon type="ArrowTopRightOnSquareIcon" size="lg" />
                    </Box>
                  </Anchor>
                </Box>
              </Box>
              <hr className="my-4" />
            </>
          }
        />
        {injectedProvider.name !== INJECTED_PROVIDERS.NOT_DETECTED && (
          <Box customStyle="mb-2">
            <Web3ConnectCard
              leftIconType={injectedProvider.iconType}
              titleLabel={injectedProvider.titleLabel}
              subtitleLabel={injectedProvider.subtitleLabel}
              handleClick={() => handleProviderClick(EthProviders.Web3Injected)}
              iconColor={
                injectedProvider.name === INJECTED_PROVIDERS.METAMASK ? 'self-color' : undefined
              }
              boxBgColor={
                injectedProvider.name === INJECTED_PROVIDERS.METAMASK ? 'yellow-100' : undefined
              }
            />
          </Box>
        )}
        <Box customStyle="mb-4">
          <Web3ConnectCard
            leftIconType="walletconnect"
            subtitleLabel={t('Scan with WalletConnect')}
            titleLabel="WalletConnect"
            handleClick={() => handleProviderClick(EthProviders.WalletConnect)}
            iconSize={{
              width: 48,
              height: 48,
            }}
            iconColor="self-color"
            boxBgColor="transparent"
          />
        </Box>
      </Box>
      <Text align="center" variant="button-sm" weight="normal">
        {t('By connecting to AKASHA world, you agree to our ')}
        <Anchor href={termsUrl} title={t('Terms & Conditions')} target="_blank">
          {t('Terms & Conditions')}
        </Anchor>
        {', '}
        <Anchor href={privacyUrl} title={t('Privacy Policy')} target="_blank">
          {t('Privacy Policy')}
        </Anchor>
        {', and '}
        <Anchor href={cocUrl} title={t('Code of Conduct')} target="_blank">
          {t('Code of Conduct')}
        </Anchor>
        {'.'}
      </Text>
    </Box>
  );
};

export default ChooseProvider;
