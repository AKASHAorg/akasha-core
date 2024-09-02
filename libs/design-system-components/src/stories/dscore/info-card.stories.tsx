import type { Meta, StoryObj } from '@storybook/react';

import InfoCard, { InfoCardProps } from '@akashaorg/design-system-core/lib/components/InfoCard';

InfoCard.displayName = 'InfoCard';

const meta: Meta<InfoCardProps> = {
  title: 'DSCore/Cards/InfoCard',
  component: InfoCard,
  argTypes: {
    assetName: { control: 'text' },
    publicImgPath: { control: 'text' },
    titleLabel: { control: 'object' },
    bodyLabel: { control: 'boolean' },
    titleVariant: { control: 'text' },
    bodyVariant: { control: 'text' },
    customWidthStyle: { control: 'text' },
  },
};

type Story = StoryObj<InfoCardProps>;

export const Default: Story = {
  args: {
    assetName: 'vibe-overview',
    publicImgPath: '',
    titleLabel: 'Title',
    bodyLabel: 'some content',
  },
};

export default meta;
