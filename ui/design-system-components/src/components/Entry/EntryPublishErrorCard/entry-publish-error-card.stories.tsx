import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import EntryPublishErrorCard, { PublishErrorCardProps } from '.';

const meta: Meta<PublishErrorCardProps> = {
  title: 'DSComponents/Errors/EntryPublishErrorCard',
  component: EntryPublishErrorCard,
};

export default meta;
type Story = StoryObj<PublishErrorCardProps>;

export const BaseEntryPublishErrorCard: Story = {
  render: () => <EntryPublishErrorCard isCard={true} message="Sorry, an error occured!" />,
};
