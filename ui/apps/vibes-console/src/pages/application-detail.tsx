import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { ApplicantDataCard, ApplicationDetail } from '../components/applications/application';
import { NoItemFound } from '../components/no-item-found';

export const ApplicationDetailPage: React.FC<unknown> = () => {
  const { t } = useTranslation('vibes-console');
  const applicationData = null;
  const applicant = null;
  if (!applicationData)
    return (
      <Card>
        <NoItemFound title="Oops! This application detail does not exist" />
      </Card>
    );
  return (
    <Stack spacing="gap-y-4">
      <ApplicantDataCard
        isMini={true}
        applicant={applicant}
        tenureInfoLabel={t('Member since')}
        appliedOnLabel={t('Applied on')}
        viewProfileLabel={t('View profile')}
        onClickViewProfile={() => {
          /** */
        }}
      />

      <ApplicationDetail
        label={t('Vibes Application')}
        sections={[
          {
            title: t('Application status'),
            description: t('{{description}}', { description: applicationData.description }),
            status: applicationData.status,
          },
          ...(applicationData.status !== 'pending'
            ? [
                {
                  title:
                    applicationData.status === 'withdrawn' ? t('Withdrawn on') : t('Resolved on'),
                  resolvedDate: applicationData.resolvedDate,
                },
              ]
            : []),
          {
            title: t('Moderation experience'),
            value: t('None'),
          },
          {
            title: t('Why I want to be a moderator'),
            description: t(
              'Being a moderator in AKASHA World will allow me to cultivate a space where knowledge, creativity, and mutual respect intersect.',
            ),
          },
          {
            title: t('Application history'),
            value: t('None'),
          },
        ]}
      />
    </Stack>
  );
};
