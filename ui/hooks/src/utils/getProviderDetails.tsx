import { INJECTED_PROVIDERS } from '@akashaproject/awf-sdk/typings/lib/interfaces/common';

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

const getProviderDetails = (provider: INJECTED_PROVIDERS): IInjectedProviderDetails => {
  switch (provider) {
    // metamask
    case INJECTED_PROVIDERS.METAMASK:
      return {
        iconType: 'metamask',
        titleLabel: provider,
        subtitleLabel:
          "We recommend using MetaMask. It's the wallet we've tested most extensively with Ethereum World. We're very sure it'll work.",
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
