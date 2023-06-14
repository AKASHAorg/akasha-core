import React from 'react';

import MarkdownCard, { IMarkdownCard } from '.';

export default {
  title: 'Cards/MarkdownCard',
  component: MarkdownCard,
};

const Template = (args: IMarkdownCard) => <MarkdownCard {...args} />;

export const BaseMarkdownCard = Template.bind({});

BaseMarkdownCard.args = {
  mdText: '`**Hello**`',
};
