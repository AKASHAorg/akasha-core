import * as React from 'react';
import DS from '@akashaproject/design-system';

const { Box, Text, Web3ConnectButton } = DS;

export interface IStepThreeProps {
  textLine1: string;
  textLine2bold: string;
  textLine2: string;
}

const StepThree: React.FC<IStepThreeProps> = props => {
  const { textLine1, textLine2bold, textLine2 } = props;

  const handleConnectWallet = () => {
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
      <Web3ConnectButton
        boxMargin={{ bottom: 'medium' }}
        titleLabel="Connect a Wallet"
        subtitleLabel="Use this option to sign up using your Ethereum wallet. You'll be able to choose which wallet to connect in the next screen."
        leftIconType="wallet"
        handleClick={handleConnectWallet}
      />
      <Web3ConnectButton
        boxMargin={{ bottom: 'medium' }}
        titleLabel="WalletConnect"
        subtitleLabel="WalletConnect has had reliability problems for us in the past. Consider it experimental at this time."
        leftIconType="walletconnect"
        handleClick={handleWalletConnect}
      />
      <Web3ConnectButton
        titleLabel="Use Your Email or Social Login"
        subtitleLabel="Use this option to sign up using email, Google, Twitter, Discord, Github, Apple, or one of many other social networks"
        leftIconType="key"
        handleClick={handleSocialLogin}
      />
    </Box>
  );
};

export { StepThree };
