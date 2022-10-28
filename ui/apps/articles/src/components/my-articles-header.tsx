import React from 'react';
import DS from '@akashaorg/design-system';

const { Box, MainAreaCardBox, Text } = DS;

export interface IMyArticlesHeaderProps {
  titleLabel: string;
  subtitleLabel: string;
  tabs: string[];
  activeTabIndex: number;
  onClickTab: (idx: number) => () => void;
}

const MyArticlesHeader: React.FC<IMyArticlesHeaderProps> = props => {
  const { titleLabel, subtitleLabel, tabs, activeTabIndex, onClickTab } = props;
  return (
    <MainAreaCardBox
      style={{
        borderBottom: 'none',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
      }}
    >
      <Box pad="medium" gap="medium">
        <Text size="xlarge" weight="bold">
          {titleLabel}
        </Text>
        <Text size="large">{subtitleLabel}</Text>
      </Box>
      <Box direction="row">
        {tabs.map((tab, idx) => (
          <Box
            key={idx}
            width={`${100 / tabs.length}%`}
            pad="medium"
            border={{ side: 'bottom', color: activeTabIndex === idx ? 'accent' : 'border' }}
            onClick={onClickTab(idx)}
          >
            <Text
              size="large"
              textAlign="center"
              color={activeTabIndex === idx ? 'accentText' : 'secondaryText'}
            >
              {tab}
            </Text>
          </Box>
        ))}
      </Box>
    </MainAreaCardBox>
  );
};

export default MyArticlesHeader;
