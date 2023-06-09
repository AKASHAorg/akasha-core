import React, { useCallback, useState } from 'react';
import Stack from '../Stack';
import Cropper, { CropperProps } from 'react-easy-crop';
import Text from '../Text';
import Icon from '../Icon';
import { Point, Area } from 'react-easy-crop/types';
import { apply, tw } from '@twind/core';
import { getRadiusClasses } from '../../utils/getRadiusClasses';
import { ProfileImageVersions } from '@akashaorg/typings/sdk/graphql-types-new';

import getCroppedImage from '../../utils/get-cropped-image';

export type ImageCropperProps = Partial<Omit<CropperProps, 'image'>> & {
  image: string | ProfileImageVersions;
  dragToRepositionLabel: string;
  onCrop: (image: Blob) => void;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.01;

const CROPPER_WIDTH = 320;
const CROPPWER_HEIGHT = 224;

const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  dragToRepositionLabel,
  onCrop,
  ...rest
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const imageUrl =
    typeof image === 'string' ? image : image?.default.src || image?.alternatives[0].src;

  const onCropComplete = useCallback(
    async (_: Area, croppedAreaPixels: Area) => {
      if (imageUrl && croppedAreaPixels.width && croppedAreaPixels.height) {
        const [cropped] = await getCroppedImage(imageUrl, croppedAreaPixels, 0);
        onCrop(cropped);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [image, imageUrl],
  );

  return (
    <Stack direction="column" spacing="gap-y-4" customStyle={`w-fit h-fit`}>
      <div
        className={tw(
          apply`relative w-[${CROPPER_WIDTH / 16}rem] h-[${
            CROPPWER_HEIGHT / 16
          }rem] overflow-hidden bg-transparent ${getRadiusClasses(20)}`,
        )}
      >
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={CROPPER_WIDTH / CROPPWER_HEIGHT}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          {...rest}
        />
      </div>
      <Text variant="footnotes2" align="center" weight="normal">
        {dragToRepositionLabel}
      </Text>
      <Stack justify="evenly" spacing="gap-x-2">
        <Icon type="MagnifyingGlassMinusIcon" size="lg" />
        <input
          data-testid="range-input"
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
