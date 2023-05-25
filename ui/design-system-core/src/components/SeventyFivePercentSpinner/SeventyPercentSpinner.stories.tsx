import React from 'react';
import SeventyFivePercentSpinner from './index';

export default {
  title: 'Spinner/SeventyFivePercentSpinner',
  component: SeventyFivePercentSpinner,
};

const Template = args => <SeventyFivePercentSpinner {...args} />;

export const Spinner = Template.bind({});
Spinner.args = {
  size: 'xl',
  color: 'secondaryLight',
};
