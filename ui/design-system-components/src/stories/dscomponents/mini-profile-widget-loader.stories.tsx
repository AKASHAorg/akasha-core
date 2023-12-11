import React from 'react';
import { tw } from '@twind/core';
import type { Meta, StoryObj } from '@storybook/react';

import MiniProfileWidgetLoader from '../../components/Loaders/mini-profile-widget-loader';

const meta: Meta = {
  title: 'DSComponents/Loaders/MiniProfileWidgetLoader',
  component: MiniProfileWidgetLoader,
};

export default meta;
type Story = StoryObj;

export const BaseCard: Story = {
  render: () => (
    <div className={tw('w-[25%]')}>
      <MiniProfileWidgetLoader />
    </div>
  ),
};
