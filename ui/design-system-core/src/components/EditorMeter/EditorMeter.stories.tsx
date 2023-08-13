import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import EditorMeter, { EditorMeterProps } from '.';

const meta: Meta<EditorMeterProps> = {
  title: 'Meter/EditorMeter',
  component: EditorMeter,
};

export default meta;
type Story = StoryObj<EditorMeterProps>;

export const BaseEditorMeter: Story = {
  render: () => <EditorMeter max={25} value={22} />,
};
