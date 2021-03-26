import { Box, FormField, Text, TextArea, TextInput } from 'grommet';
import * as React from 'react';
import { isMobile } from 'react-device-detect';
import { Button } from '../../Buttons/index';
import { Icon } from '../../Icon/index';
import { StyledLayer } from '../../Modals/common/styled-modal';
import { StyledImageInput } from '../../Popovers/image/styled-form-image-popover';
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
  StyledTextInput,
} from './styled-form-card';

export interface IBoxFormCardProps {
  className?: string;
  titleLabel?: string;
  avatarLabel?: string;
  coverImageLabel?: string;
  nameLabel?: string;
  usernameLabel?: string;
  descriptionLabel?: string;
  cancelLabel?: string;
  saveLabel?: string;
  // popover labels
  uploadLabel?: string;
  urlLabel?: string;
  deleteLabel?: string;
  // props
  nameFieldPlaceholder: string;
  usernameFieldPlaceholder?: string;
  descriptionFieldPlaceholder: string;
  ethAddress: string;
  providerData: IBoxData;
  onSave: (data: any) => void;
  onCancel?: () => void;
  updateStatus: any;
  usernameFieldInfo?: string;
  showUsername?: boolean;
  isValidatingUsername?: boolean;
  usernameError?: string;
  usernameSuccess?: string;
  onUsernameChange?: (value: string) => void;
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
  default?: any[];
}
export interface IFormValues {
  avatar?: IImageSrc | null;
  coverImage?: IImageSrc | null;
  name?: string;
  userName?: string;
  description?: string;
}

const BoxFormCard: React.FC<IBoxFormCardProps> = props => {
  const {
    className,
    titleLabel,
    avatarLabel,
    coverImageLabel,
    nameLabel,
    usernameLabel,
    descriptionLabel,
    cancelLabel,
    saveLabel,
    uploadLabel,
    urlLabel,
    deleteLabel,
    nameFieldPlaceholder,
    usernameFieldPlaceholder,
    descriptionFieldPlaceholder,
    isValidatingUsername,
    // ethAddress,
    providerData,
    onSave,
    updateStatus,
    showUsername,
    usernameFieldInfo,
    usernameError,
    usernameSuccess,
  } = props;

  const [avatarPopoverOpen, setAvatarPopoverOpen] = React.useState(false);
  const [coverImagePopoverOpen, setCoverImagePopoverOpen] = React.useState(false);
  const [formChanged, setFormChanged] = React.useState(false);
  const [formValues, setFormValues] = React.useState<IFormValues>({});

  // required for popovers
  const avatarRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  const coverImageRef: React.RefObject<HTMLDivElement> = React.useRef(null);

  const avatarInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);
  const coverInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);

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
    let userName: string | undefined;
    if (providerData && providerData.default) {
      const provider = providerData.default.find(
        p => p.property === 'userName' && p.provider === 'ewa.providers.basic',
      );
      if (provider) {
        userName = provider.value;
      }
    }
    setFormValues(prevValues => ({
      ...prevValues,
      ...rest,
      ...images,
      userName,
    }));
  }, [JSON.stringify(providerData)]);

  const handleAvatarClick = () => {
    const avatarInput = avatarInputRef.current;
    if (!formValues.avatar && avatarInput) {
      return avatarInput.click();
    }
    setAvatarPopoverOpen(true);
  };

  const handleCoverImageClick = () => {
    const coverInput = coverInputRef.current;
    if (!formValues.coverImage && coverInput) {
      return coverInput.click();
    }
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

  const handleUsernameChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    handleFormFieldChange({ userName: ev.target.value });
    if (props.onUsernameChange) {
      props.onUsernameChange(ev.target.value);
    }
  };

  const handleAvatarFileUpload = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!(ev.target.files && ev.target.files[0])) {
      return;
    }
    const file: any = ev.target.files[0];
    handleImageInsert('avatar')(file, false);
  };

  const handleCoverFileUpload = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!(ev.target.files && ev.target.files[0])) {
      return;
    }
    const file: any = ev.target.files[0];
    handleImageInsert('coverImage')(file, false);
  };

  const renderIcon = () => {
    if (isValidatingUsername) {
      return <Icon type="loading" />;
    }
    if (usernameError) {
      return <Icon type="error" />;
    }
    if (usernameSuccess) {
      return <Icon type="check" accentColor={true} />;
    }
    return;
  };

  return (
    <StyledLayer className={className}>
      <MainAreaCardBox style={{ height: isMobile ? '100%' : 'auto', overflowY: 'auto' }}>
        <Box direction="column" pad="medium" height={{ min: 'fit-content' }}>
          <Box direction="column" pad="xsmall">
            <Text
              size="large"
              textAlign="center"
              style={{ userSelect: 'none', paddingBottom: '1.5em' }}
            >
              {titleLabel}
            </Text>
          </Box>
          <Box direction="column" pad="xsmall">
            <Box direction="row" justify="start">
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
                  <StyledAvatarPlaceholderDiv
                    onClick={handleAvatarClick}
                    active={avatarPopoverOpen}
                  >
                    <StyledImageInput
                      onChange={handleAvatarFileUpload}
                      type="file"
                      ref={avatarInputRef}
                    />
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
              </Box>
              <Box
                justify="start"
                fill="horizontal"
                flex={{ shrink: 1, grow: 1 }}
                margin={{ left: '0.5em' }}
              >
                <FormField
                  name="name"
                  htmlFor="form-name-input"
                  contentProps={{ margin: { left: '1em' } }}
                  label={
                    <StyledText
                      size="small"
                      color="secondaryText"
                      style={{ verticalAlign: 'text-top', userSelect: 'none' }}
                    >
                      {nameLabel} <Text color="accent">*</Text>
                    </StyledText>
                  }
                >
                  <TextInput
                    id="form-name-input"
                    name="name"
                    value={formValues.name}
                    onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                      handleFormFieldChange({ name: ev.target.value })
                    }
                    placeholder={nameFieldPlaceholder}
                    required={true}
                    size="large"
                    style={{
                      width: '100%',
                      padding: '1em 0',
                    }}
                  />
                </FormField>
              </Box>
            </Box>
            {showUsername && (
              <Box pad={{ top: 'small' }} justify="start" fill="horizontal">
                <Box direction="row" align="center">
                  <StyledText
                    size="small"
                    margin={{ bottom: '0.5em', left: '0' }}
                    color="secondaryText"
                    style={{ userSelect: 'none' }}
                  >
                    {usernameLabel} <Text color="accent">*</Text>
                  </StyledText>
                </Box>
                <FormField
                  name="name"
                  htmlFor="username-input"
                  info={
                    usernameError ? (
                      <Text color="errorText" style={{ fontSize: '0.75em' }}>
                        {usernameError}
                      </Text>
                    ) : (
                      <Text color="secondaryText" style={{ fontSize: '0.6em' }}>
                        {usernameFieldInfo}
                      </Text>
                    )
                  }
                >
                  <Box justify="between" direction="row">
                    <Box fill="horizontal" direction="row" align="center">
                      {'@'}
                      <StyledTextInput
                        spellCheck={false}
                        computedWidth={'100%'}
                        id="username-input"
                        required={true}
                        value={formValues.userName}
                        onChange={handleUsernameChange}
                        placeholder={usernameFieldPlaceholder}
                      />
                    </Box>
                    {renderIcon()}
                  </Box>
                </FormField>
              </Box>
            )}
            <StyledText color="secondaryText" size="small" margin={{ top: 'small' }}>
              {coverImageLabel}
            </StyledText>

            {(!formValues.coverImage || !formValues.coverImage.preview) && (
              <StyledCoverImagePlaceholderDiv
                onClick={handleCoverImageClick}
                active={coverImagePopoverOpen}
              >
                <StyledImageInput
                  onChange={handleCoverFileUpload}
                  type="file"
                  ref={coverInputRef}
                />
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
            <Box direction="column" margin={{ top: 'small' }}>
              <StyledText
                size="small"
                margin={{ bottom: '0.5em', left: '0' }}
                color="secondaryText"
                style={{ userSelect: 'none' }}
              >
                {descriptionLabel}
              </StyledText>
              <FormField name="description" htmlFor="form-description-textarea">
                <TextArea
                  resize="vertical"
                  size="large"
                  rows={3}
                  style={{ padding: 0 }}
                  id="form-description-textarea"
                  name="description"
                  value={formValues.description}
                  onChange={ev => handleFormFieldChange({ description: ev.target.value })}
                  placeholder={descriptionFieldPlaceholder}
                />
              </FormField>
            </Box>
            <Box direction="row" gap="xsmall" justify="end">
              {!showUsername && <Button label={cancelLabel} onClick={handleRevert} />}
              <Button
                label={
                  updateStatus.saving ? <Spinner style={{ padding: 0 }} size={15} /> : saveLabel
                }
                onClick={handleSave}
                primary={true}
                disabled={
                  !formChanged || (!formValues.userName && showUsername) || !formValues.name
                }
              />
            </Box>
          </Box>
        </Box>

        {avatarPopoverOpen && avatarRef.current && formValues.avatar && (
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

        {coverImagePopoverOpen && coverImageRef.current && formValues.coverImage && (
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
    </StyledLayer>
  );
};

BoxFormCard.defaultProps = {
  nameLabel: 'Name',
  usernameLabel: 'Username',
  usernameFieldPlaceholder: 'username',
  usernameFieldInfo:
    'Your username identifies you in Ethereum World. Once you choose one, you won’t be able to change it.',
  descriptionLabel: 'About',
  titleLabel: 'Ethereum Address',
  avatarLabel: 'Avatar',
  coverImageLabel: 'Cover Image',
  saveLabel: 'Save',
};

export default BoxFormCard;
