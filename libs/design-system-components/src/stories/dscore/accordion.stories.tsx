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
};

type Story = StoryObj<AccordionProps>;

const profileId = 'did:pkh:eip155:5:0x36c703c4d22af437dc883e2e0884e57404e16493';

const title = (
  <Stack align="center" direction="row">
    <Avatar
      profileId={profileId}
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

const baseArgs: Story = {
  args: {
    open: true,
    accordionId: 'someId',
    titleNode: title,
    contentNode: content,
    customStyle: 'w-[15%]',
  },
};

export const Default: Story = {
  args: {
    ...baseArgs.args,
  },
};

export const AccordionWithHeaderDivider: Story = {
  args: { ...baseArgs.args, headerDivider: true },
};

export default meta;
