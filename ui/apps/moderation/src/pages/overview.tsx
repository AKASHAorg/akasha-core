import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/typings/ui';

import ModerationValuesCard from '../components/values-card';

import { values } from '../services/values';

const { Box, ModerationIntroCard } = DS;

const IntroPage: React.FC<RootComponentProps> = props => {
  const { plugins } = props;
  const { t } = useTranslation('app-moderation-ewa');

  const routing = plugins['@akashaorg/app-routing']?.routing;

  const handleCodeOfConductClick = () => {
    routing.navigateTo({
      appName: '@akashaorg/app-legal',
      getNavigationUrl: () => '/legal/code-of-conduct',
    });
  };

  const handleValueClick = (path: string) => () => {
    routing.navigateTo({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: () => `/overview/values/${path}`,
    });
  };

  return (
    <Box gap="small">
      <ModerationIntroCard
        titleLabel={t('Moderating')}
        subtitleLabel={t('Find all the moderated posts, replies and accounts')}
        introLabel={t('Welcome to the Moderation App')}
        descriptionLine1Label={t(
          'Here you can find all the moderated content in Ethereum World without revealing any personal information 🔒',
        )}
        overviewCTAArr={[
          {
            label: t('CoC Discussions'),
            url: 'https://discord.gg/A5wfg6ZCRt',
            iconType: 'discourse',
          },
          {
            label: t('Moderation thoughts'),
            url: 'https://discord.gg/A5wfg6ZCRt',
            iconType: 'discord',
          },
          {
            label: t('Send us a message'),
            url: 'mailto:moderators@ethereum.world',
            iconType: 'emailAlt',
          },
        ]}
        onCodeOfConductClick={handleCodeOfConductClick}
      />

      <ModerationValuesCard
        titleLabel={t('Our Values')}
        subtitleLabel={t('The principles guiding our behaviour')}
        ctaLabel={t('Propose your own')}
        ctaUrl=""
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

export default IntroPage;
