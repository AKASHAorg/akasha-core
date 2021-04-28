import React from 'react';
import { Grommet } from 'grommet';

import CustomizeFeedCard, { ICustomizeFeedCardProps } from '.';

import ViewportSizeProvider from '../Providers/viewport-dimension';

import lightTheme from '../../styles/themes/light/light-theme';
import { trendingProfilesData, trendingTagsData } from '../../utils/dummy-data';

export default {
  title: 'Cards/OnboardingCard',
  component: CustomizeFeedCard,
  argTypes: {
    handleFollow: { action: 'clicked follow' },
    handleUnfollow: { action: 'clicked unfollow' },
    handleSubscribe: { action: 'clicked subscribe' },
    handleUnsubscribe: { action: 'clicked unsubscribe' },
    handleCreateFeed: { action: 'clicked create feed' },
  },
};

const Template = (args: ICustomizeFeedCardProps) => (
  <Grommet theme={lightTheme}>
    <ViewportSizeProvider>
      <CustomizeFeedCard {...args} />
    </ViewportSizeProvider>
  </Grommet>
);

export const BaseCustomizeFeedCard = Template.bind({});

BaseCustomizeFeedCard.args = {
  profiles: trendingProfilesData,
  tags: trendingTagsData,
};
