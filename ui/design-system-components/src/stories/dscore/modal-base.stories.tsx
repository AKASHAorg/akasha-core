import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Modal, { ModalProps } from '@akashaorg/design-system-core/lib/components/Modal';

const meta: Meta<ModalProps> = {
  title: 'DSCore/Modals/Modal',
  component: Modal,
};

export default meta;
type Story = StoryObj<ModalProps>;

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

export const BaseModal: Story = {
  render: () => <Component />,
};
