import React from 'react';

import EditorToolbar, { IEditorToolbarProps } from '.';

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

const Template = (args: IEditorToolbarProps) => <EditorToolbar {...args} />;

export const BaseEditorToolbar = Template.bind({});

BaseEditorToolbar.args = {
  dropOpen: null,
  caseStyle: 'textcaseSentence',
  listStyle: 'listNumbered',
  alignStyle: 'alignRight',
  wrapperBorder: { side: 'horizontal', color: 'border' },
};
