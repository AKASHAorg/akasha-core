import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Moderator } from '@akashaorg/typings/lib/ui';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import TabList from '@akashaorg/design-system-core/lib/components/TabList';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import ModeratorDetailMiniCard from '../components/moderator/mini-card';

import { generateModeratorStatusLabel } from '../utils';
import { BasePageProps } from './overview';

export type ModeratorPageProps = BasePageProps & {
  isFetchingModerators: boolean;
  moderators: Moderator[];
};

export const Moderators: React.FC<ModeratorPageProps> = props => {
  const { moderators, isFetchingModerators, navigateTo } = props;

  const [activeTab, setActiveTab] = useState<number>(0);

  const { t } = useTranslation('app-vibes');

  const tabs = ['Active', 'Resigned', 'Dismissed'];

  const filteredModeratorsList = moderators?.filter(
    moderator => moderator.status === tabs[activeTab].toLowerCase(),
  );

  const handleViewModerator = (profileId: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-vibes',
      getNavigationUrl: () => `/moderators/${profileId}`,
    });
  };

  return (
    <Card padding={0}>
      <TabList
        selected={activeTab}
        onChange={setActiveTab}
        labels={tabs.map(tab => t('{{tab}}', { tab }))}
        tabListDivider
      />

      {isFetchingModerators && (
        <Stack align="center" justify="center" customStyle="p-4">
          <Spinner size="lg" />
        </Stack>
      )}

      {!isFetchingModerators && filteredModeratorsList.length === 0 && (
        <Text align="center" customStyle="pb-4">
          {t('No moderators found...yet')}
        </Text>
      )}

      {!isFetchingModerators && filteredModeratorsList && filteredModeratorsList.length > 0 && (
        <Stack>
          <Stack fullWidth={true} customStyle="h-full overflow-y-scroll">
            {filteredModeratorsList?.map((moderator, idx) => {
              const tenureInfoLabel = generateModeratorStatusLabel(moderator.status);

              return (
                <ModeratorDetailMiniCard
                  key={moderator.did.id + moderator.name}
                  moderator={moderator}
                  hasBorderBottom={idx < filteredModeratorsList.length - 1}
                  moderatedItemsLabel={t('items')}
                  tenureInfoLabel={t('{{tenureInfoLabel}}', { tenureInfoLabel })}
                  onCardClick={handleViewModerator}
                />
              );
            })}
          </Stack>
        </Stack>
      )}
    </Card>
  );
};
