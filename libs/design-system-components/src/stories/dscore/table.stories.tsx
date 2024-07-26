import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Table, { TableProps } from '@akashaorg/design-system-core/lib/components/Table';
import Text from '@akashaorg/design-system-core/lib/components/Text';

const meta: Meta<TableProps> = {
  title: 'DSCore/Table/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    tableTitle: { control: 'text' },
    customThStyle: { control: 'text' },
    customTdStyle: { control: 'text' },
    rows: { control: 'object' },
  },
};

type Story = StoryObj<TableProps>;

export const Default: Story = {
  args: {
    tableTitle: 'Table title',
    rows: [
      {
        value: [
          <Text key={0}>The Sliding Mr. Bones (Next Stop, Pottersville)</Text>,
          <Text key={1}>Malcolm Lockyer</Text>,
          <Text key={2}>1961</Text>,
        ],
        clickHandler: () => {
          /** */
        },
      },
      {
        value: [
          <Text key={0}>Witchy woman</Text>,
          <Text key={1}>The Eagles</Text>,
          <Text key={2}>1972</Text>,
        ],
        clickHandler: () => {
          /** */
        },
      },
      {
        value: [
          <Text key={0}>Shining Star</Text>,
          <Text key={1}>Earth, Wind, and Fire</Text>,
          <Text key={2}>1975</Text>,
        ],
        clickHandler: () => {
          /** */
        },
      },
    ],
  },
};

export const TableWithHeadValues: Story = {
  args: {
    tableTitle: 'Table title',
    theadValues: [
      <Text key={0}>Song</Text>,
      <Text key={1}>Artist</Text>,
      <Text key={2}>Year</Text>,
    ],
    rows: [
      {
        value: [
          <Text key={0}>The Sliding Mr. Bones (Next Stop, Pottersville)</Text>,
          <Text key={1}>Malcolm Lockyer</Text>,
          <Text key={2}>1961</Text>,
        ],
        clickHandler: () => {
          /** */
        },
      },
      {
        value: [
          <Text key={0}>Witchy woman</Text>,
          <Text key={1}>The Eagles</Text>,
          <Text key={2}>1972</Text>,
        ],
        clickHandler: () => {
          /** */
        },
      },
      {
        value: [
          <Text key={0}>Shining Star</Text>,
          <Text key={1}>Earth, Wind, and Fire</Text>,
          <Text key={2}>1975</Text>,
        ],
        clickHandler: () => {
          /** */
        },
      },
    ],
  },
};

export default meta;
