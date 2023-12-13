import React, { useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { getMediaUrl, saveMediaFile } from '@akashaorg/ui-awf-hooks';
import { BlockInstanceMethods, ContentBlockRootProps } from '@akashaorg/typings/lib/ui';

import { useCreateContentBlockMutation } from '@akashaorg/ui-awf-hooks/lib/generated';
import {
  AkashaContentBlockBlockDef,
  AkashaContentBlockLabeledValueInput,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';
import ImageBlockGallery from '@akashaorg/design-system-components/lib/components/ImageBlockGallery';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import ImageBlockToolbar from '@akashaorg/design-system-components/lib/components/ImageBlockToolbar';
import EditImageModal from '@akashaorg/design-system-components/lib/components/EditImageModal';
import { ImageObject } from '@akashaorg/typings/lib/ui';
import {
  XMarkIcon,
  ArrowPathIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';

// @TODO: replace this with actual data
const TEST_APP_VERSION_ID = 'kjzl6kcym7w8y5yp2ew8mc4ryswawpn914fm6qhe6bpoobipgu9r1pcwsu441cf';

export const ImageEditorBlock = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  const { t } = useTranslation('app-akasha-integration');
  const createContentBlock = useCreateContentBlockMutation();

  const [imageLink, setImageLink] = React.useState('');
  const [uiState, setUiState] = React.useState('menu');

  const [images, setImages] = React.useState<ImageObject[]>([]);
  const imageUrls = React.useMemo(() => images.map(imageObj => imageObj.src?.url), [images]);
  const [alignState, setAlignState] = React.useState<'start' | 'center' | 'end'>('start');
  const [showCaption, setShowCaption] = React.useState(false);
  const [caption, setCaption] = React.useState('');
  const [showEditModal, setShowEditModal] = React.useState(false);

  useImperativeHandle(
    props.blockRef,
    () => ({
      createBlock: async () => {
        const imageData = {
          images,
          caption,
          align: alignState,
        };
        const content = JSON.stringify(imageData);
        const contentBlockValue: AkashaContentBlockLabeledValueInput = {
          label: props.blockInfo.appName,
          propertyType: props.blockInfo.propertyType,
          value: content,
        };
        try {
          const resp = await createContentBlock.mutateAsync({
            i: {
              content: {
                // @TODO: replace this mock appVersionID
                appVersionID: TEST_APP_VERSION_ID,
                createdAt: new Date().toISOString(),
                content: [contentBlockValue],
                active: true,
                kind: AkashaContentBlockBlockDef.Other,
              },
            },
          });
          return {
            response: { blockID: resp.createAkashaContentBlock.document.id },
            blockInfo: props.blockInfo,
          };
        } catch (err) {
          console.error('error creating content block', err);
          return {
            response: {
              error: err.message,
            },
            blockInfo: props.blockInfo,
          };
        }
      },
    }),
    [createContentBlock, images, alignState, caption, props.blockInfo],
  );

  const handleChange = e => {
    setImageLink(e.currentTarget.value);
  };

  const uploadInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);
  const [uploading, setUploading] = React.useState(false);
  const [imageUploadDisabled, setImageUploadDisabled] = React.useState(false);

  const handleMediaClick = () => {
    if (uploadInputRef.current && !imageUploadDisabled) {
      uploadInputRef.current.click();
    }
  };

  const onUpload = async (image: File, isUrl?: boolean) => {
    if (!image || images.length > 4) return null;
    setUiState('gallery');
    setUploading(true);

    const mediaFile = await saveMediaFile({
      name: image.name || 'beam-block-image',
      isUrl: isUrl || false,
      content: image,
    });
    setUploading(false);
    if (!mediaFile) return null;

    const mediaUri = `ipfs://${mediaFile.CID}`;

    const mediaUrl = getMediaUrl(mediaUri);

    const imageObj = {
      size: { height: mediaFile.size.height, width: mediaFile.size.width },
      src: { url: mediaUrl.originLink || mediaUrl.fallbackLink },
      name: image.name,
      originalSrc: URL.createObjectURL(image),
    };

    return imageObj;
  };

  const [editorImages, setEditorImages] = React.useState([]);
  const uploadNewImage = async (image: File) => {
    const uploadedImage = await onUpload(image);
    setEditorImages(prev => [...prev, uploadedImage]);
    setImages(prev => [
      ...prev,
      { size: uploadedImage?.size, src: uploadedImage?.src, name: uploadedImage?.name },
    ]);
  };

  const uploadEditedImage = async (image: File, indexOfEditedImage: number) => {
    const uploadedImage = await onUpload(image);
    const oldImage = editorImages[indexOfEditedImage];
    setEditorImages(prev => [
      ...prev.slice(0, indexOfEditedImage),
      {
        name: oldImage.name,
        src: uploadedImage.src,
        originalSrc: uploadedImage.src,
        size: uploadedImage.size,
      },
      ...prev.slice(indexOfEditedImage + 1),
    ]);
    setImages(prev => [
      ...prev.slice(0, indexOfEditedImage),
      { size: uploadedImage?.size, src: uploadedImage?.src, name: uploadedImage?.name },
      ...prev.slice(indexOfEditedImage + 1),
    ]);
    setCanCloseModal(true);
  };

  const [canCloseModal, setCanCloseModal] = React.useState(false);
  React.useEffect(() => {
    if (!uploading && showEditModal && canCloseModal) {
      setShowEditModal(false);
      setCanCloseModal(false);
    }
  }, [uploading, showEditModal, canCloseModal]);

  const handleCloseModal = () => {
    setCanCloseModal(true);
  };

  const handleDeleteImage = (element: ImageObject) => {
    const newImages = images.filter(image => image.src !== element.src);
    if (newImages.length < 4) {
      setImageUploadDisabled(false);
    }
    if (newImages.length === 0) {
      setUiState('menu');
    }
    setImages(newImages);
  };

  const handleClickAddImage = () => {
    setUiState('menu');
  };

  const handleClickEdit = () => {
    setShowEditModal(true);
  };

  const handleCaptionClick = () => {
    setShowCaption(!showCaption);
  };

  const handleLeftAlignClick = () => {
    setAlignState('start');
  };
  const handleCenterAlignClick = () => {
    setAlignState('center');
  };
  const handleRightAlignClick = () => {
    setAlignState('end');
  };

  const handleCaptionChange = e => {
    setCaption(e.currentTarget.value);
  };

  return (
    <>
      {uiState === 'menu' && (
        <Card background={{ dark: 'grey3', light: 'grey9' }}>
          <Stack direction="column">
            <Stack customStyle="pb-8">
              <Button
                label={t('Add an image from device')}
                variant="primary"
                customStyle="w-full sm:w-48"
                onClick={handleMediaClick}
                disabled={imageUploadDisabled}
              />
            </Stack>
            <Divider />
            <Stack direction="column" spacing="gap-2" customStyle="py-8">
              <Text variant="h6">{t('From URL')}</Text>
              <Stack direction="row" justify="between">
                <TextField
                  value={imageLink}
                  placeholder={t('Paste image link')}
                  altBg
                  fullWidth
                  type={'text'}
                  onChange={handleChange}
                  disabled={imageUploadDisabled}
                />
                <Button label={t('Add')} variant="secondary" disabled={!imageLink} />
              </Stack>
            </Stack>
            <Divider />
            <Stack direction="column" spacing="gap-2" customStyle="overflow-auto pt-8">
              <Stack direction="row" justify="between">
                <Text variant="h6">{t('Uploaded images')} </Text>
                <Text variant="subtitle2">{`${images.length}/4 ${t('images')}`}</Text>
              </Stack>
              {images.map((imageObj, index) => (
                <Stack key={index} direction="row" justify="between">
                  <Stack direction="row" spacing="gap-1">
                    <Image src={imageObj.src.url} customStyle="object-contain w-8 h-8 rounded-lg" />
                    <Text>{imageObj.name}</Text>
                  </Stack>
                  <button onClick={() => handleDeleteImage(imageObj)}>
                    <Icon accentColor icon={<XMarkIcon />} />
                  </button>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Card>
      )}
      {uiState === 'gallery' && uploading && images.length === 0 && (
        <Stack
          customStyle="w-4/5 h-48 sm:h-60 rounded-xl"
          justify="center"
          align="center"
          background={{ light: 'grey8', dark: 'grey5' }}
          spacing="gap-2"
        >
          <Icon icon={<ArrowPathIcon />} rotateAnimation />
          <Text>{t('Uploading image')}</Text>
        </Stack>
      )}
      {uiState === 'gallery' && editorImages.length !== 0 && (
        <Stack spacing="gap-1">
          <Stack alignSelf={alignState}>
            <ImageBlockGallery images={editorImages} />
          </Stack>
          {showCaption && (
            <TextField
              value={caption}
              placeholder={t('Write caption here')}
              type={'text'}
              onChange={handleCaptionChange}
            />
          )}
          <ImageBlockToolbar
            handleCaptionClick={handleCaptionClick}
            handleLeftAlignClick={handleLeftAlignClick}
            handleCenterAlignClick={handleCenterAlignClick}
            handleRightAlignClick={handleRightAlignClick}
            handleEditClick={handleClickEdit}
            handleAddClick={handleClickAddImage}
            alignState={alignState}
            showCaption={showCaption}
          />
          <EditImageModal
            show={showEditModal}
            title={{ label: t('Edit Image') }}
            cancelLabel={t('Cancel')}
            saveLabel={t('Save')}
            onClose={handleCloseModal}
            images={imageUrls}
            dragToRepositionLabel={t('Drag the image to reposition')}
            isSavingImage={uploading}
            onSave={uploadEditedImage}
          />
        </Stack>
      )}
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={e => uploadNewImage(e.target.files[0])}
        hidden
      />
    </>
  );
};
