import React, { useRef } from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { GalleryImage, GalleryImageProps } from './gallery-image';
import { getGalleryState } from './get-gallery-state';
import { AppImageSource } from '@akashaorg/typings/lib/sdk/graphql-types-new';

type ActionButton = {
  label: string;
  disabled: boolean;
  handleClick: () => void;
};

export type Image = { id: string; name: string } & AppImageSource;

type ExtensionGalleryManagerProps = {
  galleryManagerTitle: string;
  galleryManagerDescription: string;
  uploadImagesLabel: string;
  imagesLabel: string;
  startUploadingLabel: string;
  emptyGalleryLabel: string;
  images: Image[];
  imageIdsWithError: string[];
  uploading: boolean;
  cancelButton: ActionButton;
  saveButton: ActionButton;
  maxGalleryImages: number;
  handleClickImage?: (image: Image) => void;
  onDelete: (image: Image) => void;
  onUploadImagesClick: (fileList: FileList) => void;
} & Pick<GalleryImageProps, 'uploadingLabel' | 'uploadingErrorLabel'>;

export const ExtensionGalleryManager: React.FC<ExtensionGalleryManagerProps> = props => {
  const {
    galleryManagerTitle,
    galleryManagerDescription,
    uploadImagesLabel,
    emptyGalleryLabel,
    images,
    imagesLabel,
    startUploadingLabel,
    imageIdsWithError,
    uploading,
    cancelButton,
    saveButton,
    uploadingLabel,
    uploadingErrorLabel,
    maxGalleryImages,
    handleClickImage,
    onDelete,
    onUploadImagesClick,
  } = props;
  const uploadInputRef = useRef(null);

  return (
    <Stack spacing={4} className="relative">
      <Stack direction="column" spacing={4} className="p-4">
        <Stack spacing={2} direction="column">
          <Stack direction="row" spacing={2} justifyContent="between" alignItems="center">
            <Text variant="h6">{galleryManagerTitle}</Text>
            <Button
              variant="link"
              onClick={() => {
                if (images.length !== maxGalleryImages) uploadInputRef.current.click();
              }}
              disabled={uploading}
            >
              {uploadImagesLabel}
            </Button>
          </Stack>
          <Text variant="body2" color={{ light: 'grey4', dark: 'grey6' }} weight="light">
            {galleryManagerDescription}
          </Text>
        </Stack>
        {images.length ? (
          <Stack className="grid grid-cols-[repeat(auto-fill,_minmax(min(10rem,_100%),_1fr))] gap-4">
            {images.map(image => (
              <GalleryImage
                key={image.id}
                name={image.name}
                src={image.src}
                uploadingLabel={uploadingLabel}
                uploadingErrorLabel={uploadingErrorLabel}
                state={getGalleryState({
                  imageId: image.id,
                  uploading: uploading ? image.src.startsWith('blob:') : false,
                  imageIdsWithError,
                })}
                handleClickImage={() => handleClickImage(image)}
                onDelete={() => onDelete(image)}
              />
            ))}
          </Stack>
        ) : (
          <ErrorLoader
            title={<Text variant="h6">{emptyGalleryLabel}</Text>}
            details={
              <Button
                onClick={() => {
                  uploadInputRef.current.click();
                }}
                className="mt-4"
              >
                {startUploadingLabel}
              </Button>
            }
            type="list-not-available"
            noWrapperCard
          />
        )}
        <input
          ref={uploadInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={e => {
            onUploadImagesClick(e.target.files);
            uploadInputRef.current.value = '';
          }}
          multiple
          hidden
        />
      </Stack>
      <Stack spacing={4} className="bg-inherit sticky bottom-0 rounded-b-2xl w-full">
        <Divider />
        <Stack direction="row" alignItems="center" spacing={2} className="px-4 mb-4">
          <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey6' }} weight="normal">
            {images.length}/{maxGalleryImages} {imagesLabel}
          </Text>
          <Button
            variant="link"
            disabled={cancelButton.disabled}
            onClick={cancelButton.handleClick}
            className="ml-auto"
          >
            {cancelButton.label}
          </Button>
          <Button
            loading={uploading}
            disabled={saveButton.disabled}
            onClick={saveButton.handleClick}
          >
            {saveButton.label}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ExtensionGalleryManager;
