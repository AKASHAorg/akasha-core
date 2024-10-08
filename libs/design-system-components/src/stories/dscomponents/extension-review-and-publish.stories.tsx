import type { Meta, StoryObj } from '@storybook/react';
import ExtensionReviewAndPublish, {
  ExtensionReviewAndPublishProps,
} from '../../components/ExtensionReviewAndPublish';

const meta: Meta<ExtensionReviewAndPublishProps> = {
  title: 'DSComponents/Extensions/ExtensionReviewAndPublish',
  component: ExtensionReviewAndPublish,
};

type Story = StoryObj<ExtensionReviewAndPublishProps>;

export const Default: Story = {
  args: {
    title: 'Review Extension',
    subtitle: {
      part1: 'Please note that fields marked with',
      part2: 'cannot be edited once submitted.',
    },
    nsfwLabel: 'Extension NSFW',
    nsfwDescription: 'You marked it as Not Safe For Work',
    descriptionLabel: 'Description',
    galleryLabel: 'Gallery',
    imageUploadedLabel: '16/16 images uploaded',
    viewAllLabel: 'View All',
    licenseLabel: 'License',
    contributorsLabel: 'Contributors',
    tagsLabel: 'Tags',
    backButtonLabel: 'Cancel',
    publishButtonLabel: 'Next',
    onViewGalleryClick: () => console.log('clicked view gallery'),
  },
};

export default meta;
