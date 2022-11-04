import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { EthProviders } from '@akashaorg/typings/sdk';
import {
  useIsValidToken,
  useConnectProvider,
  useInjectedProvider,
  useRequiredNetworkName,
} from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/typings/ui';

import { StepOne } from './steps/StepOne';
import { StepTwo } from './steps/StepTwo';
import { StepThree } from './steps/StepThree';
import { StepFour } from './steps/StepFour';
import { StepFive } from './steps/StepFive';

import { SIGN_UP_USERNAME } from '../../routes';

const { SteppedActionCard } = DS;

export interface SignUpProps {
  activeIndex?: number;
}

const SignUp: React.FC<RootComponentProps & SignUpProps> = props => {
  const routingPlugin = props.plugins['@akashaorg/app-routing']?.routing;

  const [activeIndex, setActiveIndex] = React.useState<number>(props.activeIndex || 0);
  const [inviteToken, setInviteToken] = React.useState<string>('');
  const [selectedProvider, setSelectedProvider] = React.useState<EthProviders>(EthProviders.None);

  const DEFAULT_TOKEN_LENGTH = 24;

  const { t } = useTranslation('app-auth-ewa');

  const inviteTokenQuery = useIsValidToken({
    inviteToken,
    enabler: inviteToken?.length === DEFAULT_TOKEN_LENGTH,
  });

  const getInjectedProviderQuery = useInjectedProvider();
  const injectedProvider = getInjectedProviderQuery.data;

  const connectProviderQuery = useConnectProvider(selectedProvider);

  const requiredNetworkQuery = useRequiredNetworkName();

  // convert to title case
  const requiredNetworkName = `${requiredNetworkQuery.data
    .charAt(0)
    .toLocaleUpperCase()}${requiredNetworkQuery.data.substring(1).toLocaleLowerCase()}`;

  React.useEffect(() => {
    // retrieve token if already saved
    const savedToken = localStorage.getItem('@signUpToken');
    if (savedToken) {
      setInviteToken(savedToken);
    }
  }, []);

  React.useEffect(() => {
    // if there is an error while trying to connect provider, revert selected provider state
    if (connectProviderQuery.isError) {
      setSelectedProvider(EthProviders.None);
    }
  }, [connectProviderQuery.isError]);

  const handleIconClick = () => {
    const searchParam = new URLSearchParams(location.search);
    routingPlugin?.handleRedirect({
      search: searchParam,
      fallback: {
        appName: props.worldConfig.homepageApp,
      },
    });
  };

  const handleNextStep = () => {
    if (activeIndex === 3) {
      routingPlugin?.navigateTo({
        appName: '@akashaorg/app-auth-ewa',
        getNavigationUrl: routes => routes[SIGN_UP_USERNAME],
      });
    }
    setActiveIndex(prev => prev + 1);
  };

  const handleProviderSelect = (provider: EthProviders) => {
    setSelectedProvider(provider);
  };

  const onInputTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInviteToken(e.target.value);
  };

  return (
    <SteppedActionCard
      titleLabel={t('Sign Up')}
      activeIndex={activeIndex}
      stepLabels={[
        t('Invitation Code'),
        t('Legal Agreements'),
        t('Choose How to Sign Up'),
        t('Sign Wallet Requests'),
        t('Choose Username'),
      ]}
      handleIconClick={handleIconClick}
    >
      {activeIndex === 0 && (
        <StepOne
          paragraphOneLabel={t(
            'We are currently in a private alpha. You need the invitation code we emailed you to sign up.',
          )}
          paragraphTwoBoldLabel={t('If you have not received an invitation code')}
          paragraphTwoAccentLabel={t('you can request to be placed on the waitlist')}
          writeToUsUrl={'mailto:alpha@ethereum.world'}
          paragraphTwoLabel={t('You will get one soon thereafter')}
          paragraphThree={t('Your invitation code is valid! Please proceed to create your account')}
          buttonLabel={t('Continue to Step 2 ')}
          inputLabel={t('Invitation Code')}
          inputPlaceholder={t('Type your invitation code here')}
          noArrowRight={true}
          inputValue={inviteToken}
          submitted={!inviteTokenQuery?.isLoading}
          submitting={inviteTokenQuery?.isLoading}
          success={inviteTokenQuery?.isSuccess}
          // also toggle hasError if input value exceeds default token length
          hasError={inviteTokenQuery?.isError}
          errorMsg={inviteTokenQuery?.error?.message}
          onChange={onInputTokenChange}
          onButtonClick={handleNextStep}
        />
      )}
      {activeIndex === 1 && (
        <StepTwo
          textLegalPartOne={t('Please confirm below that you have read and agree to our')}
          textLegalPartTwo={t('Also acknowledge our')}
          textLegalPartThree={t(
            'as the basis for respectful interactions with each other on Ethereum World',
          )}
          textConnector={t('and')}
          textLegalTerms={t('Terms of Service')}
          textLegalPrivacy={t('Privacy Policy')}
          textLegalConduct={t('Code of Conduct')}
          textLegalTermsLink="/legal/terms-of-service"
          textLegalPrivacyLink="/legal/privacy-policy"
          textLegalConductLink="/legal/code-of-conduct"
          checkboxLabelTerms={t('I accept the Terms of Service')}
          checkboxLabelPrivacy={t('I accept the Privacy Policy')}
          checkboxLabelConduct={t('I acknowledge the Code of Conduct')}
          buttonLabel={t('Continue to Step 3 ')}
          onButtonClick={handleNextStep}
        />
      )}
      {activeIndex === 2 && (
        <StepThree
          paragraphOneLabel={t(
            "You now need to choose how you'll sign up on  Ethereum World. If you are experienced with Ethereum, you may connect your wallet.",
          )}
          paragraphTwoBoldLabel={t(
            'If you are new to Ethereum, we recommend using the email or social login option.',
          )}
          paragraphTwoLabel={t(
            "As part of signing up, you'll get a free Ethereum wallet that you can use to send or receive crypto and sign in to other Ethereum sites.",
          )}
          paragraphThreeLabel={t(
            "While you're free to connect any wallet that works with the {{requiredNetworkName}} Network,",
            { requiredNetworkName },
          )}
          paragraphThreeBoldLabel={t('we recommend MetaMask.')}
          paragraphFourLabel={t(
            'We have tested MetaMask the most out of all Ethereum Wallets. You can install it',
          )}
          paragraphFourAccentLabel={t('here')}
          injectedProvider={injectedProvider.name}
          providerDetails={{
            ...injectedProvider.details,
            subtitleLabel: t('{{ injectedProviderSubtitleLabel }}', {
              injectedProviderSubtitleLabel: injectedProvider.details.subtitleLabel,
            }),
          }}
          tagLabel={t('auto-detected')}
          walletConnectTitleLabel="WalletConnect"
          walletConnectDescription={t(
            'The wallet you are using must allow switching the Ethereum network to Rinkeby',
          )}
          socialLoginTitleLabel={t('Email or Social Login')}
          socialLoginDescription={t(
            'Use this option to sign up using email, Google, Twitter, Discord, Github, Apple, or one of many other social networks',
          )}
          providerConnected={
            connectProviderQuery.isSuccess && selectedProvider !== EthProviders.None
          }
          connectProviderQuerySuccess={connectProviderQuery.isSuccess}
          changeProviderLabel={t('Change')}
          setRequiredNetworkLabel={t('To use Ethereum World during the alpha period, ')}
          setRequiredNetworkBoldLabel={t(
            "you'll need to set the {{ selectedProvider }} network to",
            {
              selectedProvider:
                selectedProvider === EthProviders.WalletConnect
                  ? 'WalletConnect'
                  : injectedProvider.name,
            },
          )}
          setRequiredNetworkAccentLabel={requiredNetworkName}
          metamaskCTAIntroLabel={t('Click')}
          metamaskCTAAccentLabel={t('here')}
          metamaskCTALabel={t('to change the network')}
          otherprovidersCTALabel={t('Please change the network manually')}
          isOnRequiredNetworkLabel={
            selectedProvider === EthProviders.Torus
              ? t('You have connected using Email or Social login. Click the button to continue')
              : t(
                  "We have detected that the {{ selectedProvider }} network is set to {{ requiredNetworkName }}. We'll now proceed to connect your wallet to Ethereum World.",
                  {
                    selectedProvider:
                      selectedProvider === EthProviders.WalletConnect
                        ? 'WalletConnect'
                        : injectedProvider.name,
                    requiredNetworkName,
                  },
                )
          }
          variableIconButtonLabel={t('I have set the network to {{ requiredNetworkName }}', {
            requiredNetworkName,
          })}
          variableIconErrorLabel={t(
            'Please set the network to {{ requiredNetworkName }} and try again.',
            { requiredNetworkName },
          )}
          buttonLabel={t('Continue to Step 4 ')}
          selectedProvider={selectedProvider}
          onProviderSelect={handleProviderSelect}
          onButtonClick={handleNextStep}
        />
      )}
      {activeIndex === 3 && (
        <StepFour
          textExplanation={t("We'll explain why we need each along the way")}
          textExplanationOpenLogin={t(
            'The following actions have been completed because you signed up using Email or social log in.',
          )}
          textExplanationBold={t(
            "As part of your sign-up process, you'll be required to select the account to connect and sign three transactions in your wallet",
          )}
          textPacify={t(
            'Additionally, we will not be privy to your wallet password, private key, balance, or any other information',
          )}
          textPacifyBold={t("Don't worry, signing up is free")}
          textChooseAddress={t('Choose the Ethereum address to connect')}
          textChooseAddressExplanation={t(
            'We will associate your Ethereum World account with this address.',
          )}
          textButtonSelect={t('Select Address in Wallet')}
          textVerifyOwnership={t('Verify that you own this address')}
          textVerifyOwnershipExplanation={t(
            "You'll be able to sign in to Ethereum World using this address.",
          )}
          textGetAccess={t('Sign the message to get access to Ethereum World services')}
          textGetAccessExplanation={t(
            'You will be able to create, publish and store content on Ethereum World and interact with its services.',
          )}
          textCreateProfile={t('Consent to register your public profile on Ethereum World')}
          textCreateProfileExplanation={t('Create a public record on Ethereum World.')}
          textAddressComplete={t("You've connected an Ethereum address")}
          textVerifyOwnershipComplete={t('You have verified that you own this address')}
          textGetAccessComplete={t('Message is signed and you are now connected')}
          textProfileComplete={t('You have registered your public profile on Ethereum World')}
          textCompleted={
            "That's it! The hardest part is complete. Now you only need to choose a username and you'll be done!"
          }
          textButtonSignInWallet={t('Sign in Wallet')}
          textRequestProblem={t(
            "Not seeing the wallet request? Please make sure to open your wallet extension. If you're still not seeing it, we can resend it.",
          )}
          textRequestResend={t('Resend request')}
          textAgain={t('Try Again')}
          textSuggestSignIn={t(
            'You already created an Ethereum World profile with the provided address. Perhaps you wish to',
          )}
          textSuggestSignInLink={t('Sign In')}
          buttonLabel={t('Continue to Step 5')}
          onButtonClick={handleNextStep}
          providerConnected={
            connectProviderQuery.isSuccess && selectedProvider !== EthProviders.None
          }
          provider={selectedProvider}
          requiredNetworkName={requiredNetworkName}
        />
      )}
      {activeIndex === 4 && (
        <StepFive
          textIdentifier={t('Your username identifies you in Ethereum World.')}
          textUnchangeable={t('It is unique to you and, once chosen, cannot be changed.')}
          textEnsure={t('Please ensure your username meets the following criteria')}
          textCriterionLowercase={t('Includes only lowercase letters and/or numbers')}
          textCriterionEndsWithLetter={t('Ends with a letter')}
          textCriterionCharCount={t('Between 3 and 14 characters')}
          textUsername={t('Username')}
          textInputPlaceholder={t('Type your username here')}
          textUsernameTakenError={t(
            'Sorry, this username has already been claimed by another Etherean. Please try a different one.',
          )}
          textUsernameUnknownError={t(
            'Sorry, there is an error validating the username. Please try again later.',
          )}
          textUsernameAvailable={t('This username is available, hooray!')}
          buttonLabel={t('Complete Sign-Up')}
          navigateTo={props.plugins['@akashaorg/app-routing']?.routing?.navigateTo}
        />
      )}
    </SteppedActionCard>
  );
};

export default SignUp;
