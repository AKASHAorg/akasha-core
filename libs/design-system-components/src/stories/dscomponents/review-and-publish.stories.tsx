import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ReviewAndPublish, { ReviewAndPublishProps } from '../../components/ReviewAndPublish';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';

const ReviewAndPublishComponent = (props: ReviewAndPublishProps) => (
  <Stack customStyle="w-[50%]">
    <ReviewAndPublish {...props} />
  </Stack>
);

const meta: Meta<ReviewAndPublishProps> = {
  title: 'DSComponents/Extensions/ReviewAndPublish',
  component: ReviewAndPublishComponent,
};

type Story = StoryObj<ReviewAndPublishProps>;

export const Default: Story = {
  args: {
    extensionData: {
      logoImage: { src: '', width: 60, height: 60 },
      coverImage: { src: '', width: 60, height: 60 },
      id: 'this is my extension id and the length is 48char',
      displayName: 'Extension name 24 charcs',
      github: 'https://github.com/xhubx/iLikeit',
      nsfw: true,
      applicationType: AkashaAppApplicationType.Plugin,
      description: 'Very short description of the app. Just to explain what it is and what it does',
      gallery: [
        {
          src: 'https://bafkreiduhjj2kh2f5a7i2dfv5qaow6jhhzfpbpwkaypgylwoozubkt5iwu.ipfs.w3s.link',
          width: 60,
          height: 60,
        },
        {
          src: 'https://bafkreiebphfg3neceldflksm3medufm2himfkbegtidcevmr3pork5vbcm.ipfs.w3s.link',
          width: 60,
          height: 60,
        },
        {
          src: 'https://bafkreib5bdh6a4loqbn5awhhhrzt6siclney5rgnea56z2ab2z6rhy4eka.ipfs.w3s.link',
          width: 60,
          height: 60,
        },
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
      license: {
        name: 'Lesser general public license',
        description:
          'Developers can link to open source libraries within their software and use any licensing type for the code.',
      },
      contributors: [
        {
          label: 'JasonTheElephant',
          profileId: 'did:pkh:eip155:5:0x36c703c4d22af437dc883e2e0884e57404e16493',
          avatar: { src: 'https://placebeard.it/360x360', height: 360, width: 360 },
        },
        {
          label: 'BruceLee',
          profileId: 'did:pkh:eip155:5:0x36c703c4d22af437dc883e2e0884e57404e16493',
          avatar: { src: 'https://placebeard.it/360x360', height: 360, width: 360 },
        },
        {
          label: 'Lanada',
          profileId: 'did:pkh:eip155:5:0x36c703c4d22af437dc883e2e0884e57404e16493',
          avatar: { src: 'https://placebeard.it/360x360', height: 360, width: 360 },
        },
      ],
      contactInfo: 'contact@supercarts.com',
      tags: ['tag0', 'tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7', 'tag8', 'tag9'],
    },
    title: 'Review Extension',
    subtitle: {
      part1: 'Please note that fields marked with',
      part2: 'cannot be edited once submitted.',
    },
    pluginLabel: 'Plugin',
    extensionId: 'Extension ID',
    extensionDisplayName: 'Extension Display Name',
    sourceFileLabel: 'Github Repository',
    nsfwLabel: 'Extension NSFW',
    nsfwDescription: 'You marked it as Not Safe For Work',
    activeAccordionId: 'Description',
    descriptionLabel: 'Description',
    galleryLabel: 'Gallery',
    imageUploadedLabel: '16/16 images uploaded',
    viewAllLabel: 'View All',
    documentationLabel: 'Documentation',
    licenseLabel: 'License',
    contributorsLabel: 'Contributors',
    contactInfoLabel: 'Contact Info',
    tagsLabel: 'Tags',
    backButtonLabel: 'Cancel',
    publishButtonLabel: 'Next',
    onViewGalleryClick: () => console.log('clicked view gallery'),
    onAccordionClick: () => console.log('clicked accordion'),
    onClickBack: () => console.log('clicked back'),
    onClickPublish: () => console.log('clicked publish'),
  },
};

export default meta;
