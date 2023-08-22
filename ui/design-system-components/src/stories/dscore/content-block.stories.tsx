import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import ContentBlock, {
  ContentBlockProps,
} from '@akashaorg/design-system-core/lib/components/ContentBlock';

const meta: Meta<ContentBlockProps> = {
  title: 'DSCore/Blocks/ContentBlock',
  component: ContentBlock,
};

export default meta;
type Story = StoryObj<ContentBlockProps>;

export const BaseContentBlock: Story = {
  render: () => <ContentBlock blockTitle="Content Block" />,
};

export const ContentBlockWithoutDivider: Story = {
  render: () => <ContentBlock blockTitle="Content Block" showDivider={false} />,
};
