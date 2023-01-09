import { INJECTED_PROVIDERS } from '@akashaorg/typings/sdk';

const definedIconTypes = [
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

export interface IInjectedProviderDetails {
  iconType: string;
  titleLabel: string;
  subtitleLabel: string;
}

/**
 * Utility to get the details of an injected provider
 */
const getProviderDetails = (provider: INJECTED_PROVIDERS): IInjectedProviderDetails => {
  switch (provider) {
    // metamask
    case INJECTED_PROVIDERS.METAMASK:
      return {
        iconType: 'metamask',
        titleLabel: provider,
        subtitleLabel: 'Connect using your MetaMask wallet',
      };
    // provider not detected
    case INJECTED_PROVIDERS.NOT_DETECTED:
      return {
        iconType: '',
        titleLabel: '',
        subtitleLabel: '',
      };
    default:
      return {
        iconType: definedIconTypes.includes(provider.toLocaleLowerCase())
          ? provider.toLocaleLowerCase()
          : 'wallet',
        titleLabel: provider,
        subtitleLabel:
          'This wallet has not been tested extensively and may have issues. Please ensure it supports Rinkeby Test Network',
      };
  }
};

export default getProviderDetails;
