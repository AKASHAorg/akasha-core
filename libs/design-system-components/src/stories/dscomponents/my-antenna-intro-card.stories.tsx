import type { Meta, StoryObj } from '@storybook/react';
import MyAntennaIntroCard, { MyAntennaIntroCardProps } from '../../components/MyAntennaIntroCard';

const meta: Meta<MyAntennaIntroCardProps> = {
  title: 'DSComponents/Cards/MyAntennaIntroCard',
  component: MyAntennaIntroCard,
};

type Story = StoryObj<MyAntennaIntroCardProps>;

export const Default: Story = {
  args: {
    publicImgPath: '',
    assetName: 'news-feed',
    heading: 'Add some magic to your feed 🪄',
    description:
      "Personalize your antenna! Pick favorite topics, and enjoy beams tailored to your interests. Don't miss a thing!",
    secondaryDescription: 'Your customized view of AKASHA World',
    isMinified: true,
    ctaLabel: 'Customize My Feed',
    onClickCTA: () => ({}),
  },
};

export default meta;
