import type { Meta, StoryObj } from '@storybook/react';
import VibesValueCard, { VibesValueCardProps } from '../../components/VibesValuesCard/value-card';

const meta: Meta<VibesValueCardProps> = {
  title: 'DSComponents/Vibes/VibesValueCard',
  component: VibesValueCard,
};

type Story = StoryObj<VibesValueCardProps>;

export const Default: Story = {
  args: {
    label: 'Transparency',
    assetName: 'transparency',
    publicImgPath: '',
    description:
      'It needs to be easy for everyone to see what actions are performed. Our communities shall be build on tools and processes that strive for openness, communication and accountability.',
    ctaLabel: 'Discuss this value',
    ctaUrl: '',
  },
};

export const MiniCard: Story = {
  args: { label: 'Transparency', assetName: 'transparency', publicImgPath: '', isMini: true },
};

export default meta;
