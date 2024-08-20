import React, { useEffect } from 'react';
import { ImageCropperProps } from '@akashaorg/design-system-core/lib/components/ImageCropper';

export const ImageCropperMock: React.FC<ImageCropperProps & { mockImage: Blob }> = ({
  onCrop,
  mockImage,
}) => {
  useEffect(() => {
    onCrop(mockImage);
  }, [mockImage, onCrop]);
  return <div data-testid="image-cropper" />;
};
