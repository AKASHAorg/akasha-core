import React, { useState, useEffect } from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import AppCoverImage from '@akashaorg/design-system-core/lib/components/AppCoverImage';
import AppAvatar from '@akashaorg/design-system-core/lib/components/AppAvatar';
import List, { ListProps } from '@akashaorg/design-system-core/lib/components/List';
import ImageModal, {
  ImageModalProps,
} from '@akashaorg/design-system-components/lib/components/ImageModal';
import Img from '@akashaorg/design-system-core/lib/components/Image';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { UploadIcon, PencilIcon, SquarePenIcon, InfoIcon, Trash2Icon } from 'lucide-react';
import { ExtensionImageType, type Image } from '@akashaorg/typings/lib/ui';
import Modal, { ModalProps } from '@akashaorg/design-system-core/lib/components/Modal';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils/useCloseActions';
import { DeleteImageModal } from './DeleteImageModal';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import { capitalize } from 'lodash';
import ExtensionIcon from '@akashaorg/design-system-core/lib/components/ExtensionIcon';
export type HeaderProps = {
  extensionType?: AkashaAppApplicationType;
  nsfw?: boolean;
  showExtraInfo?: boolean;
  coverImage: Image;
  logoImage: Image;
  cancelLabel: string;
  deleteLabel: string;
  saveLabel: string;
  imageTitle: {
    logoImage: ModalProps['title'];
    coverImage: ModalProps['title'];
  };
  deleteTitle: {
    logoImage: ModalProps['title'];
    coverImage: ModalProps['title'];
  };
  confirmationLabel: {
    logoImage: string;
    coverImage: string;
  };
  dragToRepositionLabel: string;
  cropErrorLabel: string;
  isSavingImage: boolean;
  publicImagePath: string;
  logoGuidelines: {
    guidelines: string[];
    titleLabel: string;
    imageDescription: string;
  };
  logoPreviewTitle: string;
  onLogoImageChange: (logoImage?: File) => void;
  onCoverImageChange: (coverImage?: File) => void;
  onImageSave: (type: ExtensionImageType, image?: File) => void;
  onImageDelete: (type: ExtensionImageType) => void;
};
export const Header: React.FC<HeaderProps> = ({
  extensionType,
  nsfw,
  showExtraInfo,
  coverImage,
  logoImage,
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
  logoGuidelines,
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
  const [showLogoGuidelineModal, setShowLogoGuidelineModal] = useState(false);
  const [images, setImages] = useState([]);
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
  const showEditAndDeleteMenuOptions =
    (appImageType === 'logo-image' && !!logoImageUrl?.src) ||
    (appImageType === 'cover-image' && !!coverImageUrl?.src);
  const dropDownActions: ListProps['items'] = [
    {
      label: 'Upload',
      icon: <UploadIcon className="h-4 w-4" />,
      onClick: () => {
        if (uploadInputRef.current) uploadInputRef.current.click();
        closeActionsDropDown();
      },
    },
    ...(showEditAndDeleteMenuOptions
      ? [
          {
            label: 'Edit',
            icon: <PencilIcon className="h-4 w-4" />,
            onClick: () => {
              switch (appImageType) {
                case 'logo-image':
                  setImages([logoImageUrl]);
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
            icon: (
              <Trash2Icon className="h-4 w-4 [&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark" />
            ),
            color: { light: 'errorLight', dark: 'errorDark' } as const,
            onClick: () => {
              setShowDeleteImage(true);
              closeActionsDropDown();
            },
          },
        ]
      : []),
  ];
  const imageModalProps: Partial<ImageModalProps> =
    appImageType === 'logo-image'
      ? {
          previewTitle: logoPreviewTitle,
          previews: [
            {
              dimension: 110,
            },
            {
              dimension: 60,
            },
            {
              dimension: 40,
              circular: true,
            },
            {
              dimension: 32,
              circular: true,
            },
            {
              dimension: 16,
              circular: true,
            },
          ],
          width: 312,
          height: 224,
          aspect: 1 / 1,
          cropShape: 'rect',
        }
      : {
          aspect: 560 / 169,
          objectFit: 'contain',
        };
  const onSave = (image: File) => {
    if (image) {
      switch (appImageType) {
        case 'logo-image':
          onImageSave('logo-image', image);
          onLogoImageChange(image);
          setLogoImageUrl({
            src: URL.createObjectURL(image),
            width: 0,
            height: 0,
          });
          break;
        case 'cover-image':
          onImageSave('cover-image', image);
          onCoverImageChange(image);
          setCoverImageUrl({
            src: URL.createObjectURL(image),
            width: 0,
            height: 0,
          });
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
          setImages([
            {
              src: URL.createObjectURL(image),
              width: 0,
              height: 0,
            },
          ]);
          break;
        case 'cover-image':
          onCoverImageChange(image);
          setImages([
            {
              src: URL.createObjectURL(image),
              width: 0,
              height: 0,
            },
          ]);
      }
      setShowEditImage(true);
    }
    uploadInputRef.current.value = '';
  };
  return (
    <Stack direction="column" spacing={2}>
      <Stack className="relative mb-8">
        <Stack className="w-full bg-inherit h-28 rounded-2xl">
          <AppCoverImage
            src={coverImageUrl?.src}
            appType={extensionType}
            customStyle={'h-28 rounded-2xl'}
          />
          <Stack
            ref={editCoverRef}
            direction="column"
            spacing={1}
            className="absolute bottom-4 right-4"
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setShowCoverDropdown(!showCoverActions);
                setAppImageType('cover-image');
              }}
            >
              <SquarePenIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
            </Button>
            {showCoverActions && (
              <List items={dropDownActions} customStyle="absolute right-0 top-7 w-auto z-10" />
            )}
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="end" spacing={2} className="absolute left-6 -bottom-8">
          <Stack alignItems="center" justifyContent="center" ref={editLogoImageRef}>
            <AppAvatar
              appType={extensionType}
              avatar={logoImageUrl}
              onClick={() => {
                setShowLogoImageActions(!showLogoImageActions);
                setAppImageType('logo-image');
              }}
              customStyle={`border-2 border-white dark:border-grey2 bg-grey8 dark:bg-grey4`}
            />
            <Stack className="absolute">
              <Button
                size="icon"
                variant="outline"
                onClick={() => {
                  setShowLogoImageActions(!showLogoImageActions);
                  setAppImageType('logo-image');
                }}
              >
                <SquarePenIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
              </Button>
              {showLogoImageActions && (
                <List items={dropDownActions} customStyle="absolute top-7 w-auto z-10" />
              )}
            </Stack>
          </Stack>
          <Button variant="link" onClick={() => setShowLogoGuidelineModal(true)}>
            <InfoIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
            {logoGuidelines.titleLabel}
          </Button>
        </Stack>
        {showExtraInfo && (
          <Stack
            direction="row"
            spacing={2}
            justifyContent="end"
            alignItems="center"
            className="absolute right-0 -bottom-8"
          >
            <Pill
              type="info"
              label={capitalize(extensionType?.toLowerCase())}
              icon={<ExtensionIcon size={'sm'} type={extensionType} />}
              color={{
                light: 'secondaryLight',
                dark: 'secondaryDark',
              }}
              customStyle="py-0.5 bg-tertiaryLight dark:bg-tertiaryDark"
            />
            {nsfw && (
              <Pill
                type="info"
                label={'NSFW'}
                color={{
                  light: 'errorDark',
                  dark: 'white',
                }}
                customStyle="py-0.5 bg-errorFade dark:bg-errorDark"
              />
            )}
          </Stack>
        )}
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
        images={images}
        rightAlignActions={true}
        dragToRepositionLabel={dragToRepositionLabel}
        errorLabel={cropErrorLabel}
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
      <Modal
        show={showLogoGuidelineModal}
        title={{
          label: logoGuidelines.titleLabel,
          variant: 'h6',
        }}
        onClose={() => setShowLogoGuidelineModal(false)}
      >
        <Stack alignItems="center" spacing={4} className="p-4">
          <ul className="list-disc ml-2 text-black dark:text-white">
            {logoGuidelines.guidelines.map((guideline, index) => (
              <li key={index}>
                <Typography>{guideline}</Typography>
              </li>
            ))}
          </ul>
          <Stack alignItems="center" spacing={4} className="relative">
            <Img
              src={`${publicImagePath}/extension-logo-guidelines.webp`}
              alt="extensions-logo-guideline"
              customStyle={`w-[12.5rem]`}
            />
            <Typography
              variant="xs"
              className="font-medium text-grey4 dark:text-grey6 absolute bottom-0"
            >
              {logoGuidelines.imageDescription}
            </Typography>
          </Stack>
        </Stack>
      </Modal>
      <input ref={uploadInputRef} type="file" onChange={e => onUpload(e.target.files[0])} hidden />
    </Stack>
  );
};
