import React, { SetStateAction } from 'react';
import styled from 'styled-components';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';
import { Box, Text } from 'grommet';

import Button from '../Button';
import Icon from '../Icon';
import Spinner from '../Spinner';
import { BaseImageDiv } from '../BoxFormCard/styled-form-card';

export type CropValue = { x: number; y: number };

export interface IImageCropperProps {
  hasPadding?: boolean;
  subtitleLabel: string;
  cancelCroppingLabel: string;
  saveCropLabel: string;
  imgSrc: { url?: string; fallbackUrl?: string };
  imgCrop: CropValue;
  imgZoom: number;
  minZoom: number;
  maxZoom: number;
  zoomStep: number;
  isLoading: boolean;
  setImgCrop: React.Dispatch<SetStateAction<CropValue>>;
  setImgZoom: React.Dispatch<SetStateAction<number>>;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  onZoomInClick: () => void;
  onZoomOutClick: () => void;
  onSaveCrop: () => void;
  onRevertCropping: () => void;
}

export const StyledCropperImageWrapper = styled(BaseImageDiv)`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 15rem;
  border-radius: ${props => props.theme.shapes.borderRadius};
`;

export const StyledZoomControlBox = styled(Box)`
  flex-direction: row;
  cursor: pointer;
`;

const ImageCropper: React.FC<IImageCropperProps> = props => {
  const {
    hasPadding = true,
    subtitleLabel,
    cancelCroppingLabel,
    saveCropLabel,
    imgSrc,
    imgCrop,
    imgZoom,
    minZoom,
    maxZoom,
    zoomStep,
    isLoading,
    setImgCrop,
    setImgZoom,
    onCropComplete,
    onZoomInClick,
    onZoomOutClick,
    onSaveCrop,
    onRevertCropping,
  } = props;
  return (
    <Box direction="column" pad={hasPadding ? 'medium' : ''} height={{ min: 'fit-content' }}>
      <StyledCropperImageWrapper>
        <Cropper
          image={imgSrc.url || imgSrc.fallbackUrl}
          crop={imgCrop}
          zoom={imgZoom}
          aspect={1344 / 288}
          objectFit={'horizontal-cover'}
          onCropChange={setImgCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setImgZoom}
        />
      </StyledCropperImageWrapper>
      <Text size="medium" textAlign="center" margin={{ bottom: 'large' }}>
        {subtitleLabel}
      </Text>
      <StyledZoomControlBox margin={{ bottom: 'xlarge' }}>
        <Icon type="zoomOutAlt" onClick={onZoomOutClick} />
        <input
          type="range"
          value={imgZoom}
          min={minZoom}
          max={maxZoom}
          step={zoomStep}
          aria-labelledby="Zoom"
          onChange={e => setImgZoom(Number(e.target.value))}
          style={{ flex: 'auto', cursor: 'pointer' }}
        />
        <Icon type="zoomInAlt" onClick={onZoomInClick} />
      </StyledZoomControlBox>
      <Box direction="row" gap="xsmall" justify="end">
        <Button label={cancelCroppingLabel} onClick={onRevertCropping} />
        <Button
          label={isLoading ? <Spinner style={{ padding: 0 }} size={15} /> : saveCropLabel}
          onClick={onSaveCrop}
          primary={true}
        />
      </Box>
    </Box>
  );
};

export default ImageCropper;
