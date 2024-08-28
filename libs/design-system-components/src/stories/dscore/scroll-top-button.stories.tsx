import type { Meta, StoryObj } from '@storybook/react';
import ScrollTopButton, {
  ScrollTopButtonProps,
} from '@akashaorg/design-system-core/lib/components/ScrollTopButton';

ScrollTopButton.displayName = 'ScrollTopButton';

const meta: Meta<ScrollTopButtonProps> = {
  title: 'DSCore/Buttons/ScrollTopButton',
  component: ScrollTopButton,

  argTypes: {
    hide: { control: 'boolean' },
  },
};

type Story = StoryObj<ScrollTopButtonProps>;

export const Default: Story = {};

export const HiddenScrollTopButton: Story = { args: { hide: true } };

export default meta;
