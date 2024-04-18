import React from 'react';
import { useTranslation } from 'react-i18next';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { ResignConfirmation } from '../components/dashboard';

export const ResignConfirmationPage: React.FC<unknown> = () => {
  const { getRoutingPlugin } = useRootComponentProps();
  const navigateTo = getRoutingPlugin().navigateTo;

  const { t } = useTranslation('app-vibes');

  const handleCloseButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: (routes: Record<string, string>) => routes.defaultRoute,
    });
  };

  return (
    <ResignConfirmation
      titleLabel={t('You are no longer a moderator')}
      subtitleLabel={t(
        'Thank you for protecting our community from harm. Remember, you can always re-apply and be a moderator again anytime!',
      )}
      continueLabel={t('Continue reading on Antenna')}
      onContinueClick={handleCloseButtonClick}
    />
  );
};
