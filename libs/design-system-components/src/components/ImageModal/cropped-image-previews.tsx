import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Img from '@akashaorg/design-system-core/lib/components/Image';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Area } from 'react-easy-crop';
import { cn } from '@akashaorg/ui/lib/library/utils';
import { cssVars } from '@akashaorg/ui/lib/library/to-css-var';
export type ImagePreview = {
  dimension: number;
  circular?: boolean;
};
export type CroppedImagePreviewProps = {
  previewTitle: string;
  previews: ImagePreview[];
  imageUrl: string;
  croppedArea: Area;
};

/**
 * Component used to display previews of the cropped image
 * @param previewTitle - preview title
 * @param previews - an array of preview meta data
 * @param imageUrl - url of the image
 * @param croppedArea - cropped area of the image(the starting x and y coordinates, and the width and height)
 */
export const CroppedImagePreviews: React.FC<CroppedImagePreviewProps> = props => {
  const { previewTitle, previews, imageUrl, croppedArea } = props;
  const scale = 100 / croppedArea.width;
  const transform = {
    x: `${-croppedArea.x * scale}%`,
    y: `${-croppedArea.y * scale}%`,
  };
  return (
    <Stack spacing={2}>
      <Typography variant="sm" bold>
        {previewTitle}
      </Typography>
      <Stack direction="row" spacing={3} alignItems="end">
        {previews.map((preview, index) => {
          return (
            <Card
              key={index}
              style={cssVars({
                '--size': `${preview.dimension}px`,
                '--transform-x': transform.x,
                '--transform-y': transform.y,
                '--scale': `${scale}`,
              })}
              className={cn(
                preview.circular ? 'rounded-full' : 'rounded-[0.625rem]',
                `p-0 relative overflow-hidden  size-[var(--size)]`,
              )}
            >
              <Img
                src={imageUrl}
                style={{
                  transform: `translate3d(var(--transform-x), var(--transform-y), 0) scale3d(var(--scale),var(--scale),1)`,
                }}
                customStyle="absolute top-0 left-0 origin-top-left w-full"
              />
            </Card>
          );
        })}
      </Stack>
    </Stack>
  );
};
