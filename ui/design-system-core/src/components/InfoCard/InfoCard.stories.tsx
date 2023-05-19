import React from 'react';
import InfoCard, { InfoCardProps } from '.';

export default {
  title: 'Cards/InfoCard',
  component: InfoCard,
};

const Template = (args: InfoCardProps) => <InfoCard {...args} />;

export const BaseInfoCard = Template.bind({});
BaseInfoCard.args = {
  titleLabel: 'Title label',
  bodyLabel: 'Subtitle label',
};
