import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Modal, { ModalProps } from '@akashaorg/design-system-core/lib/components/Modal';

const meta: Meta<ModalProps> = {
  title: 'DSCore/Modals/Modal',
  component: Modal,
  tags: ['autodocs'],
  argTypes: {
    show: { control: 'boolean' },
    actions: { control: 'object' },
    customStyle: { control: 'text' },
    showDivider: { control: 'boolean' },
    onClose: { action: 'modal closed' },
  },
};

type Story = StoryObj<ModalProps>;

const baseArgs: Story = {
  args: {
    show: false,
    actions: [
      { label: 'Cancel', variant: 'text' },
      { label: 'Delete', variant: 'primary' },
    ],
    children: (
      <Text variant="body1">
        Are you sure you want to delete your <br /> cover?
      </Text>
    ),
  },
};

const Component = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button variant="text" label="Show Modal" onClick={() => setShowModal(true)} />
      <Modal
        title={{ label: 'Delete Cover', variant: 'h6' }}
        actions={[
          { label: 'Cancel', variant: 'text' },
          { label: 'Delete', variant: 'primary' },
        ]}
        show={showModal}
        onClose={() => setShowModal(false)}
      >
        <Text variant="body1" align="center">
          Are you sure you want to delete your <br /> cover?
        </Text>
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: () => <Component />,
};

export const ModalClosed: Story = { args: { ...baseArgs.args, show: false } };

export const ModalWithDivider: Story = { args: { ...baseArgs.args, showDivider: true } };

export default meta;
