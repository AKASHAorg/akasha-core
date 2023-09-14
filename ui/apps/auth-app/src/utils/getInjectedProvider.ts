import { EthProviders, INJECTED_PROVIDERS } from '@akashaorg/typings/lib/sdk';
import { IconType } from '@akashaorg/typings/lib/ui';
import { TFunction } from 'i18next';

const availableIcons = [
  'safe',
  'nifty',
  'dapper',
  'opera',
  'trust',
  'coinbase',
  'imtoken',
  'status',
  'web3',
];

export const getInjectedProviderDetails = (provider: INJECTED_PROVIDERS, t: TFunction) => {
  switch (provider) {
    // metamask
    case INJECTED_PROVIDERS.METAMASK:
      return {
        name: provider,
        iconType: 'metamask' as IconType,
        titleLabel: provider,
        subtitleLabel: t('Connect using your MetaMask wallet'),
      };
    // provider not detected
    case INJECTED_PROVIDERS.NOT_DETECTED:
      return {
        name: provider,
        titleLabel: '',
        subtitleLabel: '',
      };
    default:
      return {
        name: provider,
        iconType: availableIcons.includes(provider.toLocaleLowerCase())
          ? (provider.toLocaleLowerCase() as IconType)
          : ('wallet' as IconType),
        titleLabel: provider,
        subtitleLabel: t(
          'This wallet has not been tested extensively and may have issues. Please ensure it supports {{requiredNetworkName}} Network',
        ),
      };
  }
};

export const getEthProviderDetails = (provider: EthProviders) => {};
