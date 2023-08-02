import React from 'react';
import { tw } from '@twind/core';
import type { Meta, StoryObj } from '@storybook/react';

import Anchor from '.';

const meta: Meta<typeof Anchor> = {
  title: 'Anchor/Anchor',
  component: Anchor,
};

export default meta;
type Story = StoryObj<typeof Anchor>;

export const BaseAnchor: Story = {
  render: () => (
    <div className={tw('w-[15%]')}>
      <Anchor href="https://beta.akasha.world">
        <p>Click me</p>
      </Anchor>
    </div>
  ),
};
