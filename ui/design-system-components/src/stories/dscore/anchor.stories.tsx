import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Anchor, { AnchorProps } from '@akashaorg/design-system-core/lib/components/Anchor';

const meta: Meta<AnchorProps> = {
  title: 'DSCore/Anchor/Anchor',
  component: Anchor,
};

export default meta;
type Story = StoryObj<AnchorProps>;

export const BaseAnchor: Story = {
  render: () => (
    <Anchor href="https://beta.akasha.world" customStyle="w-[15%]">
      <p>Click me</p>
    </Anchor>
  ),
};
