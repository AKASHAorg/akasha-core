import React from 'react';
import PasswordField from '.';

export default {
  title: 'Fields/Password',
  component: PasswordField,
};

const Template = args => <PasswordField {...args} />;

export const BasePasswordField = Template.bind({});
BasePasswordField.args = {
  strengthLevel: 0,
};

export const WeakPasswordField = Template.bind({});
WeakPasswordField.args = {
  strengthLevel: 1,
};

export const FairPasswordField = Template.bind({});
FairPasswordField.args = {
  strengthLevel: 2,
};

export const GoodPasswordField = Template.bind({});
GoodPasswordField.args = {
  strengthLevel: 3,
};

export const StrongPasswordField = Template.bind({});
StrongPasswordField.args = {
  strengthLevel: 4,
};
