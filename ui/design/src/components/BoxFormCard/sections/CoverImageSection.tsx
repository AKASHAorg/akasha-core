import React from 'react';
import Cropper from 'react-easy-crop';

import Icon from '../../Icon';

import { IFormValues } from '../';
import {
  StyledText,
  StyledImage,
  StyledCoverImageDiv,
  StyledCoverImageOverlay,
  StyledCoverImagePlaceholderDiv,
} from '../styled-form-card';
import { StyledImageInput } from '../../Editor/styled-editor-box';

type CropValue = { x: number; y: number };

export interface ICoverImageSectionProps {
  coverImageLabel?: string;
  formValues: IFormValues;
  zoom: number;
  crop: CropValue;
  coverImagePopoverOpen: boolean;
  coverImageRef: React.RefObject<HTMLDivElement>;
  coverInputRef: React.RefObject<HTMLInputElement>;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setCrop: React.Dispatch<React.SetStateAction<CropValue>>;
  onCropComplete: (arg1: Record<string, unknown>, arg2: Record<string, unknown>) => void;
  handleCoverImageClick: () => void;
  handleCoverFileUpload: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}

const CoverImageSection: React.FC<ICoverImageSectionProps> = props => {
  const {
    coverImageLabel,
    formValues,
    zoom,
    crop,
    coverImagePopoverOpen,
    coverImageRef,
    coverInputRef,
    setCrop,
    setZoom,
    onCropComplete,
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
          {/* if cover image is loaded from profile, show initial component, else if an uploaded file, show cropper component */}
          {formValues.coverImage.preview.includes('https://') && formValues.coverImage.isUrl ? (
            <StyledImage src={formValues.coverImage.preview} fit="contain" />
          ) : (
            <Cropper
              image={formValues.coverImage.preview}
              crop={crop}
              zoom={zoom}
              // taking aspect ratio from dimensions of parent div
              aspect={518.25 / 144}
              objectFit="horizontal-cover"
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          )}
        </StyledCoverImageDiv>
      )}
    </>
  );
};

export { CoverImageSection };
