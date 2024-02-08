import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateToParams } from '@akashaorg/typings/lib/ui';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import VibesIntroCard from '@akashaorg/design-system-components/lib/components/VibesIntroCard';
import VibesValuesCard from '@akashaorg/design-system-components/lib/components/VibesValuesCard';
import BecomeModeratorCard from '../components/overview/become-moderator-card';
import { values } from '../services/values';
import { externalLinks } from '../utils';

export type BasePageProps = {
  user?: string | null;
  navigateTo: (args: NavigateToParams) => void;
};

export type OverviewPageProps = BasePageProps & {
  isModerator: boolean;
};

export const Overview: React.FC<OverviewPageProps> = props => {
  const { isModerator, navigateTo } = props;
  const { t } = useTranslation('app-vibes');

  const handleCodeOfConductClick = () => {
    navigateTo({
      appName: '@akashaorg/app-legal',
      getNavigationUrl: routes => routes.codeOfConduct,
    });
  };

  const handleValueClick = (path: string) => () => {
    navigateTo({
      appName: '@akashaorg/app-vibes',
      getNavigationUrl: () => `/overview/values/${path}`,
    });
  };

  const overviewCTAArr = [
    {
      label: `📖 ${t('Our Code of Conduct')} ✨`,
      url: externalLinks.discourse.CoC,
      handler: handleCodeOfConductClick,
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
      <VibesIntroCard
        titleLabel={t('Overview')}
        introLabel={`${t('Welcome to AKASHA Vibes')}`}
        subtitleLabel={t(
          "The Vibes app encourages collaboration while safeguarding against misuse. It's an open and transparent platform, inviting you to actively participate in shaping our community's governance.",
        )}
        overviewCTAArr={overviewCTAArr}
      />

      {/**
       * if logged user is not a moderator, show this prompt
       */}
      {!isModerator && (
        <BecomeModeratorCard
          titleLabel={t('Become a Moderator')}
          subtitleLabel={`🌈 ${t(
            'Dive into Akasha World as a moderator! Contribute, guide our community, and create impact. Your journey starts here',
          )}`}
          buttonLabel={t('Apply Now!')}
          onClickApply={() => {
            /** */
          }}
        />
      )}

      <VibesValuesCard
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
