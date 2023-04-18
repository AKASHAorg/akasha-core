import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateToParams } from '@akashaorg/typings/ui';

import DismissModerator from '../components/moderator/dismiss-moderator';
import { MODERATORS } from '../routes';

export interface IDismissModeratorPageProps {
  navigateTo: (args: NavigateToParams) => void;
}

export const DismissModeratorPage: React.FC<IDismissModeratorPageProps> = props => {
  const { navigateTo } = props;

  const { t } = useTranslation('app-moderation-ewa');

  const handleCancelButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: routes => routes[MODERATORS],
    });
  };

  const handleConfirmButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: routes => routes[MODERATORS],
    });
  };

  return (
    <DismissModerator
      titleLabel={t('Why are you dismissing this moderator?')}
      placeholderLabel={t('Write down your reasons here')}
      subtitleLabel={t('If you are unsure, you can refer to our')}
      codefConductLabel={t('Code of Conduct')}
      andLabel={t('and')}
      termsOfServiceLabel={t('Terms of Service')}
      cancelButtonLabel={t('Cancel')}
      confirmButtonLabel={t('Confirm')}
      onCancelButtonClick={handleCancelButtonClick}
      onConfirmButtonClick={handleConfirmButtonClick}
    />
  );
};
