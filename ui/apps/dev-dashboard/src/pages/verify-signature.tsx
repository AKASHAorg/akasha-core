import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useLoggedIn, useRootComponentProps } from '@akashaorg/ui-awf-hooks';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';

import { SummaryCard } from '../components/profile/summary-card';
import { CardWrapper } from '../components/common';

import menuRoute, { DASHBOARD } from '../routes';
import { sampleMessage } from '../utils/dummy-data';

export const VerifySignature: React.FC<unknown> = () => {
  const [message] = useState<string>('');
  const [signature] = useState<string>('');

  // @TODO: needs update
  const verifySignatureMutation = {
    isSuccess: false,
    data: null,
    isError: false,
    error: null,
    mutate: _args => _args,
  };

  const { t } = useTranslation('app-dev-dashboard');
  const { getRoutingPlugin } = useRootComponentProps();

  const { loggedInProfileId } = useLoggedIn();

  const navigateTo = getRoutingPlugin().navigateTo;

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
    verifySignatureMutation.mutate({ did: loggedInProfileId, signature, data: message });
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
      <Stack padding="pt-4 px-4">
        {!verifySignatureMutation.isSuccess && (
          <Stack spacing="gap-y-4">
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
          </Stack>
        )}

        {verifySignatureMutation.isSuccess && (
          <SummaryCard
            titleLabel={t('Signature Verified Correctly 🙌🏽')}
            subtitleLabel={t('The message was successfully verified using the DID below')}
            paragraph1TitleLabel={t('DID 🔑')}
            paragraph2TitleLabel={t('Original Message ✉️')}
            paragraph1Content={loggedInProfileId || '3fLBxdVgUkWj8UjVvUXcIdak5qe5xRRowUDkIuVRRQ'}
            paragraph2Content={sampleMessage}
          />
        )}
      </Stack>
    </CardWrapper>
  );
};
