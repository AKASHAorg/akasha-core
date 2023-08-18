import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import CookieCard, { CookieCardProps } from '.';

const meta: Meta<CookieCardProps> = {
  title: 'DSComponents/Cards/CookieCard',
  component: CookieCard,
};

export default meta;
type Story = StoryObj<CookieCardProps>;

export const BaseCookieCard: Story = {
  render: () => (
    <CookieCard
      titleLabel="The Choice is Yours 🤘🏼"
      paragraphOneLabel="We use cookies. Some are necessary to operate effectively the platform, others are to help us improve AKASHA World."
      paragraphTwo={{
        ctaLabel: `By opting-in you allow us to collect data via `,
        analyticsLabel: 'Matomo',
        analyticsURL: '',
        middleParagraphLabeL: `, an open source analytics platform that will help us improve AKASHA World. As we respect your privacy, rest assured that we don't store personal identifiable information (PII). In addition, if you change your mind, you can always opt-out by accessing the `,
        settingsLabel: 'settings ',
        lastParagraphLabel: ' menu.',
        onSettingsClick: () => ({}),
      }}
      paragraphThree={{
        ctaLabel: 'For more info, see our ',
        urlLabel: 'Privacy Policy',
        url: 'https://ethereum.world/privacy-policy',
      }}
      onlyEssentialLabel="Only essential"
      acceptAllLabel="Accept all"
      onClickAcceptAll={() => ({})}
      onClickOnlyEssential={() => ({})}
    />
  ),
};
