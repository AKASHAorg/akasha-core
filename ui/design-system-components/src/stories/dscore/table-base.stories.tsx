import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Table, { TableProps } from '@akashaorg/design-system-core/lib/components/Table';

const meta: Meta<TableProps> = {
  title: 'DSCore/Table/Table',
  component: Table,
};

export default meta;
type Story = StoryObj<TableProps>;

export const BaseTable: Story = {
  render: () => (
    <Table
      theadValues={['Song', 'Artist', 'Year']}
      rows={[
        ['The Sliding Mr. Bones (Next Stop, Pottersville)', 'Malcolm Lockyer', '1961'],
        ['Witchy woman', 'The Eagles', '1972'],
        ['Shining Star', 'Earth, Wind, and Fire', '1975'],
      ]}
    />
  ),
};
