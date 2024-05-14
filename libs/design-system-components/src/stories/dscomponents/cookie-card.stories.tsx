import type { Meta, StoryObj } from '@storybook/react';
import CookieCard, { CookieCardProps } from '../../components/CookieCard';

const meta: Meta<CookieCardProps> = {
  title: 'DSComponents/Cards/CookieCard',
  component: CookieCard,
  argTypes: {
    titleLabel: { control: 'text' },
    paragraphOneLabel: { control: 'text' },
    paragraphTwo: { control: 'object' },
    paragraphThree: { control: 'object' },
    onlyEssentialLabel: { control: 'text' },
    acceptAllLabel: { control: 'text' },
    onClickAcceptAll: { action: 'all cookies accepted' },
    onClickOnlyEssential: { action: 'essential cookies accepted' },
  },
};

type Story = StoryObj<CookieCardProps>;

export const Default: Story = {
  args: {
    titleLabel: 'The Choice is Yours 🤘🏼',
    paragraphOneLabel:
      'We use cookies. Some are necessary to operate effectively the platform, others are to help us improve AKASHA World.',
    paragraphTwo: {
      introLabel: `By opting-in you allow us to collect data via `,
      analyticsLabel: 'Matomo',
      analyticsURL: '',
      middleParagraphLabeL: `, an open source analytics platform that will help us improve AKASHA World. As we respect your privacy, rest assured that we don't store personal identifiable information (PII). In addition, if you change your mind, you can always opt-out by accessing the `,
      settingsLabel: 'settings ',
      lastParagraphLabel: ' menu.',
      onSettingsClick: () => ({}),
    },
    paragraphThree: {
      introLabel: 'For more info, see our ',
      ctaLabel: 'Privacy Policy',
      onPrivacyClick: () => ({}),
    },
    acceptAllLabel: 'Accept all',
    onlyEssentialLabel: 'Only essential',
    onClickAcceptAll: () => ({}),
    onClickOnlyEssential: () => ({}),
  },
};

export default meta;
