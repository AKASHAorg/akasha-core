import type { Meta, StoryObj } from '@storybook/react';
import EditInterests, { EditInterestsProps } from '../../components/EditInterests';

const meta: Meta<EditInterestsProps> = {
  title: 'DSComponents/Profile/Edit/Interests',
  component: EditInterests,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    onFormDirty: { action: 'form dirtied' },
  },
};

type Story = StoryObj<EditInterestsProps>;

export const Default: Story = {
  args: {
    title: 'Your interests',
    subTitle: '(10 topics max.)',
    description: 'Your interests will help refine your social feed and throughout AKASHA World.',
    moreInterestTitle: 'Add more interests',
    moreInterestDescription: 'Separate your interests by comma or space',
    moreInterestPlaceholder: 'Interests',
    myInterests: [
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
    ],
    interests: [
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
    ],
    maxInterests: 10,
    labelType: 'TOPIC',
    maxInterestsErrorMessage: 'Max interests reached. Remove some interests to add more.',
    cancelButton: { label: 'Cancel', handleClick: () => ({}) },
    saveButton: {
      label: 'Save',
      handleClick: interests => {
        console.log(interests);
      },
    },
  },
};

export default meta;
