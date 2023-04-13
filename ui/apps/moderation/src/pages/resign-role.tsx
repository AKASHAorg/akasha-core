import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateToParams } from '@akashaorg/typings/ui';

import ResignRole from '../components/dashboard/resign-role';

import { DASHBOARD, RESIGN_CONFIRMATION } from '../routes';

export interface IResignRolePageProps {
  user: string | null;
  navigateTo: (args: NavigateToParams) => void;
}

export const ResignRolePage: React.FC<IResignRolePageProps> = props => {
  const { navigateTo } = props;

  const { t } = useTranslation('app-moderation-ewa');

  const handleCancelButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: routes => routes[DASHBOARD],
    });
  };

  const handleConfirmButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: routes => routes[RESIGN_CONFIRMATION],
    });
  };

  return (
    <ResignRole
      label={t('Resign From Moderator Role')}
      textLine1Label={t(
        'Once you resign you won’t be able to preform any moderation actions such as, keeping, delisting content and suspending or banning users.',
      )}
      reasonTitleLabel={t('Why do you want to resign?')}
      reasonPlaceholderLabel={t('Write down your reasons here')}
      optionalLabel={t('optional')}
      textLine2Label={t(
        'If you are 100% sure about your decision, you can go ahead and confirm your resignation',
      )}
      cancelButtonLabel="Cancel"
      confirmButtonLabel="Confirm Resignation"
      onCancelButtonClick={handleCancelButtonClick}
      onConfirmButtonClick={handleConfirmButtonClick}
    />
  );
};
