import React from 'react';
import { Image } from '@akashaorg/ui/lib/akasha-components/image';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Loader2 } from 'lucide-react';
import { Trash2Icon, XCircleIcon } from 'lucide-react';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';

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
        <Button
          size="icon"
          variant="ghost"
          disabled={state === GalleryImageState.LOADING}
          onClick={onDelete}
          className={`bg-black/50 size-6 [&_*]:stroke-white  hover:[&_*]:stroke-black ${state === GalleryImageState.LOADING ? 'cursor-not-allowed' : ''}`}
        >
          <Trash2Icon className="h-3 w-3" />
        </Button>
      </Stack>
      {state && (
        <Stack
          alignItems="center"
          justifyContent="center"
          spacing={2}
          className="absolute top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 w-full"
        >
          {state === GalleryImageState.ERROR && (
            <XCircleIcon className="h-6 w-6 [&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark" />
          )}
          {state === GalleryImageState.LOADING && (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          )}
          {state === GalleryImageState.ERROR && (
            <Typography variant="xs" bold className="text-center">
              {uploadingErrorLabel}
            </Typography>
          )}
          {state === GalleryImageState.LOADING && (
            <Typography variant="xs" bold className="text-center">
              {uploadingLabel}
            </Typography>
          )}
        </Stack>
      )}
    </Stack>
  );
};
