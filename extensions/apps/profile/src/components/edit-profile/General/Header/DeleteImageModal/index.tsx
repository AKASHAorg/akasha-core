import React from 'react';
import Modal, { ModalProps } from '@akashaorg/design-system-core/lib/components/Modal';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
type DeleteImageModalProps = {
  title: ModalProps['title'];
  show: ModalProps['show'];
  cancelLabel: string;
  deleteLabel: string;
  confirmationLabel: string;
  onDelete: () => void;
  onClose: ModalProps['onClose'];
};
export const DeleteImageModal: React.FC<DeleteImageModalProps> = ({
  show,
  title,
  cancelLabel,
  deleteLabel,
  confirmationLabel,
  onDelete,
  onClose,
}) => {
  return (
    <Modal
      show={show}
      title={title}
      actions={[
        {
          variant: 'secondary',
          label: cancelLabel,
          onClick: onClose,
        },
        {
          variant: 'primary',
          label: deleteLabel,
          onClick: onDelete,
        },
      ]}
      onClose={onClose}
      customStyle="min-w-[20rem] sm:min-w-[38rem]"
    >
      <Typography>{confirmationLabel}</Typography>
    </Modal>
  );
};
