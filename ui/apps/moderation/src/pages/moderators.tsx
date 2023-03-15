import React from 'react';
import { useTranslation } from 'react-i18next';

import { useGetModerators } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/typings/ui';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import ModerationSwitchCard from '@akashaorg/design-system-core/lib/components/ModerationSwitchCard';
import ModeratorDetailCard from '@akashaorg/design-system-core/lib/components/ModeratorDetailCard';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';

const tabs = ['All', 'Active', 'Resigned', 'Revoked'];

const AllModerators: React.FC<RootComponentProps> = () => {
  const [activeTab, setActiveTab] = React.useState<string>('All');

  const { t } = useTranslation('app-moderation-ewa');

  const getModeratorsQuery = useGetModerators();

  const allModerators = getModeratorsQuery.data;

  const modTabs = tabs.map(tab => ({
    title: t('{{tab}}', { tab }),
    value: tab,
  }));

  const filteredModeratorList = allModerators?.filter(moderator =>
    activeTab === 'All' ? moderator : moderator.status === activeTab.toLowerCase(),
  );

  const handleSocialLinkClick = () => {
    /** TODO: connect this */
  };

  return (
    <BasicCardBox pad="p-0">
      <ModerationSwitchCard tabs={modTabs} activeTab={activeTab} onTabClick={setActiveTab} />

      {getModeratorsQuery.isFetching && (
        <Box customStyle="flex items-center justify-center p-4">
          <Spinner size="lg" />
        </Box>
      )}

      {!getModeratorsQuery.isFetching &&
        getModeratorsQuery.data &&
        getModeratorsQuery.data.length > 0 && (
          <Box customStyle="flex-1">
            <Box customStyle="w-full h-full overflow-y-scroll">
              {filteredModeratorList?.map((moderator, idx) => (
                <ModeratorDetailCard
                  key={idx}
                  moderator={moderator}
                  hasBorderBottom={idx < filteredModeratorList.length - 1}
                  tenureInfoLabel={
                    moderator.status === 'active'
                      ? t('Moderator since')
                      : t(`{{status}} on`, {
                          status: moderator.status
                            ? moderator.status[0].toUpperCase() + moderator.status.slice(1)
                            : '',
                        })
                  }
                  onSocialLinkClick={handleSocialLinkClick}
                />
              ))}
            </Box>
          </Box>
        )}
    </BasicCardBox>
  );
};

export default AllModerators;
