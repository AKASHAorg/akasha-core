import * as React from 'react';
import { Box, Text } from 'grommet';
import {
  StyledImageDiv,
  StyledValueText,
  StyledUploadingDiv,
  StyledText,
  StyledCloseDiv,
  StyledImageInput,
} from './styled-editor-box';

import Icon from '../Icon';

export interface IImageUpload {
  // labels
  uploadFailedLabel?: string;
  uploadingImageLabel?: string;
  // parent state
  uploading: boolean;
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  // handlers
  uploadRequest?: (data: string | File, isUrl?: boolean) => any;
  handleInsertImage: (data: {
    src: string;
    size: {
      width: string;
      height: string;
      naturalWidth: string;
      naturalHeight: string;
    };
  }) => void;
  // ref for hidden input
  ref: React.Ref<HTMLInputElement>;
}

const ImageUpload: React.FC<IImageUpload> = React.forwardRef((props, ref) => {
  const {
    uploadFailedLabel,
    uploadingImageLabel,
    uploadRequest,
    handleInsertImage,
    uploading,
    setUploading,
  } = props;

  const [uploadValueName, setUploadValueName] = React.useState('');

  const [imageSize, setImageSize] = React.useState<{ height: number; width: number } | null>(null);
  const [uploadErrorState, setUploadErrorState] = React.useState(false);

  const handleCancelUpload = () => {
    setUploadErrorState(false);
    setUploading(false);
    setImageSize(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!(e.target.files && e.target.files[0])) {
      setUploadErrorState(true);
      return;
    }
    const file = e.target.files[0];
    const fileName = file.name;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener('load', async () => {
      setUploadValueName(fileName);
      setUploadErrorState(false);
      if (uploadRequest && fileReader.result) {
        const img = new Image();
        img.onload = () => {
          setUploading(true);
          setImageSize({ height: Math.min(img.height, 640), width: Math.min(img.width, 640) });
        };
        img.src = fileReader.result as string;
        const resp = await uploadRequest(file);
        if (resp.error) {
          setUploadErrorState(true);
        } else if (resp.data) {
          handleInsertImage(resp.data);
        }
        setUploading(false);
      }
    });
  };

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

            <Box direction="row" gap="xsmall" align="center">
              <Text color="errorText">{uploadFailedLabel}</Text>
            </Box>
          </Box>
        </StyledUploadingDiv>
      )}
      {uploading && (
        <StyledUploadingDiv>
          <Box direction="column" gap="medium" align="center" justify="center">
            <Icon type="loading" />
            <StyledText size="medium" color="accentText">
              {uploadingImageLabel}
            </StyledText>
          </Box>
        </StyledUploadingDiv>
      )}
      <StyledImageInput value="" onChange={handleFileUpload} type="file" ref={ref} />
    </>
  );
});

export { ImageUpload };
