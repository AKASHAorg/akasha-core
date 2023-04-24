import React from 'react';
import EntryError, { EntryErrorProps } from '.';

export default {
  title: 'Profile/EntryError',
  component: EntryError,
};

const Template = (args: EntryErrorProps) => <EntryError {...args} />;

export const BaseEntryError = Template.bind({});
BaseEntryError.args = {};
