import React from 'react';

import LoginCTAWidgetCard, { ILoginCTACardProps } from '.';

export default {
  title: 'Cards/LoginCTAWidgetCard',
  component: LoginCTAWidgetCard,
};

const Template = (args: ILoginCTACardProps) => <LoginCTAWidgetCard {...args} />;

export const BaseLoginCTAWidgetCard = Template.bind({});

BaseLoginCTAWidgetCard.args = {
  title: 'Welcome, fellow Ethereans! 💫',
  subtitle: 'We are in private alpha at this time. ',
  beforeLinkLabel: "If you'd like to participate,just ",
  afterLinkLabel: "and we'll send you a ticket for the next shuttle going to Akasha World.",
  disclaimerLabel:
    "Please bear in mind we're onboarding new people gradually to make sure our systems can scale up. Bon voyage! 🚀",
  writeToUsLabel: 'drop us a message',
  writeToUsUrl: 'mailto:alpha@akasha.world',
};
