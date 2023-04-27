import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateToParams } from '@akashaorg/typings/ui';

import BecomeModerator from '../components/moderator/become-moderator';

import { DASHBOARD } from '../routes';

export interface IBecomeModeratorPageProps {
  user: string | null;
  navigateTo: (args: NavigateToParams) => void;
}

export const BecomeModeratorPage: React.FC<IBecomeModeratorPageProps> = props => {
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
      getNavigationUrl: routes => routes[DASHBOARD],
    });
  };

  return (
    <BecomeModerator
      titleLabel={t('Becoming a moderator')}
      subtitle1Label={t(
        'Becoming a moderator means that you will be responsible to protect the community from harmful contents that violate our',
      )}
      codeOfConductLabel={t('Code of Conduct')}
      subtitle2Label={t(
        'Make sure that you have fully understood our values and our code of conduct before applying!',
      )}
      cancelButtonLabel="Cancel"
      confirmButtonLabel="Continue"
      onCancelButtonClick={handleCancelButtonClick}
      onConfirmButtonClick={handleConfirmButtonClick}
    />
  );
};
