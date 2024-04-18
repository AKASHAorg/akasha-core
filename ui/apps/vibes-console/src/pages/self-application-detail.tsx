import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import {
  ApplicationApprovedCard,
  SelfApplicationDetail,
} from '../components/applications/application';
import { generateSelfApplicationData } from '../utils';
import routes, { DASHBOARD, WITHDRAW_APPLICATION } from '../routes';

export const SelfApplicationDetailPage: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('vibes-console');

  const handleCancelButtonClick = (applicationId: string) => {
    navigate({
      to: routes[WITHDRAW_APPLICATION],
      params: {
        applicationId,
      },
    });
  };

  const handleGoToReviewHub = () => {
    navigate({
      to: routes[DASHBOARD],
    });
  };

  const applicationData = generateSelfApplicationData();

  return (
    <Stack spacing="gap-y-4">
      {applicationData.status === 'approved' && (
        <ApplicationApprovedCard
          titleLabel={t('Application Approved')}
          descriptionLabel={t('Congratulations ✨ you are officially a moderator')}
          buttonLabel={t('Start Reviewing Flagged items 🚀')}
          onButtonClick={handleGoToReviewHub}
        />
      )}

      <SelfApplicationDetail
        label={t('Your Application')}
        sections={[
          {
            title: t('Status'),
            description: t('{{description}}', { description: applicationData.description }),
            reason: applicationData.reason,
            status: applicationData.status,
          },
          {
            title: t('Applied on'),
            ...(applicationData.status === 'pending' && {
              description: t(
                "You can't modify your application but you can withdraw it and re-apply.",
              ),
            }),
            applicationDate: new Date('2024-02-07'),
          },
          ...(applicationData.status !== 'pending'
            ? [
                {
                  title: t('Resolved on'),
                  applicationDate: new Date(),
                },
              ]
            : []),
        ]}
        {...(applicationData.status === 'pending' && {
          cancelButtonLabel: t('Withdraw Application'),
          cancelButtonVariant: 'secondary',
          onCancelButtonClick: () => handleCancelButtonClick(applicationData.id),
        })}
      />
    </Stack>
  );
};
