import { Box, FormField, Text, TextArea, TextInput } from 'grommet';
import * as React from 'react';
import { Button } from '../../Buttons/index';
import { Icon } from '../../Icon/index';
import { FormImagePopover } from '../../Popovers/index';
import { MainAreaCardBox } from '../common/basic-card-box';
import {
  StyledAvatarDiv,
  StyledAvatarOverlay,
  StyledAvatarPlaceholderDiv,
  StyledCoverImageDiv,
  StyledCoverImageOverlay,
  StyledCoverImagePlaceholderDiv,
  StyledImage,
  StyledText,
} from './styled-form-card';

export interface IBoxFormCardProps {
  className?: string;
  titleLabel: string;
  avatarLabel: string;
  coverImageLabel: string;
  nameLabel: string;
  descriptionLabel: string;
  cancelLabel: string;
  saveLabel: string;
  // popover labels
  uploadLabel: string;
  urlLabel: string;
  deleteLabel: string;
  // props
  nameFieldPlaceholder: string;
  descriptionFieldPlaceholder: string;
  ethAddress: string;
  providerData: IBoxData;
  handleSubmit: (data: IBoxData) => void;
}

export interface IBoxData {
  providerName: string;
  avatar?: string;
  coverImage?: string;
  name?: string;
  description?: string;
}

const BoxFormCard: React.FC<IBoxFormCardProps> = props => {
  const {
    className,
    titleLabel,
    avatarLabel,
    coverImageLabel,
    nameLabel,
    descriptionLabel,
    cancelLabel,
    saveLabel,
    uploadLabel,
    urlLabel,
    deleteLabel,
    nameFieldPlaceholder,
    descriptionFieldPlaceholder,
    ethAddress,
    providerData,
    handleSubmit,
  } = props;

  const [avatarPopoverOpen, setAvatarPopoverOpen] = React.useState(false);
  const [coverImagePopoverOpen, setCoverImagePopoverOpen] = React.useState(false);

  const [avatar, setAvatar] = React.useState(providerData.avatar);
  const [coverImage, setCoverImage] = React.useState(providerData.coverImage);
  const [name, setName] = React.useState(providerData.name);
  const [description, setDescription] = React.useState(providerData.description);

  const avatarRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  const coverImageRef: React.RefObject<HTMLDivElement> = React.useRef(null);

  const handleCopyEthAddress = () => {
    navigator.clipboard.writeText(ethAddress);
  };

  const handleInsertAvatar = (url: string) => {
    setAvatar(url);
  };

  const handleInsertCoverImage = (url: string) => {
    setCoverImage(url);
  };

  const handleAvatarClick = () => {
    setAvatarPopoverOpen(true);
  };

  const handleCoverImageClick = () => {
    setCoverImagePopoverOpen(true);
  };

  const handleCancel = () => {
    setAvatar(providerData.avatar);
    setCoverImage(providerData.coverImage);
    setName(providerData.name);
    setDescription(providerData.description);
  };

  const handleSave = () => {
    handleSubmit({
      avatar,
      coverImage,
      name,
      description,
      providerName: providerData.providerName,
    });
  };

  return (
    <MainAreaCardBox className={className}>
      <Box direction="column" pad="medium">
        <Box direction="column" pad="xsmall">
          <Text weight="bold"> {titleLabel}</Text>
          <Box direction="row" gap="xxsmall" pad={{ bottom: 'xsmall' }} align="center">
            <Text color="secondaryText">{ethAddress}</Text>
            <Icon type="copy" onClick={handleCopyEthAddress} clickable={true} />
          </Box>
        </Box>
        <Box direction="column" pad="xsmall">
          <StyledText color="secondaryText" size="small">
            {avatarLabel}
          </StyledText>
          {!avatar && (
            <StyledAvatarPlaceholderDiv onClick={handleAvatarClick} active={avatarPopoverOpen}>
              <Icon type="image" ref={avatarRef} />
            </StyledAvatarPlaceholderDiv>
          )}
          {avatar && (
            <StyledAvatarDiv onClick={handleAvatarClick}>
              <StyledImage src={avatar} fit="contain" />
              <StyledAvatarOverlay>
                <Icon type="editSimple" ref={avatarRef} />
              </StyledAvatarOverlay>
            </StyledAvatarDiv>
          )}

          <StyledText color="secondaryText" size="small">
            {coverImageLabel}
          </StyledText>
          {!coverImage && (
            <StyledCoverImagePlaceholderDiv
              onClick={handleCoverImageClick}
              active={coverImagePopoverOpen}
            >
              <Icon type="image" ref={coverImageRef} />
            </StyledCoverImagePlaceholderDiv>
          )}
          {coverImage && (
            <StyledCoverImageDiv onClick={handleCoverImageClick}>
              <StyledCoverImageOverlay>
                <Icon type="editSimple" ref={coverImageRef} />
              </StyledCoverImageOverlay>
              <StyledImage src={coverImage} fit="contain" />
            </StyledCoverImageDiv>
          )}

          <FormField
            name="name"
            htmlFor="text-input"
            label={
              <StyledText color="secondaryText" size="small">
                {nameLabel}
              </StyledText>
            }
          >
            <TextInput
              id="text-input"
              value={name}
              onChange={ev => {
                setName(ev.target.value);
              }}
              placeholder={nameFieldPlaceholder}
            />
          </FormField>
          <FormField
            name="description"
            htmlFor="text-area"
            label={
              <StyledText color="secondaryText" size="small">
                {descriptionLabel}
              </StyledText>
            }
          >
            <TextArea
              id="text-area"
              value={description}
              onChange={ev => {
                setDescription(ev.target.value);
              }}
              placeholder={descriptionFieldPlaceholder}
            />
          </FormField>

          <Box direction="row" gap="xsmall" justify="end">
            <Button label={cancelLabel} onClick={handleCancel} />
            <Button label={saveLabel} onClick={handleSave} primary={true} />
          </Box>
        </Box>
      </Box>
      {avatarPopoverOpen && avatarRef.current && (
        <FormImagePopover
          uploadLabel={uploadLabel}
          urlLabel={urlLabel}
          deleteLabel={deleteLabel}
          target={avatarRef.current}
          closePopover={() => {
            setAvatarPopoverOpen(false);
          }}
          insertImage={handleInsertAvatar}
          currentImage={!!avatar}
          handleDeleteImage={() => {
            setAvatar('');
          }}
        />
      )}
      {coverImagePopoverOpen && coverImageRef.current && (
        <FormImagePopover
          uploadLabel={uploadLabel}
          urlLabel={urlLabel}
          deleteLabel={deleteLabel}
          target={coverImageRef.current}
          closePopover={() => {
            setCoverImagePopoverOpen(false);
          }}
          insertImage={handleInsertCoverImage}
          currentImage={!!coverImage}
          handleDeleteImage={() => {
            setCoverImage('');
          }}
        />
      )}
    </MainAreaCardBox>
  );
};

export default BoxFormCard;
