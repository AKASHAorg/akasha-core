import * as React from 'react';
import { tx, apply } from '@twind/core';
import { useDropzone } from 'react-dropzone';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Meter from '@akashaorg/design-system-core/lib/components/Meter';

const closeDivClass = apply('${flexCenteredClass} z-1 w-6 h-6 rounded-full bg-grey7');
const flexCenteredClass = apply(`flex items-center justify-items-center`);
const backgroundClass = apply(`bg(grey9 dark:grey1)`);

export interface IImageUpload {
  // labels
  uploadFailedLabel?: string;
  uploadingImageLabel?: string;
  dropZoneActiveLabel?: string;
  // parent state
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  // handlers
  uploadRequest?: (
    data: string | File,
    isUrl?: boolean,
  ) => Promise<{ data?: ImageData; error?: Error }>;
  handleInsertImage: (data: ImageData) => void;
  // ref for hidden input
  ref: React.Ref<HTMLInputElement>;
}

export interface ImageData {
  originalSrc?: string;
  src: { url?: string; fallbackUrl?: string };
  size: {
    width: number;
    height: number;
    naturalWidth: number;
    naturalHeight: number;
  };
}

const ImageUpload: React.FC<IImageUpload> = React.forwardRef((props, ref) => {
  const {
    // uploadFailedLabel,
    dropZoneActiveLabel,
    uploadingImageLabel,
    uploadRequest,
    handleInsertImage,
    uploading,
    setUploading,
  } = props;

  const [uploadValueName, setUploadValueName] = React.useState('');

  const [imageSize, setImageSize] = React.useState<{ height: number; width: number } | null>(null);
  const [uploadErrorState, setUploadErrorState] = React.useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = React.useState(0);

  let interval;

  const startLoadingProgress = () => {
    let currentProgress = 0;
    const step = loadingProgress > 50 ? 0.1 : 0.3;
    interval = setInterval(() => {
      currentProgress += step;
      const progress = Math.round((Math.atan(currentProgress) / (Math.PI / 2)) * 100 * 1000) / 1000;
      setLoadingProgress(progress);
    }, 100);
  };

  const handleCancelUpload = () => {
    setUploadErrorState(null);
    setUploading(false);
    setImageSize(null);
  };

  const handleFileUpload = acceptedFiles => {
    if (!(acceptedFiles && acceptedFiles[0])) {
      setUploadErrorState('No file provided');
      return;
    }
    const file = acceptedFiles[0];
    const fileName = file.name;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener('load', async () => {
      setUploadValueName(fileName);
      setUploadErrorState(null);
      if (uploadRequest && fileReader.result) {
        const img = new Image();
        img.onload = () => {
          setUploading(true);
          startLoadingProgress();
          setImageSize({ height: Math.min(img.height, 640), width: Math.min(img.width, 640) });
        };
        img.src = fileReader.result as string;
        const resp = await uploadRequest(file);
        if (resp.error) {
          setUploadErrorState(resp.error.message);
        } else if (resp.data) {
          handleInsertImage(resp.data);
        }
        setUploading(false);
        setLoadingProgress(0);
        clearInterval(interval);
      }
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleFileUpload });

  return (
    <>
      {!uploading && uploadErrorState && imageSize && (
        <div
          className={tx(
            `relative h-[8.125rem] w-full ${backgroundClass} border(solid grey8 dark:grey3) rounded-lg ${flexCenteredClass}`,
          )}
        >
          <button className={tx(`${closeDivClass}`)} onClick={handleCancelUpload}>
            <Icon type="XMarkIcon" />
          </button>
          <div
            className={tx(
              `h-12 w-12 bg(grey9 dark:grey-4) border border-grey3 rounded-lg ${flexCenteredClass}`,
            )}
          >
            <Icon type="PhotoIcon" />
          </div>
          <div className={tx(`flex flex-col gap-2 pl-2`)}>
            <Text truncate={true} customStyle={'max-w-[11rem]'}>
              {uploadValueName}
            </Text>

            <div className={tx(`flex flex-row items-center max-w-xs`)}>
              <Text customStyle={'break-words'} color={'error'}>
                {uploadErrorState}
              </Text>
            </div>
          </div>
        </div>
      )}
      {uploading && (
        <div
          className={tx(
            `relative h-[8.125rem] w-full ${backgroundClass} border(solid grey8 dark:grey3) rounded-lg ${flexCenteredClass}`,
          )}
        >
          <div className={tx(`${flexCenteredClass} flex-col gap-8 px-2`)}>
            <Meter type="bar" value={loadingProgress} max={100} size={600} thickness={48} />
            <Text>{uploadingImageLabel}</Text>
          </div>
        </div>
      )}
      <div {...getRootProps()}>
        <input {...getInputProps({ ref, accept: 'image/*', type: 'file' })} />

        {isDragActive ? (
          <div
            className={tx(
              `hidden sm:${flexCenteredClass} mb-2 rounded-sm w-full h-12 border(secondary dashed)`,
            )}
          >
            <Text color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
              {dropZoneActiveLabel}
            </Text>
          </div>
        ) : (
          <div className={tx(`h-full min-h-[3rem]`)} />
        )}
      </div>
    </>
  );
});

ImageUpload.displayName = 'ImageUpload';

ImageUpload.defaultProps = {
  dropZoneActiveLabel: 'Drop photos here',
};

export { ImageUpload };
