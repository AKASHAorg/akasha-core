import React from 'react';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import DS from '@akashaproject/design-system';
import { EthProviders } from '@akashaproject/sdk-typings/lib/interfaces';

import {
  switchToRequiredNetwork,
  useConnectProvider,
  useGetProfile,
  useInjectedProvider,
  useNetworkState,
  useRequiredNetworkName,
} from '@akashaproject/ui-awf-hooks';

import SignInStatus from './sign-in-status';
import { useTranslation } from 'react-i18next';
import ChooseProvider from './choose-provider';
import RequiredNetworkStep from '../sign-up/steps/required-network';
import { INJECTED_PROVIDERS } from '@akashaproject/sdk-typings/lib/interfaces/common';
import { useGetLogin, useSignUp } from '@akashaproject/ui-awf-hooks/lib/use-login';
import SuggestSignup from './suggest-signup';
import routes, { SIGN_UP_USERNAME } from '../../routes';

const { MainAreaCardBox, Box, Heading, HorizontalDivider } = DS;

const SignIn: React.FC<RootComponentProps> = props => {
  const [selectedProvider, setSelectedProvider] = React.useState<EthProviders>(EthProviders.None);
  const [signInComplete, setSignInComplete] = React.useState(false);
  const { t } = useTranslation();

  const navigateTo = React.useRef(props.navigateTo);

  const loginQuery = useGetLogin();
  const profileDataReq = useGetProfile(loginQuery.data.pubKey, null, loginQuery.isSuccess);

  const connectProviderQuery = useConnectProvider(selectedProvider);

  const injectedProviderQuery = useInjectedProvider();
  const injectedProvider = React.useMemo(
    () => injectedProviderQuery.data,
    [injectedProviderQuery.data],
  );

  const requiredNetworkQuery = useRequiredNetworkName();

  const networkStateQuery = useNetworkState(connectProviderQuery.data);
  const { signUpState, ethAddress, fireRemainingMessages, error, fullSignUp } = useSignUp(
    selectedProvider,
    true,
  );

  const isNotRegistered = React.useMemo(
    () => error && error.message.toLowerCase().trim() === 'profile not found',
    [error],
  );

  React.useEffect(() => {
    if (selectedProvider === EthProviders.WalletConnect && connectProviderQuery.isError) {
      setSelectedProvider(EthProviders.None);
    }
  }, [selectedProvider, connectProviderQuery.isError]);

  React.useEffect(() => {
    if (signInComplete && profileDataReq.isSuccess && !!profileDataReq.data?.userName) {
      return navigateTo.current((qsStringify, currentRedirect) => {
        if (!currentRedirect) {
          return '/';
        }
        return currentRedirect;
      });
    }
    if (signInComplete && profileDataReq.isSuccess && !profileDataReq.data?.userName) {
      navigateTo.current(routes[SIGN_UP_USERNAME]);
    }
  }, [signInComplete, profileDataReq]);

  const requiredNetworkName = `${requiredNetworkQuery.data
    .charAt(0)
    .toLocaleUpperCase()}${requiredNetworkQuery.data.substr(1).toLocaleLowerCase()}`;

  const handleSwitchNetworkMetamask = () => {
    switchToRequiredNetwork();
  };

  const handleNetworkRecheck = () => {
    networkStateQuery.refetch();
  };

  const handleProviderSelect = (provider: EthProviders) => {
    setSelectedProvider(provider);
  };

  const handleSignInComplete = () => {
    setSignInComplete(true);
  };

  const networkNotSupported = React.useMemo(() => {
    if (
      selectedProvider !== EthProviders.None &&
      !networkStateQuery.isFetching &&
      connectProviderQuery.data
    ) {
      return networkStateQuery.data.networkNotSupported;
    }
    return false;
  }, [networkStateQuery, selectedProvider, connectProviderQuery.data]);

  return (
    <>
      {isNotRegistered && <SuggestSignup onNavigate={props.singleSpa.navigateToUrl} />}
      {!isNotRegistered && (
        <MainAreaCardBox pad="large">
          <Box margin={{ bottom: 'xlarge' }}>
            <Box flex={true} direction="row">
              <Heading
                style={{ userSelect: 'none', width: '100%' }}
                level="4"
                size="small"
                textAlign="center"
                fill={true}
                margin={{ left: 'small' }}
              >
                {t('Sign In')}
              </Heading>
            </Box>
            <HorizontalDivider />
          </Box>
          <ChooseProvider
            selectedProvider={selectedProvider}
            providerIsConnected={connectProviderQuery.data}
            injectedProvider={injectedProvider}
            onProviderSelect={handleProviderSelect}
          />
          <SignInStatus
            isActive={
              selectedProvider !== EthProviders.None &&
              !networkNotSupported &&
              connectProviderQuery.data
            }
            status={signUpState}
            ethAddress={ethAddress}
            selectedProvider={selectedProvider}
            onSignRequest={() => fireRemainingMessages()}
            onSignIn={fullSignUp.mutate}
            signInError={error}
            requiredNetworkName={requiredNetworkName}
            onSignInComplete={handleSignInComplete}
          />
          {networkNotSupported && (
            <RequiredNetworkStep
              setRequiredNetworkLabel={t('To use Ethereum World during the alpha period, ')}
              setRequiredNetworkBoldLabel={`${t('you’ll need to set the')} ${
                selectedProvider === EthProviders.WalletConnect
                  ? 'WalletConnect'
                  : injectedProvider.name
              } ${t('network to')}`}
              setRequiredNetworkAccentLabel={requiredNetworkName}
              injectedProvider={
                selectedProvider === EthProviders.WalletConnect
                  ? INJECTED_PROVIDERS.NOT_DETECTED
                  : injectedProvider.name
              }
              isOnRequiredNetwork={!networkNotSupported}
              onClickSwitchMetamaskNetwork={handleSwitchNetworkMetamask}
              metamaskCTAIntroLabel={t('Click')}
              metamaskCTAAccentLabel={t('here')}
              metamaskCTALabel={t('to change the network.')}
              otherprovidersCTALabel={t('Please change the network manually')}
              variableIconButtonLabel={t(`I have set the network to ${requiredNetworkName}`)}
              variableIconErrorLabel={t(
                `Please set the network to ${requiredNetworkName} and try again.`,
              )}
              onClickCheckNetwork={handleNetworkRecheck}
              selectedProvider={selectedProvider}
            />
          )}
        </MainAreaCardBox>
      )}
    </>
  );
};

export default SignIn;
