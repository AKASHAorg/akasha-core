import React, { useCallback, useState } from 'react';
import Stack from '../Stack';
import Cropper, { CropperProps } from 'react-easy-crop';
import Text from '../Text';
import Icon from '../Icon';
import { Point, Area } from 'react-easy-crop/types';
import { tw } from '@twind/core';
import { getRadiusClasses } from '../../utils/getRadiusClasses';
import { ImageSrc } from '../types/common.types';

import getCroppedImage from '../../utils/get-cropped-image';

export type ImageCropperProps = {
  image: CropperProps['image'];
  avatar: ImageSrc;
  onCrop: (image: Blob) => void;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.01;

const CROPPER_WIDTH = 320;
const CROPPWER_HEIGHT = 224;

const ImageCropper: React.FC<ImageCropperProps> = ({ image, avatar, onCrop }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const onCropComplete = useCallback(
    async (_: Area, croppedAreaPixels: Area) => {
      const [cropped] = await getCroppedImage(
        avatar.url || avatar.fallbackUrl,
        croppedAreaPixels,
        0,
      );
      onCrop(cropped);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [avatar],
  );

  return (
    <Stack direction="column" spacing="gap-y-4" customStyle={`w-fit h-fit`}>
      <div
        className={tw(
          `relative w-[${CROPPER_WIDTH / 16}rem] h-[${
            CROPPWER_HEIGHT / 16
          }rem] overflow-hidden bg-white ${getRadiusClasses(20)}`,
        )}
      >
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={CROPPER_WIDTH / CROPPWER_HEIGHT}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          objectFit="horizontal-cover"
        />
      </div>
      <Text variant="footnotes2" align="center" weight="normal">
        Drag the image to reposition
      </Text>
      <Stack justify="evenly" spacing="gap-x-2">
        <Icon type="MagnifyingGlassMinusIcon" size="lg" />
        <input
          type="range"
          value={zoom}
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={ZOOM_STEP}
          aria-labelledby="Zoom"
          onChange={e => setZoom(Number(e.target.value))}
          className={tw(`w-[${(CROPPER_WIDTH - 64) / 16}rem]`)}
        />
        <Icon type="MagnifyingGlassPlusIcon" size="lg" />
      </Stack>
    </Stack>
  );
};

export default ImageCropper;
