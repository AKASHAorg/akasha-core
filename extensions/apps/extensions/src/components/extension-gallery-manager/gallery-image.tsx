import React from 'react';
import { Image } from '@akashaorg/ui/lib/akasha-components/image';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Loader2 } from 'lucide-react';
import {
  TrashIcon,
  XCircleIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export enum GalleryImageState {
  ERROR = 'error',
  LOADING = 'Loading',
}

export type GalleryImageProps = {
  name: string;
  src: string;
  uploadingLabel: string;
  uploadingErrorLabel: string;
  state?: GalleryImageState;
  handleClickImage?: () => void;
  onDelete: () => void;
};

export const GalleryImage: React.FC<GalleryImageProps> = props => {
  const { name, src, state, uploadingLabel, uploadingErrorLabel, handleClickImage, onDelete } =
    props;
  return (
    <Stack className="relative w-[9.125rem] h-[9.125rem] min-[400px]:w-[10.625rem] min-[400px]:h-[10.625rem] overflow-hidden rounded-[0.5rem] cursor-pointer">
      <Image
        alt={name}
        src={src}
        onClick={handleClickImage}
        className={`object-cover w-full h-full ${state === GalleryImageState.ERROR || state === GalleryImageState.LOADING ? 'opacity-20' : ''}`}
        showLoadingIndicator
      />
      {
        //action buttons
      }
      <Stack direction="row" spacing={2} className="absolute top-2 right-2">
        <button
          onClick={onDelete}
          disabled={state === GalleryImageState.LOADING}
          className={state === GalleryImageState.LOADING ? 'cursor-not-allowed' : ''}
        >
          <AppIcon
            placeholderIcon={<TrashIcon />}
            size="xs"
            iconSize="sm"
            iconStyle="[&>*]:stroke-white"
            customStyle="bg-black/50"
            hover
          />
        </button>
      </Stack>
      {state && (
        <Stack
          alignItems="center"
          justifyContent="center"
          spacing={2}
          className="absolute top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 w-full"
        >
          {state === GalleryImageState.ERROR && (
            <Icon
              icon={<XCircleIcon />}
              size="lg"
              customStyle={'[&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark'}
            />
          )}
          {state === GalleryImageState.LOADING && (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          )}
          {state === GalleryImageState.ERROR && (
            <Text variant="button-sm" align="center">
              {uploadingErrorLabel}
            </Text>
          )}
          {state === GalleryImageState.LOADING && (
            <Text variant="button-sm" align="center">
              {uploadingLabel}
            </Text>
          )}
        </Stack>
      )}
    </Stack>
  );
};
