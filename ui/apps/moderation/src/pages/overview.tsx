import React from 'react';
import { useTranslation } from 'react-i18next';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ModerationIntroCard from '@akashaorg/design-system-components/lib/components/ModerationIntroCard';
import ModerationValuesCard from '@akashaorg/design-system-components/lib/components/ModerationValuesCard';

import BecomeModeratorCard from '../components/overview/become-moderator-card';
import HelloModeratorCard from '../components/overview/hello-moderator-card';

import { BasePageProps } from './dashboard';
import { BECOME_MODERATOR, CHECK_APPLICATION_STATUS } from '../routes';
import { values } from '../services/values';
import { externalLinks } from '../utils';

export enum ApplicationStatusType {
  review = 'Under Review',
  approved = 'Approved!',
  rejected = 'Rejected',
}

export type OverviewPageProps = BasePageProps & {
  isAuthorised: boolean;
  applicationStatus: ApplicationStatusType | null;
};

export const Overview: React.FC<OverviewPageProps> = props => {
  const { isAuthorised, applicationStatus, navigateTo } = props;
  const { t } = useTranslation('app-moderation-ewa');

  const handleCodeOfConductClick = () => {
    navigateTo({
      appName: '@akashaorg/app-legal',
      getNavigationUrl: routes => routes.codeOfConduct,
    });
  };

  const handleValueClick = (path: string) => () => {
    navigateTo({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: () => `/overview/values/${path}`,
    });
  };

  const handleClickApply = () => {
    navigateTo({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: routes =>
        applicationStatus ? routes[CHECK_APPLICATION_STATUS] : routes[BECOME_MODERATOR],
    });
  };

  return (
    <Stack spacing="gap-y-4">
      {isAuthorised && (
        <HelloModeratorCard
          titleLabel={t('Hello Moderator!')}
          subtitleLabel={t(
            'In this section you will find some useful moderation documentation and FAQs',
          )}
          moderatorGuideLabel={t("Moderator's Guide")}
          moderatorGuideUrl={externalLinks.discourse.CoC}
          moderationFAQLabel={t('Moderation FAQs')}
          moderationFAQUrl={externalLinks.discourse.CoC}
        />
      )}
      <ModerationIntroCard
        titleLabel={t('Overview')}
        introLabel={t('Welcome to Vibe')}
        subtitleLabel={t(
          'Vibe facilitates cooperation and prevents abuse. The app is open and transparent. Take part in the process of governing this community.',
        )}
        codeOfConductLabel={t('Read our Code of Conduct')}
        overviewCTAArr={[
          {
            label: t('CoC discussions'),
            url: externalLinks.discourse.CoC,
            iconType: 'SparklesIcon',
          },
          {
            label: t('Moderation thoughts'),
            url: externalLinks.discord,
            iconType: 'ChatBubbleOvalLeftEllipsisIcon',
          },
          {
            label: t('Send us a message'),
            url: externalLinks.email,
            iconType: 'EnvelopeIcon',
          },
        ]}
        onCodeOfConductClick={handleCodeOfConductClick}
      />

      {/**
       * if logged user is not a moderator, show this prompt
       */}
      {!isAuthorised && (
        <BecomeModeratorCard
          titleLabel={t('Keep our Community Safe')}
          subtitleLabel={t(
            'You can help us keep the community safer by applying to be a moderator!',
          )}
          buttonLabel={applicationStatus ? t('Check your application') : t('Apply')}
          onClickApply={handleClickApply}
        />
      )}

      <ModerationValuesCard
        titleLabel={t('Our Values')}
        subtitleLabel={t('The principles guiding our behaviour')}
        ctaLabel={t('Propose your own')}
        ctaUrl={externalLinks.discourse.values}
        values={values.map(value => ({
          path: value.path,
          title: t('{{title}}', { title: value.title }),
          assetName: value.assetName,
          description: value.description,
        }))}
        onValueClick={handleValueClick}
      />
    </Stack>
  );
};
