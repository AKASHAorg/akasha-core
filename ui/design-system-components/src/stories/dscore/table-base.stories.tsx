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
      theadValues={[<p key={0}>Song</p>, <p key={1}>Artist</p>, <p key={2}>Year</p>]}
      rows={[
        {
          value: [
            <p key={0}>The Sliding Mr. Bones (Next Stop, Pottersville)</p>,
            <p key={1}>Malcolm Lockyer</p>,
            <p key={2}>1961</p>,
          ],
        },
        { value: [<p key={0}>Witchy woman</p>, <p key={1}>The Eagles</p>, <p key={2}>1972</p>] },
        {
          value: [
            <p key={0}>Shining Star</p>,
            <p key={1}>Earth, Wind, and Fire</p>,
            <p key={2}>1975</p>,
          ],
        },
      ]}
    />
  ),
};
