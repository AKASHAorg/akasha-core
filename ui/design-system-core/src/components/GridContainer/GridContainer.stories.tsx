import React from 'react';

import { GridContainer } from './index';

export default {
  title: 'GridContainer',
  component: GridContainer,
};

const Template = args => <GridContainer {...args} />;

const GridContents = (
  <>
    <div>1</div>
    <div>2</div>
  </>
);

export const Default = Template.bind({});
Default.args = {
  grid: true,
  margin: 'auto',
  children: GridContents,
};
