import type { Meta, StoryObj } from '@storybook/react';
import ListAppTopbar, { ListAppTopbarProps } from '../../components/ListAppTopbar';

const meta: Meta<ListAppTopbarProps> = {
  title: 'DSComponents/ListApp/ListAppTopbar',
  component: ListAppTopbar,
  tags: ['autodocs'],
  argTypes: {
    titleLabel: { control: 'text' },
    resetLabel: { control: 'text' },
    removeAllLabel: { control: 'text' },
    dropDownMenuItems: { control: 'object' },
    handleIconMenuClick: { action: 'icon menu clicked' },
  },
};

type Story = StoryObj<ListAppTopbarProps>;

export const Default: Story = {
  args: {
    titleLabel: 'Your List',
    resetLabel: 'Reset',
    removeAllLabel: 'Remove All',
    dropDownMenuItems: [
      { id: '0', title: 'All Categories' },
      { id: '1', title: 'Beams' },
      { id: '2', title: 'Reflections' },
    ],
    handleIconMenuClick: () => ({}),
  },
};

export default meta;
