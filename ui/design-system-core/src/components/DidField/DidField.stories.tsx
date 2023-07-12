// eslint-disable-next-line unicorn/filename-case
import React from 'react';
import DidField from '.';

export default {
  title: 'Fields/DidField',
  component: DidField,
};

const Template = args => <DidField {...args} />;

export const EthDidField = Template.bind({});
EthDidField.args = {
  did: 'did:pkh:eip155:5:0xc1cb6a6dd8099718157b20467311486c1fa8b415',
};

export const SolanaDidField = Template.bind({});
SolanaDidField.args = {
  did: 'did:pkh:solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ:CKg5d12Jhpej1JqtmxLJgaFqqeYjxgPqToJ4LBdvG9Ev',
};

export const BasicDidField = Template.bind({});
BasicDidField.args = {
  did: 'did:pkh:bip122:000000000019d6689c085ae165831e93:128Lkh3S7CkDTBZ8W7BbpsN3YYizJMp8p6',
};

export const BasicDidFieldGreyText = Template.bind({});
BasicDidFieldGreyText.args = {
  did: 'did:pkh:bip122:000000000019d6689c085ae165831e93:128Lkh3S7CkDTBZ8W7BbpsN3YYizJMp8p6',
  textColor: 'grey7',
};
