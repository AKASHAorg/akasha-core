import React from 'react';
import { Grommet } from 'grommet';

import BookmarkPill, { IBookmarkPill } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Notifications/BookmarkPill',
  component: BookmarkPill,
  argTypes: {
    infoLabel: { control: 'text' },
    handleDismiss: { action: 'pill dismissed' },
  },
};

const Template = (args: IBookmarkPill) => (
  <Grommet theme={lightTheme}>
    <BookmarkPill {...args} />
  </Grommet>
);

export const BaseBookmarkPill = Template.bind({});

BaseBookmarkPill.args = {
  infoLabel: 'Bookmark successfully saved',
};
