import { Box } from 'grommet';
import * as React from 'react';
import { isMobile, isMobileOnly } from 'react-device-detect';
import { FormImagePopover } from '../ImagePopover/form-image-popover';
import { MainAreaCardBox } from '../EntryCard/basic-card-box';

import { TitleSection } from './sections/TitleSection';
import { AvatarSection } from './sections/AvatarSection';
import { NameInputSection } from './sections/NameInputSection';
import { UsernameInputSection } from './sections/UsernameInputSection';
import { CoverImageSection } from './sections/CoverImageSection';
import { DescriptionSection } from './sections/DescriptionSection';
import { ActionButtonsSection } from './sections/ActionButtonsSection';
import { UpdateProfileStatus } from '@akashaproject/ui-awf-typings/lib/profile';
import useBodyScrollLock from '../../utils/use-body-scroll-lock';

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
  const [fieldsToUpdate, setFieldsToUpdate] = React.useState<string[]>([]);
  const [formValues, setFormValues] = React.useState<IFormValues>({
    avatar: { src: '', prefix: null, isUrl: false },
    coverImage: { src: '', prefix: null, isUrl: false },
    userName: '',
    description: '',
    name: '',
    pubKey: '',
    ethAddress: '',
  });

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
      // transform null values to empty strings
      if (!providerData[key]) {
        updatedFields[key] = '';
      } else {
        updatedFields[key] = providerData[key];
      }
      if (key === 'avatar') {
        if (providerData[key] && typeof providerData[key] === 'string') {
          updatedFields[key] = {
            preview: providerData[key],
            prefix: '',
            isUrl: true,
          };
        }
      }
      if (key === 'coverImage') {
        if (providerData[key] && typeof providerData[key] === 'string') {
          updatedFields[key] = {
            preview: providerData[key],
            prefix: '',
            isUrl: true,
          };
        }
      }
      if (key === 'userName') {
        if (providerData.userName) {
          updatedFields[key] = providerData.userName;
        } else if (providerData.default && providerData.default.length > 0) {
          const userNameProvider = providerData.default.find(
            p => p.property === 'userName' && p.provider === 'ewa.providers.basic',
          );
          updatedFields[key] = userNameProvider ? userNameProvider.value : '';
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
  const handleImageInsert = (imageKey: string) => (src: File | string, isUrl: boolean) => {
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
    handleImageInsert('avatar')(file, false);
  };

  const handleCoverFileUpload = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (!(ev.target.files && ev.target.files[0])) {
      return;
    }
    const file: File = ev.target.files[0];
    handleImageInsert('coverImage')(file, false);
  };

  return (
    <MainAreaCardBox
      style={{ height: isMobile ? '100%' : 'auto', overflowY: 'auto' }}
      className={className}
    >
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
          uploadLabel={uploadLabel}
          urlLabel={urlLabel}
          deleteLabel={deleteLabel}
          target={avatarRef.current}
          closePopover={closeAvatarPopover}
          insertImage={handleImageInsert('avatar')}
          currentImage={!!formValues.avatar}
          onMobile={isMobileOnly}
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
          onMobile={isMobileOnly}
          handleDeleteImage={() => handleFormFieldChange({ coverImage: null })}
        />
      )}
    </MainAreaCardBox>
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
