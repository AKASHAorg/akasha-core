import React from 'react';
import { tw } from '@twind/core';
import type { Meta, StoryObj } from '@storybook/react';

import Anchor, { AnchorProps } from '.';

const meta: Meta<AnchorProps> = {
  title: 'Anchor/Anchor',
  component: Anchor,
};

export default meta;
type Story = StoryObj<AnchorProps>;

export const BaseAnchor: Story = {
  render: () => (
    <div className={tw('w-[15%]')}>
      <Anchor href="https://beta.akasha.world">
        <p>Click me</p>
      </Anchor>
    </div>
  ),
};
