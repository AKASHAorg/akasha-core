import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Tab from '@akashaorg/design-system-core/lib/components/Tab';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import ModeratorDetailMiniCard from '../components/moderator/mini-card';

import { generateTenureInfoLabel } from '../utils';
import { BasePageProps } from './dashboard';

export const Moderators: React.FC<BasePageProps> = props => {
  const { navigateTo } = props;

  const [activeTab, setActiveTab] = useState<number>(0);

  const { t } = useTranslation('app-moderation-ewa');

  const getModeratorsQuery = { data: null, isFetching: false };

  const allModerators = getModeratorsQuery.data;

  const tabs = ['All', 'Active', 'Resigned', 'Revoked'];

  const filteredModeratorList = allModerators?.filter(moderator =>
    tabs[activeTab] === 'All' ? moderator : moderator.status === tabs[activeTab].toLowerCase(),
  );

  const handleViewModerator = (profileId: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: () => `/moderator/${profileId}`,
    });
  };

  return (
    <Card padding={0}>
      <Tab value={activeTab} onChange={setActiveTab} labels={tabs} labelTextVariant="body1">
        {getModeratorsQuery.isFetching && (
          <Box customStyle="flex items-center justify-center p-4">
            <Spinner size="lg" />
          </Box>
        )}

        {!getModeratorsQuery.isFetching && !filteredModeratorList && (
          <Text align="center" customStyle="pb-4">
            {t('No moderators found...yet')}
          </Text>
        )}

        {!getModeratorsQuery.isFetching &&
          filteredModeratorList &&
          filteredModeratorList.length > 0 && (
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
      </Tab>
    </Card>
  );
};
