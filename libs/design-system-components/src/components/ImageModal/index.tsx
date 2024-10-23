import React, { useCallback, useState } from 'react';
import Modal, { ModalProps } from '@akashaorg/design-system-core/lib/components/Modal';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Img from '@akashaorg/design-system-core/lib/components/Image';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Cropper, { Area, CropperProps, Point } from 'react-easy-crop';
import { tw } from '@twind/core';
import { type Image } from '@akashaorg/typings/lib/ui';
import { ImagePreviewProps, ImagePreviews } from './image-previews';
import {
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { getCroppedImage } from './get-cropped-image';

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.01;

const CROPPER_WIDTH = 320;
const CROPPER_HEIGHT = 224;

export type ImageModalProps = {
  title: ModalProps['title'];
  show: ModalProps['show'];
  cancelLabel: string;
  saveLabel: string;
  isSavingImage: boolean;
  images: (string | Image)[];
  dragToRepositionLabel: string;
  imageWidth?: number;
  imageHeight?: number;
  removeCropAreaBoxShadow?: boolean;
  onSave: (image: Blob, indexOfEditedImage?: number) => void;
} & Pick<ModalProps, 'rightAlignActions' | 'onClose'> &
  Partial<Pick<CropperProps, 'aspect' | 'objectFit' | 'cropShape'>> &
  Partial<Pick<ImagePreviewProps, 'previewTitle' | 'previews'>>;

/**
 * Component used to crop user uploaded images
 * @param title - title of the modal
 * @param show - controls the visibility of the modal
 * @param cancelLabel - label for cancel button
 * @param saveLabel - label for save button
 * @param isSavingImage - status for saving the cropped image, prevents
 exiting the modal while true
 * @param images - an array of the images
 * @param dragToRepositionLabel - label for dragging image
 * @param imageWidth - (optional) width of the image container
 * @param imageHeight - (optional) height of the image container
 * @param removeCropAreaBoxShadow - (optional) flag to remove box shadow on crop area
 * @param onSave - handler for saving the cropped image
 */
const ImageModal: React.FC<ImageModalProps> = ({
  title,
  show,
  images,
  cancelLabel,
  saveLabel,
  isSavingImage,
  dragToRepositionLabel,
  aspect,
  objectFit,
  cropShape,
  imageWidth = CROPPER_WIDTH,
  imageHeight = CROPPER_HEIGHT,
  previewTitle,
  previews,
  rightAlignActions,
  removeCropAreaBoxShadow,
  onSave,
  onClose,
}) => {
  const [croppedImage, setCroppedImage] = useState<Blob>(null);
  const [croppedArea, setCroppedArea] = useState<Area>({
    x: 0,
    y: 0,
    width: imageWidth,
    height: imageHeight,
  });
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [selectedImageIndex, setSelectedIndexImage] = useState(0);

  const aspectRatio = aspect ? aspect : imageWidth / imageHeight;
  const selectedImage = images[selectedImageIndex];
  const imageUrl = typeof selectedImage === 'string' ? selectedImage : selectedImage?.src;
  const onCropComplete = useCallback(
    async (_, croppedAreaPixels: Area) => {
      if (imageUrl && croppedAreaPixels.width && croppedAreaPixels.height) {
        const response = await getCroppedImage(imageUrl, croppedAreaPixels, 0);
        if (response.data) {
          const [croppedImageBlob] = await response.data;
          setCroppedImage(croppedImageBlob);
        }
        //@TODO: if there is an error while cropping an image then we need to handle this properly
      }
    },
    [imageUrl],
  );

  const cropAreaStyle = removeCropAreaBoxShadow ? { cropAreaStyle: { boxShadow: 'none' } } : {};

  return (
    <Modal
      title={title}
      show={show}
      onClose={onClose}
      rightAlignActions={rightAlignActions}
      actions={[
        { variant: 'text', disabled: isSavingImage, label: cancelLabel, onClick: onClose },
        {
          variant: 'primary',
          label: saveLabel,
          loading: isSavingImage,
          onClick: () => onSave(croppedImage, selectedImageIndex),
        },
      ]}
    >
      {images.length > 0 && (
        <Stack direction="row" justify="start" align="center" spacing="gap-2">
          {images.map((imageData, index) => {
            const imageUrl = typeof imageData === 'string' ? imageData : imageData?.src;
            return (
              <Button key={index} onClick={() => setSelectedIndexImage(index)} plain>
                <Img src={imageUrl} customStyle="object-contain w-10 h-10 rounded-lg" />
              </Button>
            );
          })}
        </Stack>
      )}
      <Card
        padding="p-0"
        elevation="none"
        radius={20}
        customStyle={`relative w-[${imageWidth / 16}rem] h-[${
          imageHeight / 16
        }rem] overflow-hidden bg-transparent`}
      >
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          objectFit={objectFit}
          cropShape={cropShape}
          aspect={aspectRatio}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onCropAreaChange={setCroppedArea}
          onZoomChange={setZoom}
          style={cropAreaStyle}
        />
      </Card>
      <Text variant="footnotes2" align="center" weight="normal">
        {dragToRepositionLabel}
      </Text>
      <Stack direction="column" spacing="gap-y-4" padding="px-4" fullWidth>
        <Stack direction="row" align="center" spacing="gap-x-2">
          <Icon icon={<MagnifyingGlassMinusIcon />} size="lg" />
          <input
            aria-label="range-input"
            type="range"
            value={zoom}
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={ZOOM_STEP}
            className={tw(
              'grow h-2 bg(gray-200 dark:gray-700) rounded-lg appearance-none cursor-pointer',
            )}
            onChange={e => setZoom(Number(e.target.value))}
          />
          <Icon icon={<MagnifyingGlassPlusIcon />} size="lg" />
        </Stack>
        {previews?.length > 0 && (
          <ImagePreviews
            previewTitle={previewTitle}
            previews={previews}
            imageUrl={imageUrl}
            croppedArea={croppedArea}
          />
        )}
      </Stack>
    </Modal>
  );
};

export default ImageModal;
