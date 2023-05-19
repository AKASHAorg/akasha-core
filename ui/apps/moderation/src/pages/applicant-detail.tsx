import React from 'react';
import { useTranslation } from 'react-i18next';

import ApplicantDetail from '../components/dashboard/applicant-detail';

export const ApplicantDetailPage: React.FC = () => {
  const selectedApplicant = null;

  const { t } = useTranslation('app-moderation-ewa');

  const handleButtonClick = () => () => {
    /** */
  };

  return (
    <ApplicantDetail
      selectedApplicant={selectedApplicant}
      viewProfileLabel={t('View Profile')}
      onButtonClick={handleButtonClick}
    />
  );
};
