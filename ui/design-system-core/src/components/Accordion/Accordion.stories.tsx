import React from 'react';
import { tw } from '@twind/core';
import type { Meta, StoryObj } from '@storybook/react';

import Accordion, { AccordionProps } from '.';
import Avatar from '../Avatar';
import Stack from '../Stack';

/**
 * Define metadata to compose stories for the component
 */
const meta: Meta<AccordionProps> = {
  title: 'Accordion/Accordion',
  component: Accordion,
};

export default meta;
type Story = StoryObj<AccordionProps>;

const ethAddress = '0x003410490050000320006570034567114572000';

const title = (
  <Stack align="center">
    <Avatar
      profileId={ethAddress}
      avatar={{ default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } }}
    />
    <p className={tw('ml-2.5 text-white dark:text-black')}>Item name</p>
  </Stack>
);

const content = (
  <div className={tw('text(white dark:black)')}>
    <p>Accordion content</p>
    <p>Accordion content</p>
    <p>Accordion content</p>
  </div>
);

export const BaseAccordion: Story = {
  render: () => (
    <div className={tw('w-[15%]')}>
      <Accordion titleNode={title} contentNode={content} />
    </div>
  ),
};
