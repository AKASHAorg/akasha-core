import * as React from 'react';

import DS from '@akashaproject/design-system';
import { INJECTED_PROVIDERS } from '@akashaproject/awf-sdk/typings/lib/interfaces/common';
import { IInjectedProviderDetails } from '@akashaproject/ui-awf-hooks/lib/utils/getProviderDetails';
import { EthProviders } from '@akashaproject/awf-sdk/typings/lib/interfaces';

import { StyledButton } from './styles';

const { Box, Text, Icon, VariableIconButton, Web3ConnectButton } = DS;

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
  tagLabel: string;
  walletConnectDescription: string;
  socialLoginTitleLabel: string;
  socialLoginDescription: string;
  changeProviderLabel: string;
  setRinkebyLabel: string;
  setRinkebyBoldLabel: string;
  setRinkebyAccentLabel: string;
  isOnRinkebyLabel: string;
  variableIconButtonLabel: string;
  variableIconErrorLabel: string;
  buttonLabel: string;
  selectedProvider: EthProviders;
  isOnRinkeby: boolean;
  isNetworkCheckLoading: boolean;
  isNetworkCheckError: boolean;
  onClickCheckNetwork: () => void;
  onProviderSelect: (provider: EthProviders) => void;
  onButtonClick: () => void;
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
    walletConnectDescription,
    socialLoginTitleLabel,
    socialLoginDescription,
    changeProviderLabel,
    setRinkebyLabel,
    setRinkebyBoldLabel,
    setRinkebyAccentLabel,
    isOnRinkebyLabel,
    variableIconButtonLabel,
    variableIconErrorLabel,
    buttonLabel,
    selectedProvider,
    isOnRinkeby,
    isNetworkCheckLoading,
    isNetworkCheckError,
    onClickCheckNetwork,
    onProviderSelect,
    onButtonClick,
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
      {selectedProvider == EthProviders.Torus && (
        <Box direction="row" justify="between" margin={{ bottom: 'large' }}>
          <Text size="large" weight="bold">
            {socialLoginTitleLabel}
          </Text>
        </Box>
      )}
      {/* show this, if selected provider is web3 injected */}
      {selectedProvider === EthProviders.Web3Injected && (
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
          {!isOnRinkeby && (
            <>
              {/* if network is not Rinkeby */}
              <Text size="large" margin={{ bottom: 'large' }}>
                {setRinkebyLabel}
                <Text size="large" weight="bold">
                  {setRinkebyBoldLabel}
                </Text>{' '}
                <Text size="large" weight="bold" color="accentText">
                  {setRinkebyAccentLabel}
                </Text>
                .
              </Text>
              {/* video area (if injectedProvider is MetaMask): setting to Rinkeby on MetaMask */}
              <VariableIconButton
                titleLabel={variableIconButtonLabel}
                errorLabel={variableIconErrorLabel}
                isLoading={isNetworkCheckLoading}
                isError={isNetworkCheckError}
                onClick={onClickCheckNetwork}
              />
            </>
          )}
          {isOnRinkeby && (
            <>
              {/* if network is Rinkeby */}
              <Text size="large" margin={{ bottom: 'large' }}>
                {isOnRinkebyLabel}
              </Text>
              <Box
                align="flex-end"
                justify="center"
                margin={{ top: 'small' }}
                pad={{ top: 'medium' }}
                border={{ side: 'top', color: 'border', size: 'xsmall' }}
              >
                <StyledButton
                  primary={true}
                  icon={<Icon type="arrowRight" color="white" />}
                  reverse={true}
                  label={buttonLabel}
                  onClick={onButtonClick}
                />
              </Box>
            </>
          )}
        </>
      )}
      {/* show this, if no selected provider */}
      {selectedProvider === EthProviders.None && (
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
        </>
      )}
    </Box>
  );
};

export { StepThree };
