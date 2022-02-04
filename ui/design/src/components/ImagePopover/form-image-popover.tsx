import { Box, Text } from 'grommet';
import * as React from 'react';
import {
  StyledBox,
  StyledDeleteBox,
  StyledDrop,
  StyledImageInput,
} from './styled-form-image-popover';
import Icon from '../Icon';
import MobileListModal from '../MobileListModal';

export interface IFormImagePopover {
  uploadLabel?: string;
  urlLabel?: string;
  deleteLabel?: string;
  target: HTMLElement;
  closePopover: () => void;
  insertImage?: (src: File | string, isUrl: boolean) => void;
  currentImage?: boolean;
  onMobile: boolean;
  handleDeleteImage?: () => void;
  modalSlotId: string;
}

const FormImagePopover: React.FC<IFormImagePopover> = props => {
  const {
    uploadLabel,
    deleteLabel,
    target,
    closePopover,
    insertImage,
    currentImage,
    onMobile,
    handleDeleteImage,
    modalSlotId,
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

  if (onMobile) {
    return (
      <>
        <MobileListModal
          modalSlotId={modalSlotId}
          closeModal={closePopover}
          menuItems={[
            {
              label: uploadLabel,
              icon: 'upload',
              handler: (ev: React.SyntheticEvent) => {
                ev.stopPropagation();
                handleUploadInputClick();
              },
            },
            ...(currentImage
              ? [
                  {
                    label: deleteLabel,
                    icon: 'trash',
                    handler: (ev: React.SyntheticEvent) => {
                      ev.stopPropagation();
                      handleDeleteClick();
                    },
                  },
                ]
              : []),
          ]}
        />

        <StyledImageInput
          onChange={handleFileUpload}
          type="file"
          accept="image/*"
          ref={uploadInputRef}
        />
      </>
    );
  }

  return (
    <StyledDrop
      overflow="hidden"
      target={target}
      align={{ top: 'bottom', left: 'left' }}
      onClickOutside={closePopover}
      onEsc={closePopover}
      style={{ zIndex: 999 }}
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
          <StyledImageInput
            onChange={handleFileUpload}
            type="file"
            accept="image/*"
            ref={uploadInputRef}
          />
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
