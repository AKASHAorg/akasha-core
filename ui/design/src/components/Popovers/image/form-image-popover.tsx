import { Box, Text } from 'grommet';
import * as React from 'react';
import {
  StyledBox,
  StyledDeleteBox,
  StyledDrop,
  StyledImageInput,
} from './styled-form-image-popover';
import Icon from '../../Icon';
import { MobileListModal } from '../../Modals';
import { StyledDropAlt } from '../../EntryCard/styled-entry-box';

export interface IFormImagePopover {
  uploadLabel?: string;
  urlLabel?: string;
  deleteLabel?: string;
  target: HTMLElement;
  closePopover: () => void;
  insertImage?: (src: File | string, isUrl: boolean) => void;
  currentImage?: boolean;
  onMobile: any;
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
    onMobile,
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

  if (onMobile) {
    return (
      <>
        <StyledDropAlt>
          <MobileListModal
            closeModal={closePopover}
            menuItems={[
              {
                label: uploadLabel,
                icon: 'upload',
                handler: () => {
                  handleUploadInputClick();
                  closePopover();
                },
              },
              ...(currentImage
                ? [
                    {
                      label: deleteLabel,
                      icon: 'trash',
                      handler: () => {
                        handleDeleteClick();
                        closePopover();
                      },
                    },
                  ]
                : []),
            ]}
          />
        </StyledDropAlt>
        <StyledImageInput onChange={handleFileUpload} type="file" ref={uploadInputRef} />
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
