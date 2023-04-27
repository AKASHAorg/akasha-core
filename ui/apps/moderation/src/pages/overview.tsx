import React from 'react';
import { useTranslation } from 'react-i18next';

import { NavigateToParams } from '@akashaorg/typings/ui';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import ModerationIntroCard from '@akashaorg/design-system-components/lib/components/ModerationIntroCard';
import ModerationValuesCard from '@akashaorg/design-system-components/lib/components/ModerationValuesCard';

import BecomeModeratorCard from '../components/moderator/become-moderator-card';

import { values } from '../services/values';
import { externalLinks } from '../utils/external-links';
import { BECOME_MODERATOR } from '../routes';

export interface IOverviewProps {
  isAuthorised: boolean;
  navigateTo: (args: NavigateToParams) => void;
}

export const Overview: React.FC<IOverviewProps> = props => {
  const { isAuthorised, navigateTo } = props;
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
      getNavigationUrl: routes => routes[BECOME_MODERATOR],
    });
  };

  return (
    <Box customStyle="space-y-4">
      <ModerationIntroCard
        titleLabel={t('Overview')}
        introLabel={t('Welcome to Akasha Moderation')}
        subtitleLabel={t(
          'The Moderation app facilitates cooperation and prevents abuse. The app is open and transparent. Take part in the process of governing this community.',
        )}
        codeOfConductLabel={t('Read our Code of Conduct')}
        overviewCTAArr={[
          {
            label: t('CoC discussions'),
            url: externalLinks.discourse.CoC,
            iconType: 'explore',
          },
          {
            label: t('Moderation thoughts'),
            url: externalLinks.discord,
            iconType: 'chatBubble',
          },
          {
            label: t('Send us a message'),
            url: externalLinks.email,
            iconType: 'message',
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
          buttonLabel={t('Apply')}
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
    </Box>
  );
};
