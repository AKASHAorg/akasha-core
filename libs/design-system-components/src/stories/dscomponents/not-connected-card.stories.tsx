import type { Meta, StoryObj } from '@storybook/react';
import NotConnectedCard, { NotConnectedCardProps } from '../../components/NotConnectedCard';

const meta: Meta<NotConnectedCardProps> = {
  title: 'DSComponents/Cards/NotConnectedCard',
  component: NotConnectedCard,
  tags: ['autodocs'],
};

type Story = StoryObj<NotConnectedCardProps>;

export const Default: Story = {
  args: {
    publicImgPath: '',
    assetName: 'not-connected',
    title: 'Uh-oh! You are not connected!',
    subtitle: 'some extra message here',
    buttonLabel: 'Connect',
    onButtonClick: () => ({}),
  },
};

export default meta;
