import React from 'react';
import { Grommet } from 'grommet';

import TagCard, { ITagCard } from '.';
import { TagDetailCard, ITagDetailCard } from './tag-detail-card';
import { TagProfileCard, ITagProfileCard } from './tag-profile-card';
import { TagSearchCard, ITagSearchCard } from './tag-search-card';

import ViewportSizeProvider from '../Providers/viewport-dimension';

import lightTheme from '../../styles/themes/light/light-theme';
import { trendingTagsData } from '../../utils/dummy-data';

export default {
  title: 'Cards/TagCard',
  component: TagCard,
  argType: {
    handleSubscribe: { action: 'clicked subscribe' },
    handleUnsubscribe: { action: 'clicked unsubscribe' },
  },
};

const Template = (args: ITagCard) => (
  <Grommet theme={lightTheme}>
    <ViewportSizeProvider>
      <TagCard {...args} />
    </ViewportSizeProvider>
  </Grommet>
);

const TemplateDetail = (args: ITagDetailCard) => (
  <Grommet theme={lightTheme}>
    <ViewportSizeProvider>
      <TagDetailCard {...args} />
    </ViewportSizeProvider>
  </Grommet>
);

const TemplateProfile = (args: ITagProfileCard) => (
  <Grommet theme={lightTheme}>
    <ViewportSizeProvider>
      <TagProfileCard {...args} />
    </ViewportSizeProvider>
  </Grommet>
);

const TemplateSearch = (args: ITagSearchCard) => (
  <Grommet theme={lightTheme}>
    <ViewportSizeProvider>
      <TagSearchCard {...args} />
    </ViewportSizeProvider>
  </Grommet>
);

export const BaseTagCard = Template.bind({});

BaseTagCard.args = {
  tag: trendingTagsData[0],
};

export const BaseTagDetailCard = TemplateDetail.bind({});

BaseTagDetailCard.args = {
  tag: trendingTagsData[0],
};

export const BaseTagProfileCard = TemplateProfile.bind({});

BaseTagProfileCard.args = {
  tag: trendingTagsData[0],
  subscribedTags: ['Ethereum'],
};

export const BaseTagSearchCard = TemplateSearch.bind({});

BaseTagSearchCard.args = {
  tag: trendingTagsData[0],
  subscribedTags: ['Ethereum'],
  mentionsLabel: 'posts',
  subscribeLabel: 'subscribe',
  subscribedLabel: 'subscribed',
  unsubscribeLabel: 'unsubscribe',
  tagAnchorLink: '/social-app/tags',
};
