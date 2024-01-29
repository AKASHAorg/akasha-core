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
import {
  SparklesIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  EnvelopeIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

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

  const overviewCTAArr = isAuthorised
    ? [
        {
          label: t('CoC discussions'),
          url: externalLinks.discourse.CoC,
          icon: <SparklesIcon />,
        },
        {
          label: t('Moderation thoughts'),
          url: externalLinks.discord,
          icon: <ChatBubbleOvalLeftEllipsisIcon />,
        },
        {
          label: t('Send us a message'),
          url: externalLinks.email,
          icon: <EnvelopeIcon />,
        },
      ]
    : [
        {
          label: `📖 ${t('Our Code of Conduct')} ✨`,
          url: externalLinks.discourse.CoC,
        },
        {
          label: `🗣️ ${t('Code of Conduct Discussions')} 🚀`,
          url: externalLinks.discourse.CoC,
        },
        {
          label: `👉🏼 ${t('Vibes Thoughts')} 🧠`,
          url: externalLinks.discord,
        },
      ];

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
        introLabel={`${t('Welcome to AKASHA')} ${isAuthorised ? t('Moderation') : t('Vibe')}`}
        subtitleLabel={
          isAuthorised
            ? t(
                'The Moderation app facilitates cooperation and prevents abuse. The app is open and transparent. Take part in the process of governing this community.',
              )
            : t(
                "The Vibe app encourages collaboration while safeguarding against misuse. It's an open and transparent platform, inviting you to actively participate in shaping our community's governance.",
              )
        }
        {...(isAuthorised && { codeOfConductLabel: t('Read our Code of Conduct') })}
        overviewCTAArr={overviewCTAArr}
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
