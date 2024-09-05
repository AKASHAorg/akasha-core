import type { Meta, StoryObj } from '@storybook/react';
import VibesIntroCard, { VibesIntroCardProps } from '../../components/VibesIntroCard';

const meta: Meta<VibesIntroCardProps> = {
  title: 'DSComponents/Vibes/VibesIntroCard',
  component: VibesIntroCard,
};

type Story = StoryObj<VibesIntroCardProps>;

export const Default: Story = {
  args: {
    titleLabel: 'Welcome to AKASHA Vibes',
    subtitleLabel:
      'Vibes app facilitates cooperation and prevents abuse. The app is open and transparent. Take part in the process of governing this community.',
    overviewCTAArr: [
      {
        label: 'CoC discussions',
        url: '',
      },
      {
        label: 'Vibes thoughts',
        url: '',
      },
      {
        label: 'Send us a message',
        url: '',
      },
    ],
  },
};

export default meta;
