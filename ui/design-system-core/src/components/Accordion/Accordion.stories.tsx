import React from 'react';
import { tw } from '@twind/core';
import type { Meta, StoryObj } from '@storybook/react';

import Accordion from '.';
import Avatar from '../Avatar';

/**
 * Define metadata to compose stories for the component
 */
const meta: Meta<typeof Accordion> = {
  title: 'Accordion/Accordion',
  component: Accordion,
};

export default meta;
type Story = StoryObj<typeof Accordion>;

const ethAddress = '0x003410490050000320006570034567114572000';

const title = (
  <div className={tw('flex flex-row items-center')}>
    <Avatar
      profileId={ethAddress}
      avatar={{ default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } }}
    />
    <p className={tw('ml-2.5 text-white dark:text-black')}>Item name</p>
  </div>
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
