import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Img from '@akashaorg/design-system-core/lib/components/Image';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Area } from 'react-easy-crop';

export type ImagePreview = {
  dimension: number;
  circular?: boolean;
};

export type ImagePreviewProps = {
  previewTitle: string;
  previews: ImagePreview[];
  imageUrl: string;
  croppedArea: Area;
};

export const ImagePreviews: React.FC<ImagePreviewProps> = props => {
  const { previewTitle, previews, imageUrl, croppedArea } = props;
  const scale = 100 / croppedArea.width;
  const transform = {
    x: `${-croppedArea.x * scale}%`,
    y: `${-croppedArea.y * scale}%`,
  };

  return (
    <Stack spacing="gap-y-2.5">
      <Text variant="button-md">{previewTitle}</Text>
      <Stack direction="row" spacing="gap-x-3.5" align="end">
        {previews.map((preview, index) => (
          <Card
            key={index}
            padding={'p-0'}
            elevation="none"
            radius={preview.circular ? 'rounded-full' : 10}
            customStyle={`relative overflow-hidden w-[${preview.dimension}px] h-[${preview.dimension}px]`}
          >
            <Img
              src={imageUrl}
              style={{
                transform: `translate3d(${transform.x}, ${transform.y}, 0) scale3d(${scale},${scale},1)`,
              }}
              customStyle="absolute top-0 left-0 origin-top-left w-full"
            />
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};
