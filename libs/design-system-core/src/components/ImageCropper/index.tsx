import React, { useCallback, useState } from 'react';
import { apply, tw } from '@twind/core';
import Cropper, { CropperProps, Point, Area } from 'react-easy-crop';

import Icon from '../Icon';
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '../Icon/hero-icons-outline';
import Stack from '../Stack';
import Text from '../Text';
import { getCroppedImage, getRadiusClasses } from '../../utils';
import { type Image } from '@akashaorg/typings/lib/ui';

export type ImageCropperProps = Partial<Omit<CropperProps, 'image'>> & {
  image: string | Image;
  dragToRepositionLabel: string;
  onCrop: (image: Blob) => void;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.01;

const CROPPER_WIDTH = 320;
const CROPPER_HEIGHT = 224;

/**
 * An ImageCropper component makes the task of cropping an image much easier. It also makes
 * the task of including an image cropper in your app more straightforward. The component makes
 * use of the [`react-easy-crop`](https://www.npmjs.com/package/react-easy-crop) library under
 * the hood and accepts some additional props as listed below:
 * @param image - the image you want to crop
 * @param dragToRepositionLabel - supply your custom label here
 * @param onCrop - callback function that will be called when the image cropping finishes
 * @example
 * ```tsx
 *  <ImageCropper image={selectedImage} onCrop={setCroppedImage} />
 * ```
 **/
const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  dragToRepositionLabel,
  onCrop,
  ...rest
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const imageUrl = typeof image === 'string' ? image : image?.src;

  const onCropComplete = useCallback(
    async (_: Area, croppedAreaPixels: Area) => {
      if (imageUrl && croppedAreaPixels.width && croppedAreaPixels.height) {
        const response = await getCroppedImage(imageUrl, croppedAreaPixels, 0);
        if (response.data) {
          const [croppedImageBlob] = await response.data;
          onCrop(croppedImageBlob);
        }
        //@TODO: if there is an error while cropping an image then we need to handle this properly
      }
    },
    [imageUrl, onCrop],
  );

  return (
    <Stack direction="column" spacing="gap-y-4" customStyle={`w-fit h-fit`}>
      <div
        className={tw(
          apply`relative w-[${CROPPER_WIDTH / 16}rem] h-[${
            CROPPER_HEIGHT / 16
          }rem] overflow-hidden bg-transparent ${getRadiusClasses(20)}`,
        )}
      >
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={CROPPER_WIDTH / CROPPER_HEIGHT}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          {...rest}
        />
      </div>
      <Text variant="footnotes2" align="center" weight="normal">
        {dragToRepositionLabel}
      </Text>
      <Stack direction="row" justify="evenly" spacing="gap-x-2">
        <Icon icon={<MagnifyingGlassMinusIcon />} size="lg" />
        <input
          aria-label="range-input"
          type="range"
          value={zoom}
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={ZOOM_STEP}
          onChange={e => setZoom(Number(e.target.value))}
          className={tw(`w-[${(CROPPER_WIDTH - 64) / 16}rem]`)}
        />
        <Icon icon={<MagnifyingGlassPlusIcon />} size="lg" />
      </Stack>
    </Stack>
  );
};

export default ImageCropper;
