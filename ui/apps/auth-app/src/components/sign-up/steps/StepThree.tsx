import * as React from 'react';

import DS from '@akashaorg/design-system';
import { INJECTED_PROVIDERS } from '@akashaorg/awf-sdk/typings/lib/interfaces/common';
import { IInjectedProviderDetails } from '@akashaorg/ui-awf-hooks/lib/utils/getProviderDetails';
import { EthProviders } from '@akashaorg/awf-sdk/typings/lib/interfaces';
import {
  switchToRequiredNetwork,
  useAnalytics,
  useNetworkState,
} from '@akashaorg/ui-awf-hooks';
import { AnalyticsCategories } from '@akashaorg/ui-awf-typings/lib/analytics';

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
  connectProviderQuerySuccess?: boolean;
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
    connectProviderQuerySuccess,
    changeProviderLabel,
    selectedProvider,
    onProviderSelect,
  } = props;
  const [analyticsActions] = useAnalytics();

  // check network if connection is successfully established
  const networkStateQuery = useNetworkState(connectProviderQuerySuccess);

  const isOnRequiredNetwork = React.useMemo(() => {
    if (networkStateQuery.data?.networkNotSupported) {
      analyticsActions.trackEvent({
        category: AnalyticsCategories.SIGN_UP,
        action: 'Rinkeby Not Setup',
      });
    }
    return !networkStateQuery.data?.networkNotSupported;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkStateQuery.data]);

  const handleWeb3Injected = () => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.SIGN_UP,
      action: `${providerDetails.titleLabel} Selection`,
    });
    onProviderSelect(EthProviders.Web3Injected);
  };

  const handleWalletConnect = () => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.SIGN_UP,
      action: 'Wallet Connect Selection',
    });
    onProviderSelect(EthProviders.WalletConnect);
  };

  const handleSocialLogin = () => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.SIGN_UP,
      action: 'Social Login Selection',
    });
    onProviderSelect(EthProviders.Torus);
  };

  const handleChangeProvider = () => {
    onProviderSelect(EthProviders.None);
  };

  const handleNetworkCheck = () => {
    return networkStateQuery?.refetch();
  };

  const handleSwitchNetworkMetamask = () => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.SIGN_UP,
      action: 'Rinkeby Setup Prompt',
    });
    switchToRequiredNetwork();
  };

  const requiredNetworkProps = {
    ...props,
    isOnRequiredNetwork: isOnRequiredNetwork,
    isNetworkCheckLoading: networkStateQuery.isFetching,
    isNetworkCheckError: networkStateQuery.isError,
    onClickCheckNetwork: handleNetworkCheck,
    onClickSwitchMetamaskNetwork: handleSwitchNetworkMetamask,
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
          {isOnRequiredNetwork && <RequiredNetworkStep {...requiredNetworkProps} />}
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
          {!isOnRequiredNetwork && <RequiredNetworkStep {...requiredNetworkProps} />}
          {isOnRequiredNetwork && <RequiredNetworkStep {...requiredNetworkProps} />}
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
          {!isOnRequiredNetwork && <RequiredNetworkStep {...requiredNetworkProps} />}
          {isOnRequiredNetwork && <RequiredNetworkStep {...requiredNetworkProps} />}
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
