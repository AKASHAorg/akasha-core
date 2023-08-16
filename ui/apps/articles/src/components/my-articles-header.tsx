import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export interface IMyArticlesHeaderProps {
  titleLabel: string;
  subtitleLabel: string;
  tabs: string[];
  activeTabIndex: number;
  onClickTab: (idx: number) => () => void;
}

const MyArticlesHeader: React.FC<IMyArticlesHeaderProps> = props => {
  const { titleLabel, subtitleLabel, tabs, activeTabIndex, onClickTab } = props;
  const tabWidth = 100 / tabs.length;
  return (
    <Card customStyle="border-b-0 rounded-b-none">
      <Box customStyle="p-4 gap-4">
        <Text variant="h2">{titleLabel}</Text>
        <Text variant="h6">{subtitleLabel}</Text>
      </Box>
      <Box customStyle="flex flex-row">
        {tabs.map((tab, idx) => (
          <button onClick={onClickTab(idx)}>
            <Box
              key={idx}
              customStyle={`w-[${tabWidth}%}] p-4 border(b ${
                activeTabIndex === idx ? 'secondaryLight dark:secondaryDark' : 'grey8 dark:grey3'
              })`}
            >
              <Text
                variant="h6"
                align="center"
                color={
                  activeTabIndex === idx
                    ? {
                        light: 'secondaryLight',
                        dark: 'secondaryDark',
                      }
                    : {
                        light: 'grey4',
                        dark: 'grey7',
                      }
                }
              >
                {tab}
              </Text>
            </Box>
          </button>
        ))}
      </Box>
    </Card>
  );
};

export default MyArticlesHeader;
