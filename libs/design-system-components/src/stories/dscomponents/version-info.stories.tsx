import type { Meta, StoryObj } from '@storybook/react';
import VersionInfo, { VersionInfoProps } from '../../components/VersionInfo';

const meta: Meta<VersionInfoProps> = {
  title: 'DSComponents/Extensions/VersionInfo',
  component: VersionInfo,
  tags: ['autodocs'],
};

type Story = StoryObj<VersionInfoProps>;

export const Default: Story = {
  args: {
    integrationName: 'Integration Name',
    packageName: 'Package name',
    versionTitle: 'Version 2.8.0',
    newFeaturesTitle: 'New Features',
    bugFixesTitle: 'Bug Fixes',
    additionalNotesTitle: 'Additional Notes',
    additionalNotesBody:
      "All problems from previous version have been fixed. We cannot guarantee that it'll work 100% well as we are all still working on the fixes. Please feel free to contact us if you are facing any other issue.",
  },
};

export default meta;
