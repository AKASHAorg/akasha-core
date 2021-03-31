import { Box, Text } from 'grommet';
import * as React from 'react';
import { Icon } from '../../Icon/index';
import {
  StyledBox,
  StyledDeleteBox,
  StyledDrop,
  StyledImageInput,
} from './styled-form-image-popover';

export interface IFormImagePopover {
  uploadLabel?: string;
  urlLabel?: string;
  deleteLabel?: string;
  target: HTMLElement;
  closePopover: () => void;
  insertImage?: (src: File | string, isUrl: boolean) => void;
  currentImage?: boolean;
  handleDeleteImage?: () => void;
}

const FormImagePopover: React.FC<IFormImagePopover> = props => {
  const {
    uploadLabel,
    deleteLabel,
    target,
    closePopover,
    insertImage,
    currentImage,
    handleDeleteImage,
  } = props;

  const uploadInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);

  const handleDeleteClick = () => {
    if (handleDeleteImage) handleDeleteImage();
    closePopover();
  };

  const handleUploadInputClick = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.click();
    }
    return;
  };

  const handleFileUpload = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!(ev.target.files && ev.target.files[0])) {
      return;
    }
    const file = ev.target.files[0];
    if (insertImage) {
      insertImage(file, false);
    }
    closePopover();
  };

  return (
    <StyledDrop
      overflow="hidden"
      target={target}
      align={{ top: 'bottom', left: 'left' }}
      onClickOutside={closePopover}
      onEsc={closePopover}
    >
      <Box direction="column" pad="xsmall">
        <StyledBox
          pad={{ left: 'xxsmall' }}
          align="center"
          direction="row"
          gap="xsmall"
          onClick={handleUploadInputClick}
        >
          <Icon type="upload" />
          <Text>{uploadLabel}</Text>
          <StyledImageInput onChange={handleFileUpload} type="file" ref={uploadInputRef} />
        </StyledBox>
        {currentImage && (
          <StyledDeleteBox
            pad={{ left: 'xxsmall' }}
            align="center"
            direction="row"
            gap="xsmall"
            onClick={handleDeleteClick}
          >
            <Icon type="trash" />
            <Text>{deleteLabel}</Text>
          </StyledDeleteBox>
        )}
      </Box>
    </StyledDrop>
  );
};
FormImagePopover.defaultProps = {
  uploadLabel: 'Upload',
  urlLabel: 'By URL',
  deleteLabel: 'Delete',
};
export { FormImagePopover };
