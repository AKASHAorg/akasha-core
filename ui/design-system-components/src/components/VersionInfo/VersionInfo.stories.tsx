import React from 'react';
import VersionInfo, { VersionInfoProps } from '.';

export default {
  title: 'AkashaVerse/VersionInfo',
  component: VersionInfo,
};

const Template = (args: VersionInfoProps) => <VersionInfo {...args} />;

export const BaseVersionInfo = Template.bind({});

BaseVersionInfo.args = {
  integrationName: 'Integration Name',
  packageName: 'Package name',
  versionTitle: 'Version 2.8.0',
  newFeaturesTitle: 'New Features',
  bugFixesTitle: 'Bug Fixes',
  additionalNotesTitle: 'Additional Notes',
  additionalNotesBody:
    'All problems from previous version have been fixed. We cannot guarantee that it’ll work 100% well as we are all still working on the fixes. Please feel free to contact us if you are facing any other issue.',
};
