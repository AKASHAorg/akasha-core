import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import AssignAdmin from '../components/dashboard/assign-admin';

import { BasePageProps } from './dashboard';
import { DASHBOARD } from '../routes';
import { generateActiveModerators } from '../utils/dummy-data';

export const AssignAdminPage: React.FC<BasePageProps> = props => {
  const { navigateTo } = props;

  const [assignedAdmin, setAssignedAdmin] = useState(false);

  const { t } = useTranslation('app-moderation-ewa');

  const handleAssignButtonClick = () => {
    setAssignedAdmin(true);
  };

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

  const introLabel = !assignedAdmin
    ? 'Before resigning, you need to assign a new admin from the list below or you can search for a certain moderator'
    : 'Once the moderator accept the admin request you will be able to resign officially. The following moderator will be notified about assignment:';

  return (
    <AssignAdmin
      activeModerators={generateActiveModerators()}
      label={t('Assign a New Admin')}
      introLabel={t('{{introLabel}}', { introLabel })}
      searchPlaceholderLabel={t('Search for a moderator')}
      assignButtonLabel={t('Assign')}
      cancelButtonLabel="Cancel"
      confirmButtonLabel="Confirm Assigment"
      assignedAdmin={assignedAdmin}
      onClickAssign={handleAssignButtonClick}
      onCancelButtonClick={handleCancelButtonClick}
      onConfirmButtonClick={handleConfirmButtonClick}
    />
  );
};
