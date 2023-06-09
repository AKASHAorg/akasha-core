import * as React from 'react';
import { EthProviders, INJECTED_PROVIDERS } from '@akashaorg/typings/sdk';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Accordion from '@akashaorg/design-system-core/lib/components/Accordion';
import { useTranslation } from 'react-i18next';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Web3ConnectCard from './web3-connect-card';
import { IconType } from '@akashaorg/typings/ui';
import { useNetworkState, useRequiredNetworkName } from '@akashaorg/ui-awf-hooks';

interface ChooseProviderProps {
  requiredNetworkName: string;
  injectedProvider: {
    name: INJECTED_PROVIDERS;
    iconType?: IconType;
    titleLabel?: string;
    subtitleLabel?: string;
  };
  onProviderSelect: (provider: EthProviders) => void;
}

// @TODO: create a getter method in the routing plugin
export const baseAppLegalRoute = '/@akashaorg/app-legal';

const ChooseProvider: React.FC<ChooseProviderProps> = props => {
  const { injectedProvider, onProviderSelect, requiredNetworkName } = props;
  const [isSubmittingWithError, setIsSubmittingWithError] = React.useState(false);
  const { t } = useTranslation('app-auth-ewa');
  const networkStateQuery = useNetworkState();

  const networkNotSupportedError = React.useMemo(() => {
    if (networkStateQuery.data.networkNotSupported && injectedProvider.name) {
      return t(
        "To use Akasha World during the alpha period, you'll need to set the {{selectedProviderName}} wallet to {{requiredNetworkName}}",
        {
          selectedProviderName: injectedProvider.name,
          requiredNetworkName,
        },
      );
    }
    return null;
  }, [requiredNetworkName, injectedProvider]);

  const handleProviderClick = React.useCallback(
    (provider: EthProviders) => {
      if (
        networkNotSupportedError &&
        !isSubmittingWithError &&
        provider !== EthProviders.WalletConnect
      ) {
        setIsSubmittingWithError(true);
        return;
      }
      onProviderSelect(provider);
    },
    [networkNotSupportedError, isSubmittingWithError],
  );

  return (
    <BasicCardBox data-testid="providers-list">
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
                <Box customStyle="flex">
                  <Box>
                    <Icon type="metamask" />
                  </Box>
                  <Anchor
                    title={t('Get a MetaMask Wallet')}
                    href="https://metamask.io"
                    // label={t('Get a MetaMask Wallet')}
                    target="_blank"
                    // margin={{ left: '0.5rem', right: '0.5rem' }}
                  />
                  <Icon type="ArrowTopRightOnSquareIcon" size="lg" />
                </Box>
              </Box>
              <hr className="my-4" />
            </>
          }
        />
        {injectedProvider.name !== INJECTED_PROVIDERS.NOT_DETECTED && (
          <Box customStyle="mb-2">
            {networkNotSupportedError && (
              <Box
                customStyle={`bg-warningLight dark:bg-waningDark ${
                  isSubmittingWithError ? 'animate-shake' : ''
                }`}
                id={'network-not-supported-error'}
                onAnimationEnd={() => setIsSubmittingWithError(false)}
              >
                <Text variant="subtitle2">{networkNotSupportedError}.</Text>
              </Box>
            )}
            <Web3ConnectCard
              leftIconType={injectedProvider.iconType}
              titleLabel={injectedProvider.titleLabel}
              subtitleLabel={injectedProvider.subtitleLabel}
              iconBackground="lightGold"
              handleClick={() => handleProviderClick(EthProviders.Web3Injected)}
            />
          </Box>
        )}
        <Box customStyle="mb-4">
          <Web3ConnectCard
            leftIconType="walletconnect"
            subtitleLabel={t('Scan with WalletConnect')}
            titleLabel="WalletConnect"
            iconBackground="deepBlue"
            handleClick={() => handleProviderClick(EthProviders.WalletConnect)}
          />
        </Box>
      </Box>
      <Text align="center" variant="button-sm" weight="normal">
        {t('By connecting to AKASHA world, you agree to our ')}
        <Anchor
          href={`${baseAppLegalRoute}/terms-of-service`}
          title={t('Terms & Conditions')}
          target="_blank"
        >
          {t('Terms & Conditions')}
        </Anchor>
        {', '}
        <Anchor
          href={`${baseAppLegalRoute}/privacy-policy`}
          title={t('Privacy Policy')}
          target="_blank"
        >
          {t('Privacy Policy')}
        </Anchor>
        {', and '}
        <Anchor
          href={`${baseAppLegalRoute}/code-of-conduct`}
          title={t('Code of Conduct')}
          target="_blank"
        >
          {t('Code of Conduct')}
        </Anchor>
        {'.'}
      </Text>
    </BasicCardBox>
  );
};

export default ChooseProvider;
