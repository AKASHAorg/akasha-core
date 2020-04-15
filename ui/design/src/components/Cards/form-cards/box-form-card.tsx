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
  const [formValues, setFormValues] = React.useState(props.providerData);

  // required for popovers
  const avatarRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  const coverImageRef: React.RefObject<HTMLDivElement> = React.useRef(null);

  React.useEffect(() => {
    setFormValues(prevValues => ({
      ...prevValues,
      ...providerData,
    }));
  }, [JSON.stringify(providerData)]);

  const handleCopyEthAddress = () => {
    navigator.clipboard.writeText(ethAddress);
  };

  const handleAvatarClick = () => {
    setAvatarPopoverOpen(true);
  };

  const handleCoverImageClick = () => {
    setCoverImagePopoverOpen(true);
  };

  const handleRevert = () => {
    setFormValues(props.providerData);
    setFormChanged(false);
  };

  const handleSave = () => {
    handleSubmit(formValues);
  };
  const handleFormFieldChange = (newValues: {}) => {
    setFormChanged(true);
    setFormValues(oldValues => ({
      ...oldValues,
      ...newValues,
    }));
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
          {!formValues.avatar && (
            <StyledAvatarPlaceholderDiv onClick={handleAvatarClick} active={avatarPopoverOpen}>
              <Icon type="image" ref={avatarRef} />
            </StyledAvatarPlaceholderDiv>
          )}
          {formValues.avatar && (
            <StyledAvatarDiv onClick={handleAvatarClick}>
              <StyledImage
                src={`${getImageSrc(formValues.avatar).prefix}${
                  getImageSrc(formValues.avatar).src
                }`}
                fit="contain"
              />
              <StyledAvatarOverlay>
                <Icon type="editSimple" ref={avatarRef} />
              </StyledAvatarOverlay>
            </StyledAvatarDiv>
          )}

          <StyledText color="secondaryText" size="small">
            {coverImageLabel}
          </StyledText>
          {!formValues.coverImage && (
            <StyledCoverImagePlaceholderDiv
              onClick={handleCoverImageClick}
              active={coverImagePopoverOpen}
            >
              <Icon type="image" ref={coverImageRef} />
            </StyledCoverImagePlaceholderDiv>
          )}
          {formValues.coverImage && (
            <StyledCoverImageDiv onClick={handleCoverImageClick}>
              <StyledCoverImageOverlay>
                <Icon type="editSimple" ref={coverImageRef} />
              </StyledCoverImageOverlay>
              <StyledImage
                src={`${getImageSrc(formValues.coverImage).prefix}${
                  getImageSrc(formValues.coverImage).src
                }`}
                fit="contain"
              />
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
              name="name"
              value={formValues.name}
              onChange={(ev: any) => handleFormFieldChange({ name: ev.target.value })}
              placeholder={nameFieldPlaceholder}
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
              name="description"
              value={formValues.description}
              // tslint:disable-next-line: no-console
              onChange={ev => handleFormFieldChange({ description: ev.target.value })}
              placeholder={descriptionFieldPlaceholder}
            />
          </FormField>
          <Box direction="row" gap="xsmall" justify="end">
            <Button label={cancelLabel} onClick={handleRevert} disabled={!formChanged} />
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
          insertImage={(url: string) => handleFormFieldChange({ avatar: url })}
          currentImage={!!formValues.avatar}
          handleDeleteImage={() => handleFormFieldChange({ avatar: undefined })}
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
          insertImage={(url: string) => handleFormFieldChange({ coverImage: url })}
          currentImage={!!formValues.coverImage}
          handleDeleteImage={() => handleFormFieldChange({ coverImage: undefined })}
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
