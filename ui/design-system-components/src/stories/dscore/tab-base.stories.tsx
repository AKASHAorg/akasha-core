import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Tab, { TabProps } from '@akashaorg/design-system-core/lib/components/Tab';

const meta: Meta<TabProps> = {
  title: 'DSCore/Tab/Tab',
  component: Tab,
};

export default meta;
type Story = StoryObj<TabProps>;

const Component = () => {
  const [value, setValue] = useState(0);

  return (
    <Tab value={value} onChange={setValue} labels={['Tab 1', 'Tab 2', 'Tab 3']}>
      <div>Content 1</div>
      <div>Content 2</div>
      <div>Content 3</div>
    </Tab>
  );
};

export const BaseTab: Story = {
  render: () => <Component />,
};
