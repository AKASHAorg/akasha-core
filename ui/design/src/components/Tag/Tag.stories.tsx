import React from 'react';
import { Grommet } from 'grommet';

import Tag, { ITagProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Tags/Tag',
  component: Tag,
  argTypes: {
    titleLabel: { control: 'text' },
  },
};

const Template = (args: ITagProps) => (
  <Grommet theme={lightTheme}>
    <Tag {...args} />
  </Grommet>
);

export const BaseTag = Template.bind({});

BaseTag.args = {
  titleLabel: 'auto-detected',
};
