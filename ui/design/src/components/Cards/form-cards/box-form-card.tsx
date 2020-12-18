import { Box, FormField, Text, TextArea, TextInput } from 'grommet';
import * as React from 'react';
import { Button } from '../../Buttons/index';
import { Icon } from '../../Icon/index';
import { FormImagePopover } from '../../Popovers/index';
import Spinner from '../../Spinner';
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
  onSave: (data: any) => void;
  onCancel?: () => void;
  updateStatus: any;
}

export interface IImageSrc {
  src: string | null;
  prefix: string | null;
  preview?: string;
  isUrl: boolean;
}
export interface IBoxData {
  avatar?: string | IImageSrc;
  coverImage?: string | IImageSrc;
  name?: string;
  description?: string;
}
export interface IFormValues {
  avatar?: IImageSrc | null;
  coverImage?: IImageSrc | null;
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
    onSave,
    updateStatus,
  } = props;

  const [avatarPopoverOpen, setAvatarPopoverOpen] = React.useState(false);
  const [coverImagePopoverOpen, setCoverImagePopoverOpen] = React.useState(false);
  const [formChanged, setFormChanged] = React.useState(false);
  const [formValues, setFormValues] = React.useState<IFormValues>({});

  // required for popovers
  const avatarRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  const coverImageRef: React.RefObject<HTMLDivElement> = React.useRef(null);

  React.useEffect(() => {
    const { avatar, coverImage, ...rest } = providerData;
    const images: { avatar?: IImageSrc; coverImage?: IImageSrc } = {};
    if (typeof avatar === 'string') {
      images.avatar = { preview: avatar, src: null, prefix: null, isUrl: true };
    } else if (avatar && avatar.src) {
      images.avatar = avatar;
    }
    if (typeof coverImage === 'string') {
      images.coverImage = { preview: coverImage, src: null, prefix: null, isUrl: true };
    } else if (coverImage && coverImage.src) {
      images.coverImage = coverImage;
    }
    setFormValues(prevValues => ({
      ...prevValues,
      ...rest,
      ...images,
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
    setFormValues({});
    setFormChanged(false);
    if (props.onCancel) {
      props.onCancel();
    }
  };

  const handleSave = () => {
    onSave(formValues);
  };
  const handleFormFieldChange = (newValues: {}) => {
    setFormChanged(true);
    setFormValues(oldValues => ({
      ...oldValues,
      ...newValues,
    }));
  };

  const closeAvatarPopover = () => {
    setAvatarPopoverOpen(false);
  };

  const closeCoverImagePopover = () => {
    setCoverImagePopoverOpen(false);
  };

  const handleImageInsert = (imageKey: string) => (src: string, isUrl: boolean) => {
    if (isUrl) {
      handleFormFieldChange({ [imageKey]: { src, isUrl, preview: src } });
    } else {
      handleFormFieldChange({ [imageKey]: { src, isUrl, preview: URL.createObjectURL(src) } });
    }
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
          {(!formValues.avatar || !formValues.avatar.preview) && (
            <StyledAvatarPlaceholderDiv onClick={handleAvatarClick} active={avatarPopoverOpen}>
              <Icon type="image" ref={avatarRef} />
            </StyledAvatarPlaceholderDiv>
          )}
          {formValues.avatar && (
            <StyledAvatarDiv onClick={handleAvatarClick}>
              <StyledImage src={formValues.avatar.preview} fit="contain" />
              <StyledAvatarOverlay>
                <Icon type="editSimple" ref={avatarRef} />
              </StyledAvatarOverlay>
            </StyledAvatarDiv>
          )}

          <StyledText color="secondaryText" size="small">
            {coverImageLabel}
          </StyledText>
          {(!formValues.coverImage || !formValues.coverImage.preview) && (
            <StyledCoverImagePlaceholderDiv
              onClick={handleCoverImageClick}
              active={coverImagePopoverOpen}
            >
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
              onChange={ev => handleFormFieldChange({ description: ev.target.value })}
              placeholder={descriptionFieldPlaceholder}
            />
          </FormField>
          <Box direction="row" gap="xsmall" justify="end">
            <Button label={cancelLabel} onClick={handleRevert} />
            <Button
              label={updateStatus.saving ? <Spinner style={{ padding: 0 }} size={15} /> : saveLabel}
              onClick={handleSave}
              primary={true}
              disabled={!formChanged}
            />
          </Box>
        </Box>
      </Box>
      {avatarPopoverOpen && avatarRef.current && (
        <FormImagePopover
          uploadLabel={uploadLabel}
          urlLabel={urlLabel}
          deleteLabel={deleteLabel}
          target={avatarRef.current}
          closePopover={closeAvatarPopover}
          insertImage={handleImageInsert('avatar')}
          currentImage={!!formValues.avatar}
          handleDeleteImage={() => handleFormFieldChange({ avatar: null })}
        />
      )}
      {coverImagePopoverOpen && coverImageRef.current && (
        <FormImagePopover
          uploadLabel={uploadLabel}
          urlLabel={urlLabel}
          deleteLabel={deleteLabel}
          target={coverImageRef.current}
          closePopover={closeCoverImagePopover}
          insertImage={handleImageInsert('coverImage')}
          currentImage={!!formValues.coverImage}
          handleDeleteImage={() => handleFormFieldChange({ coverImage: null })}
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
