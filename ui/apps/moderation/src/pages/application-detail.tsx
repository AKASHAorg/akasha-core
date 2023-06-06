import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Box from '@akashaorg/design-system-core/lib/components/Box';

import ApplicationDetailIntro from '../components/dashboard/tabs/applications/application-detail-intro';
import ApplicationDetail from '../components/dashboard/tabs/applications/application-detail';

import { generateApplicants, preSelectedReasons } from '../utils';

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams();

  const applicants = generateApplicants();

  const selectedApplicant = applicants.find(el => el.did.id === id) ?? applicants[0];

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
      <ApplicationDetailIntro
        selectedApplicant={selectedApplicant}
        viewProfileLabel={t('View Profile')}
        applicationDateLabel={t('Application date')}
        memberSinceLabel={t('Member since')}
        onButtonClick={handleButtonClick}
      />

      <ApplicationDetail
        label={t('Application Details')}
        categoryLabel={t('Moderation category')}
        categories={preSelectedReasons.map(el => t('{{el}}', { el }))}
        reasonLabel={t('Moderation reason')}
        reason={t('I would like to apply because I really want to protect AKASHA community')}
        recordTitleLabel={t('Member record')}
        recordDescription={
          !selectedApplicant.reports.length
            ? t('The applicant have never been reported before')
            : `${t('The applicant has been reported before for the following reasons')}:`
        }
        historyLabel={t('Application history')}
        historyDescription={
          !selectedApplicant.history.length
            ? t('The applicant never applied to be a moderator before')
            : t('The applicant have applied before and have been')
        }
        confirmButtonLabel={t('Approve')}
        cancelButtonLabel={t('Reject')}
        onCancelButtonClick={handleCancelButtonClick}
        onConfirmButtonClick={handleConfirmButtonClick}
      />
    </Box>
  );
};
