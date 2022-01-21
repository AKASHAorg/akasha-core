import * as React from 'react';

import DS from '@akashaproject/design-system';
import { INJECTED_PROVIDERS } from '@akashaproject/awf-sdk/typings/lib/interfaces/common';
import { IInjectedProviderDetails } from '@akashaproject/ui-awf-hooks/lib/utils/getProviderDetails';
import { EthProviders } from '@akashaproject/awf-sdk/typings/lib/interfaces';

import RequiredNetworkStep, { IRequiredNetworkStepProps } from './required-network';

const { Box, Text, Web3ConnectButton } = DS;

export interface IStepThreeProps extends IRequiredNetworkStepProps {
  paragraphOneLabel: string;
  paragraphTwoLabel: string;
  paragraphTwoBoldLabel: string;
  paragraphThreeLabel: string;
  paragraphThreeBoldLabel: string;
  paragraphFourLabel: string;
  paragraphFourAccentLabel: string;
  providerDetails: IInjectedProviderDetails;
  tagLabel: string;
  walletConnectTitleLabel: string;
  walletConnectDescription: string;
  socialLoginTitleLabel: string;
  socialLoginDescription: string;
  providerConnected: boolean;
  changeProviderLabel: string;
  onProviderSelect: (provider: EthProviders) => void;
}

const StepThree: React.FC<IStepThreeProps> = props => {
  const {
    paragraphOneLabel,
    paragraphTwoLabel,
    paragraphTwoBoldLabel,
    paragraphThreeLabel,
    paragraphThreeBoldLabel,
    paragraphFourLabel,
    paragraphFourAccentLabel,
    injectedProvider,
    providerDetails,
    tagLabel,
    walletConnectTitleLabel,
    walletConnectDescription,
    socialLoginTitleLabel,
    socialLoginDescription,
    providerConnected,
    changeProviderLabel,
    selectedProvider,
    isOnRequiredNetwork,
    onProviderSelect,
  } = props;

  const handleWeb3Injected = () => {
    onProviderSelect(EthProviders.Web3Injected);
  };

  const handleWalletConnect = () => {
    onProviderSelect(EthProviders.WalletConnect);
  };

  const handleSocialLogin = () => {
    onProviderSelect(EthProviders.Torus);
  };

  const handleChangeProvider = () => {
    onProviderSelect(EthProviders.None);
  };

  return (
    <Box>
      {/* show this, if selected provider is Email or Social Login */}
      {selectedProvider == EthProviders.Torus && providerConnected && (
        <>
          <Box direction="row" justify="between" margin={{ bottom: 'large' }}>
            <Text size="large" weight="bold">
              {socialLoginTitleLabel}
            </Text>
          </Box>
          {isOnRequiredNetwork && <RequiredNetworkStep {...props} />}
        </>
      )}
      {/* show this, if selected provider is WalletConnect */}
      {selectedProvider == EthProviders.WalletConnect && providerConnected && (
        <>
          <Box direction="row" justify="between" margin={{ bottom: 'large' }}>
            <Text size="large" weight="bold">
              {walletConnectTitleLabel}
            </Text>
            <Text
              size="large"
              color="accentText"
              style={{ cursor: 'pointer' }}
              onClick={handleChangeProvider}
            >
              {changeProviderLabel}
            </Text>
          </Box>
          {!isOnRequiredNetwork && <RequiredNetworkStep {...props} />}
          {isOnRequiredNetwork && <RequiredNetworkStep {...props} />}
        </>
      )}
      {/* show this, if selected provider is web3 injected */}
      {selectedProvider === EthProviders.Web3Injected && providerConnected && (
        <>
          <Box direction="row" justify="between" margin={{ bottom: 'large' }}>
            <Text size="large" weight="bold">
              {injectedProvider}
            </Text>
            <Text
              size="large"
              color="accentText"
              style={{ cursor: 'pointer' }}
              onClick={handleChangeProvider}
            >
              {changeProviderLabel}
            </Text>
          </Box>
          {!isOnRequiredNetwork && <RequiredNetworkStep {...props} />}
          {isOnRequiredNetwork && <RequiredNetworkStep {...props} />}
        </>
      )}
      {/* show this, if no selected provider */}
      {(selectedProvider === EthProviders.None || !providerConnected) && (
        <>
          <Text size="large" margin={{ bottom: 'large' }}>
            {paragraphOneLabel}
          </Text>
          <Text size="large" margin={{ bottom: 'large' }}>
            <Text size="large" weight="bold">
              {paragraphTwoBoldLabel}
            </Text>{' '}
            {paragraphTwoLabel}
          </Text>
          {/* show extra info if detected wallet is not METAMASK */}
          {injectedProvider !== INJECTED_PROVIDERS.METAMASK && (
            <>
              <Text size="large" margin={{ bottom: 'large' }}>
                {paragraphThreeLabel}{' '}
                <Text size="large" weight="bold">
                  {paragraphThreeBoldLabel}
                </Text>
              </Text>
              <Text size="large" margin={{ bottom: 'large' }}>
                {paragraphFourLabel}{' '}
                <Text size="large" color="accentText">
                  {paragraphFourAccentLabel}.
                </Text>
              </Text>
            </>
          )}
          {injectedProvider !== INJECTED_PROVIDERS.NOT_DETECTED && (
            <Web3ConnectButton
              boxMargin={{ bottom: 'medium' }}
              titleLabel={providerDetails.titleLabel}
              subtitleLabel={providerDetails.subtitleLabel}
              leftIconType={providerDetails.iconType}
              tagLabel={tagLabel}
              handleClick={handleWeb3Injected}
            />
          )}
          <Web3ConnectButton
            boxMargin={{ bottom: 'medium' }}
            titleLabel={walletConnectTitleLabel}
            subtitleLabel={walletConnectDescription}
            leftIconType="walletconnect"
            handleClick={handleWalletConnect}
          />
          <Web3ConnectButton
            titleLabel={socialLoginTitleLabel}
            subtitleLabel={socialLoginDescription}
            leftIconType="key"
            handleClick={handleSocialLogin}
          />
        </>
      )}
    </Box>
  );
};

export { StepThree };
