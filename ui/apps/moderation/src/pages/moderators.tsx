import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { useGetModerators } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/typings/ui';

const { BasicCardBox, Box, ModeratorDetailCard, Text, Spinner, styled } = DS;

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
      <BasicCardBox>
        <Box pad="medium" gap="small">
          <Text size="xlarge" weight="bold">
            {t('Moderators')}
          </Text>
          <Text color="subtitleText">
            {t('Learn more about and reach out to your moderators.')}
          </Text>
        </Box>
        <Box direction="row" width="98%" margin={{ vertical: '0', horizontal: 'auto' }}>
          {modTabs.map((tab, idx) => (
            <Box
              key={tab.title + idx}
              width="25%"
              pad="small"
              border={tab.value === activeTab ? { side: 'bottom', color: 'accentText' } : false}
              onClick={handleTabClick(tab.value)}
            >
              <Text
                size="large"
                color={tab.value === activeTab ? 'accentText' : 'subtitleText'}
                textAlign="center"
              >
                {tab.title}
              </Text>
            </Box>
          ))}
        </Box>
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
