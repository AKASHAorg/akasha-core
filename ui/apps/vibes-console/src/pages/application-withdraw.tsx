import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { WAConfirmation, WithdrawApplication } from '../components/applications/application/';

export type WithdrawApplicationPageProp = {
  applicationId: string;
};

export const WithdrawApplicationPage: React.FC<WithdrawApplicationPageProp> = () => {
  const [step, setStep] = useState(0);

  const navigate = useNavigate();
  const { t } = useTranslation('vibes-console');

  const handleCancelButtonClick = () => {
    navigate({
      to: '/applications-center',
    });
  };

  const handleWithdrawApplication = () => {
    /** interact with api */
    setStep(1);
  };

  if (step === 1) {
    return (
      <WAConfirmation
        titleLabel={t('Application Withdrawal is confirmed')}
        descriptionLabel={t(
          "We're here if you decide to return. Best wishes on your journey ahead",
        )}
        cancelButtonLabel={t('Go back to the Application Center')}
        onCancelButtonClick={handleCancelButtonClick}
      />
    );
  }

  return (
    <WithdrawApplication
      label={t('Withdraw Your Application')}
      description={t(
        "Decided to withdraw your mod application? No problem! 🚀 Remember, our community always benefits from passionate protectors. 🛡️ Feel free to reapply anytime you're ready to make a difference! 🌟🤗",
      )}
      cancelButtonLabel={t('Cancel')}
      confirmButtonLabel={t('Confirm withdrawal')}
      onCancelButtonClick={handleCancelButtonClick}
      onConfirmButtonClick={handleWithdrawApplication}
    />
  );
};
