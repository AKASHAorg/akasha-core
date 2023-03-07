import React from 'react';
import Links, { LinksProps } from './index';

export default {
  title: 'Cards/ProfileLinks',
  component: Links,
};

const Template = (args: LinksProps) => <Links {...args} />;

export const BasicProfileLinks = Template.bind({});
BasicProfileLinks.args = {
  title: 'Find me on',
  links: [
    { value: 'https://lover.coffee', type: '' },
    { value: 'handle', type: 'com.github' },
    { value: 'handle', type: 'org.telegram' },
  ],
};
