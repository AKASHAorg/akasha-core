import React, { RefObject, useRef } from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { type GalleryImage } from '@akashaorg/typings/lib/ui';

export type GalleryProps = {
  galleryFieldLabel?: string;
  galleryDescriptionLabel?: string;
  addLabel?: string;
  images: GalleryImage[];
  handleImageUpload?: (image: File) => void;
  handleImageDelete?: (image: GalleryImage) => void;
  uploading?: boolean;
};

export const Gallery: React.FC<GalleryProps> = props => {
  const {
    galleryFieldLabel,
    galleryDescriptionLabel,
    addLabel,
    images,
    uploading,
    handleImageUpload,
    handleImageDelete,
  } = props;

  const uploadInputRef: RefObject<HTMLInputElement> = useRef(null);
  const imageUploadDisabled = React.useMemo(() => {
    return images.length > 15 || uploading;
  }, [images, uploading]);

  const handleMediaClick = () => {
    if (uploadInputRef.current && !imageUploadDisabled) {
      uploadInputRef.current.click();
    }
  };

  return (
    <Stack>
      <Stack spacing="gap-y-1" direction="column">
        <Stack direction="row" spacing="gap-x-2" justify="between" align="center">
          <Text variant="h6">{galleryFieldLabel}</Text>
          <Button
            variant="text"
            icon={<PlusIcon />}
            iconDirection="left"
            label={addLabel}
            onClick={handleMediaClick}
          />
        </Stack>
        <Text variant="body2" color={{ light: 'grey4', dark: 'grey6' }} weight="light">
          {galleryDescriptionLabel}
        </Text>
      </Stack>
      {images.map((imageObj, index) => (
        <Stack key={index} direction="row" justify="between">
          <Stack direction="row" align="center" spacing="gap-1">
            <Image
              alt={imageObj.name}
              src={imageObj.originalSrc || imageObj.displaySrc || imageObj.src}
              customStyle="object-contain w-8 h-8 rounded-lg"
            />
            <Text>{imageObj.name || `uploaded-image-${index + 1}`}</Text>
          </Stack>
          <button onClick={() => handleImageDelete(imageObj)}>
            <Icon
              size="md"
              color={{ light: 'errorLight', dark: 'errorDark' }}
              icon={<TrashIcon />}
            />
          </button>
        </Stack>
      ))}
      {uploading && <Spinner />}
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={e => handleImageUpload(e.target.files[0])}
        hidden
      />
    </Stack>
  );
};
