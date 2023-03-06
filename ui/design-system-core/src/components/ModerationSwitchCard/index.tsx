import React, { Dispatch, SetStateAction } from 'react';
import { tw } from '@twind/core';

import Text from '../Text';

export interface IModerationSwitchCardProps {
  tabs: { title: string; value: string }[];
  activeTab: string;
  onTabClick: Dispatch<SetStateAction<string>>;
}

const ModerationSwitchCard: React.FC<IModerationSwitchCardProps> = props => {
  const { tabs, activeTab, onTabClick } = props;

  const handleTabClick = (value: string) => {
    onTabClick(value);
  };

  return (
    <div className={tw('flex w-full')}>
      {tabs.map((tab, idx) => (
        <div
          key={tab.title + idx}
          className={tw(
            `w-[25%] p-4 border-b ${
              tab.value === activeTab
                ? ' border-secondary-light dark:border-secondary-dark'
                : 'border-grey8 dark:border-grey3'
            } cursor-pointer`,
          )}
          onClick={() => handleTabClick(tab.value)}
        >
          <Text
            color={
              tab.value === activeTab
                ? { light: 'text-secondary-light', dark: 'text-secondary-dark' }
                : { light: 'text-grey7', dark: 'text-grey5' }
            }
            align="center"
          >
            {tab.title}
          </Text>
        </div>
      ))}
    </div>
  );
};

export default ModerationSwitchCard;
