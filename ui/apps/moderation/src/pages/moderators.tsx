import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetModerators } from '@akashaorg/ui-awf-hooks';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import ModerationSwitchCard from '@akashaorg/design-system-components/lib/components/ModerationSwitchCard';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';

import ModeratorDetailMiniCard from '../components/moderator/mini-card';

import { generateTenureInfoLabel } from '../utils';
import { BasePageProps } from './dashboard';

export const Moderators: React.FC<BasePageProps> = props => {
  const { navigateTo } = props;

  const [activeTab, setActiveTab] = useState<string>('All');

  const { t } = useTranslation('app-moderation-ewa');

  const getModeratorsQuery = useGetModerators();

  const allModerators = getModeratorsQuery.data;

  const tabs = ['All', 'Active', 'Resigned', 'Revoked'];

  const modTabs = tabs.map(tab => ({
    title: t('{{tab}}', { tab }),
    value: tab,
  }));

  const filteredModeratorList = allModerators?.filter(moderator =>
    activeTab === 'All' ? moderator : moderator.status === activeTab.toLowerCase(),
  );

  const handleViewModerator = (profileId: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: () => `/moderator/${profileId}`,
    });
  };

  return (
    <BasicCardBox pad="p-0">
      <ModerationSwitchCard tabs={modTabs} activeTab={activeTab} onTabClick={setActiveTab} />

      {getModeratorsQuery.isFetching && (
        <Box customStyle="flex items-center justify-center p-4">
          <Spinner size="lg" />
        </Box>
      )}

      {!getModeratorsQuery.isFetching && filteredModeratorList && filteredModeratorList.length > 0 && (
        <Box customStyle="flex-1">
          <Box customStyle="w-full h-full overflow-y-scroll">
            {filteredModeratorList?.map((moderator, idx) => {
              const tenureInfoLabel = generateTenureInfoLabel(moderator.status);

              return (
                <ModeratorDetailMiniCard
                  key={moderator.did.id}
                  moderator={moderator}
                  hasBorderBottom={idx < filteredModeratorList.length - 1}
                  tenureInfoLabel={t('{{tenureInfoLabel}}', { tenureInfoLabel })}
                  onCardClick={handleViewModerator}
                />
              );
            })}
          </Box>
        </Box>
      )}
    </BasicCardBox>
  );
};
