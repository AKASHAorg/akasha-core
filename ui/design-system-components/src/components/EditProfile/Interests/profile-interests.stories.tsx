import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Interests, InterestsProps } from '.';

const meta: Meta<InterestsProps> = {
  title: 'DSComponents/Profile/Edit/Interests',
  component: Interests,
};

export default meta;
type Story = StoryObj<InterestsProps>;

export const BaseInterests: Story = {
  render: () => (
    <Interests
      title="Your interests"
      description="Your interests will help refine your social feed and throughout AKASHA World.  You can have a maximum of 10 topics"
      moreInterestTitle="Find more interests"
      moreInterestDescription="You can find more interests and add them to your list of interests!"
      moreInterestPlaceholder="Search for interests"
      myInterests={[
        {
          value: 'AKASHA',
          labelType: 'TOPIC',
        },
        {
          value: 'Ethereum',
          labelType: 'TOPIC',
        },
        {
          value: 'Finance',
          labelType: 'TOPIC',
        },
        {
          value: 'Politics',
          labelType: 'TOPIC',
        },
        {
          value: 'Travel',
          labelType: 'TOPIC',
        },
        {
          value: 'Cooking',
          labelType: 'TOPIC',
        },
      ]}
      interests={[
        {
          value: 'Akira',
          labelType: 'TOPIC',
        },
        {
          value: 'Akela',
          labelType: 'TOPIC',
        },
        {
          value: 'Sports',
          labelType: 'TOPIC',
        },
        {
          value: 'Reading',
          labelType: 'TOPIC',
        },
        {
          value: 'Swimming',
          labelType: 'TOPIC',
        },
      ]}
      labelType="TOPIC"
      cancelButton={{ label: 'Cancel', handleClick: () => ({}) }}
      saveButton={{
        label: 'Save',
        handleClick: () => ({}),
      }}
    />
  ),
};
