import React, { Dispatch, SetStateAction } from 'react';
import { tw } from '@twind/core';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type ModerationSwitchCardProps = {
  tabs: { title: string; value: string }[];
  activeTab: string;
  onTabClick: Dispatch<SetStateAction<string>>;
};

const ModerationSwitchCard: React.FC<ModerationSwitchCardProps> = props => {
  const { tabs, activeTab, onTabClick } = props;

  const handleTabClick = (value: string) => {
    onTabClick(value);
  };

  return (
    <div className={tw('flex w-full')}>
      {tabs.map((tab, idx) => (
        <Button plain={true} onClick={() => handleTabClick(tab.value)}>
          <div
            key={tab.title + idx}
            className={tw(
              `w-[25%] p-4 border-b ${
                tab.value === activeTab
                  ? ' border(secondaryLight dark:secondaryDark)'
                  : 'border(grey8 dark:grey3)'
              } cursor-pointer`,
            )}
          >
            <Text
              color={
                tab.value === activeTab
                  ? { light: 'secondaryLight', dark: 'secondaryDark' }
                  : { light: 'grey7', dark: 'grey5' }
              }
              align="center"
            >
              {tab.title}
            </Text>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default ModerationSwitchCard;
