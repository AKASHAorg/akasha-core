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

const ModalComponent: React.FC<Omit<ModalProps, 'show' | 'onClose'>> = props => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button variant="text" label="Show Modal" onClick={() => setShowModal(true)} />
      <Modal {...props} show={showModal} onClose={() => setShowModal(false)}>
        <Text variant="body1" align="center">
          Are you sure you want to delete your <br /> cover?
        </Text>
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: () => (
    <ModalComponent
      title={{ label: 'Delete Cover', variant: 'h6' }}
      actions={[
        { label: 'Cancel', variant: 'text' },
        { label: 'Delete', variant: 'primary' },
      ]}
    />
  ),
};

export const ModalWithDivider: Story = {
  render: () => (
    <ModalComponent
      title={{ label: 'Delete Cover', variant: 'h6' }}
      actions={[
        { label: 'Cancel', variant: 'text' },
        { label: 'Delete', variant: 'primary' },
      ]}
      showDivider={true}
    />
  ),
};

export default meta;
