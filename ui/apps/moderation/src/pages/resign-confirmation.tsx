import React from 'react';
import { useTranslation } from 'react-i18next';

import ResignConfirmation from '../components/dashboard/tabs/general/resign-confirmation';

import { BasePageProps } from './dashboard';
import { HOME } from '../routes';

export const ResignConfirmationPage: React.FC<BasePageProps> = props => {
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
