import type { Meta, StoryObj } from '@storybook/react';

import ErrorCard, { ErrorCardProps } from '@akashaorg/design-system-core/lib/components/ErrorCard';

const meta: Meta<ErrorCardProps> = {
  title: 'DSCore/Cards/ErrorCard',
  component: ErrorCard,
  tags: ['autodocs'],
  argTypes: {
    boxSize: { control: 'text' },
    errorType: { control: 'text' },
    titleLabel: { control: 'text' },
    subtitleLabel: { control: 'text' },
    buttonLabel: { control: 'text' },
    textMarginTop: { control: 'boolean' },
    textMarginBottom: { control: 'boolean' },
    hasButton: { control: 'boolean' },
    imageBoxHasMargin: { control: 'boolean' },
    publicImgPath: { control: 'text' },
    onClick: { action: 'card clicked' },
  },
};

type Story = StoryObj<ErrorCardProps>;

export const Default: Story = {
  args: {
    boxSize: '18.75rem',
    publicImgPath: '',
    errorType: 'no-authentication',
    titleLabel: 'This page is for our marvelous AKASHA World moderators',
    subtitleLabel:
      'To view this page you must be an AKASHA World Moderator and log in with your wallet to continue',
    hasButton: true,
  },
};

export const ErrorCardWithButton: Story = {
  args: {
    boxSize: '18.75rem',
    publicImgPath: '',
    errorType: 'no-authentication',
    titleLabel: 'This page is for our marvelous AKASHA World moderators',
    subtitleLabel:
      'To view this page you must be an AKASHA World Moderator and log in with your wallet to continue',
    hasButton: true,
    buttonLabel: 'Connect a wallet',
  },
};

export default meta;
