import { Box, Tabs, Text } from 'grommet';
import React, { useState } from 'react';
import { Icon } from '../../Icon/index';
import { LinkInput } from '../../Input/index';
import { Dropzone } from './dropzone';
import {
  StyledButton,
  StyledDrop,
  // StyledImageInput,
  StyledImg,
  StyledImageDiv,
  // StyledInputDiv,
  StyledTab,
  StyledText,
  StyledUploadingDiv,
  StyledUploadValueBox,
  StyledValueText,
} from './styled-image-popover';

export interface IImagePopover {
  dropzoneLabel?: string;
  uploadImageLabel?: string;
  uploadingImageLabel?: string;
  byUrlLabel?: string;
  insertLabel?: string;
  uploadFailedLabel?: string;
  fetchImageFailedLabel?: string;
  tryAgainLabel?: string;
  target: HTMLElement;
  closePopover: () => void;
  insertImage: (data: {
    src: string;
    size: {
      width: string;
      height: string;
      naturalWidth: string;
      naturalHeight: string;
    };
  }) => void;
  // upload an URL or a file and returns a promise that resolves to an array
  uploadRequest?: (data: string | File, isUrl?: boolean) => any;
}

const ImagePopover: React.FC<IImagePopover> = props => {
  const {
    target,
    closePopover,
    insertImage,
    uploadRequest,
    dropzoneLabel,
    uploadImageLabel,
    uploadingImageLabel,
    byUrlLabel,
    insertLabel,
    uploadFailedLabel,
    fetchImageFailedLabel,
    tryAgainLabel,
  } = props;

  const [linkInputValue, setLinkInputValue] = useState('');
  const [uploadFileValue, setUploadFileValue] = useState<{
    src: string;
    size: {
      width: string;
      height: string;
      naturalWidth: string;
      naturalHeight: string;
    };
  } | null>(null);
  const [uploadLinkValue, setUploadLinkValue] = useState<{
    src: string;
    size: {
      width: string;
      height: string;
      naturalWidth: string;
      naturalHeight: string;
    };
  } | null>(null);
  const [uploadValueName, setUploadValueName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadErrorState, setUploadErrorState] = useState(false);

  const handleLinkInputChange = async (ev: React.ChangeEvent<HTMLInputElement>) => {
    setLinkInputValue(ev.target.value);
    if (uploadRequest) {
      setUploading(true);
      const resp = await uploadRequest(ev.target.value, true);
      if (resp.error) {
        setUploading(false);
        setUploadErrorState(true);
      } else if (resp.data) {
        setUploadLinkValue(resp.data);
        setUploading(false);
        setUploadErrorState(false);
      }
    } else {
      setUploadErrorState(true);
    }
  };

  const handleFileUpload = (acceptedFiles: any) => {
    if (acceptedFiles.length < 1) {
      setUploadFileValue(null);
      setUploadErrorState(true);
      return;
    }
    const file = acceptedFiles[0];
    const fileName = file.name;
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.addEventListener('load', async () => {
      const result = fileReader.result as any;
      setUploadValueName(fileName);
      setUploadErrorState(false);
      if (uploadRequest) {
        setUploading(true);
        const resp = await uploadRequest(file);
        if (resp.error) {
          setUploadErrorState(true);
          setUploading(false);
        } else if (resp.data) {
          setUploadFileValue(resp.data);
          setUploading(false);
        }
      } else {
        setUploadFileValue(result);
      }
    });
  };

  const handleInsertImage = (type: 'file' | 'url') => {
    // @Todo check if isUrl and isImage
    if (uploadFileValue && type === 'file') {
      insertImage(uploadFileValue);
    }
    if (uploadLinkValue && type === 'url') {
      insertImage(uploadLinkValue);
    }
    closePopover();
  };

  const handleDeleteUpload = () => {
    if (linkInputValue) {
      setLinkInputValue('');
    }
    if (uploadFileValue) {
      setUploadFileValue(null);
    }
    if (uploadLinkValue) {
      setUploadLinkValue(null);
    }
    setUploadErrorState(false);
    setUploadValueName('');
  };

  const renderUploadTabTitle = () => (
    <Box direction="row" gap="xsmall" justify="center" align="center">
      <Icon type="upload" />
      <Text size="large">{uploadImageLabel}</Text>
    </Box>
  );

  const renderUrlTabTitle = () => (
    <Box direction="row" gap="xsmall" justify="center" align="center">
      <Icon type="link" />
      <Text size="large">{byUrlLabel}</Text>
    </Box>
  );

  return (
    <StyledDrop
      overflow="hidden"
      target={target}
      align={{ top: 'bottom', left: 'left' }}
      onClickOutside={closePopover}
      onEsc={closePopover}
    >
      <Tabs>
        <StyledTab title={renderUploadTabTitle()}>
          {uploadFileValue && (
            <StyledUploadValueBox
              pad="medium"
              direction="row"
              align="center"
              gap="small"
              justify="between"
            >
              <Box direction="row" align="center" gap="small">
                <StyledImg src={uploadFileValue.src} />
                <StyledValueText>{uploadValueName}</StyledValueText>
              </Box>
              <Box gap="small" align="center" direction="row">
                <Icon type="trash" clickableRed={true} size="xs" onClick={handleDeleteUpload} />
                <StyledButton
                  label={insertLabel}
                  onClick={() => handleInsertImage('file')}
                  disabled={!uploadFileValue}
                  primary={true}
                  color="accent"
                />
              </Box>
            </StyledUploadValueBox>
          )}
          {!uploadFileValue && (
            <StyledUploadValueBox align="start" justify="center" pad="medium">
              {!uploading && (
                <>
                  <Dropzone
                    onDrop={handleFileUpload}
                    accept={'image/*'}
                    dropzoneLabel={dropzoneLabel}
                  />
                  {uploadErrorState && (
                    <Box
                      direction="row"
                      gap="small"
                      align="center"
                      justify="start"
                      pad={{ top: 'medium' }}
                    >
                      <StyledImageDiv>
                        <Icon type="image" />
                      </StyledImageDiv>
                      <Box direction="column" gap="small">
                        <Box direction="row" gap="xsmall" align="center" justify="start">
                          <StyledValueText>{uploadValueName}</StyledValueText>
                          <Icon
                            type="trash"
                            clickableRed={true}
                            size="xs"
                            onClick={handleDeleteUpload}
                          />
                        </Box>
                        <Box direction="row" gap="xsmall" align="center">
                          <Text color="errorText">{uploadFailedLabel}</Text>
                          <Text color="accentText">{tryAgainLabel}</Text>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </>
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
            </StyledUploadValueBox>
          )}
        </StyledTab>
        <StyledTab title={renderUrlTabTitle()}>
          <StyledUploadValueBox pad="medium" gap="small">
            <Box gap="xsmall">
              <LinkInput
                inputValue={linkInputValue}
                onChange={handleLinkInputChange}
                handleClearInput={handleDeleteUpload}
              />
              {uploadErrorState && (
                <Box direction="column" gap="xsmall" align="start" justify="center">
                  <Text color="errorText">{fetchImageFailedLabel}</Text>
                  <Text color="accentText">{tryAgainLabel}</Text>
                </Box>
              )}
            </Box>
            <Box align="end">
              <Box direction="row" gap="xsmall" align="center">
                {uploading && <Icon type="loading" />}
                <StyledButton
                  label={insertLabel}
                  onClick={() => handleInsertImage('url')}
                  disabled={!uploadLinkValue}
                  primary={true}
                  color="accent"
                />
              </Box>
            </Box>
          </StyledUploadValueBox>
        </StyledTab>
      </Tabs>
    </StyledDrop>
  );
};

ImagePopover.defaultProps = {
  dropzoneLabel: 'Drop an image or click to upload an image from your computer',
  uploadImageLabel: 'Upload Image',
  byUrlLabel: 'By Url',
  uploadingImageLabel: 'Uploading Image',
  insertLabel: 'Insert',
  uploadFailedLabel: 'Upload failed.',
  fetchImageFailedLabel: 'Sorry, we could not fetch the image.',
  tryAgainLabel: 'Try again.',
};

export { ImagePopover };
