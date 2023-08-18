import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import DidField, { DidFieldProps } from '.';

const meta: Meta<DidFieldProps> = {
  title: 'Fields/DidField',
  component: DidField,
};

export default meta;
type Story = StoryObj<DidFieldProps>;

export const BaseDidField: Story = {
  render: () => (
    <DidField did="did:pkh:bip122:000000000019d6689c085ae165831e93:128Lkh3S7CkDTBZ8W7BbpsN3YYizJMp8p6" />
  ),
};

export const BaseDidFieldWithGreyText: Story = {
  render: () => (
    <DidField
      did="did:pkh:bip122:000000000019d6689c085ae165831e93:128Lkh3S7CkDTBZ8W7BbpsN3YYizJMp8p6"
      textColor="grey7"
    />
  ),
};

export const EthDidField: Story = {
  render: () => <DidField did="did:pkh:eip155:5:0xc1cb6a6dd8099718157b20467311486c1fa8b415" />,
};

export const SolanaDidField: Story = {
  render: () => (
    <DidField did="did:pkh:solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ:CKg5d12Jhpej1JqtmxLJgaFqqeYjxgPqToJ4LBdvG9Ev" />
  ),
};
