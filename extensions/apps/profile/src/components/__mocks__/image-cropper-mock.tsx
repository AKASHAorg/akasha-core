import React from 'react';
import { ImageCropperProps } from '@akashaorg/design-system-core/lib/components/ImageCropper';

export const ImageCropperMock: React.FC<ImageCropperProps & { mockImage: Blob }> = ({
  onCrop,
  mockImage,
}) => {
  return <button onClick={() => onCrop(mockImage)}>Crop</button>;
};
