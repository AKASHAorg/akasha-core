import React, { useCallback, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@akashaorg/ui/lib/components/alert-dialog';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Img from '@akashaorg/design-system-core/lib/components/Image';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import Cropper, { Area, CropperProps, Point } from 'react-easy-crop';
import { type Image } from '@akashaorg/typings/lib/ui';
import { CroppedImagePreviewProps, CroppedImagePreviews } from './cropped-image-previews';
import { ZoomOutIcon, ZoomInIcon } from 'lucide-react';
import { getCroppedImage } from './get-cropped-image';
import { XCircleIcon } from 'lucide-react';
import { cssVars } from '@akashaorg/ui/lib/library/to-css-var';
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.01;
const CROPPER_WIDTH = 320;
const CROPPER_HEIGHT = 224;
export type ImageModalProps = {
  title: { label: string };
  show: boolean;
  cancelLabel: string;
  saveLabel: string;
  isSavingImage: boolean;
  images: (string | Image)[];
  dragToRepositionLabel: string;
  errorLabel: string;
  width?: number;
  height?: number;
  onSave: (image: Blob, indexOfEditedImage?: number) => void;
  rightAlignActions?: boolean;
  onClose?: () => void;
} & Partial<Pick<CropperProps, 'aspect' | 'objectFit' | 'cropShape'>> &
  Partial<Pick<CroppedImagePreviewProps, 'previewTitle' | 'previews'>>;

/**
 * Component used to crop user uploaded images
 * @param title - title of the modal
 * @param show - controls the visibility of the modal
 * @param cancelLabel - label for cancel button
 * @param saveLabel - label for save button
 * @param isSavingImage - status for saving the cropped image, prevents
 exiting the modal while true
 * @param images - an array of the images
 * @param dragToRepositionLabel - label for dragging image
 * @param errorLabel - text describing cropping error
 * @param width - (optional) width of the image container
 * @param height - (optional) height of the image container
 * @param onSave - handler for saving the cropped image
 */
const ImageModal: React.FC<ImageModalProps> = ({
  title,
  show,
  images,
  cancelLabel,
  saveLabel,
  isSavingImage,
  dragToRepositionLabel,
  errorLabel,
  aspect,
  objectFit,
  cropShape,
  width = CROPPER_WIDTH,
  height = CROPPER_HEIGHT,
  previewTitle,
  previews,
  rightAlignActions,
  onSave,
  onClose,
}) => {
  const [croppedArea, setCroppedArea] = useState<Area>({
    x: 0,
    y: 0,
    width,
    height,
  });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>(null);
  const [crop, setCrop] = useState<Point>({
    x: 0,
    y: 0,
  });
  const [zoom, setZoom] = useState(1);
  const [selectedImageIndex, setSelectedIndexImage] = useState(0);
  const [showCropError, setShowCropError] = useState(false);
  const aspectRatio = aspect ? aspect : width / height;
  const selectedImage = images[selectedImageIndex];
  const imageUrl = typeof selectedImage === 'string' ? selectedImage : selectedImage?.src;
  const onCropComplete = useCallback(
    async (_, croppedAreaPixels: Area) => {
      if (imageUrl && croppedAreaPixels.width && croppedAreaPixels.height) {
        setCroppedAreaPixels(croppedAreaPixels);
      }
    },
    [imageUrl],
  );
  const handleSaveClick = async () => {
    if (croppedAreaPixels) {
      const response = await getCroppedImage(imageUrl, croppedAreaPixels, 0);
      if (response.data) {
        const [croppedImageBlob] = await response.data;
        onSave(croppedImageBlob, selectedImageIndex);
        return;
      }
    }
    setShowCropError(true);
  };
  const imageContainerBorderStyle = showCropError
    ? `border-4 border-errorLight dark:border-errorDark`
    : '';
  return (
    <AlertDialog open={show} onOpenChange={onClose}>
      <AlertDialogContent className="py-4 px-6 md:px-24">
        <AlertDialogHeader>
          <AlertDialogTitle>{title?.label}</AlertDialogTitle>
          <AlertDialogDescription>
            {images?.length >= 2 && (
              <Stack direction="row" justifyContent="start" alignItems="center" spacing={2}>
                {images.map((imageData, index) => {
                  const imageUrl = typeof imageData === 'string' ? imageData : imageData?.src;
                  return (
                    <button key={index} onClick={() => setSelectedIndexImage(index)}>
                      <Img src={imageUrl} customStyle="object-contain w-10 h-10 rounded-[0.5rem]" />
                    </button>
                  );
                })}
              </Stack>
            )}
            <div
              style={cssVars({
                '--width': `${width / 16}rem`,
                '--height': `${height / 16}rem`,
              })}
            >
              <Card
                padding="p-0"
                elevation="none"
                radius={20}
                border={showCropError}
                customStyle={`relative w-[var(--width)] h-[var(--height)] overflow-hidden bg-transparent ${imageContainerBorderStyle}`}
              >
                <Cropper
                  image={imageUrl}
                  crop={crop}
                  zoom={zoom}
                  objectFit={objectFit}
                  cropShape={cropShape}
                  aspect={aspectRatio}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onCropAreaChange={setCroppedArea}
                  onZoomChange={setZoom}
                />
              </Card>
            </div>
            {showCropError && (
              <Stack direction="row" spacing={1} alignItems="center">
                <XCircleIcon className="h-6 w-6 [&>*]:fill-errorLight dark:[&>*]:fill-errorDark" />
                <Typography
                  variant="xs"
                  className="font-medium font-normal text-errorLight dark:text-errorDark"
                >
                  {errorLabel}
                </Typography>
              </Stack>
            )}
            <Typography variant="xs" className="font-medium text-center font-normal">
              {dragToRepositionLabel}
            </Typography>
            <Stack direction="column" spacing={4} className="w-full mb-2">
              <Stack direction="row" alignItems="center" spacing={2}>
                <ZoomOutIcon className="h-6 w-6 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
                <input
                  aria-label="range-input"
                  type="range"
                  value={zoom}
                  min={MIN_ZOOM}
                  max={MAX_ZOOM}
                  step={ZOOM_STEP}
                  className={
                    'grow h-2 bg-gray-200 dark:bg-gray-700 rounded-[0.5rem] appearance-none cursor-pointer'
                  }
                  onChange={e => setZoom(Number(e.target.value))}
                />
                <ZoomInIcon className="h-6 w-6 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
              </Stack>
              {previews?.length > 0 && (
                <CroppedImagePreviews
                  previewTitle={previewTitle}
                  previews={previews}
                  imageUrl={imageUrl}
                  croppedArea={croppedArea}
                />
              )}
            </Stack>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={`${rightAlignActions ? 'justify-end' : 'justify-center'}`}>
          <AlertDialogCancel disabled={isSavingImage} onClick={onClose}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction disabled={showCropError} onClick={handleSaveClick}>
            {saveLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default ImageModal;
