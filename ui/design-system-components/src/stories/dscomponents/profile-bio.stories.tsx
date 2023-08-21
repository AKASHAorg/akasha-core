import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Bio, { BioProps } from '../../components/Profile/Bio';

const meta: Meta<BioProps> = {
  title: 'DSComponents/Profile/ProfileBio',
  component: Bio,
};

export default meta;
type Story = StoryObj<BioProps>;

export const BaseBio: Story = {
  render: () => (
    <Bio
      title="Bio"
      biography="Coffee lover ☕️ Web3.Space traveler 🧑🏼‍🚀 Loves cooking and baking for the shelter in my neighborhood."
    />
  ),
};
