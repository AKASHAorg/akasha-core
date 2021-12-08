import * as React from 'react';
import { Box, Text, Meter } from 'grommet';
import {
  StyledImageDiv,
  StyledValueText,
  StyledUploadingDiv,
  StyledText,
  StyledCloseDiv,
  // StyledImageInput,
} from './styled-editor-box';
import styled from 'styled-components';
import Icon from '../Icon';
import { useDropzone } from 'react-dropzone';

const StyledMeter = styled(Meter)`
  height: 0.5rem;
`;

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
  src: string;
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
        <StyledUploadingDiv>
          <StyledCloseDiv onClick={handleCancelUpload}>
            <Icon type="close" clickable={true} />
          </StyledCloseDiv>
          <StyledImageDiv>
            <Icon type="image" />
          </StyledImageDiv>
          <Box direction="column" gap="small" pad={{ left: 'small' }}>
            <StyledValueText>{uploadValueName}</StyledValueText>

            <Box direction="row" gap="xsmall" align="center" width={{ max: '20rem' }}>
              <Text wordBreak="break-all" color="errorText">
                {uploadErrorState}
              </Text>
            </Box>
          </Box>
        </StyledUploadingDiv>
      )}
      {uploading && (
        <StyledUploadingDiv height={75}>
          <Box
            direction="column"
            gap="medium"
            align="center"
            justify="center"
            pad={{ horizontal: 'small' }}
          >
            <StyledMeter
              type="bar"
              round={true}
              value={loadingProgress}
              max={100}
              // color defined in grommet config
              color="secondaryText"
            />
            <StyledText size="medium" color="primaryText">
              {uploadingImageLabel}
            </StyledText>
          </Box>
        </StyledUploadingDiv>
      )}
      {/* <StyledImageInput accept={'image/*'} onChange={handleFileUpload} type="file" ref={ref} /> */}
      <div {...getRootProps()}>
        <input {...getInputProps({ ref, accept: 'image/*', type: 'file' })} />
        {isDragActive ? (
          <Box
            pad={{ bottom: 'small' }}
            round="small"
            justify="center"
            align="center"
            fill="horizontal"
            height="2rem"
            border={{
              color: 'accent',
              style: 'dashed',
              side: 'all',
              size: '1px',
            }}
          >
            <Text color="accent">{dropZoneActiveLabel}</Text>
          </Box>
        ) : (
          <Box fill="vertical" height={{ min: '2rem' }} />
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
