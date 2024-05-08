import type { Meta, StoryObj } from '@storybook/react';

import DidField, { DidFieldProps } from '@akashaorg/design-system-core/lib/components/DidField';

const meta: Meta<DidFieldProps> = {
  title: 'DSCore/Fields/DidField',
  component: DidField,
  tags: ['autodocs'],
  argTypes: {
    did: { control: 'text' },
    isValid: { control: 'boolean' },
    textColor: { control: 'string' },
    copyLabel: { control: 'text' },
    copiedLabel: { control: 'text' },
    copiable: { control: 'boolean' },
    customStyle: { control: 'text' },
  },
};

type Story = StoryObj<DidFieldProps>;

const baseArgs: Story = {
  args: {
    did: 'did:pkh:bip122:000000000019d6689c085ae165831e93:128Lkh3S7CkDTBZ8W7BbpsN3YYizJMp8p6',
    copyLabel: 'Copy',
    copiedLabel: 'Copied',
  },
};

export const Default: Story = { args: { ...baseArgs.args } };

export const DidFieldWithSpecificColor: Story = { args: { ...baseArgs.args, textColor: 'grey7' } };

export const DidFieldEth: Story = {
  args: { ...baseArgs.args, did: 'did:pkh:eip155:5:0xc1cb6a6dd8099718157b20467311486c1fa8b415' },
};

export const DidFieldSolana: Story = {
  args: {
    ...baseArgs.args,
    did: 'did:pkh:solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ:CKg5d12Jhpej1JqtmxLJgaFqqeYjxgPqToJ4LBdvG9Ev',
  },
};

export const DidFieldInvalid: Story = {
  args: {
    ...baseArgs.args,
    isValid: false,
  },
};

export const DidFieldNotCopiable: Story = {
  args: {
    ...baseArgs.args,
    copiable: false,
  },
};

export default meta;
