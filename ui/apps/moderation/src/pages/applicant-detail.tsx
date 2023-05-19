import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Box from '@akashaorg/design-system-core/lib/components/Box';

import ApplicantDetailIntro from '../components/dashboard/applicant-detail-intro';
import ApplicantDetail from '../components/dashboard/applicant-detail';

import { applicants } from '../utils';

export const ApplicantDetailPage: React.FC = () => {
  const { id } = useParams();

  const selectedApplicant = applicants.find(el => el.pubKey === id);

  const { t } = useTranslation('app-moderation-ewa');

  const handleButtonClick = () => () => {
    /** */
  };

  const handleCancelButtonClick = () => {
    /** */
  };

  const handleConfirmButtonClick = () => {
    /** */
  };

  return (
    <Box customStyle="space-y-4">
      <ApplicantDetailIntro
        selectedApplicant={selectedApplicant}
        viewProfileLabel={t('View Profile')}
        applicationDateLabel={t('Application date')}
        memberSinceLabel={t('Member since')}
        onButtonClick={handleButtonClick}
      />

      <ApplicantDetail
        label={t('Application Details')}
        moderationCategoryLabel={t('Moderation Category')}
        confirmButtonLabel={t('Approve')}
        cancelButtonLabel={t('Reject')}
        onCancelButtonClick={handleCancelButtonClick}
        onConfirmButtonClick={handleConfirmButtonClick}
      />
    </Box>
  );
};
