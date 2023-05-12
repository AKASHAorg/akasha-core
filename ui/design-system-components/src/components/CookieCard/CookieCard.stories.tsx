import React from 'react';
import CookieCard, { CookieCardProps } from '.';

export default {
  title: 'Cards/CookieCard',
  component: CookieCard,
};

const Template = (args: CookieCardProps) => <CookieCard {...args} />;

export const BaseCookieCard = Template.bind({});

BaseCookieCard.args = {
  titleLabel: 'The Choice is Yours 🤘🏼',
  paragraphOneLabel: `We use cookies. Some are necessary to operate effectively the platform, others are to help us improve AKASHA World.`,
  paragraphTwo: {
    ctaLabel: `By opting-in you allow us to collect data via `,
    analyticsLabel: 'Matomo',
    analyticsURL: '',
    middleParagraphLabeL: `, an open source analytics platform that will help us improve AKASHA World. As we respect your privacy, rest assured that we don't store personal identifiable information (PII). In addition, if you change your mind, you can always opt-out by accessing the `,
    settingsLabel: 'settings ',
    settingsUrl: '',
    lastParagraphLabel: ' menu.',
  },
  paragraphThree: {
    ctaLabel: 'For more info, see our ',
    urlLabel: 'Privacy Policy',
    url: 'https://ethereum.world/privacy-policy',
  },
  onlyEssentialLabel: 'Only essential',
  acceptAllLabel: 'Accept all',
};
