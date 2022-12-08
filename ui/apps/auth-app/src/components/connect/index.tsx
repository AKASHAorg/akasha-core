import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { EthProviders } from '@akashaorg/typings/sdk';
import { AnalyticsCategories, RootComponentProps } from '@akashaorg/typings/ui';
import {
  useAnalytics,
  useConnectProvider,
  useGetLogin,
  useGetProfile,
  useInjectedProvider,
  useNetworkState,
  useSignUp,
  useIsValidToken,
} from '@akashaorg/ui-awf-hooks';

import ConnectWallet from './connect-wallet';
import ChooseProvider from './choose-provider';
import InviteCode from './invite-code';

import { getStatusDescription, getStatusLabel } from '../../utils/connect';

const { MainAreaCardBox } = DS;

export enum ConnectStep {
  CHOOSE_PROVIDER = 'Choose_Provider',
  CONNECT_WALLET = 'Connect_Wallet',
  INVITE_CODE = 'Invite_Code',
}

// export enum ConnectWalletStatus {
//   CONNECTING = 'Connecting',
//   CONNECTED = 'Connected',
//   ERROR = 'Error',
// }

const baseAppLegalRoute = '/@akashaorg/app-legal';

const Connect: React.FC<RootComponentProps> = props => {
  const [step, setStep] = React.useState<ConnectStep>(ConnectStep.CHOOSE_PROVIDER);
  const [selectedProvider, setSelectedProvider] = React.useState<EthProviders>(EthProviders.None);
  const [signInComplete, setSignInComplete] = React.useState(false);
  const [inviteToken, setInviteToken] = React.useState<string>('');
  const [validInviteToken, setValidInviteToken] = React.useState<boolean>(false);

  const [errorText] = React.useState<string>('Failed to Authorize');

  const DEFAULT_TOKEN_LENGTH = 24;

  const [analyticsActions] = useAnalytics();
  const routingPlugin = React.useRef(props.plugins['@akashaorg/app-routing']?.routing);

  const loginQuery = useGetLogin();
  const profileDataReq = useGetProfile(loginQuery.data.pubKey, null, loginQuery.isSuccess);

  const { t } = useTranslation('app-auth-ewa');

  const connectProviderQuery = useConnectProvider(selectedProvider);

  const injectedProviderQuery = useInjectedProvider();
  const injectedProvider = React.useMemo(
    () => injectedProviderQuery.data,
    [injectedProviderQuery.data],
  );

  // const requiredNetworkQuery = useRequiredNetworkName();
  const networkStateQuery = useNetworkState(connectProviderQuery.data);

  const { ethAddress, fullSignUp, signUpState, error, fireRemainingMessages, resetState } =
    useSignUp(selectedProvider, true);

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

  // const isNotRegistered = React.useMemo(() => {
  //   if (error?.message && typeof error.message === 'string') {
  //     return error.message.toLowerCase().trim() === 'profile not found';
  //   }
  //   return false;
  // }, [error]);

  const inviteTokenQuery = useIsValidToken({
    inviteToken,
    enabler: inviteToken?.length === DEFAULT_TOKEN_LENGTH,
  });

  React.useEffect(() => {
    // retrieve token if already saved
    const savedToken = localStorage.getItem('@signUpToken');
    if (savedToken) {
      setInviteToken(savedToken);
    }
  }, [inviteToken]);

  React.useEffect(() => {
    if (connectProviderQuery.isError) {
      setSelectedProvider(EthProviders.None);
    }
  }, [connectProviderQuery.isError]);

  React.useEffect(() => {
    // if not registered, show invite code page
    if (
      validInviteToken === false &&
      error?.message &&
      typeof error.message === 'string' &&
      error.message.toLowerCase().trim() === 'profile not found'
    ) {
      setStep(ConnectStep.INVITE_CODE);
    }
  }, [error]);

  React.useEffect(() => {
    if (signInComplete && profileDataReq.isSuccess && !!profileDataReq.data?.userName) {
      const searchParam = new URLSearchParams(location.search);
      routingPlugin.current?.handleRedirect({
        search: searchParam,
        fallback: {
          appName: props.worldConfig.homepageApp,
        },
      });
    }
    if (signInComplete && profileDataReq.isSuccess && !profileDataReq.data?.userName) {
      routingPlugin.current?.navigateTo({
        appName: '@akashaorg/app-profile',
        getNavigationUrl: navRoutes => `${navRoutes.myProfile}/edit`,
      });
    }
  }, [signInComplete, profileDataReq, props.worldConfig.homepageApp]);

  // const requiredNetworkName = `${requiredNetworkQuery.data
  //   .charAt(0)
  //   .toLocaleUpperCase()}${requiredNetworkQuery.data.substr(1).toLocaleLowerCase()}`;

  // const handleSwitchNetworkMetamask = () => {
  //   switchToRequiredNetwork();
  // };

  // const handleNetworkRecheck = () => {
  //   networkStateQuery.refetch();
  // };

  const handleProviderSelect = (provider: EthProviders) => {
    setSelectedProvider(provider);
    localStorage.setItem('@acceptedTermsAndPrivacy', JSON.stringify(true));
    setStep(ConnectStep.CONNECT_WALLET);
  };

  const handleSignInComplete = () => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.SIGN_IN,
      action: 'Successful Sign In',
    });
    setSignInComplete(true);
  };

  const handleDisconnect = () => {
    setSelectedProvider(EthProviders.None);
    setStep(ConnectStep.CHOOSE_PROVIDER);
  };

  const onInputTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const token = e.target.value;
    localStorage.setItem('@signUpToken', token);
    setInviteToken(token);
  };

  const handleContinueClick = () => {
    setValidInviteToken(true);
    fireRemainingMessages();
    setStep(ConnectStep.CONNECT_WALLET);
  };

  return (
    <MainAreaCardBox pad="large">
      {step === ConnectStep.CHOOSE_PROVIDER && (
        <ChooseProvider
          titleLabel={t('✨ Welcome to AKASHA World ✨')}
          subtitleLabel={t('Choose a way to connect')}
          infoLabel={t('Web3 Wallets')}
          accordionTitle={t('What is a wallet?')}
          accordionContent={t(
            "A web3 wallet is simply a digital wallet that can be used to store digital assets. These digital assets include Non-fungible tokens (NFTs). It's also a tool that allows people to interact with Dapps and pltaforms like AKASHA world with out storing any personal data.",
          )}
          accordionFooter={t('Get your own wallet')}
          accordionFooterCTA={t('Get a MetaMask Wallet')}
          accordionFooterCTAUrl="https://metamask.io"
          wcSubtitleLabel={t('Scan with WalletConnect')}
          footerLabel={t('By connecting to AKASHA world, you agree to our ')}
          footerCTAArr={[
            {
              href: `${baseAppLegalRoute}/terms-of-service`,
              label: t('Terms & Conditions'),
              delimiter: ', ',
            },
            {
              href: `${baseAppLegalRoute}/privacy-policy`,
              label: t('Privacy Policy'),
              delimiter: ', and ',
            },
            {
              href: `${baseAppLegalRoute}/code-of-conduct`,
              label: t('Code of Conduct'),
              delimiter: '.',
            },
          ]}
          injectedProvider={{
            ...injectedProvider,
            details: {
              ...injectedProvider.details,
              subtitleLabel: t(injectedProvider.details.subtitleLabel),
            },
          }}
          onProviderSelect={handleProviderSelect}
        />
      )}
      {((validInviteToken && signUpState <= 1) ||
        signUpState > 1 ||
        step === ConnectStep.CONNECT_WALLET) &&
        selectedProvider !== EthProviders.None && (
          <ConnectWallet
            isActive={!networkNotSupported && connectProviderQuery.data}
            titleLine1Label={t('{{connect}} to AKASHA World', {
              connect: signUpState > 5 ? 'Connected' : 'Connecting',
            })}
            titleLine2Label={t('using your wallet')}
            selectedProvider={selectedProvider}
            status={signUpState}
            statusLabel={t(getStatusLabel(signUpState, errorText))}
            statusDescription={t(getStatusDescription(signUpState, selectedProvider))}
            yourAddressLabel={t('Your Address')}
            connectedAddress={ethAddress}
            connectedAddressPlaceholder={t(
              'the address you select to connect with will be shown here',
            )}
            footerLabel="Disconnect or change way to connect"
            onSignIn={validInviteToken ? fireRemainingMessages : fullSignUp.mutate}
            onSignInComplete={handleSignInComplete}
            onDisconnect={handleDisconnect}
          />
        )}
      {step === ConnectStep.INVITE_CODE && !validInviteToken && (
        <InviteCode
          paragraphOneLabel={t(
            "Oh-uh! We have detected that  there's no account associated with the address you're trying to connect",
          )}
          paragraphThreePartOneLabel={t("If you don't have an invitation code, you can request it")}
          paragraphThreeAccentLabel={t(' here ')}
          writeToUsUrl={'mailto:alpha@ethereum.world'}
          paragraphThreePartTwoLabel={t("and we'll get back to you shortly!")}
          paragraphTwo={t('You need an invitation code to sign up!')}
          inputPlaceholder={t('Your Invitation Code')}
          inputValue={inviteToken}
          submitted={!inviteTokenQuery?.isLoading}
          submitting={inviteTokenQuery?.isLoading}
          success={inviteTokenQuery?.isSuccess}
          // also toggle hasError if input value exceeds default token length
          hasError={inviteTokenQuery?.isError}
          errorMsg={inviteTokenQuery?.error?.message}
          successPromptLabel={t('Looks good 🙌🏽')}
          cancelButtonLabel={t('Cancel')}
          continueButtonLabel={t('Continue')}
          onChange={onInputTokenChange}
          onContinueClick={handleContinueClick}
          onCancelClick={() => setStep(ConnectStep.CHOOSE_PROVIDER)}
        />
      )}
    </MainAreaCardBox>
  );
};

export default Connect;
