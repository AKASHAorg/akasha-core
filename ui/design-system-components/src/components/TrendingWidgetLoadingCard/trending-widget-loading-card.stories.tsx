import React from 'react';
import TrendingWidgetLoadingCard from '.';
import { tw } from '@twind/core';

export default {
  title: 'Cards/TrendingWidgetLoadingCard',
  component: TrendingWidgetLoadingCard,
};

const Template = args => (
  <div className={tw('w-[25%]')}>
    <TrendingWidgetLoadingCard {...args} />
  </div>
);

export const BaseTrendingWidgetLoadingCard = Template.bind({});

BaseTrendingWidgetLoadingCard.args = {};
