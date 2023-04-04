import React, { useState } from 'react';
import Modal, { ModalProps } from './index';
import Button from '../Button';
import Text from '../Text';

export default {
  title: 'Modal/Modal',
  component: Modal,
};

const Template = (args: ModalProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button variant="text" label="Show Modal" onClick={() => setShowModal(true)} />
      <Modal {...args} show={showModal} onClose={() => setShowModal(false)}>
        <Text variant="body1" align="center">
          Are you sure you want to delete your <br /> cover?
        </Text>
      </Modal>
    </>
  );
};

export const BaseDialog = Template.bind({});
BaseDialog.args = {
  title: { label: 'Delete Cover', variant: 'h6' },
  actions: [
    { label: 'Cancel', variant: 'text' },
    { label: 'Delete', variant: 'primary' },
  ],
};
