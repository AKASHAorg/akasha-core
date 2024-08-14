import type { Meta, StoryObj } from '@storybook/react';
import TabList, { TabListProps } from '@akashaorg/design-system-core/lib/components/TabList';

const meta: Meta<TabListProps> = {
  title: 'DSCore/Tabs/TabList',
  component: TabList,
  tags: ['autodocs'],
  argTypes: {
    labels: { control: 'object' },
    selected: { control: 'number' },
    customStyle: { control: 'text' },
    tabListDivider: { control: 'boolean' },
    labelTextVariant: { control: 'text' },
    onChange: { action: 'tablist changed' },
  },
};

type Story = StoryObj<TabListProps>;

export const Default: Story = { args: { labels: ['Tab 1', 'Tab 2', 'Tab 3'], selected: 0 } };

export const TabListWithDivider: Story = {
  args: { labels: ['Tab 1', 'Tab 2', 'Tab 3'], selected: 1, tabListDivider: true },
};

export default meta;
