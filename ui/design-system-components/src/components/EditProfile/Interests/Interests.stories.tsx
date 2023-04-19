import React from 'react';
import { Interests, InterestsProps } from '.';

export default {
  title: 'Profile/Interests',
  component: Interests,
};

const Template = (args: InterestsProps) => <Interests {...args} />;

export const BaseInterests = Template.bind({});
BaseInterests.args = {
  title: 'Your interests',
  description:
    'Your interests will help refine your social feed and throughout AKASHA World.  You can have a maximum of 10 topics',
  moreInterestTitle: 'Find more interests',
  moreInterestDescription: 'You can find more interests and add them to your list of interests!',
  moreInterestPlaceholder: 'Search for interests',
  myInterests: ['Akasha', 'Ethereum', 'Finance', 'Politics', 'Travel', 'Cooking'],
  interests: ['Akasha', 'Akira', 'Akela', 'Ethereum', 'Finance', 'Politics', 'Travel', 'Cooking'],
  cancelButton: { label: 'Cancel', handleClick: () => ({}) },
  saveButton: { label: 'Save', handleClick: () => ({}) },
};
