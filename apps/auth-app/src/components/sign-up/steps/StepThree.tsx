import * as React from 'react';

import DS from '@akashaproject/design-system';
import { INJECTED_PROVIDERS } from '@akashaproject/awf-sdk/typings/lib/interfaces/common';
import { IInjectedProviderDetails } from '@akashaproject/ui-awf-hooks/lib/utils/getProviderDetails';

const { Box, Text, Web3ConnectButton } = DS;

export interface IStepThreeProps {
  paragraphOneLabel: string;
  paragraphTwoLabel: string;
  paragraphTwoBoldLabel: string;
  paragraphThreeLabel: string;
  paragraphThreeBoldLabel: string;
  paragraphFourLabel: string;
  paragraphFourAccentLabel: string;
  injectedProvider: INJECTED_PROVIDERS;
  providerDetails: IInjectedProviderDetails;
  walletConnectDescription: string;
  socialLoginTitleLabel: string;
  socialLoginDescription: string;
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
    walletConnectDescription,
    socialLoginTitleLabel,
    socialLoginDescription,
  } = props;

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
          handleClick={handleConnectProvider}
        />
      )}
      <Web3ConnectButton
        boxMargin={{ bottom: 'medium' }}
        titleLabel="WalletConnect"
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
    </Box>
  );
};

export { StepThree };
