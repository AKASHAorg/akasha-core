import React from 'react';
import { lastValueFrom } from 'rxjs';
import { useTranslation } from 'react-i18next';

import DS from '@akashaproject/design-system';
import getSDK from '@akashaproject/awf-sdk';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { INJECTED_PROVIDERS } from '@akashaproject/awf-sdk/typings/lib/interfaces/common';

import { StepOne } from './steps/StepOne';
import { StepThree } from './steps/StepThree';

const { Box, SignUpCard } = DS;

export interface IInviteTokenForm {
  submitted: boolean;
  submitting: boolean;
  success: boolean;
  hasError: boolean;
  errorMsg: string;
}

const SignUp: React.FC<RootComponentProps> = _props => {
  const [activeIndex, setActiveIndex] = React.useState<number>(2);
  const [inviteToken, setInviteToken] = React.useState<string>('');
  const [injectedProvider, setInjectedProvider] = React.useState<INJECTED_PROVIDERS>(
    INJECTED_PROVIDERS.NOT_DETECTED,
  );
  const [inviteTokenForm, setinviteTokenForm] = React.useState<IInviteTokenForm>({
    submitted: false,
    submitting: false,
    success: false,
    hasError: false,
    errorMsg: '',
  });

  const { t } = useTranslation();
  const sdk = getSDK();

  const DEFAULT_TOKEN_LENGTH = 24;

  const getInjectedProvider = async () => {
    const injectedProvider = await lastValueFrom(sdk.services.common.web3.detectInjectedProvider());

    setInjectedProvider(injectedProvider.data);
  };

  const handleIconClick = () => {
    if (activeIndex === 0) return;
    setActiveIndex(prev => prev - 1);
  };

  const handleNextStep = () => {
    setActiveIndex(prev => prev + 1);
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

  React.useEffect(
    () => {
      getInjectedProvider();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Box width={'38%'} margin={{ top: 'small', horizontal: 'auto', bottom: '0' }}>
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
            textLine1={t(
              'We are currently in a private alpha. You need the invitation code we emailed you to sign up.',
            )}
            textLine2bold={t('If you have not received an invitation code')}
            textLine2accent={t('you can request to be placed on the waitlist')}
            writeToUsUrl={'mailto:alpha@ethereum.world'}
            textLine2={t('You will get one soon thereafter')}
            textLine3={t('Your invitation code is valid! Please proceed to create your account')}
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
        {activeIndex === 2 && (
          <StepThree
            textLine1={t(
              "You now need to choose how you'll sign up on  Ethereum World. If you are experienced wth Ethereum, you may connect your wallet.",
            )}
            textLine2bold={t(
              'If you are new to Ethereum, we recommend using the email or social login option.',
            )}
            textLine2={t(
              "As part of signing up, you'll get a free Ethereum wallet tht you can use to send or receive crypto and sign in to other Ethereum sites.",
            )}
            injectedProvider={injectedProvider}
          />
        )}
      </SignUpCard>
    </Box>
  );
};

export default SignUp;
