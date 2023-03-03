import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import DSNew from '@akashaorg/design-system-core';
import { useGetModerators } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/typings/ui';

const { Box, ModeratorDetailCard, Spinner, styled } = DS;

const { BasicCardBox, ModerationSwitchCard } = DSNew;

const tabs = ['All', 'Active', 'Resigned', 'Revoked'];

const VerticalFillBox = styled(Box)`
  height: calc(
    100vh - 48px /* topbar height */ - 104px /* merge info card height */ - 2rem /* offset bottom */
  );
`;

const ListWrapper = styled(Box)`
  flex: 1;
`;

const ListArea = styled(BasicCardBox)`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
`;

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

  const handleTabClick = (value: string) => () => {
    setActiveTab(value);
  };

  const handleSocialLinkClick = () => {
    /** TODO: connect this */
  };

  return (
    <VerticalFillBox gap="small">
      <BasicCardBox pad="pb-0" styling="rounded-b-none">
        <ModerationSwitchCard tabs={modTabs} activeTab={activeTab} onTabClick={handleTabClick} />
      </BasicCardBox>

      {getModeratorsQuery.isFetching && <Spinner />}

      {!getModeratorsQuery.isFetching &&
        getModeratorsQuery.data &&
        getModeratorsQuery.data.length > 0 && (
          <ListWrapper>
            <ListArea>
              {filteredModeratorList?.map((moderator, idx) => (
                <ModeratorDetailCard
                  key={idx}
                  moderator={moderator}
                  hasBorderBottom={idx < allModerators.length - 1}
                  tenureInfoLabel={
                    moderator.status === 'active' ? t('Moderator since') : t('Moderator until')
                  }
                  onSocialLinkClick={handleSocialLinkClick}
                />
              ))}
            </ListArea>
          </ListWrapper>
        )}
    </VerticalFillBox>
  );
};

export default AllModerators;
