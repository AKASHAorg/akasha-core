import React from 'react';
import { tw } from '@twind/core';
import type { Meta, StoryObj } from '@storybook/react';

import AntennaLoader from '../../components/Loaders/antenna-loader';

const meta: Meta = {
  title: 'DSComponents/Loaders/AntennaLoader',
  component: AntennaLoader,
};

export default meta;
type Story = StoryObj;

export const BaseCard: Story = {
  render: () => (
    <div className={tw('w-[50%]')}>
      <AntennaLoader />
    </div>
  ),
};
