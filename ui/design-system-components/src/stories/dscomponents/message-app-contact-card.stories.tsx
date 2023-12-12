import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import MessageContactCard, { MessageContactCardProps } from '../../components/MessageContactCard';

const meta: Meta<MessageContactCardProps> = {
  title: 'DSComponents/Cards/MessageContactCard',
  component: MessageContactCard,
};

export default meta;
type Story = StoryObj<MessageContactCardProps>;

const senderAvatar = { default: { src: 'https://placebeard.it/360x360', height: 360, width: 360 } };

const senderDid = 'did:key:003410490050000320006570034567114572000';

export const BaseMessageContactCard: Story = {
  render: () => (
    <MessageContactCard
      locale="en"
      senderName="Jerry Mil"
      content="Hello Jerry, I hope you're good and having a great day?"
      isRead={true}
      isPinned={false}
      pinConvoLabel="Pin"
      unpinConvoLabel="Unpin"
      senderAvatar={senderAvatar}
      senderDid={senderDid}
      transformSource={() => ({
        src: 'https://placebeard.it/360x360',
        width: 360,
        height: 360,
      })}
    />
  ),
};
