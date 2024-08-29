import type { Meta, StoryObj } from '@storybook/react';
import Label, { LabelProps } from '@akashaorg/design-system-core/lib/components/Label';

const meta: Meta = {
  title: 'DSCore/Labels/Label',
  component: Label,

  argTypes: {
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
};

type Story = StoryObj<LabelProps>;

export const Default: Story = {
  args: { children: 'Label' },
};

export const RequiredLabel: Story = {
  args: { children: 'Label', required: true },
};

export const DisabledLabel: Story = {
  args: { children: 'Label', disabled: true },
};

export default meta;
