import React from 'react';
import { apply, tw } from '@twind/core';

import Accordion, { IAccordionProps } from '.';
import Avatar from '../Avatar';

export default {
  title: 'Accordion/Accordion',
  component: Accordion,
};

const ethAddress = '0x003410490050000320006570034567114572000';

const Template = (args: IAccordionProps) => (
  <div className={tw('w-[15%]')}>
    <Accordion {...args} />
  </div>
);

const Title = (
  <div className={tw(apply('flex flex-row items-center'))}>
    <Avatar ethAddress={ethAddress} src={{ url: 'https://placebeard.it/360x360' }} />
    <p className={tw(apply('ml-2.5 text-white dark:text-black'))}>Item name</p>
  </div>
);

const Content = (
  <div className={tw(apply('text-white dark:text-black'))}>
    <p>Accordion content</p>
    <p>Accordion content</p>
    <p>Accordion content</p>
  </div>
);

export const BaseAccordion = Template.bind({});

BaseAccordion.args = {
  titleNode: Title,
  contentNode: Content,
};
