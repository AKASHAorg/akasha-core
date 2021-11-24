import React from 'react';
import { lastValueFrom } from 'rxjs';
import { useTranslation } from 'react-i18next';

import DS from '@akashaproject/design-system';
import getSDK from '@akashaproject/awf-sdk';
import { EthProviders } from '@akashaproject/awf-sdk/typings/lib/interfaces';
import { useInjectedProvider } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

import { StepOne } from './steps/StepOne';
import { StepTwo } from './steps/StepTwo';
import { StepThree } from './steps/StepThree';
import { StepFour } from './steps/StepFour';
import { StepFive } from './steps/StepFive';

import routes, { SIGN_UP_USERNAME } from '../../routes';

const { Box, SignUpCard } = DS;

export interface IInviteTokenForm {
  submitted: boolean;
  submitting: boolean;
  success: boolean;
  hasError: boolean;
  errorMsg: string;
}

export interface SignUpProps {
  activeIndex?: number;
}

const SignUp: React.FC<RootComponentProps & SignUpProps> = props => {
  const { navigateToUrl } = props.singleSpa;

  const [activeIndex, setActiveIndex] = React.useState<number>(props.activeIndex || 2);
  const [inviteToken, setInviteToken] = React.useState<string>('');
  const [selectedProvider, setSelectedProvider] = React.useState<EthProviders>(EthProviders.None);
  const [inviteTokenForm, setinviteTokenForm] = React.useState<IInviteTokenForm>({
    submitted: false,
    submitting: false,
    success: false,
    hasError: false,
    errorMsg: '',
  });

  const getInjectedProviderQuery = useInjectedProvider();
  const injectedProvider = getInjectedProviderQuery.data;

  const { t } = useTranslation();
  const sdk = getSDK();

  const DEFAULT_TOKEN_LENGTH = 24;

  const handleIconClick = () => {
    if (activeIndex === 0) return;
    setActiveIndex(prev => prev - 1);
  };

  const handleNextStep = () => {
    if (activeIndex === 3) {
      navigateToUrl(routes[SIGN_UP_USERNAME]);
    }
    setActiveIndex(prev => prev + 1);
  };

  const handleProviderSelect = (provider: EthProviders) => {
    setSelectedProvider(provider);
  };

  const onInputTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setinviteTokenForm({
      submitted: false,
      submitting: false,
      success: false,
      hasError: false,
      errorMsg: '',
    });
    setInviteToken(e.target.value);
  };

  const checkIsValidToken = () => {
    setinviteTokenForm({
      submitted: false,
      submitting: true,
      success: false,
      hasError: false,
      errorMsg: '',
    });
    lastValueFrom(sdk.api.auth.validateInvite(inviteToken))
      .then(() => {
        setinviteTokenForm({
          submitted: true,
          submitting: false,
          success: true,
          hasError: false,
          errorMsg: '',
        });
      })
      .catch((err: Error) => {
        setinviteTokenForm({
          submitted: true,
          submitting: false,
          success: false,
          hasError: true,
          errorMsg: err.message,
        });
      });
  };

  const validateTokenFn = (e: MouseEvent) => {
    e.preventDefault();
    checkIsValidToken();
  };

  const triggerInviteValidation = () => {
    if (inviteToken?.length && inviteToken?.length === DEFAULT_TOKEN_LENGTH) {
      checkIsValidToken();
    }
  };

  React.useEffect(
    triggerInviteValidation,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inviteToken],
  );

  return (
    <Box
      width={props.isMobile ? '100%' : '38%'}
      margin={{ top: 'small', horizontal: 'auto', bottom: '0' }}
    >
      <SignUpCard
        titleLabel="Sign Up"
        activeIndex={activeIndex}
        stepLabels={[
          'Invitation Code',
          'Legal Agreements',
          'Choose How to Sign Up',
          'Sign Wallet Requests',
          'Choose Username',
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
            paragraphThree={t(
              'Your invitation code is valid! Please proceed to create your account',
            )}
            buttonLabel={t('Continue to Step 2 ')}
            inputLabel={t('Invitation Code')}
            inputPlaceholder={t('Type your invitation code here')}
            noArrowRight={true}
            inputValue={inviteToken}
            submitted={inviteTokenForm.submitted}
            submitting={inviteTokenForm.submitting}
            success={inviteTokenForm.success}
            // also toggle hasError if input value exceeds default token length
            hasError={inviteTokenForm.hasError || inviteToken.length > DEFAULT_TOKEN_LENGTH}
            errorMsg={inviteTokenForm.errorMsg}
            onChange={onInputTokenChange}
            validateTokenFn={validateTokenFn}
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
              "You now need to choose how you'll sign up on  Ethereum World. If you are experienced wth Ethereum, you may connect your wallet.",
            )}
            paragraphTwoBoldLabel={t(
              'If you are new to Ethereum, we recommend using the email or social login option.',
            )}
            paragraphTwoLabel={t(
              "As part of signing up, you'll get a free Ethereum wallet that you can use to send or receive crypto and sign in to other Ethereum sites.",
            )}
            paragraphThreeLabel={t(
              "While you're free to conect any wallet that works with the Rinkeby Network,",
            )}
            paragraphThreeBoldLabel={t('we recommend MetaMask.')}
            paragraphFourLabel={t(
              'We have tested MetaMask the most out of all Ethereum Wallets. You can install it',
            )}
            paragraphFourAccentLabel={t('here')}
            injectedProvider={injectedProvider.name}
            providerDetails={{
              ...injectedProvider.details,
              subtitleLabel: t(injectedProvider.details.subtitleLabel),
            }}
            walletConnectDescription={t(
              'WalletConnect has had reliability problems for us in the past. Consider it experimental at this time.',
            )}
            socialLoginTitleLabel={t('Email or Social Login')}
            socialLoginDescription={t(
              'Use this option to sign up using email, Google, Twitter, Discord, Github, Apple, or one of many other social networks',
            )}
            changeProviderLabel={t('Change')}
            setRinkebyLabel={t('To use Ethereum World during the alpha period, ')}
            setRinkebyBoldLabel={`${t('you’ll need to set the')} ${injectedProvider.name} ${t(
              'network to',
            )}`}
            setRinkebyAccentLabel={'Rinkeby'}
            variableIconButtonLabel={t('I have set the network to Rinkeby')}
            variableIconErrorLabel={t('Please set the network to Rinkeby and try again.')}
            buttonLabel={t('Continue to Step 4 ')}
            selectedProvider={selectedProvider}
            onProviderSelect={handleProviderSelect}
            onButtonClick={handleNextStep}
          />
        )}
        {activeIndex === 3 && (
          <StepFour
            textExplanation={t("We'll explain why we need each along the way")}
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
            textCreateSignIn={t('Create a way to sign in to your account')}
            textCreateSignInExplanation={t(
              "You'll be able to sign in to your account with this wallet address. Think of it as using your wallet like a username and password.",
            )}
            textCreateSecure={t('Create a secure place to store your data')}
            textCreateSecureExplanation={t(
              'You will create a secure space to store your data (posts, photos, replies, and so forth). Moving forward we will need explicit permission from you to access you data.',
            )}
            textCreateProfile={t('Create your Ethereum World profile')}
            textCreateProfileExplanation={t(
              'We will create your Ethereum World profile in our systems.',
            )}
            textAddressComplete={t("You've connected an Ethereum address")}
            textSignInComplete={t('You can sign in with this address')}
            textSecureComplete={t('You have a secure place to store your data')}
            textProfileComplete={t('You have created your Ethereum World profile')}
            textCompleted={
              "That's it! The hardest part is complete. Now you only need to choose a username and you’ll be done!"
            }
            textButtonSignInWallet={t('Sign in Wallet')}
            textRequestProblem={t(
              "Not seeing the wallet request? Please make sure to open your wallet extension. If you're still not seeing it, we can resend it.",
            )}
            textRequestResend={t('Resend request')}
            textDeclinedError={t(
              'You have declined the signature request. You will not be able to proceed unless you accept all signature requests.',
            )}
            textTimeoutError={t(
              'The signature request has timed out. Please try again to sign the request.',
            )}
            textNetworkError={t(
              'Ethereum World only works with the Rinkeby test network. Please set your network to Rinkeby to continue.',
            )}
            textAgain={t('Try Again')}
            buttonLabel={t('Continue to Step 5')}
            onButtonClick={handleNextStep}
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
          />
        )}
      </SignUpCard>
    </Box>
  );
};

export default SignUp;
