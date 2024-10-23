import React, { useState, useEffect } from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import List, { ListProps } from '@akashaorg/design-system-core/lib/components/List';
import ImageModal, { ImageModalProps } from '../../ImageModal';
import {
  ArrowUpOnSquareIcon,
  PencilIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { ExtensionImageType, type Image } from '@akashaorg/typings/lib/ui';
import { ModalProps } from '@akashaorg/design-system-core/lib/components/Modal';
import { getColorClasses } from '@akashaorg/design-system-core/lib/utils/getColorClasses';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils/useCloseActions';
import { DeleteImageModal } from './DeleteImageModal';
import AppAvatar from '@akashaorg/design-system-core/lib/components/AppAvatar';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export type HeaderProps = {
  extensionType?: AkashaAppApplicationType;
  coverImage: Image;
  logoImage: Image;
  cancelLabel: string;
  deleteLabel: string;
  saveLabel: string;
  imageTitle: { logoImage: ModalProps['title']; coverImage: ModalProps['title'] };
  deleteTitle: { logoImage: ModalProps['title']; coverImage: ModalProps['title'] };
  confirmationLabel: { logoImage: string; coverImage: string };
  dragToRepositionLabel: string;
  isSavingImage: boolean;
  publicImagePath: string;
  logoPreviewTitle: string;
  onLogoImageChange: (logoImage?: File) => void;
  onCoverImageChange: (coverImage?: File) => void;
  onImageSave: (type: ExtensionImageType, image?: File) => void;
  onImageDelete: (type: ExtensionImageType) => void;
};

export const Header: React.FC<HeaderProps> = ({
  extensionType,
  coverImage,
  logoImage,
  cancelLabel,
  deleteLabel,
  saveLabel,
  imageTitle,
  deleteTitle,
  confirmationLabel,
  dragToRepositionLabel,
  isSavingImage,
  logoPreviewTitle,
  onLogoImageChange,
  onCoverImageChange,
  onImageSave,
  onImageDelete,
}) => {
  const uploadInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);
  const [showLogoImageActions, setShowLogoImageActions] = useState(false);
  const [showCoverActions, setShowCoverDropdown] = useState(false);
  const [appImageType, setAppImageType] = useState<ExtensionImageType>();
  const [showEditImage, setShowEditImage] = useState(false);
  const [showDeleteImage, setShowDeleteImage] = useState(false);
  const [logoImageUrl, setLogoImageUrl] = useState(logoImage);
  const [coverImageUrl, setCoverImageUrl] = useState(coverImage);
  const [uploadedLogoImageUrl, setUploadedLogoImageUrl] = useState(logoImage);
  const [uploadedCoverImageUrl, setUploadedCoverImageUrl] = useState(coverImage);

  useEffect(() => {
    if (!isSavingImage) {
      setShowEditImage(false);
    }
  }, [isSavingImage]);

  const editLogoImageRef = useCloseActions(() => {
    setShowLogoImageActions(false);
  });

  const editCoverRef = useCloseActions(() => {
    setShowCoverDropdown(false);
  });

  const closeActionsDropDown = () => {
    switch (appImageType) {
      case 'logo-image':
        setShowLogoImageActions(false);
        return;
      case 'cover-image':
        setShowCoverDropdown(false);
        return;
    }
  };

  const dropDownActions: ListProps['items'] = [
    {
      label: 'Upload',
      icon: <ArrowUpOnSquareIcon />,
      onClick: () => {
        if (uploadInputRef.current) uploadInputRef.current.click();
        closeActionsDropDown();
      },
    },
    {
      label: 'Edit',
      icon: <PencilIcon />,
      onClick: () => {
        setShowEditImage(true);
        closeActionsDropDown();
      },
    },
    {
      label: 'Delete',
      icon: <TrashIcon />,
      color: { light: 'errorLight', dark: 'errorDark' },
      onClick: () => {
        setShowDeleteImage(true);
        closeActionsDropDown();
      },
    },
  ];

  const imageModalProps: Partial<ImageModalProps> =
    appImageType === 'logo-image'
      ? {
          previewTitle: logoPreviewTitle,
          previews: [
            { dimension: 110 },
            { dimension: 60 },
            { dimension: 40, circular: true },
            { dimension: 32, circular: true },
            { dimension: 16, circular: true },
          ],
          removeCropAreaBoxShadow: true,
          imageWidth: 213,
          imageHeight: 213,
          aspect: 213 / 213,
          cropShape: 'rect',
        }
      : { aspect: 560 / 169, objectFit: 'contain' };

  const onSave = (image: File) => {
    if (image) {
      switch (appImageType) {
        case 'logo-image':
          onImageSave('logo-image', image);
          onLogoImageChange(image);
          setLogoImageUrl({ src: URL.createObjectURL(image), width: 0, height: 0 });
          break;
        case 'cover-image':
          onImageSave('cover-image', image);
          onCoverImageChange(image);
          setCoverImageUrl({ src: URL.createObjectURL(image), width: 0, height: 0 });
      }
    }
  };

  const onDelete = () => {
    switch (appImageType) {
      case 'logo-image':
        onImageDelete('logo-image');
        onLogoImageChange(null);
        setLogoImageUrl(null);
        break;
      case 'cover-image':
        onImageDelete('cover-image');
        onCoverImageChange(null);
        setCoverImageUrl(null);
    }
    setShowDeleteImage(false);
  };

  const onUpload = (image: File) => {
    if (image) {
      switch (appImageType) {
        case 'logo-image':
          onLogoImageChange(image);
          setUploadedLogoImageUrl({ src: URL.createObjectURL(image), width: 0, height: 0 });
          break;
        case 'cover-image':
          onCoverImageChange(image);
          setUploadedCoverImageUrl({ src: URL.createObjectURL(image), width: 0, height: 0 });
      }
      setShowEditImage(true);
    }
    uploadInputRef.current.value = '';
  };

  return (
    <Stack direction="column" spacing="gap-y-2">
      <Stack customStyle="relative mb-8">
        <Card
          radius={20}
          background={{ light: 'grey7', dark: 'grey5' }}
          customStyle={`flex p-4 h-28 w-full bg-no-repeat bg-center bg-cover bg-[url(${coverImageUrl?.src || coverImage?.src})]`}
        >
          <Stack
            ref={editCoverRef}
            direction="column"
            spacing="gap-y-1"
            customStyle="relative mt-auto ml-auto"
          >
            <Button
              icon={<PencilSquareIcon />}
              size="xs"
              variant="primary"
              onClick={() => {
                setShowCoverDropdown(!showCoverActions);
                setAppImageType('cover-image');
              }}
              greyBg
              iconOnly
            />
            {showCoverActions && (
              <List items={dropDownActions} customStyle="absolute right-0 top-7 w-auto z-10" />
            )}
          </Stack>
        </Card>
        <Stack
          align="center"
          justify="center"
          customStyle="absolute left-6 -bottom-8"
          ref={editLogoImageRef}
        >
          <AppAvatar
            appType={extensionType}
            avatar={logoImageUrl || logoImage}
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

          <Stack customStyle="absolute">
            <Button
              icon={<PencilSquareIcon />}
              size="xs"
              variant="primary"
              onClick={() => {
                setShowLogoImageActions(!showLogoImageActions);
                setAppImageType('logo-image');
              }}
              greyBg
              iconOnly
            />
            {showLogoImageActions && (
              <List items={dropDownActions} customStyle="absolute top-7 w-auto z-10" />
            )}
          </Stack>
        </Stack>
      </Stack>
      <ImageModal
        show={showEditImage}
        title={appImageType === 'logo-image' ? imageTitle.logoImage : imageTitle.coverImage}
        cancelLabel={cancelLabel}
        saveLabel={saveLabel}
        onClose={() => {
          if (isSavingImage) return;
          setShowEditImage(false);
        }}
        images={
          appImageType === 'logo-image'
            ? [uploadedLogoImageUrl?.src || logoImage?.src]
            : [uploadedCoverImageUrl?.src || coverImage?.src]
        }
        rightAlignActions={true}
        dragToRepositionLabel={dragToRepositionLabel}
        isSavingImage={isSavingImage}
        onSave={onSave}
        {...imageModalProps}
      />
      <DeleteImageModal
        show={showDeleteImage}
        title={appImageType === 'logo-image' ? deleteTitle.logoImage : deleteTitle.coverImage}
        cancelLabel={cancelLabel}
        deleteLabel={deleteLabel}
        confirmationLabel={
          appImageType === 'logo-image' ? confirmationLabel.logoImage : confirmationLabel.coverImage
        }
        onDelete={onDelete}
        onClose={() => setShowDeleteImage(false)}
      />
      <input ref={uploadInputRef} type="file" onChange={e => onUpload(e.target.files[0])} hidden />
    </Stack>
  );
};
