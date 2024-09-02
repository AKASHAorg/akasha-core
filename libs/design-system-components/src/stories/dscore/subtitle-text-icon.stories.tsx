import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BeakerIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import SubtitleTextIcon, {
  SubtitleTextIconProps,
} from '@akashaorg/design-system-core/lib/components/SubtitleTextIcon';

SubtitleTextIcon.displayName = 'SubtitleTextIcon';

const meta: Meta<SubtitleTextIconProps> = {
  title: 'DSCore/Icons/SubtitleTextIcon',
  component: SubtitleTextIcon,
  argTypes: {
    customStyle: { control: 'text' },
    icon: { control: 'object' },
    solid: { control: 'boolean' },
    backgroundSize: { control: 'text' },
    backgroundColor: { control: 'boolean' },
    label: { control: 'text' },
    labelSize: { control: 'select', options: ['button-sm', 'button-lg'] },
    subtitle: { control: 'text' },
    subtitleIcon: { control: 'object' },
    gap: { control: 'select', options: ['xxsmall', 'xsmall', 'small', 'medium', 'large'] },
    maxWidth: { control: 'text' },
    onClick: { action: 'subtitle text icon clicked' },
  },
};

type Story = StoryObj<SubtitleTextIconProps>;

export const Default: Story = { args: { label: 'Subtitle Text Label', subtitle: 'some subtitle' } };

export const WithIcon: Story = {
  args: { label: 'Subtitle Text Label', subtitle: 'some subtitle', icon: <BeakerIcon /> },
};

export const WithIconBackgroundColor: Story = {
  args: {
    label: 'Subtitle Text Label',
    subtitle: 'some subtitle',
    icon: <BeakerIcon />,
    backgroundColor: true,
  },
};

export default meta;
