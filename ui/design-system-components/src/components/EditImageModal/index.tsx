import React, { useState } from 'react';
import Modal, { ModalProps } from '@akashaorg/design-system-core/lib/components/Modal';
import ImageCropper, {
  ImageCropperProps,
} from '@akashaorg/design-system-core/lib/components/ImageCropper';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Image from '@akashaorg/design-system-core/lib/components/Image';

type EditImageModalProps = {
  title: ModalProps['title'];
  show: ModalProps['show'];
  cancelLabel: string;
  saveLabel: string;
  isSavingImage: boolean;
  onSave: (image: Blob, indexOfEditedImage?: number) => void;
  onClose: ModalProps['onClose'];
  images: ImageCropperProps['image'][];
} & Pick<ImageCropperProps, 'dragToRepositionLabel'>;

const EditImageModal: React.FC<EditImageModalProps> = ({
  title,
  show,
  images,
  cancelLabel,
  saveLabel,
  isSavingImage,
  onSave,
  onClose,
  ...rest
}) => {
  const [croppedImage, setCroppedImage] = useState<Blob>();
  const [indexOfSelectedImage, setIndexOfSelectedImage] = useState(0);

  return (
    <Modal
      title={title}
      show={show}
      onClose={onClose}
      actions={[
        { variant: 'text', disabled: isSavingImage, label: cancelLabel, onClick: onClose },
        {
          variant: 'primary',
          label: saveLabel,
          loading: isSavingImage,
          onClick: () => onSave(croppedImage, indexOfSelectedImage),
        },
      ]}
    >
      {images.length > 0 && (
        <Stack direction="row" justify="start" align="center" spacing="gap-2">
          {images.map((imageData, index) => {
            const imageUrl = typeof imageData === 'string' ? imageData : imageData?.src;
            return (
              <button key={index} onClick={() => setIndexOfSelectedImage(index)}>
                <Image src={imageUrl} customStyle="object-contain w-10 h-10 rounded-lg" />
              </button>
            );
          })}
        </Stack>
      )}
      <ImageCropper image={images[indexOfSelectedImage]} onCrop={setCroppedImage} {...rest} />
    </Modal>
  );
};

export default EditImageModal;
