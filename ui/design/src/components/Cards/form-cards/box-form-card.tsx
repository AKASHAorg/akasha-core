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
import { isBase64 } from '../../../utils/string-utils';

export interface IBoxFormCardProps {
  className?: string;
  titleLabel?: string;
  avatarLabel?: string;
  coverImageLabel?: string;
  nameLabel?: string;
  descriptionLabel?: string;
  cancelLabel?: string;
  saveLabel?: string;
  // popover labels
  uploadLabel?: string;
  urlLabel?: string;
  deleteLabel?: string;
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
const getImageSrc = (src?: string) => {
  // assume that the src is either base64 or ipfs CID
  if (src) {
    if (!isBase64(src)) {
      // is probably ipfs CID
      return {
        src,
        prefix: 'https://ipfs.io/ipfs/',
      };
    }
    // maybe return an imageObject?
    // first we must decide on an encoding standard.
    return {
      src,
      prefix: '',
    };
  }
  return {
    src: '',
    prefix: '',
  };
};

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
  const [formChanged, setFormChanged] = React.useState(false);

  const avatarRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  const coverImageRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  const [avatarSrc, setAvatarSrc] = React.useState(getImageSrc(providerData.avatar));
  const [coverImageSrc, setCoverImageSrc] = React.useState(getImageSrc(providerData.coverImage));

  // clashing definitions between react's TextInput and grommet's TextInput
  // leave it as 'any' for now
  const nameInputRef: React.RefObject<any> = React.useRef(null);
  const descriptionInputRef: React.RefObject<any> = React.useRef(null);

  React.useEffect(() => {
    // set the src's only if needed
    if (providerData.avatar) {
      setAvatarSrc(getImageSrc(providerData.avatar));
    }
    if (providerData.coverImage) {
      setCoverImageSrc(getImageSrc(providerData.coverImage));
    }
  }, [providerData.avatar, providerData.coverImage]);

  const handleCopyEthAddress = () => {
    navigator.clipboard.writeText(ethAddress);
  };

  const handleInsertAvatar = (url: string) => {
    setAvatarSrc(getImageSrc(url));
    setFormChanged(true);
  };

  const handleInsertCoverImage = (url: string) => {
    setCoverImageSrc(getImageSrc(url));
    setFormChanged(true);
  };

  const handleAvatarClick = () => {
    setAvatarPopoverOpen(true);
  };

  const handleCoverImageClick = () => {
    setCoverImagePopoverOpen(true);
  };

  const handleCancel = () => {
    // setAvatar(providerData.avatar);
    // setCoverImage(providerData.coverImage);
    // setName(providerData.name);
    // setDescription(providerData.description);
  };

  const handleSave = () => {
    const { name, description, avatar, coverImage, providerName } = props.providerData;
    // make sure we pass the correct 3box schema
    // initially the payload is empty
    const payload: IBoxData = {
      providerName,
    };

    if (nameInputRef.current && nameInputRef.current.value !== name) {
      payload.name = nameInputRef.current.value;
    }

    if (descriptionInputRef.current && descriptionInputRef.current.value !== description) {
      payload.description = descriptionInputRef.current.value;
    }

    if (avatarSrc.src !== avatar) {
      payload.avatar = avatarSrc.src;
    }

    if (coverImageSrc.src !== coverImage) {
      payload.coverImage = coverImageSrc.src;
    }
    handleSubmit(payload);
  };
  const handleNameChange = () => {
    setFormChanged(true);
  };
  const handleDescriptionChange = () => {
    setFormChanged(true);
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
          {!avatarSrc.src && (
            <StyledAvatarPlaceholderDiv onClick={handleAvatarClick} active={avatarPopoverOpen}>
              <Icon type="image" ref={avatarRef} />
            </StyledAvatarPlaceholderDiv>
          )}
          {avatarSrc.src && (
            <StyledAvatarDiv onClick={handleAvatarClick}>
              <StyledImage src={`${avatarSrc.prefix}${avatarSrc.src}`} fit="contain" />
              <StyledAvatarOverlay>
                <Icon type="editSimple" ref={avatarRef} />
              </StyledAvatarOverlay>
            </StyledAvatarDiv>
          )}

          <StyledText color="secondaryText" size="small">
            {coverImageLabel}
          </StyledText>
          {!coverImageSrc.src && (
            <StyledCoverImagePlaceholderDiv
              onClick={handleCoverImageClick}
              active={coverImagePopoverOpen}
            >
              <Icon type="image" ref={coverImageRef} />
            </StyledCoverImagePlaceholderDiv>
          )}
          {coverImageSrc.src && (
            <StyledCoverImageDiv onClick={handleCoverImageClick}>
              <StyledCoverImageOverlay>
                <Icon type="editSimple" ref={coverImageRef} />
              </StyledCoverImageOverlay>
              <StyledImage src={`${coverImageSrc.prefix}${coverImageSrc.src}`} fit="contain" />
            </StyledCoverImageDiv>
          )}

          <FormField
            name="name"
            htmlFor="3box-form-name-input"
            label={
              <StyledText color="secondaryText" size="small">
                {nameLabel}
              </StyledText>
            }
          >
            <TextInput
              id="3box-form-name-input"
              defaultValue={providerData.name}
              placeholder={nameFieldPlaceholder}
              onChange={handleNameChange}
              ref={nameInputRef}
            />
          </FormField>
          <FormField
            name="description"
            htmlFor="3box-form-description-textarea"
            label={
              <StyledText color="secondaryText" size="small">
                {descriptionLabel}
              </StyledText>
            }
          >
            <TextArea
              id="3box-form-description-textarea"
              defaultValue={providerData.description}
              placeholder={descriptionFieldPlaceholder}
              ref={descriptionInputRef}
              onChange={handleDescriptionChange}
            />
          </FormField>

          <Box direction="row" gap="xsmall" justify="end">
            <Button label={cancelLabel} onClick={handleCancel} />
            <Button label={saveLabel} onClick={handleSave} primary={true} disabled={!formChanged} />
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
          currentImage={!!avatarSrc.src}
          handleDeleteImage={() => {
            setAvatarSrc({ prefix: '', src: '' });
            setFormChanged(true);
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
          currentImage={!!coverImageSrc.src}
          handleDeleteImage={() => {
            setCoverImageSrc({ prefix: '', src: '' });
            setFormChanged(true);
          }}
        />
      )}
    </MainAreaCardBox>
  );
};

BoxFormCard.defaultProps = {
  nameLabel: 'Name',
  descriptionLabel: 'About',
  titleLabel: 'Ethereum Address',
  avatarLabel: 'Avatar',
  coverImageLabel: 'Cover Image',
  saveLabel: 'Save',
};

export default BoxFormCard;
