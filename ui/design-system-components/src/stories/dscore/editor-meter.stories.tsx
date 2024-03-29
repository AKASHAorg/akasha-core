import type { Meta, StoryObj } from '@storybook/react';
import EditorMeter, {
  EditorMeterProps,
} from '@akashaorg/design-system-core/lib/components/EditorMeter';

const meta: Meta<EditorMeterProps> = {
  title: 'DSCore/Meters/EditorMeter',
  component: EditorMeter,
  tags: ['autodocs'],
  argTypes: {
    max: { control: 'number' },
    value: { control: 'number' },
    background: { control: 'text' },
    customStyle: { control: 'text' },
  },
};

type Story = StoryObj<EditorMeterProps>;

export const Default: Story = {
  args: {
    max: 25,
    value: 22,
  },
};

export default meta;
