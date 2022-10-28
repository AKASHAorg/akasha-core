import React from 'react';
import { Box, Grommet } from 'grommet';

import EditorToolbar, { IEditorToolbarProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Toolbars/EditorToolbar',
  component: EditorToolbar,
  argTypes: {
    dropOpen: { control: 'text' },
    listStyle: { control: 'text' },
    alignStyle: { control: 'text' },
    wrapperBorder: { control: 'text' },
  },
};

const Template = (args: IEditorToolbarProps) => (
  <Grommet theme={lightTheme}>
    <Box width="38%" pad="none" align="center">
      <EditorToolbar {...args} />
    </Box>
  </Grommet>
);

export const BaseEditorToolbar = Template.bind({});

BaseEditorToolbar.args = {
  dropOpen: null,
  caseStyle: 'textcaseSentence',
  listStyle: 'listNumbered',
  alignStyle: 'alignRight',
  wrapperBorder: { side: 'horizontal', color: 'border' },
};
