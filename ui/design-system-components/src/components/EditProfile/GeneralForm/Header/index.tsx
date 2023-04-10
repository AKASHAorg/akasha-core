import React, { useState } from 'react';
import Avatar, {
  AvatarSrc,
  IAvatarProps,
} from '@akashaorg/design-system-core/lib/components/Avatar';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ActionDropdown, {
  ActionDropdownProps,
} from '@akashaorg/design-system-core/lib/components/ActionDropDown';
import { ModalProps } from '@akashaorg/design-system-core/lib/components/Modal';
import { ImageSrc } from '@akashaorg/design-system-core/lib/components/types/common.types';
import { tw } from '@twind/core';
import { getColorClasses } from '@akashaorg/design-system-core/lib/utils/getColorClasses';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils/useCloseActions';
import { EditImageModal } from './EditImageModal';
import { DeleteImageModal } from './DeleteImageModal';
import { CropperProps } from 'react-easy-crop';
import { useEffect } from 'react';

type ImageType = 'avatar' | 'cover-image';

export type HeaderProps = {
  coverImage: ImageSrc;
  avatar: IAvatarProps['src'];
  ethAddress: IAvatarProps['ethAddress'];
  title: string;
  cancelLabel: string;
  deleteLabel: string;
  saveLabel: string;
  imageTitle: { avatar: ModalProps['title']; coverImage: ModalProps['title'] };
  deleteTitle: { avatar: ModalProps['title']; coverImage: ModalProps['title'] };
  confirmationLabel: { avatar: string; coverImage: string };
  onAvatarChange: (avatar?: AvatarSrc) => void;
  onCoverImageChange: (coverImage?: ImageSrc) => void;
};

export const Header: React.FC<HeaderProps> = ({
  title,
  coverImage,
  ethAddress,
  avatar,
  cancelLabel,
  deleteLabel,
  saveLabel,
  imageTitle,
  deleteTitle,
  confirmationLabel,
  onAvatarChange,
  onCoverImageChange,
}) => {
  const uploadInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);
  const [showAvatarActions, setShowAvatarActions] = useState(false);
  const [showCoverActions, setShowCoverDropdown] = useState(false);
  const [imageType, setImageType] = useState<ImageType>();
  const [showEditImage, setShowEditImage] = useState(false);
  const [showDeleteImage, setShowDeleteImage] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(avatar);
  const [coverImageUrl, setCoverImageUrl] = useState(coverImage);

  const editAvatarRef = useCloseActions(() => {
    setShowAvatarActions(false);
  });

  const editCoverRef = useCloseActions(() => {
    setShowCoverDropdown(false);
  });

  const dropDownActions: ActionDropdownProps['actions'] = [
    {
      label: 'Upload',
      icon: 'ArrowUpOnSquareIcon',
      onClick: () => {
        if (uploadInputRef.current) uploadInputRef.current.click();
      },
    },
    {
      label: 'Edit',
      icon: 'PencilIcon',
      onClick: () => setShowEditImage(true),
    },
    {
      label: 'Delete',
      icon: 'TrashIcon',
      color: { light: 'errorLight', dark: 'errorDark' },
      onClick: () => setShowDeleteImage(true),
    },
  ];

  const imageModalProps: Partial<CropperProps> =
    imageType === 'avatar'
      ? { aspect: 250 / 250, cropShape: 'round' }
      : { aspect: 560 / 169, objectFit: 'contain' };

  const onSave = image => {
    if (image) {
      switch (imageType) {
        case 'avatar':
          setAvatarUrl({ url: URL.createObjectURL(image) });
          break;
        case 'cover-image':
          setCoverImageUrl({ url: URL.createObjectURL(image) });
      }
    }
    setShowEditImage(false);
  };

  const onDelete = () => {
    switch (imageType) {
      case 'avatar':
        setAvatarUrl(null);
        break;
      case 'cover-image':
        setCoverImageUrl(null);
    }
    setShowDeleteImage(false);
  };

  const onUpload = (image: File) => {
    if (image) {
      switch (imageType) {
        case 'avatar':
          setAvatarUrl({ url: URL.createObjectURL(image) });
          break;
        case 'cover-image':
          setCoverImageUrl({ url: URL.createObjectURL(image) });
      }
    }
    uploadInputRef.current.value = null;
  };

  useEffect(() => {
    onAvatarChange(avatarUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatarUrl]);

  useEffect(() => {
    onCoverImageChange(coverImageUrl);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coverImageUrl]);

  return (
    <Stack direction="column" spacing="gap-y-2">
      <Text variant="h6">{title}</Text>
      <div className={tw('relative mb-8')}>
        <Card
          radius={20}
          background={{ light: 'grey7', dark: 'grey5' }}
          customStyle={`flex p-4 h-28 w-full bg-no-repeat bg-center bg-cover bg-[url(${
            coverImageUrl?.url || coverImageUrl?.fallbackUrl
          })]`}
        >
          <Stack direction="column" spacing="gap-y-1" customStyle="relative mt-auto ml-auto">
            <Button
              icon="PencilSquareIcon"
              size="xs"
              variant="primary"
              onClick={() => {
                setShowCoverDropdown(!showCoverActions);
                setImageType('cover-image');
              }}
              ref={editCoverRef}
              greyBg
              iconOnly
            />
            {showCoverActions && (
              <ActionDropdown actions={dropDownActions} customStyle="absolute right-0 top-7" />
            )}
          </Stack>
        </Card>
        <Stack align="center" justify="center" customStyle="absolute left-6 -bottom-8">
          <Avatar
            ethAddress={ethAddress}
            size="lg"
            src={avatarUrl}
            customStyle={`border-2 ${getColorClasses(
              {
                light: 'white',
                dark: 'grey2',
              },
              'border',
            )} ${getColorClasses(
              {
                light: 'grey8',
                dark: 'grey4',
              },
              'bg',
            )}`}
          />
          <div className={tw('absolute')}>
            <Button
              icon="PencilSquareIcon"
              size="xs"
              variant="primary"
              onClick={() => {
                setShowAvatarActions(!showAvatarActions);
                setImageType('avatar');
              }}
              ref={editAvatarRef}
              greyBg
              iconOnly
            />
            {showAvatarActions && (
              <ActionDropdown actions={dropDownActions} customStyle="absolute top-7" />
            )}
          </div>
        </Stack>
      </div>
      <EditImageModal
        show={showEditImage}
        title={imageType === 'avatar' ? imageTitle.avatar : imageTitle.coverImage}
        cancelLabel={cancelLabel}
        saveLabel={saveLabel}
        onClose={() => setShowEditImage(false)}
        image={imageType === 'avatar' ? avatarUrl : coverImageUrl}
        onSave={onSave}
        {...imageModalProps}
      />
      <DeleteImageModal
        show={showDeleteImage}
        title={imageType === 'avatar' ? deleteTitle.avatar : deleteTitle.coverImage}
        cancelLabel={cancelLabel}
        deleteLabel={deleteLabel}
        confirmationLabel={
          imageType === 'avatar' ? confirmationLabel.avatar : confirmationLabel.coverImage
        }
        onDelete={onDelete}
        onClose={() => setShowDeleteImage(false)}
      />
      <input ref={uploadInputRef} type="file" onChange={e => onUpload(e.target.files[0])} hidden />
    </Stack>
  );
};
