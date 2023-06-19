import React from 'react';
import Links, { LinksProps } from './index';

export default {
  title: 'Profile/ProfileLinks',
  component: Links,
};

const Template = (args: LinksProps) => <Links {...args} />;

export const BasicProfileLinks = Template.bind({});
BasicProfileLinks.args = {
  title: 'Find me on',
  links: [
    { href: 'https://lover.coffee' },
    { href: 'https://github.com/handle' },
    { href: 'https://telegram.com/handle' },
  ],
};
