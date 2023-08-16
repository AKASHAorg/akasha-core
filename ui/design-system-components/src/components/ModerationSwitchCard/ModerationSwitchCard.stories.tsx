import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ModerationSwitchCard, { ModerationSwitchCardProps } from '.';
import Box from '@akashaorg/design-system-core/lib/components/Box';

const meta: Meta<ModerationSwitchCardProps> = {
  title: 'Moderation/ModerationSwitchCard',
  component: ModerationSwitchCard,
};

export default meta;
type Story = StoryObj<ModerationSwitchCardProps>;

const Component = () => {
  const [activetab, setActiveTab] = useState('All');

  return (
    <Box customStyle="w-[40%]">
      <ModerationSwitchCard
        tabs={[
          { title: 'All', value: 'All' },
          { title: 'Active', value: 'Active' },
          { title: 'Resigned', value: 'Resigned' },
          { title: 'Revoked', value: 'Revoked' },
        ]}
        activeTab={activetab}
        onTabClick={setActiveTab}
      />
    </Box>
  );
};

export const BaseModerationSwitchCard: Story = {
  render: () => <Component />,
};
