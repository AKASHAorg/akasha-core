import * as React from 'react';
import { Box, Text } from 'grommet';
import Cropper from 'react-easy-crop';
import { isMobile, isMobileOnly } from 'react-device-detect';
import {
  IProfileData,
  ProfileProviderProperties,
  ProfileProviders,
  UpdateProfileStatus,
} from '@akashaorg/ui-awf-typings/lib/profile';

import { TitleSection } from './sections/TitleSection';
import { AvatarSection } from './sections/AvatarSection';
import { NameInputSection } from './sections/NameInputSection';
import { CoverImageSection } from './sections/CoverImageSection';
import { DescriptionSection } from './sections/DescriptionSection';
import { ActionButtonsSection } from './sections/ActionButtonsSection';
import { UsernameInputSection } from './sections/UsernameInputSection';

import Icon from '../Icon';
import { FormImagePopover } from '../ImagePopover/form-image-popover';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';

import useBodyScrollLock from '../../utils/use-body-scroll-lock';
import getCroppedImage from '../../utils/get-cropped-image';

import { StyledCropperImageWrapper, StyledZoomControlBox } from './styled-form-card';

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
  editLabel?: string;
  editImageSubtitle?: string;
  deleteLabel?: string;
  // props
  nameFieldPlaceholder: string;
  usernameFieldPlaceholder?: string;
  descriptionFieldPlaceholder: string;
  ethAddress: string;
  providerData: IBoxData;
  onSave: (data: IFormValues, changedFields: string[]) => void;
  onCancel?: () => void;
  updateStatus: UpdateProfileStatus;
  usernameFieldInfo?: string;
  showUsername?: boolean;
  isValidatingUsername?: boolean;
  usernameError?: string;
  usernameSuccess?: string;
  onUsernameChange?: (value: string) => void;
  onUsernameBlur?: (username: string) => void;
  modalSlotId: string;
}

export interface IImageSrc {
  src: { url?: string; fallbackUrl?: string } | null;
  type?: string;
  prefix: string | null;
  preview?: string;
  isUrl: boolean;
}
export interface IBoxData {
  avatar?: IProfileData['avatar'];
  coverImage?: IProfileData['coverImage'];
  name?: string;
  description?: string;
  default?: { provider: string; property: string; value: string }[];
  userName?: string;
  ethAddress: string;
  pubKey: string;
}
export interface IFormValues {
  avatar?: IImageSrc | null;
  coverImage?: IImageSrc | null;
  name?: string;
  userName?: string;
  description?: string;
  pubKey: string;
  ethAddress: string;
}

export type CroppableFields =
  | ProfileProviderProperties.AVATAR
  | ProfileProviderProperties.COVER_IMAGE;

export type CropValue = { x: number; y: number };

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
    editLabel,
    editImageSubtitle,
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
    modalSlotId,
  } = props;

  const [avatarPopoverOpen, setAvatarPopoverOpen] = React.useState(false);
  const [coverImagePopoverOpen, setCoverImagePopoverOpen] = React.useState(false);
  const [fieldsToUpdate, setFieldsToUpdate] = React.useState<string[]>([]);
  const [formValues, setFormValues] = React.useState<IFormValues>({
    avatar: { src: { url: '', fallbackUrl: '' }, prefix: null, isUrl: false },
    coverImage: { src: { url: '', fallbackUrl: '' }, prefix: null, isUrl: false },
    userName: '',
    description: '',
    name: '',
    pubKey: '',
    ethAddress: '',
  });

  // state values to handle image cropping
  const [avatarCrop, setAvatarCrop] = React.useState<CropValue>({
    x: 0,
    y: 0,
  });
  const [coverImageCrop, setCoverImageCrop] = React.useState<CropValue>({
    x: 0,
    y: 0,
  });
  const [avatarZoom, setAvatarZoom] = React.useState<number>(1);
  const [coverImageZoom, setCoverImageZoom] = React.useState<number>(1);
  const [showCropper, setShowCropper] = React.useState<CroppableFields>(null);
  const [avatarRotation /* setAvatarRotation */] = React.useState<number>(0);
  const [coverImageRotation /* setCoverImageRotation */] = React.useState<number>(0);
  const [avatarCroppedAreaPixels, setAvatarCroppedAreaPixels] = React.useState(null);
  const [coverImageCroppedAreaPixels, setCoverImageCroppedAreaPixels] = React.useState(null);
  const [avatarSrc, setAvatarSrc] = React.useState<{ url?: string; fallbackUrl?: string }>(null);
  const [coverImageSrc, setCoverImageSrc] =
    React.useState<{ url?: string; fallbackUrl?: string }>(null);

  const isEditingAvatar = showCropper === ProfileProviderProperties.AVATAR;

  // predefined zoom values
  const minZoom = 1;
  const maxZoom = 3;
  const zoomStep = 0.01;

  // required for popovers
  const avatarRef: React.RefObject<HTMLDivElement> = React.useRef(null);
  const coverImageRef: React.RefObject<HTMLDivElement> = React.useRef(null);

  const avatarInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);
  const coverInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);
  useBodyScrollLock();
  // Update internal state based on providerData prop
  React.useEffect(() => {
    const updatedFields = {};
    for (const key in providerData) {
      if (providerData.hasOwnProperty(key)) {
        // transform null values to empty strings
        if (!providerData[key]) {
          updatedFields[key] = '';
        } else {
          updatedFields[key] = providerData[key];
        }
        if (key === ProfileProviderProperties.AVATAR) {
          if (providerData[key] && typeof providerData[key] === 'object') {
            updatedFields[key] = {
              preview: providerData[key].url,
              prefix: '',
              isUrl: true,
            };
          }
        }
        if (key === ProfileProviderProperties.COVER_IMAGE) {
          if (providerData[key] && typeof providerData[key] === 'object') {
            updatedFields[key] = {
              preview: providerData[key].url,
              prefix: '',
              isUrl: true,
            };
          }
        }
        if (key === ProfileProviderProperties.USERNAME) {
          if (providerData.userName) {
            updatedFields[key] = providerData.userName;
          } else if (providerData.default && providerData.default.length > 0) {
            const userNameProvider = providerData.default.find(
              p =>
                p.property === ProfileProviderProperties.USERNAME &&
                p.provider === ProfileProviders.EWA_BASIC,
            );
            updatedFields[key] = userNameProvider ? userNameProvider.value : '';
          }
        }
      }
    }
    setFormValues({
      ...updatedFields,
      ethAddress: providerData.ethAddress,
      pubKey: providerData.pubKey,
    });
  }, [providerData]);

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

  const handleEdit = (field: CroppableFields) => setShowCropper(field);

  /* resets all state values required for cropping */
  const resetCropperFields = () => {
    // reset crop values
    setAvatarCrop({ x: 0, y: 0 });
    setCoverImageCrop({ x: 0, y: 0 });
    // reset zoom values
    setAvatarZoom(1);
    setCoverImageZoom(1);
    // reset cropped area values
    setAvatarCroppedAreaPixels(null);
    setCoverImageCroppedAreaPixels(null);

    // close modal
    setShowCropper(null);
  };

  const onAvatarCropComplete = React.useCallback((_, croppedAreaPixels) => {
    setAvatarCroppedAreaPixels(croppedAreaPixels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCoverImageCropComplete = React.useCallback((_, croppedAreaPixels) => {
    setCoverImageCroppedAreaPixels(croppedAreaPixels);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCropAvatar = React.useCallback(async () => {
    try {
      const [cropped] = await getCroppedImage(
        avatarSrc.url || avatarSrc.fallbackUrl,
        avatarCroppedAreaPixels,
        avatarRotation,
        formValues.avatar.type,
      );

      handleImageInsert(ProfileProviderProperties.AVATAR)(cropped, false);

      resetCropperFields();
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatarCroppedAreaPixels, avatarRotation]);

  const handleCropCoverImage = React.useCallback(async () => {
    try {
      const [cropped] = await getCroppedImage(
        coverImageSrc.url || coverImageSrc.fallbackUrl,
        coverImageCroppedAreaPixels,
        coverImageRotation,
        formValues.coverImage.type,
      );

      handleImageInsert(ProfileProviderProperties.COVER_IMAGE)(cropped, false);

      resetCropperFields();
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coverImageCroppedAreaPixels, coverImageRotation]);

  const handleRevert = () => {
    setFormValues({
      avatar: { src: null, prefix: null, isUrl: false },
      coverImage: { src: null, prefix: null, isUrl: false },
      userName: providerData.userName,
      description: providerData.description,
      name: providerData.name,
      pubKey: providerData.pubKey,
      ethAddress: providerData.ethAddress,
    });
    if (props.onCancel) {
      props.onCancel();
    }
  };

  const handleSave = async () => {
    onSave(formValues, fieldsToUpdate);
  };

  const handleFormFieldChange = React.useCallback(
    (newValues: Record<string, unknown>) => {
      // setFormChanged(true);
      for (const key in newValues) {
        if (newValues[key] !== providerData[key]) {
          setFieldsToUpdate(prev => {
            if (prev.indexOf(key) === -1) {
              return prev.concat(key);
            }
            return prev;
          });
        } else {
          setFieldsToUpdate(prev => prev.filter(k => k !== key));
        }
      }
      setFormValues(oldValues => ({
        ...oldValues,
        ...newValues,
      }));
    },
    [providerData],
  );

  const closeAvatarPopover = () => {
    setAvatarPopoverOpen(false);
  };

  const closeCoverImagePopover = () => {
    setCoverImagePopoverOpen(false);
  };
  // @Todo: update this after ts-jest migration to ESM
  const handleImageInsert =
    (imageKey: string) => (src: Blob | { url?: string; fallbackUrl?: string }, isUrl: boolean) => {
      if (isUrl && src.hasOwnProperty('url')) {
        // set blob sources to state if not already defined
        if (imageKey === ProfileProviderProperties.AVATAR && !avatarSrc)
          setAvatarSrc(src as { url?: string; fallbackUrl?: string });
        if (imageKey === ProfileProviderProperties.COVER_IMAGE && !coverImageSrc)
          setCoverImageSrc(src as { url?: string; fallbackUrl?: string });

        handleFormFieldChange({ [imageKey]: { src, isUrl, preview: src } });
      } else if (src instanceof Blob) {
        // set blob sources to state if not already defined
        if (imageKey === ProfileProviderProperties.AVATAR && !avatarSrc)
          setAvatarSrc({ url: URL.createObjectURL(src) });
        if (imageKey === ProfileProviderProperties.COVER_IMAGE && !coverImageSrc)
          setCoverImageSrc({ url: URL.createObjectURL(src) });

        handleFormFieldChange({
          [imageKey]: {
            src: { url: src },
            isUrl,
            type: src.type,
            preview: URL.createObjectURL(src),
          },
        });
      }
    };

  const handleUsernameChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    handleFormFieldChange({ userName: ev.target.value });
    if (props.onUsernameChange) {
      props.onUsernameChange(ev.target.value);
    }
  };

  const handleUsernameBlur = (ev: React.FocusEvent<HTMLInputElement>) => {
    const val = ev.target.value;
    if (props.onUsernameBlur) {
      props.onUsernameBlur(val);
    }
  };

  const handleAvatarFileUpload = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!(ev.target.files && ev.target.files[0])) {
      return;
    }
    const file: File = ev.target.files[0];
    handleImageInsert(ProfileProviderProperties.AVATAR)(file, false);
  };

  const handleCoverFileUpload = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!(ev.target.files && ev.target.files[0])) {
      return;
    }
    const file: File = ev.target.files[0];
    handleImageInsert(ProfileProviderProperties.COVER_IMAGE)(file, false);
  };

  const handleZoomInClick = () => {
    // if value of the respective field's zoom is equal to or exceeds the predefined maxZoom value, return
    if (isEditingAvatar) {
      if (avatarZoom >= maxZoom) return;
      setAvatarZoom(prev => prev + zoomStep);
    } else {
      if (coverImageZoom >= maxZoom) return;
      setCoverImageZoom(prev => prev + zoomStep);
    }
  };

  const handleZoomOutClick = () => {
    // if value of the respective field's zoom is equal to or less than the predefined minZoom value, return
    if (isEditingAvatar) {
      if (avatarZoom <= minZoom) return;
      setAvatarZoom(prev => prev - zoomStep);
    } else {
      if (coverImageZoom <= minZoom) return;
      setCoverImageZoom(prev => prev - zoomStep);
    }
  };

  return (
    <MainAreaCardBox
      style={{ height: isMobile ? '100%' : 'auto', overflowY: 'auto' }}
      className={className}
    >
      {showCropper && (
        <Box direction="column" pad="medium" height={{ min: 'fit-content' }}>
          <TitleSection
            titleLabel={`${editLabel} ${isEditingAvatar ? avatarLabel : coverImageLabel}`}
            iconType="arrowLeft"
            onIconClick={resetCropperFields}
          />
          {showCropper === ProfileProviderProperties.AVATAR ? (
            <StyledCropperImageWrapper>
              <Cropper
                image={avatarSrc.url || avatarSrc.fallbackUrl}
                crop={avatarCrop}
                zoom={avatarZoom}
                aspect={76 / 76}
                cropShape={'round'}
                objectFit={'contain'}
                onCropChange={setAvatarCrop}
                onCropComplete={onAvatarCropComplete}
                onZoomChange={setAvatarZoom}
              />
            </StyledCropperImageWrapper>
          ) : (
            <StyledCropperImageWrapper>
              <Cropper
                image={coverImageSrc.url || coverImageSrc.fallbackUrl}
                crop={coverImageCrop}
                zoom={coverImageZoom}
                aspect={1344 / 288}
                objectFit={'horizontal-cover'}
                onCropChange={setCoverImageCrop}
                onCropComplete={onCoverImageCropComplete}
                onZoomChange={setCoverImageZoom}
              />
            </StyledCropperImageWrapper>
          )}
          <Text size="medium" textAlign="center" margin={{ bottom: 'large' }}>
            {editImageSubtitle}
          </Text>
          <StyledZoomControlBox margin={{ bottom: 'xlarge' }}>
            <Icon type="zoomOutAlt" onClick={handleZoomOutClick} />
            <input
              type="range"
              value={isEditingAvatar ? avatarZoom : coverImageZoom}
              min={minZoom}
              max={maxZoom}
              step={zoomStep}
              aria-labelledby="Zoom"
              onChange={e =>
                isEditingAvatar
                  ? setAvatarZoom(Number(e.target.value))
                  : setCoverImageZoom(Number(e.target.value))
              }
              style={{ flex: 'auto', cursor: 'pointer' }}
            />
            <Icon type="zoomInAlt" onClick={handleZoomInClick} />
          </StyledZoomControlBox>
          <ActionButtonsSection
            cancelLabel={cancelLabel}
            saveLabel={saveLabel}
            showUsername={showUsername}
            formChanged={fieldsToUpdate.length > 0}
            isValidatingUsername={isValidatingUsername}
            usernameError={usernameError}
            formValues={formValues}
            updateStatus={updateStatus}
            handleRevert={resetCropperFields}
            handleSave={isEditingAvatar ? handleCropAvatar : handleCropCoverImage}
          />
        </Box>
      )}
      {!showCropper && (
        <>
          <Box direction="column" pad="medium" height={{ min: 'fit-content' }}>
            <TitleSection titleLabel={titleLabel} />
            <Box direction="column" pad="xsmall">
              <Box direction="row" justify="start">
                <AvatarSection
                  avatarLabel={avatarLabel}
                  formValues={formValues}
                  avatarPopoverOpen={avatarPopoverOpen}
                  avatarRef={avatarRef}
                  avatarInputRef={avatarInputRef}
                  handleAvatarClick={handleAvatarClick}
                  handleAvatarFileUpload={handleAvatarFileUpload}
                />
                <NameInputSection
                  nameLabel={nameLabel}
                  nameFieldPlaceholder={nameFieldPlaceholder}
                  formValues={formValues}
                  handleFormFieldChange={handleFormFieldChange}
                />
              </Box>
              {showUsername && (
                <UsernameInputSection
                  usernameLabel={usernameLabel}
                  usernameFieldInfo={usernameFieldInfo}
                  usernameFieldPlaceholder={usernameFieldPlaceholder}
                  isValidatingUsername={isValidatingUsername}
                  usernameError={usernameError}
                  usernameSuccess={usernameSuccess}
                  formValues={formValues}
                  handleUsernameChange={handleUsernameChange}
                  handleUsernameBlur={handleUsernameBlur}
                />
              )}

              <CoverImageSection
                coverImageLabel={coverImageLabel}
                formValues={formValues}
                coverImagePopoverOpen={coverImagePopoverOpen}
                coverImageRef={coverImageRef}
                coverInputRef={coverInputRef}
                handleCoverImageClick={handleCoverImageClick}
                handleCoverFileUpload={handleCoverFileUpload}
              />
              <DescriptionSection
                descriptionLabel={descriptionLabel}
                descriptionFieldPlaceholder={descriptionFieldPlaceholder}
                formValues={formValues}
                handleFormFieldChange={handleFormFieldChange}
              />
              <ActionButtonsSection
                cancelLabel={cancelLabel}
                saveLabel={saveLabel}
                showUsername={showUsername}
                formChanged={fieldsToUpdate.length > 0}
                isValidatingUsername={isValidatingUsername}
                usernameError={usernameError}
                formValues={formValues}
                updateStatus={updateStatus}
                handleRevert={handleRevert}
                handleSave={handleSave}
              />
            </Box>
          </Box>

          {avatarPopoverOpen && avatarRef.current && formValues.avatar && (
            <FormImagePopover
              modalSlotId={modalSlotId}
              uploadLabel={uploadLabel}
              urlLabel={urlLabel}
              editLabel={editLabel}
              fieldToEdit={ProfileProviderProperties.AVATAR}
              deleteLabel={deleteLabel}
              target={avatarRef.current}
              closePopover={closeAvatarPopover}
              insertImage={handleImageInsert(ProfileProviderProperties.AVATAR)}
              currentImage={!!formValues.avatar}
              onMobile={isMobileOnly}
              editable={fieldsToUpdate.includes(ProfileProviderProperties.AVATAR)}
              handleEdit={handleEdit}
              handleDeleteImage={() => handleFormFieldChange({ avatar: null })}
            />
          )}

          {coverImagePopoverOpen && coverImageRef.current && formValues.coverImage && (
            <FormImagePopover
              modalSlotId={modalSlotId}
              uploadLabel={uploadLabel}
              urlLabel={urlLabel}
              editLabel={editLabel}
              fieldToEdit={ProfileProviderProperties.COVER_IMAGE}
              deleteLabel={deleteLabel}
              target={coverImageRef.current}
              closePopover={closeCoverImagePopover}
              insertImage={handleImageInsert(ProfileProviderProperties.COVER_IMAGE)}
              currentImage={!!formValues.coverImage}
              onMobile={isMobileOnly}
              editable={fieldsToUpdate.includes(ProfileProviderProperties.COVER_IMAGE)}
              handleEdit={handleEdit}
              handleDeleteImage={() => handleFormFieldChange({ coverImage: null })}
            />
          )}
        </>
      )}
    </MainAreaCardBox>
  );
};

BoxFormCard.defaultProps = {
  nameLabel: 'Name',
  usernameLabel: 'Username',
  usernameFieldPlaceholder: 'username',
  usernameFieldInfo:
    "Your username identifies you in Ethereum World. Once you choose one, you won't be able to change it.",
  descriptionLabel: 'About',
  titleLabel: 'Ethereum Address',
  avatarLabel: 'Avatar',
  coverImageLabel: 'Cover Image',
  saveLabel: 'Save',
};

export default BoxFormCard;
