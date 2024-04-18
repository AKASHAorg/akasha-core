import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { ResignRole } from '../components/dashboard';
import routes, { RESIGN_CONFIRMATION, SETTINGS } from '../routes';

export const ResignRolePage: React.FC<unknown> = () => {
  const navigate = useNavigate();

  const { t } = useTranslation('app-vibes');

  const handleCancelButtonClick = () => {
    navigate({
      to: routes[SETTINGS],
    });
  };

  const handleConfirmButtonClick = () => {
    navigate({
      to: routes[RESIGN_CONFIRMATION],
    });
  };

  return (
    <ResignRole
      label={t('Resign From Moderator Role')}
      textLine1Label={t(
        "Once you resign you won't be able to preform any moderation actions such as, keeping, delisting content and suspending or banning users.",
      )}
      reasonTitleLabel={t('Why do you want to resign?')}
      reasonPlaceholderLabel={t('Write down your reasons here')}
      optionalLabel={t('optional')}
      textLine2Label={t(
        'If you are 100% sure about your decision, you can go ahead and confirm your resignation',
      )}
      cancelButtonLabel={t('Cancel')}
      confirmButtonLabel={t('Confirm Resignation')}
      onCancelButtonClick={handleCancelButtonClick}
      onConfirmButtonClick={handleConfirmButtonClick}
    />
  );
};
