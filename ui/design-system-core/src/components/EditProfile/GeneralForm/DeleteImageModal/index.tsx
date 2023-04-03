import React from 'react';
import Modal, { ModalProps } from '../../../Modal';
import Text from '../../../Text';

type DeleteImageModalProps = {
  title: ModalProps['title'];
  show: ModalProps['show'];
  cancelLabel: string;
  deleteLabel: string;
  deleteConfirmation: string;
  onDelete: () => void;
  onClose: ModalProps['onClose'];
};

export const DeleteImageModal: React.FC<DeleteImageModalProps> = ({
  show,
  title,
  cancelLabel,
  deleteLabel,
  deleteConfirmation,
  onDelete,
  onClose,
}) => {
  return (
    <Modal
      show={show}
      title={title}
      actions={[
        { variant: 'secondary', label: cancelLabel, onClick: onClose },
        { variant: 'primary', label: deleteLabel, onClick: onDelete },
      ]}
      actionsAlign="center"
      onClose={onClose}
      customStyle="min-w-[20rem] sm:min-w-[38rem]"
    >
      <Text variant="body1">{deleteConfirmation}</Text>
    </Modal>
  );
};
