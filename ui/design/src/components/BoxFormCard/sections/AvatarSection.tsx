import React from 'react';
import { Box } from 'grommet';

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

export interface IAvatarSectionProps {
  avatarLabel?: string;
  formValues: IFormValues;
  avatarPopoverOpen: boolean;
  avatarRef: React.RefObject<HTMLDivElement>;
  avatarInputRef: React.RefObject<HTMLInputElement>;
  handleAvatarClick: () => void;
  handleAvatarFileUpload: (ev: React.ChangeEvent<HTMLInputElement>) => void;
}

const AvatarSection: React.FC<IAvatarSectionProps> = props => {
  const {
    avatarLabel,
    formValues,
    avatarPopoverOpen,
    avatarRef,
    avatarInputRef,
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
          <StyledImageInput onChange={handleAvatarFileUpload} type="file" ref={avatarInputRef} />
          <Icon type="image" ref={avatarRef} />
        </StyledAvatarPlaceholderDiv>
      )}
      {formValues.avatar && formValues.avatar.preview && (
        <StyledAvatarDiv onClick={handleAvatarClick}>
          <StyledImage src={formValues.avatar.preview} fit="contain" />
          <StyledAvatarOverlay>
            <Icon type="editSimple" ref={avatarRef} />
          </StyledAvatarOverlay>
        </StyledAvatarDiv>
      )}
    </Box>
  );
};

export { AvatarSection };
