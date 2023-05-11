import React from 'react';
import Bio, { BioProps } from './index';

export default {
  title: 'Profile/ProfileBio',
  component: Bio,
};

const Template = (args: BioProps) => <Bio {...args} />;

export const BasicProfileBio = Template.bind({});
BasicProfileBio.args = {
  title: 'Bio',
  biography: `Coffee lover ☕️ Web3.Space traveler 🧑🏼‍🚀 Loves
  cooking and baking for the shelter in my neighborhood.`,
};
