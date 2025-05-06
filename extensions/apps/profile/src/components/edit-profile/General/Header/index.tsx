import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import {
  ProfileAvatar,
  ProfileAvatarImage,
  ProfileAvatarFallback,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import List, { ListProps } from '@akashaorg/design-system-core/lib/components/List';
import ImageModal from '@akashaorg/design-system-components/lib/components/ImageModal';
import {
  ArrowUpOnSquareIcon,
  PencilIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { CropperProps } from 'react-easy-crop';
import { ProfileImageType, Profile, type Image } from '@akashaorg/typings/lib/ui';
import { ModalProps } from '@akashaorg/design-system-core/lib/components/Modal';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils/useCloseActions';
import { DeleteImageModal } from './DeleteImageModal';
import { getImageFromSeed } from '@akashaorg/design-system-core/lib/utils';
import { cssVars } from '@akashaorg/ui/lib/library/to-css-var';

export type HeaderProps = {
  coverImage: Profile['background'];
  avatar: Profile['avatar'];
  profileId: Profile['did']['id'];
  title: string;
  cancelLabel: string;
  deleteLabel: string;
  saveLabel: string;
  imageTitle: { avatar: ModalProps['title']; coverImage: ModalProps['title'] };
  deleteTitle: { avatar: ModalProps['title']; coverImage: ModalProps['title'] };
  confirmationLabel: { avatar: string; coverImage: string };
  dragToRepositionLabel: string;
  cropErrorLabel: string;
  isSavingImage: boolean;
  publicImagePath: string;
  transformSource: (src: Image) => Image;
  onAvatarChange: (avatar?: File) => void;
  onCoverImageChange: (coverImage?: File) => void;
  onImageSave: (type: ProfileImageType, image?: File) => void;
};

export const Header: React.FC<HeaderProps> = ({
  title,
  coverImage,
  profileId,
  avatar,
  cancelLabel,
  deleteLabel,
  saveLabel,
  imageTitle,
  deleteTitle,
  confirmationLabel,
  dragToRepositionLabel,
  cropErrorLabel,
  isSavingImage,
  publicImagePath,
  transformSource,
  onAvatarChange,
  onCoverImageChange,
  onImageSave,
}) => {
  const uploadInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);
  const [showAvatarActions, setShowAvatarActions] = useState(false);
  const [showCoverActions, setShowCoverDropdown] = useState(false);
  const [profileImageType, setProfileImageType] = useState<ProfileImageType>();
  const [showEditImage, setShowEditImage] = useState(false);
  const [showDeleteImage, setShowDeleteImage] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(transformSource(avatar?.default));
  const [coverImageUrl, setCoverImageUrl] = useState(transformSource(coverImage?.default));
  const [images, setImages] = useState([]);
  const alternativeAvatars = useRef(
    avatar?.alternatives?.map(alternative => transformSource(alternative)),
  );

  const seed = getImageFromSeed(profileId, 3);
  const coverImageFallback = `${publicImagePath}/profile-cover-${seed}.webp`;

  useEffect(() => {
    if (!isSavingImage) {
      setShowEditImage(false);
    }
  }, [isSavingImage]);

  const editAvatarRef = useCloseActions(() => {
    setShowAvatarActions(false);
  });

  const editCoverRef = useCloseActions(() => {
    setShowCoverDropdown(false);
  });

  const closeActionsDropDown = () => {
    switch (profileImageType) {
      case 'avatar':
        setShowAvatarActions(false);
        return;
      case 'cover-image':
        setShowCoverDropdown(false);
        return;
    }
  };

  const showEditAndDeleteMenuOptions =
    (profileImageType === 'avatar' && !!avatarUrl) ||
    (profileImageType === 'cover-image' && !!coverImageUrl);

  const dropDownActions: ListProps['items'] = [
    {
      label: 'Upload',
      icon: <ArrowUpOnSquareIcon />,
      onClick: () => {
        if (uploadInputRef.current) uploadInputRef.current.click();
        closeActionsDropDown();
      },
    },
    ...(showEditAndDeleteMenuOptions
      ? [
          {
            label: 'Edit',
            icon: <PencilIcon />,
            onClick: () => {
              switch (profileImageType) {
                case 'avatar':
                  setImages([avatarUrl]);
                  break;
                case 'cover-image':
                  setImages([coverImageUrl]);
              }
              setShowEditImage(true);
              closeActionsDropDown();
            },
          },
          {
            label: 'Delete',
            icon: <TrashIcon />,
            color: { light: 'errorLight', dark: 'errorDark' } as const,
            onClick: () => {
              setShowDeleteImage(true);
              closeActionsDropDown();
            },
          },
        ]
      : []),
  ];

  const imageModalProps: Partial<CropperProps> =
    profileImageType === 'avatar'
      ? { aspect: 250 / 250, cropShape: 'round' }
      : { aspect: 560 / 169, objectFit: 'contain' };

  const onSave = (image: File) => {
    if (image) {
      switch (profileImageType) {
        case 'avatar':
          onImageSave('avatar', image);
          onAvatarChange(image);
          setAvatarUrl({ src: URL.createObjectURL(image), width: 0, height: 0 });
          break;
        case 'cover-image':
          onImageSave('cover-image', image);
          onCoverImageChange(image);
          setCoverImageUrl({ src: URL.createObjectURL(image), width: 0, height: 0 });
      }
    }
  };

  const onDelete = () => {
    switch (profileImageType) {
      case 'avatar':
        onAvatarChange(null);
        setAvatarUrl(null);
        break;
      case 'cover-image':
        onCoverImageChange(null);
        setCoverImageUrl(null);
    }
    setShowDeleteImage(false);
  };

  const onUpload = (image: File) => {
    if (image) {
      switch (profileImageType) {
        case 'avatar':
          setImages([{ src: URL.createObjectURL(image), width: 0, height: 0 }]);
          break;
        case 'cover-image':
          setImages([{ src: URL.createObjectURL(image), width: 0, height: 0 }]);
      }
      setShowEditImage(true);
    }
    uploadInputRef.current.value = '';
  };

  return (
    <Stack direction="column" spacing={2}>
      <Typography variant="h6">{title}</Typography>
      <Stack className="relative mb-8">
        <Card
          data-testid="cover-image"
          style={cssVars({
            '--background-url': `url('${coverImageUrl?.src ?? coverImageFallback}')`,
          })}
          className={`rounded-[1.25rem] flex p-4 h-28 w-full bg-no-repeat bg-center bg-cover bg-(image:--background-url) overflow-visible`}
        >
          <Stack
            ref={editCoverRef}
            direction="column"
            spacing={1}
            className="relative mt-auto ml-auto"
          >
            <Button
              aria-label="cover-image"
              variant="outline"
              size="icon"
              onClick={() => {
                setShowCoverDropdown(!showCoverActions);
                setProfileImageType('cover-image');
              }}
            >
              <PencilSquareIcon />
            </Button>
            {showCoverActions && (
              <List items={dropDownActions} customStyle="absolute right-0 top-7 w-auto z-10" />
            )}
          </Stack>
        </Card>
        <Stack
          alignItems="center"
          justifyContent="center"
          ref={editAvatarRef}
          className="absolute left-6 -bottom-8"
        >
          <ProfileAvatar profileDID={profileId} size="xl" className="border-2 border-white">
            <ProfileAvatarImage src={avatarUrl?.src || alternativeAvatars?.[0]?.src} />
            <ProfileAvatarFallback />
          </ProfileAvatar>
          <Stack className="absolute">
            <Button
              aria-label="avatar"
              onClick={() => {
                setShowAvatarActions(!showAvatarActions);
                setProfileImageType('avatar');
              }}
              variant="outline"
              size="icon"
            >
              <PencilSquareIcon />
            </Button>
            {showAvatarActions && (
              <List items={dropDownActions} customStyle="absolute top-7 w-auto z-10" />
            )}
          </Stack>
        </Stack>
      </Stack>
      <ImageModal
        show={showEditImage}
        title={profileImageType === 'avatar' ? imageTitle.avatar : imageTitle.coverImage}
        cancelLabel={cancelLabel}
        saveLabel={saveLabel}
        onClose={() => {
          if (isSavingImage) return;
          setShowEditImage(false);
        }}
        images={images}
        dragToRepositionLabel={dragToRepositionLabel}
        errorLabel={cropErrorLabel}
        isSavingImage={isSavingImage}
        onSave={onSave}
        {...imageModalProps}
      />
      <DeleteImageModal
        show={showDeleteImage}
        title={profileImageType === 'avatar' ? deleteTitle.avatar : deleteTitle.coverImage}
        cancelLabel={cancelLabel}
        deleteLabel={deleteLabel}
        confirmationLabel={
          profileImageType === 'avatar' ? confirmationLabel.avatar : confirmationLabel.coverImage
        }
        onDelete={onDelete}
        onClose={() => setShowDeleteImage(false)}
      />
      <input
        ref={uploadInputRef}
        type="file"
        aria-label="image-upload"
        onChange={e => onUpload(e.target.files[0])}
        hidden
      />
    </Stack>
  );
};
