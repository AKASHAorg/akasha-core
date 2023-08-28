import React from 'react';
import { useTranslation } from 'react-i18next';

import { RootComponentProps } from '@akashaorg/typings/ui';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';

import { CardWrapper } from '../components/common';
import { SummaryCard } from '../components/profile/summary-card';

import menuRoute, { DASHBOARD } from '../routes';
import { sampleSignature } from '../utils/dummy-data';

export const SignMessage: React.FC<RootComponentProps> = props => {
  const { plugins } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing.navigateTo;

  const { t } = useTranslation('app-dev-dashboard');

  const [message] = React.useState<string>('');

  const signMessageMutation = {
    isSuccess: false,
    data: null,
    isError: false,
    error: null,
    mutate: _args => _args,
  };

  const handleSignMessage = () => {
    signMessageMutation.mutate({ message });
  };

  const handleButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-dev-dashboard',
      getNavigationUrl: () => menuRoute[DASHBOARD],
    });
  };

  const isSuccess = signMessageMutation.isSuccess;

  return (
    <CardWrapper
      titleLabel={t('Signing a Message')}
      cancelButtonLabel={!isSuccess ? t('Cancel') : undefined}
      confirmButtonLabel={isSuccess ? t('Dev Dashboard') : t('Sign')}
      onCancelButtonClick={handleButtonClick}
      onConfirmButtonClick={isSuccess ? handleButtonClick : handleSignMessage}
    >
      <Box customStyle="pt-4 px-4">
        {!signMessageMutation.isSuccess && (
          <Box>
            <TextField
              label={t('Message')}
              placeholder={t('Place the message to be signed here')}
              type="multiline"
            />
          </Box>
        )}

        {signMessageMutation.isSuccess && (
          <SummaryCard
            titleLabel={t('Message Signed correctly 🙌🏽')}
            subtitleLabel={t('Here are the details of the signature')}
            paragraph1TitleLabel={t('Signature String 🖋')}
            paragraph2TitleLabel={t('Signed Message ✉️')}
            paragraph1Content={sampleSignature}
            paragraph2Content={sampleSignature}
          />
        )}
      </Box>
    </CardWrapper>
  );
};
