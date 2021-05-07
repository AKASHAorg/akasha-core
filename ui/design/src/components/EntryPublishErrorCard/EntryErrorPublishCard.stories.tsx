import React from 'react';
import { Grommet } from 'grommet';

import EntryPublishErrorCard, { PublishErrorCardProps } from '.';

import lightTheme from '../../styles/themes/light/light-theme';

export default {
  title: 'Errors/EntryPublishErrorCard',
  component: EntryPublishErrorCard,
  argTypes: {
    isCard: { control: 'boolean' },
  },
};

const Template = (args: PublishErrorCardProps) => (
  <Grommet theme={lightTheme}>
    <EntryPublishErrorCard {...args} />
  </Grommet>
);

export const BaseEntryPublishErrorCard = Template.bind({});
BaseEntryPublishErrorCard.args = {
  isCard: true,
  message: 'Sorry, an error occured!',
};
