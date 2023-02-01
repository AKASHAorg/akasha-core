import React from 'react';

import SubtitleTextIcon from './';

export default {
  title: 'SubtitleTextIcon',
  component: SubtitleTextIcon,
};

const Template = args => <SubtitleTextIcon {...args} />;

export const BaseSubtitleTextIcon = Template.bind({});
BaseSubtitleTextIcon.args = {
  labelColor: 'text-red-300',
  subtitleColor: 'text-amber-700',
  label: 'Text',
  subtitle: 'Some text',
  labelSize: 'text-sm',
  iconType: 'BeakerIcon',
  backgroundColor: true,
};

export const SubtitleTextIconNoImage = Template.bind({});
SubtitleTextIconNoImage.args = {
  labelColor: 'text-red-300',
  subtitleColor: 'text-amber-700',
  label: 'Text',
  subtitle: 'Some text',
  labelSize: 'text-sm',
  backgroundColor: true,
};
