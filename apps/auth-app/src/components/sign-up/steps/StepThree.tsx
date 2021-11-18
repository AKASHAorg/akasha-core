import * as React from 'react';
import DS from '@akashaproject/design-system';
import { INJECTED_PROVIDERS } from '@akashaproject/awf-sdk/typings/lib/interfaces/common';

const { Box, Text, Web3ConnectButton } = DS;

export interface IStepThreeProps {
  textLine1: string;
  textLine2bold: string;
  textLine2: string;
  injectedProvider: INJECTED_PROVIDERS;
}

const StepThree: React.FC<IStepThreeProps> = props => {
  const { textLine1, textLine2bold, textLine2, injectedProvider } = props;

  const handleConnectProvider = () => {
    /* TODO: */
  };

  const handleWalletConnect = () => {
    /* TODO: */
  };

  const handleSocialLogin = () => {
    /* TODO: */
  };

  return (
    <Box>
      <Text size="large" margin={{ bottom: 'large' }}>
        {textLine1}
      </Text>
      <Text size="large" margin={{ bottom: 'large' }}>
        <Text size="large" weight="bold">
          {textLine2bold}
        </Text>{' '}
        {textLine2}
      </Text>
      {/* show open login option at the top if no provider is detected */}
      {injectedProvider === INJECTED_PROVIDERS.NOT_DETECTED && (
        <Web3ConnectButton
          boxMargin={{ bottom: 'medium' }}
          titleLabel="Use Your Email or Social Login"
          subtitleLabel="Use this option to sign up using email, Google, Twitter, Discord, Github, Apple, or one of many other social networks"
          leftIconType="key"
          handleClick={handleSocialLogin}
        />
      )}
      {injectedProvider === INJECTED_PROVIDERS.METAMASK && (
        <Web3ConnectButton
          boxMargin={{ bottom: 'medium' }}
          titleLabel="MetaMask"
          subtitleLabel="We recommend using MetaMask. It's the wallet we've tested most extensively with Ethereum World. We're very sure it'll work"
          leftIconType="metamask"
          handleClick={handleConnectProvider}
        />
      )}
      <Web3ConnectButton
        boxMargin={{ bottom: 'medium' }}
        titleLabel="WalletConnect"
        subtitleLabel="WalletConnect has had reliability problems for us in the past. Consider it experimental at this time."
        leftIconType="walletconnect"
        handleClick={handleWalletConnect}
      />
      {/* show open login option at the bottom if a provider is detected */}
      {injectedProvider !== INJECTED_PROVIDERS.NOT_DETECTED && (
        <Web3ConnectButton
          titleLabel="Use Your Email or Social Login"
          subtitleLabel="Use this option to sign up using email, Google, Twitter, Discord, Github, Apple, or one of many other social networks"
          leftIconType="key"
          handleClick={handleSocialLogin}
        />
      )}
    </Box>
  );
};

export { StepThree };
