import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
      <Stack padding="p-4" spacing="gap-4">
        <Text variant="h2">{titleLabel}</Text>
        <Text variant="h6">{subtitleLabel}</Text>
      </Stack>
      <Stack direction="row">
        {tabs.map((tab, idx) => (
          <button onClick={onClickTab(idx)}>
            <Stack
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
            </Stack>
          </button>
        ))}
      </Stack>
    </Card>
  );
};

export default MyArticlesHeader;
