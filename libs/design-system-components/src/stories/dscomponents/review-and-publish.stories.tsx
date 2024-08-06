import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ReviewAndPublish, { ReviewAndPublishProps } from '../../components/ReviewAndPublish';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';

const meta: Meta<ReviewAndPublishProps> = {
  title: 'DSComponents/Extensions/ReviewAndPublish',
  component: props => (
    <Stack customStyle="w-[50%]">
      <ReviewAndPublish {...props} />
    </Stack>
  ),
  tags: ['autodocs'],
};

type Story = StoryObj<ReviewAndPublishProps>;

export const Default: Story = {
  args: {
    extensionData: {
      logoImage: { src: '', width: 60, height: 60 },
      coverImage: { src: '', width: 60, height: 60 },
      id: 'package.ilikeit.org',
      displayName: 'Extension x',
      github: 'https://github.com/AKASHAorg',
      nsfw: false,
      applicationType: AkashaAppApplicationType.Plugin,
      description: 'Very short description of the app. Just to explain what it is and what it does',
      gallery: [
        { src: '', width: 60, height: 60 },
        { src: '', width: 60, height: 60 },
        { src: '', width: 60, height: 60 },
        { src: '', width: 60, height: 60 },
      ],
      links: [
        {
          label: 'Contribution Guidelines',
          href: 'https://contributionguidelines.com',
        },
        {
          label: 'Developer FAQ',
          href: 'https://developerfaq.com',
        },
        {
          label: 'SDK Documentation',
          href: 'https://sdkdocumentation.com',
        },
      ],
      contactInfo: 'contact@supercarts.com',
      license: {
        name: 'Lesser general public license',
        description:
          'Developers can link to open source libraries within their software and use any licensing type for the code.',
      },
      contributors: [],
    },
    title: 'Review and Publish',
    pluginLabel: 'Plugin',
    extensionId: 'Extension ID',
    extensionDisplayName: 'Extension display name',
    githubRepoLabel: 'Github Repository',
    nsfwLabel: 'Extension NSFW',
    nsfwDescription: "Once you mark it as NSFW, you can't change it back",
    activeAccordionId: 'Description',
    descriptionLabel: 'Description',
    galleryLabel: 'Gallery',
    documentationLabel: 'Documentation',
    licenseLabel: 'License',
    contributorsLabel: 'Contributors',
    contactInfoLabel: 'Contact Info',
    backButtonLabel: 'Back',
    publishButtonLabel: 'Publish',
    onToggleNSFW: () => console.log('toggled nsfw'),
    onClickBack: () => console.log('clicked back'),
    onClickPublish: () => console.log('clicked publish'),
  },
};

export default meta;
