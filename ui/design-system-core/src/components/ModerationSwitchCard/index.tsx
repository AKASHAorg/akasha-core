import React from 'react';
import { tw } from '@twind/core';

import Text from '../Text';

export interface IModerationSwitchCard {
  tabs: { title: string; value: string }[];
  activeTab: string;
  onTabClick: (value: string) => void;
}

const ModerationSwitchCard: React.FC<IModerationSwitchCard> = props => {
  const { tabs, activeTab, onTabClick } = props;

  const handleTabClick = value => {
    onTabClick(value);
  };
  return (
    <div className={tw('flex w-[98%] my-0 mx-auto')}>
      {tabs.map((tab, idx) => (
        <div
          key={tab.title + idx}
          className={tw(
            `w-[25%] p-1.5 md:p-3 ${
              tab.value === activeTab
                ? 'border-b border-secondary-light dark:border-secondary-dark'
                : ''
            }`,
          )}
          onClick={() => handleTabClick(tab.value)}
        >
          <Text
            variant="body1"
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
