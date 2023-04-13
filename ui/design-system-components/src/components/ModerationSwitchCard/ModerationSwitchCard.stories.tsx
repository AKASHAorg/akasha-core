import React from 'react';

import ModerationSwitchCard, { IModerationSwitchCardProps } from '.';

export default {
  title: 'Moderation/ModerationSwitchCard',
  component: ModerationSwitchCard,
};

const Template = (args: IModerationSwitchCardProps) => {
  const [activetab, setActiveTab] = React.useState('All');

  return (
    <div style={{ width: '40%' }}>
      <ModerationSwitchCard {...args} activeTab={activetab} onTabClick={setActiveTab} />
    </div>
  );
};

export const BaseModerationSwitchCard = Template.bind({});

BaseModerationSwitchCard.args = {
  tabs: [
    { title: 'All', value: 'All' },
    { title: 'Active', value: 'Active' },
    { title: 'Resigned', value: 'Resigned' },
    { title: 'Revoked', value: 'Revoked' },
  ],
};
