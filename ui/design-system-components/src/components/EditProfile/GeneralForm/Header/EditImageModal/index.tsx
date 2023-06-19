import React, { useState } from 'react';
import Modal, { ModalProps } from '@akashaorg/design-system-core/lib/components/Modal';
import ImageCropper, {
  ImageCropperProps,
} from '@akashaorg/design-system-core/lib/components/ImageCropper';

type EditImageModalProps = {
  title: ModalProps['title'];
  show: ModalProps['show'];
  cancelLabel: string;
  saveLabel: string;
  onSave: (image: Blob) => void;
  onClose: ModalProps['onClose'];
} & Pick<ImageCropperProps, 'image' | 'dragToRepositionLabel'>;

export const EditImageModal: React.FC<EditImageModalProps> = ({
  title,
  show,
  image,
  cancelLabel,
  saveLabel,
  onSave,
  onClose,
  ...rest
}) => {
  const [croppedImage, setCroppedImage] = useState<Blob>();

  return (
    <Modal
      title={title}
      show={show}
      onClose={onClose}
      actions={[
        { variant: 'text', label: cancelLabel, onClick: onClose },
        { variant: 'primary', label: saveLabel, onClick: () => onSave(croppedImage) },
      ]}
    >
      <ImageCropper image={image} onCrop={setCroppedImage} {...rest} />
    </Modal>
  );
};
