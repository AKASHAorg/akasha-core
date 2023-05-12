import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { EthProviders } from '@akashaorg/typings/sdk';
import { AnalyticsCategories, RootComponentProps } from '@akashaorg/typings/ui';
import {
  useAnalytics,
  useGetLogin,
  useGetProfile,
  useInjectedProvider,
  useNetworkState,
  useIsValidToken,
  useRequiredNetworkName,
  useConnectWallet,
  useLogin,
} from '@akashaorg/ui-awf-hooks';

import ConnectWallet from './connect-wallet';
import ChooseProvider from './choose-provider';
import InviteCode from './invite-code';

import { getStatusDescription, getStatusLabel } from '../../utils/connect';

const { MainAreaCardBox, useViewportSize } = DS;

export enum ConnectStep {
  CHOOSE_PROVIDER = 'Choose_Provider',
  CONNECT_WALLET = 'Connect_Wallet',
  INVITE_CODE = 'Invite_Code',
}

// @TODO: create a getter method in the routing plugin
export const baseAppLegalRoute = '/@akashaorg/app-legal';

const mapProviders = {
  [EthProviders.Web3Injected]: 'MetaMask',
  [EthProviders.WalletConnect]: 'WalletConnect',
};

const Connect: React.FC<RootComponentProps> = props => {
  const [step, setStep] = React.useState<ConnectStep>(ConnectStep.CHOOSE_PROVIDER);
  const [selectedProvider, setSelectedProvider] = React.useState<EthProviders>(EthProviders.None);
  const [signInComplete, setSignInComplete] = React.useState(false);
  const [inviteToken, setInviteToken] = React.useState<string>('');
  const [validInviteToken, setValidInviteToken] = React.useState<boolean>(false);

  const DEFAULT_TOKEN_LENGTH = 24;

  const { size } = useViewportSize();
  const isMobile = size === 'small';

  const [analyticsActions] = useAnalytics();
  const routingPlugin = React.useRef(props.plugins['@akashaorg/app-routing']?.routing);

  const loginQuery = useGetLogin();
  const profileDataReq = useGetProfile(loginQuery.data.pubKey, null, loginQuery.isSuccess);

  const { t } = useTranslation('app-auth-ewa');

  const injectedProviderQuery = useInjectedProvider();
  const injectedProvider = React.useMemo(
    () => injectedProviderQuery.data,
    [injectedProviderQuery.data],
  );

  const requiredNetworkQuery = useRequiredNetworkName();
  const connectWallet = useConnectWallet(selectedProvider);
  const networkStateQuery = useNetworkState(!!connectWallet.data);

  const requiredNetworkName = `${requiredNetworkQuery.data
    .charAt(0)
    .toLocaleUpperCase()}${requiredNetworkQuery.data.substring(1).toLocaleLowerCase()}`;

  const loginMutation = useLogin();

  const networkNotSupported = React.useMemo(() => {
    if (selectedProvider !== EthProviders.None && !networkStateQuery.isFetching) {
      return networkStateQuery.data.networkNotSupported;
    }
    return false;
  }, [networkStateQuery, selectedProvider]);

  const inviteTokenQuery = useIsValidToken({
    inviteToken,
    enabler: step === ConnectStep.INVITE_CODE && inviteToken?.length === DEFAULT_TOKEN_LENGTH,
  });

  const errorMessage = React.useMemo(() => {
    if (requiredNetworkQuery.data !== requiredNetworkName.toLowerCase()) {
      return `To use Akasha World during the alpha period, you'll need to set the ${mapProviders[selectedProvider]} network to ${requiredNetworkName}`;
    }

    return null;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requiredNetworkQuery, requiredNetworkName, selectedProvider]);

  const searchParam = new URLSearchParams(location.search);

  React.useEffect(() => {
    // retrieve token if already saved
    const savedToken = localStorage.getItem('@signUpToken');
    if (savedToken) {
      setInviteToken(savedToken);
    }
  }, [inviteToken]);

  React.useEffect(() => {
    // if user is logged in, do not show the connect page
    if (loginQuery.data?.id) {
      routingPlugin.current?.handleRedirect({
        search: searchParam,
        fallback: {
          appName: props.worldConfig.homepageApp,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginQuery, props.worldConfig.homepageApp]);

  React.useEffect(() => {
    if (
      connectWallet.isError &&
      connectWallet.error.message.includes('already pending for origin')
    ) {
      connectWallet.reset();
      connectWallet.mutateAsync();
    }
  }, [connectWallet]);

  const handleProviderSelect = (provider: EthProviders) => {
    setSelectedProvider(provider);
    //this is required because of the backend
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
    // resetState();
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
    setStep(ConnectStep.CONNECT_WALLET);
  };

  const handleCancelClick = () => {
    setValidInviteToken(false);
    // resetState();
    setSelectedProvider(EthProviders.None);
    setStep(ConnectStep.CHOOSE_PROVIDER);
  };

  const handleSignIn = () => {
    loginMutation.mutate({ selectedProvider, checkRegistered: true });
  };

  return (
    <MainAreaCardBox
      pad={{ vertical: 'large', horizontal: isMobile ? 'none' : 'large' }}
      responsive={true}
    >
      {(step === ConnectStep.CHOOSE_PROVIDER || selectedProvider === EthProviders.None) && (
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
              subtitleLabel: t('{{subtitleLabel}}', {
                subtitleLabel: injectedProvider.details.subtitleLabel,
              }),
            },
          }}
          onProviderSelect={handleProviderSelect}
        />
      )}
      {(step === ConnectStep.CONNECT_WALLET || step !== ConnectStep.INVITE_CODE) &&
        selectedProvider !== EthProviders.None && (
          <ConnectWallet
            isActive={!networkNotSupported}
            titleLine1Label={t('Connect to AKASHA World')}
            titleLine2Label={t('using your wallet')}
            selectedProvider={selectedProvider}
            status={1}
            errorMessage={t('{{errorMessage}}', { errorMessage })}
            statusLabel={t('{{statusLabel}}', {
              statusLabel: getStatusLabel(1, errorMessage),
            })}
            statusDescription={t('{{statusDescription}}', {
              statusDescription: getStatusDescription(1, errorMessage, selectedProvider, true),
            })}
            yourAddressLabel={t('Your Address')}
            connectedAddress={connectWallet.data}
            connectedAddressPlaceholder={t(
              'The address you select to connect with will be shown here',
            )}
            footerLabel={t('Disconnect or change way to connect')}
            onSignIn={handleSignIn}
            //onSignIn={checkSignupQuery.data ? fullSignUp.mutate : fireRemainingMessages}
            onSignInComplete={handleSignInComplete}
            onDisconnect={handleDisconnect}
            onConnectWallet={connectWallet.mutate}
            // onSwitchNetwork={handleSwitchNetworkMetamask}
          />
        )}
      {step === ConnectStep.INVITE_CODE && selectedProvider !== EthProviders.None && (
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
          onCancelClick={handleCancelClick}
        />
      )}
    </MainAreaCardBox>
  );
};

export default Connect;
