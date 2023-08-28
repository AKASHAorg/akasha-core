import React from 'react';
import { useTranslation } from 'react-i18next';

import { RootComponentProps } from '@akashaorg/typings/ui';
import { useGetLogin } from '@akashaorg/ui-awf-hooks';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';

import { SummaryCard } from '../components/profile/summary-card';
import { CardWrapper } from '../components/common';

import menuRoute, { DASHBOARD } from '../routes';
import { sampleMessage } from '../utils/dummy-data';

export const VerifySignature: React.FC<RootComponentProps> = props => {
  const { plugins } = props;

  const [message] = React.useState<string>('');
  const [signature] = React.useState<string>('');

  const verifySignatureMutation = {
    isSuccess: false,
    data: null,
    isError: false,
    error: null,
    mutate: _args => _args,
  };

  const navigateTo = plugins['@akashaorg/app-routing']?.routing.navigateTo;

  const { t } = useTranslation('app-dev-dashboard');

  const loginQuery = useGetLogin();

  const did = loginQuery.data?.id;

  // const handleFieldChange = (ev, field: string) => {
  //   switch (field) {
  //     case 'pubKey':
  //       setDid(ev.target.value);
  //       break;
  //     case 'message':
  //       setMessage(ev.target.value);
  //       break;
  //     case 'signature':
  //       setSignature(ev.target.value);
  //       break;
  //     default:
  //       break;
  //   }
  // };

  const handleVerifySignature = () => {
    verifySignatureMutation.mutate({ did: did, signature, data: message });
  };

  const handleButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-dev-dashboard',
      getNavigationUrl: () => menuRoute[DASHBOARD],
    });
  };

  const isSuccess = verifySignatureMutation.isSuccess;

  return (
    <CardWrapper
      titleLabel={t('Verify a Signature')}
      cancelButtonLabel={!isSuccess ? t('Cancel') : undefined}
      confirmButtonLabel={isSuccess ? t('Dev Dashboard') : t('Verify')}
      onCancelButtonClick={handleButtonClick}
      onConfirmButtonClick={isSuccess ? handleButtonClick : handleVerifySignature}
    >
      <Box customStyle="pt-4 px-4">
        {!verifySignatureMutation.isSuccess && (
          <Box customStyle="space-y-4">
            <TextField label={t('DID')} placeholder={t('Paste your DID here')} type="text" />

            <TextField
              label={t('Original Message')}
              placeholder={t('Place the original message here')}
              type="multiline"
            />

            <TextField
              label={t('Signature String')}
              placeholder={t('Place the signature string here')}
              type="multiline"
            />
          </Box>
        )}

        {verifySignatureMutation.isSuccess && (
          <SummaryCard
            titleLabel={t('Signature Verified Correctly 🙌🏽')}
            subtitleLabel={t('The message was successfully verified using the DID below')}
            paragraph1TitleLabel={t('DID 🔑')}
            paragraph2TitleLabel={t('Original Message ✉️')}
            paragraph1Content={did || '3fLBxdVgUkWj8UjVvUXcIdak5qe5xRRowUDkIuVRRQ'}
            paragraph2Content={sampleMessage}
          />
        )}
      </Box>
    </CardWrapper>
  );
};
