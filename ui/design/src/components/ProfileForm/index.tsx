import * as React from 'react';
import { Box, Spinner, Text } from 'grommet';
import Cropper from 'react-easy-crop';
import { isMobileOnly } from 'react-device-detect';
import {
  IProfileData,
  ProfileProviderProperties,
  UpdateProfileStatus,
} from '@akashaorg/typings/ui';

import { AvatarSection } from './sections/AvatarSection';
import { NameInputSection } from './sections/NameInputSection';
import { CoverImageSection } from './sections/CoverImageSection';
import { DescriptionSection } from './sections/DescriptionSection';
import { ActionButtonsSection } from './sections/ActionButtonsSection';
import { UsernameInputSection } from './sections/UsernameInputSection';

import Icon from '../Icon';
import { CropValue, StyledCropperImageWrapper, StyledZoomControlBox } from '../ImageCropper';
import { FormImagePopover } from '../ImagePopover/form-image-popover';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';

import getCroppedImage from '../../utils/get-cropped-image';

import SocialLinksSection, { StateLink } from './sections/social-links-section';
import EnsPrefillSection from './sections/ens-prefill-section';
import { EnsTxtPresets } from './sections/social-link-input';
import { getUpdatedFields } from './get-updated-fields';

export interface ProfileFormProps {
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
  onSave: (
    data: Omit<IFormValues, 'socialLinks'> & { socialLinks?: { type: string; value: string }[] },
    changedFields: string[],
  ) => void;
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
  ensData?: { name?: string; links?: { type: string; value: string }[] };
  onEnsPrefill?: () => void;
  ensSectionTitle: string;
  ensPrefillButtonLabel: string;
  isLoading?: boolean;
  loadingDataLabel?: string;
  ensPrefillLoading?: boolean;
  ensPrefillData?: { txt: string; value: string }[];
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
  socialLinks?: StateLink[];
}

export type CroppableFields =
  | ProfileProviderProperties.AVATAR
  | ProfileProviderProperties.COVER_IMAGE;

// tslint:disable:cyclomatic-complexity
/* eslint-disable complexity */

const ProfileForm: React.FC<ProfileFormProps> = props => {
  const {
    className,
    // titleLabel,
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
    isLoading = false,
    loadingDataLabel,
    ensPrefillData,
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
    socialLinks: [],
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
  const [coverImageSrc, setCoverImageSrc] = React.useState<{ url?: string; fallbackUrl?: string }>(
    null,
  );

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
  // Update internal state based on providerData prop
  React.useEffect(() => {
    if (!providerData) {
      return;
    }
    const updatedFields = getUpdatedFields(providerData);
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

      handleImageInsert(ProfileProviderProperties.AVATAR)(cropped);

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

      handleImageInsert(ProfileProviderProperties.COVER_IMAGE)(cropped);

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

  const handleSave = () => {
    if (formValues.socialLinks.length) {
      const links = formValues.socialLinks.map(link => {
        if (link.type === EnsTxtPresets.URL) {
          return {
            type: link.type,
            value: encodeURIComponent(link.value),
          };
        }
        return {
          type: link.type,
          value: link.value,
        };
      });
      return onSave({ ...formValues, socialLinks: links }, fieldsToUpdate);
    }
    return onSave(formValues, fieldsToUpdate);
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
  const handleImageInsert = React.useCallback(
    (imageKey: string) => (src: Blob) => {
      if (src instanceof Blob) {
        // set blob sources to state if not already defined
        if (imageKey === ProfileProviderProperties.AVATAR && !avatarSrc)
          setAvatarSrc({ url: URL.createObjectURL(src) });
        if (imageKey === ProfileProviderProperties.COVER_IMAGE && !coverImageSrc)
          setCoverImageSrc({ url: URL.createObjectURL(src) });

        handleFormFieldChange({
          [imageKey]: {
            src: { url: src },
            type: src.type,
            preview: URL.createObjectURL(src),
          },
        });
      }
    },
    [avatarSrc, coverImageSrc, handleFormFieldChange],
  );
  React.useEffect(() => {
    if (ensPrefillData) {
      setFormValues(prev => ({ ...prev, socialLinks: [] }));
      for (const { txt, value } of ensPrefillData) {
        if (!value) continue;
        switch (txt) {
          case EnsTxtPresets.DISCORD:
          case EnsTxtPresets.GITHUB:
          case EnsTxtPresets.REDDIT:
          case EnsTxtPresets.TWITTER:
          case EnsTxtPresets.TELEGRAM:
          case EnsTxtPresets.URL:
            setFormValues(prev => ({
              ...prev,
              socialLinks: prev.socialLinks.concat({
                id: prev.socialLinks.length,
                type: txt,
                value: value,
              }),
            }));
            setFieldsToUpdate(prev => {
              if (!prev.includes('socialLinks')) {
                return prev.concat('socialLinks');
              }
              return prev;
            });
            break;
          case EnsTxtPresets.DESCRIPTION:
            setFormValues(prev => ({ ...prev, description: value }));
            setFieldsToUpdate(prev => {
              if (!prev.includes('description')) {
                return prev.concat('description');
              }
              return prev;
            });
            break;
          case EnsTxtPresets.AVATAR:
            setFormValues(prev => ({
              ...prev,
              avatar: {
                src: { url: value, fallbackUrl: '' },
                prefix: '',
                preview: value,
                isUrl: true,
              },
            }));
            setFieldsToUpdate(prev => {
              if (!prev.includes('avatar')) {
                return prev.concat('avatar');
              }
              return prev;
            });
            break;
          default:
            break;
        }
      }
    }
  }, [ensPrefillData, handleImageInsert]);

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
    handleImageInsert(ProfileProviderProperties.AVATAR)(file);
  };

  const handleCoverFileUpload = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!(ev.target.files && ev.target.files[0])) {
      return;
    }
    const file: File = ev.target.files[0];
    handleImageInsert(ProfileProviderProperties.COVER_IMAGE)(file);
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

  const handleLinkCreate = () => {
    setFormValues(prev => {
      if (!prev.socialLinks) {
        return {
          ...prev,
          socialLinks: [{ id: 0, type: EnsTxtPresets.URL, value: '' }],
        };
      }
      return {
        ...prev,
        socialLinks: prev.socialLinks.concat({
          id: prev.socialLinks[prev.socialLinks.length - 1].id + 1,
          type: EnsTxtPresets.URL,
          value: '',
        }),
      };
    });
  };
  const handleLinkInputChange = (id: number, value: string) => {
    setFormValues(prev => {
      const newLinks = prev.socialLinks.slice();
      const linkIdx = newLinks.findIndex(link => link.id === id);
      if (linkIdx >= 0) {
        newLinks[linkIdx].value = value;
      }
      return {
        ...prev,
        socialLinks: newLinks,
      };
    });
  };
  const handleLinkTypeChange = (
    id: number,
    type: typeof EnsTxtPresets[keyof typeof EnsTxtPresets],
  ) => {
    setFormValues(prev => {
      const newLinks = prev.socialLinks.slice();
      const linkIdx = newLinks.findIndex(link => link.id === id);
      if (linkIdx >= 0) {
        newLinks[linkIdx].type = type;
      }
      return {
        ...prev,
        socialLinks: newLinks,
      };
    });
  };

  const handleLinkRemove = (id: number) => {
    setFormValues(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter(link => link.id !== id),
    }));
  };

  return (
    <MainAreaCardBox className={className}>
      {showCropper && (
        <Box direction="column" pad="medium" height={{ min: 'fit-content' }}>
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
            {/* <TitleSection titleLabel={titleLabel} /> */}
            <Box direction="column" pad="xsmall">
              {isLoading && (
                <Box justify="center" align="center" pad="medium">
                  <Spinner size="medium" />
                  <Text margin={{ top: 'xsmall' }}>{loadingDataLabel}</Text>
                </Box>
              )}
              {!isLoading && (
                <>
                  <CoverImageSection
                    coverImageLabel={coverImageLabel}
                    formValues={formValues}
                    coverImagePopoverOpen={coverImagePopoverOpen}
                    coverImageRef={coverImageRef}
                    coverInputRef={coverInputRef}
                    handleCoverImageClick={handleCoverImageClick}
                    handleCoverFileUpload={handleCoverFileUpload}
                  />
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
                  <Box>
                    {props.ensData.name && (
                      <EnsPrefillSection
                        titleLabel={props.ensSectionTitle}
                        prefillButtonLabel={props.ensPrefillButtonLabel}
                        ensName={props.ensData.name}
                        onEnsPrefill={props.onEnsPrefill}
                      />
                    )}
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
                  <DescriptionSection
                    descriptionLabel={descriptionLabel}
                    descriptionFieldPlaceholder={descriptionFieldPlaceholder}
                    formValues={formValues}
                    handleFormFieldChange={handleFormFieldChange}
                  />
                  <SocialLinksSection
                    title="Social Links"
                    links={formValues.socialLinks}
                    onLinkCreate={handleLinkCreate}
                    onLinkInputChange={handleLinkInputChange}
                    onLinkTypeChange={handleLinkTypeChange}
                    onLinkRemove={handleLinkRemove}
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
                </>
              )}
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
              editable={
                fieldsToUpdate.includes(ProfileProviderProperties.AVATAR) &&
                !formValues.avatar.isUrl
              }
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

ProfileForm.defaultProps = {
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
  loadingDataLabel: 'Loading profile data',
};

export default ProfileForm;
