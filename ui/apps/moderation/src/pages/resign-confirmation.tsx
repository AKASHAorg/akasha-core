import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateToParams } from '@akashaorg/typings/ui';

import ResignConfirmation from '../components/dashboard/tabs/general/resign-confirmation';

import { HOME } from '../routes';

export interface IResignConfirmationPageProps {
  user: string | null;
  navigateTo: (args: NavigateToParams) => void;
}

export const ResignConfirmationPage: React.FC<IResignConfirmationPageProps> = props => {
  const { navigateTo } = props;

  const { t } = useTranslation('app-moderation-ewa');

  const handleCloseButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: routes => routes[HOME],
    });
  };

  return (
    <ResignConfirmation
      titleLabel={t('You are no longer a moderator')}
      subtitleLabel={t(
        'Thank you for protecting our community from harm. Remember, you can always re-apply and be a moderator again anytime!',
      )}
      onCloseButtonClick={handleCloseButtonClick}
    />
  );
};
