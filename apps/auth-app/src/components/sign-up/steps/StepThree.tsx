import * as React from 'react';

import DS from '@akashaproject/design-system';
import { INJECTED_PROVIDERS } from '@akashaproject/awf-sdk/typings/lib/interfaces/common';
import { IInjectedProviderDetails } from '@akashaproject/ui-awf-hooks/lib/utils/getProviderDetails';
import { EthProviders } from '@akashaproject/awf-sdk/typings/lib/interfaces';

import { StyledButton } from './styles';

const { Box, Text, Icon, VariableIconButton, Web3ConnectButton } = DS;

interface IRequiredNetworkStepProps {
  injectedProvider: INJECTED_PROVIDERS;
  isOnRequiredNetwork: boolean;
  setRequiredNetworkLabel?: string;
  setRequiredNetworkBoldLabel?: string;
  setRequiredNetworkAccentLabel?: string;
  metamaskCTAIntroLabel?: string;
  metamaskCTAAccentLabel?: string;
  metamaskCTALabel?: string;
  otherprovidersCTALabel?: string;
  variableIconButtonLabel?: string;
  variableIconErrorLabel?: string;
  isNetworkCheckLoading?: boolean;
  isNetworkCheckError?: boolean;
  isOnRequiredNetworkLabel?: string;
  buttonLabel?: string;
  onClickSwitchMetamaskNetwork: () => void;
  onClickCheckNetwork?: () => void;
  onButtonClick?: () => void;
}
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
  selectedProvider: EthProviders;
  onProviderSelect: (provider: EthProviders) => void;
}

const RequiredNetworkStep: React.FC<IRequiredNetworkStepProps> = props => {
  const {
    injectedProvider,
    isOnRequiredNetwork,
    setRequiredNetworkLabel,
    setRequiredNetworkBoldLabel,
    setRequiredNetworkAccentLabel,
    metamaskCTAIntroLabel,
    metamaskCTAAccentLabel,
    metamaskCTALabel,
    otherprovidersCTALabel,
    variableIconButtonLabel,
    variableIconErrorLabel,
    isNetworkCheckLoading,
    isNetworkCheckError,
    isOnRequiredNetworkLabel,
    buttonLabel,
    onClickSwitchMetamaskNetwork,
    onClickCheckNetwork,
    onButtonClick,
  } = props;
  if (isOnRequiredNetwork) {
    return (
      <>
        <Text size="large" margin={{ bottom: 'large' }}>
          {isOnRequiredNetworkLabel}
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
    );
  }
  return (
    <>
      <Text size="large" margin={{ bottom: 'large' }}>
        {setRequiredNetworkLabel}
        <Text size="large" weight="bold">
          {setRequiredNetworkBoldLabel}
        </Text>{' '}
        <Text size="large" weight="bold" color="accentText">
          {setRequiredNetworkAccentLabel}
        </Text>
        .{' '}
        {injectedProvider === INJECTED_PROVIDERS.METAMASK && (
          <>
            <Text size="large">
              {metamaskCTAIntroLabel}{' '}
              <Text
                size="large"
                color="accentText"
                style={{ cursor: 'pointer' }}
                onClick={onClickSwitchMetamaskNetwork}
              >
                {metamaskCTAAccentLabel}
              </Text>{' '}
              {metamaskCTALabel}
            </Text>
          </>
        )}
        {injectedProvider !== INJECTED_PROVIDERS.METAMASK && (
          <>
            <Text size="large">{otherprovidersCTALabel}</Text>
          </>
        )}
      </Text>
      {/* video area (if injectedProvider is MetaMask): setting to the required network on MetaMask */}
      <VariableIconButton
        titleLabel={variableIconButtonLabel}
        errorLabel={variableIconErrorLabel}
        isLoading={isNetworkCheckLoading}
        isError={isNetworkCheckError}
        onClick={onClickCheckNetwork}
      />
    </>
  );
};

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
