import React from 'react';
import { Box, Grommet } from 'grommet';
import { withDesign } from 'storybook-addon-designs';
import BasicPopover, { IBasicPopover } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Popovers/BasicPopover',
  component: BasicPopover,
  argTypes: {
    gap: { control: 'string' },
    closePopover: { action: 'closed' },
  },
  decorators: [withDesign],
};

const Template = (args: IBasicPopover) => (
  <Grommet theme={lightTheme}>
    <BasicPopover {...args}>
      <Box>
        <div onClick={args.closePopover}>text line 1</div>
        <div onClick={args.closePopover}>text line 2</div>
      </Box>
    </BasicPopover>
  </Grommet>
);

const targetNode = document.createElement('div');
document.body.appendChild(targetNode);

export const BaseBasicPopover = Template.bind({});
BaseBasicPopover.args = {
  target: targetNode,
  gap: '-0.313em',
};
