import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import DSNew from '@akashaorg/design-system-core';
import { useGetModerators } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/typings/ui';

const { Spinner } = DS;

const { Box, BasicCardBox, ModerationSwitchCard, ModeratorDetailCard } = DSNew;

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

      {getModeratorsQuery.isFetching && <Spinner />}

      {!getModeratorsQuery.isFetching &&
        getModeratorsQuery.data &&
        getModeratorsQuery.data.length > 0 && (
          <Box style="flex-1">
            <Box style="w-full h-full overflow-y-scroll">
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
