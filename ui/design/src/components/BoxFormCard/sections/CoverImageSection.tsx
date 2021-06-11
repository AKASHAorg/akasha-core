import React from 'react';

import Icon from '../../Icon';
import { IFormValues } from '../';

import { StyledImageInput } from '../../Editor/styled-editor-box';
import {
  StyledText,
  StyledImage,
  StyledCoverImageDiv,
  StyledCoverImageOverlay,
  StyledCoverImagePlaceholderDiv,
} from '../styled-form-card';

export interface ICoverImageSectionProps {
  coverImageLabel?: string;
  formValues: IFormValues;
  coverImagePopoverOpen: boolean;
  coverImageRef: React.RefObject<HTMLDivElement>;
  coverInputRef: React.RefObject<HTMLInputElement>;
  handleCoverImageClick: () => void;
  handleCoverFileUpload: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}

const CoverImageSection: React.FC<ICoverImageSectionProps> = props => {
  const {
    coverImageLabel,
    formValues,
    coverImagePopoverOpen,
    coverImageRef,
    coverInputRef,
    handleCoverImageClick,
    handleCoverFileUpload,
  } = props;
  return (
    <>
      <StyledText color="secondaryText" size="small" margin={{ top: 'small' }}>
        {coverImageLabel}
      </StyledText>

      {(!formValues.coverImage || !formValues.coverImage.preview) && (
        <StyledCoverImagePlaceholderDiv
          onClick={handleCoverImageClick}
          active={coverImagePopoverOpen}
        >
          <StyledImageInput onChange={handleCoverFileUpload} type="file" ref={coverInputRef} />
          <Icon type="image" ref={coverImageRef} />
        </StyledCoverImagePlaceholderDiv>
      )}

      {formValues.coverImage && formValues.coverImage.preview && (
        <StyledCoverImageDiv onClick={handleCoverImageClick}>
          <StyledCoverImageOverlay>
            <Icon type="editSimple" ref={coverImageRef} />
          </StyledCoverImageOverlay>
          <StyledImage src={formValues.coverImage.preview} fit="contain" />
        </StyledCoverImageDiv>
      )}
    </>
  );
};

export { CoverImageSection };
