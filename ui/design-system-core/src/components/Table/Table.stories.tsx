import React from 'react';
import Table, { ITableProps } from './index';

export default {
  title: 'Table/Table',
  component: Table,
};

const Template = (args: ITableProps) => <Table {...args} />;

export const BaseTable = Template.bind({});
BaseTable.args = {
  theadValues: ['Song', 'Artist', 'Year'],
  rows: [
    ['The Sliding Mr. Bones (Next Stop, Pottersville)', 'Malcolm Lockyer', '1961'],
    ['Witchy woman', 'The Eagles', '1972'],
    ['Shining Star', 'Earth, Wind, and Fire', '1975'],
  ],
};
