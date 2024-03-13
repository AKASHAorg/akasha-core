import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Accordion, { AccordionProps } from '@akashaorg/design-system-core/lib/components/Accordion';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

const meta: Meta<AccordionProps> = {
  title: 'DSCore/Accordion/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    customStyle: { defaultValue: '', control: 'text' },
    contentStyle: { defaultValue: '', control: 'text' },
    open: { control: 'boolean' },
    headerDivider: { control: 'boolean' },
    handleClick: { action: 'accordion clicked', control: '' },
  },
};

type Story = StoryObj<AccordionProps>;

const ethAddress = '0x003410490050000320006570034567114572000';

const title = (
  <Stack align="center" direction="row">
    <Avatar
      profileId={ethAddress}
      avatar={{ src: 'https://placebeard.it/360x360', height: 360, width: 360 }}
    />
    <Text customStyle="ml-2.5">Item name</Text>
  </Stack>
);

const content = (
  <Stack>
    <Text>some interesting items</Text>
    <Text>could be placed</Text>
    <Text>inside the accordion</Text>
  </Stack>
);

export default meta;

const baseArgs: Story = {
  args: {
    open: true,
    accordionId: 0,
    titleNode: title,
    contentNode: content,
  },
};

export const BaseAccordion: Story = {
  args: {
    ...baseArgs.args,
  },
};

export const AccordionWithHeaderDivider: Story = {
  args: { ...baseArgs.args, headerDivider: true },
};
