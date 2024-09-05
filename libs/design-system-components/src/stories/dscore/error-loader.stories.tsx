import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import ErrorLoader, {
  ErrorLoaderProps,
} from '@akashaorg/design-system-core/lib/components/ErrorLoader';

ErrorLoader.displayName = 'ErrorLoader';

const meta: Meta<ErrorLoaderProps> = {
  title: 'DSCore/Cards/ErrorLoader',
  component: ErrorLoader,
  argTypes: {
    type: { control: 'text' },
    publicImgPath: { control: 'text' },
    title: { control: 'text' },
    details: { control: 'text' },
  },
};

type Story = StoryObj<ErrorLoaderProps>;

export const Default: Story = {
  args: {
    publicImgPath: '',
    type: 'not-authenticated',
    title: 'Uh-oh! You are not connected!',
    details: 'To access this resource, you must be connected ⚡️',
  },
};

export const ErrorLoaderWithCTA: Story = {
  args: {
    publicImgPath: '',
    type: 'not-authenticated',
    title: 'Uh-oh! You are not connected!',
    details: 'To access this resource, you must be connected ⚡️',
    children: (
      <Button variant="primary" label="Take Action" onClick={() => console.log('clicked button')} />
    ),
  },
};

export default meta;
