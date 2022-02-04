import React from 'react';
import { Box } from 'grommet';
import Cropper from 'react-easy-crop';

import Icon from '../../Icon';
import { IFormValues } from '../';

import { StyledImageInput } from '../../Editor/styled-editor-box';
import {
  StyledText,
  StyledAvatarPlaceholderDiv,
  StyledAvatarDiv,
  StyledImage,
  StyledAvatarOverlay,
} from '../styled-form-card';

export type CropValue = { x: number; y: number };

export interface IAvatarSectionProps {
  avatarLabel?: string;
  formValues: IFormValues;
  zoom: number;
  crop: CropValue;
  avatarPopoverOpen: boolean;
  avatarRef: React.RefObject<HTMLDivElement>;
  avatarInputRef: React.RefObject<HTMLInputElement>;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  setCrop: React.Dispatch<React.SetStateAction<CropValue>>;
  onCropComplete: (arg1: Record<string, unknown>, arg2: Record<string, unknown>) => void;
  handleAvatarClick: () => void;
  handleAvatarFileUpload: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}

const AvatarSection: React.FC<IAvatarSectionProps> = props => {
  const {
    avatarLabel,
    formValues,
    zoom,
    crop,
    avatarPopoverOpen,
    avatarRef,
    avatarInputRef,
    setCrop,
    setZoom,
    onCropComplete,
    handleAvatarClick,
    handleAvatarFileUpload,
  } = props;

  return (
    <Box direction="column" flex={{ shrink: 0, grow: 1 }}>
      <StyledText
        style={{ margin: '0.5rem', lineHeight: 2, userSelect: 'none' }}
        color="secondaryText"
        size="small"
        title={avatarLabel}
      >
        {avatarLabel}
      </StyledText>

      {(!formValues.avatar || !formValues.avatar.preview) && (
        <StyledAvatarPlaceholderDiv onClick={handleAvatarClick} active={avatarPopoverOpen}>
          <StyledImageInput
            onChange={handleAvatarFileUpload}
            type="file"
            accept="image/*"
            ref={avatarInputRef}
          />
          <Icon type="image" ref={avatarRef} />
        </StyledAvatarPlaceholderDiv>
      )}
      {formValues.avatar && formValues.avatar.preview && (
        <StyledAvatarDiv onClick={handleAvatarClick}>
          <StyledAvatarOverlay>
            <Icon type="editSimple" ref={avatarRef} />
          </StyledAvatarOverlay>
          {formValues.avatar.preview.startsWith('https://') && formValues.avatar.isUrl ? (
            <StyledImage src={formValues.avatar.preview} fit="contain" />
          ) : (
            <Cropper
              image={formValues.avatar.preview}
              crop={crop}
              zoom={zoom}
              aspect={76 / 76}
              cropShape="round"
              objectFit="contain"
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          )}
        </StyledAvatarDiv>
      )}
    </Box>
  );
};

export { AvatarSection };
