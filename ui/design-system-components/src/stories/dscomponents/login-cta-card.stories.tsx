import type { Meta, StoryObj } from '@storybook/react';
import LoginCTACard, { LoginCTACardProps } from '../../components/LoginCTACard';

const meta: Meta<LoginCTACardProps> = {
  title: 'DSComponents/Cards/LoginCTACard',
  component: LoginCTACard,
  tags: ['autodocs'],
  argTypes: {
    publicImgPath: { control: 'text' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    beforeLinkLabel: { control: 'text' },
    afterLinkLabel: { control: 'text' },
    disclaimerLabel: { control: 'text' },
    writeToUsLabel: { control: 'text' },
    writeToUsUrl: { control: 'text' },
  },
};

type Story = StoryObj<LoginCTACardProps>;

export const Default: Story = {
  args: {
    publicImgPath: '',
    title: 'Welcome, fellow Ethereans! 💫',
    subtitle: 'We are in private alpha at this time. ',
    beforeLinkLabel: "If you'd like to participate,just ",
    afterLinkLabel: "and we'll send you a ticket for the next shuttle going to Akasha World.",
    disclaimerLabel:
      "Please bear in mind we're onboarding new people gradually to make sure our systems can scale up. Bon voyage! 🚀",
    writeToUsLabel: 'drop us a message',
    writeToUsUrl: 'mailto:alpha@ethereum.world',
  },
};

export default meta;
