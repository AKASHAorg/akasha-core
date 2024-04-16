import type { Meta, StoryObj } from '@storybook/react';
import ChatAreaHeader, { ChatAreaHeaderProps } from '../../components/ChatAreaHeader';

const meta: Meta<ChatAreaHeaderProps> = {
  title: 'DSComponents/Chat/ChatAreaHeader',
  component: ChatAreaHeader,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    avatar: { control: 'object' },
    did: { control: 'object' },
    transformSource: { action: 'source transformed' },
  },
};

type Story = StoryObj<ChatAreaHeaderProps>;

const avatar = { src: 'https://placebeard.it/360x360', height: 360, width: 360 };

export const Default: Story = {
  args: {
    avatar,
    name: 'Estelle Collier',
    did: { id: 'did:key:003410490050000320006570034567114572000' },
    transformSource: () => ({
      src: 'https://placebeard.it/360x360',
      width: 360,
      height: 360,
    }),
  },
};

export default meta;
