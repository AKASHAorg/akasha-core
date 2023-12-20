import React, { useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { getMediaUrl, saveMediaFile, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import {
  type BlockInstanceMethods,
  type ContentBlockRootProps,
  NotificationEvents,
} from '@akashaorg/typings/lib/ui';
import { useCreateContentBlockMutation } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import {
  AkashaContentBlockBlockDef,
  type AkashaContentBlockLabeledValueInput,
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
import { type ImageObject } from '@akashaorg/typings/lib/ui';
import {
  XMarkIcon,
  ArrowPathIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import getSDK from '@akashaorg/awf-sdk';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';

// @TODO: replace this with actual data
const TEST_APP_VERSION_ID = 'kjzl6kcym7w8y8af3kd0lwkkk2m1nxtchlvcikbak748md3m3gplz1ori3s1j5f';

const isImgUrl = url => {
  return fetch(url, { method: 'HEAD' }).then(res => {
    return res.headers.get('Content-Type').startsWith('image');
  });
};

export const ImageEditorBlock = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  const { t } = useTranslation('app-akasha-integration');
  const sdk = React.useRef(getSDK());
  const { uiEvents } = useRootComponentProps();
  const _uiEvents = React.useRef(uiEvents);
  const [createContentBlock, contentBlockQuery] = useCreateContentBlockMutation();
  const retryCount = React.useRef<number>();
  const [imageLink, setImageLink] = React.useState('');
  const [uiState, setUiState] = React.useState('menu');

  const [contentBlockImages, setContentBlockImages] = React.useState<ImageObject[]>([]);
  const imageGalleryImages = React.useMemo(
    () =>
      contentBlockImages.map(imageObj => {
        return {
          src: imageObj.displaySrc,
          size: imageObj.size,
          name: imageObj.name,
          originalSrc: imageObj.originalSrc,
        };
      }),
    [contentBlockImages],
  );
  const imageUrls = React.useMemo(
    () => contentBlockImages.map(imageObj => imageObj.displaySrc),
    [contentBlockImages],
  );
  const [alignState, setAlignState] = React.useState<'start' | 'center' | 'end'>('start');
  const [showCaption, setShowCaption] = React.useState(false);
  const [caption, setCaption] = React.useState('');
  const [showEditModal, setShowEditModal] = React.useState(false);

  const createBlock = React.useCallback(async () => {
    const imageData = {
      images: contentBlockImages.map(imageObj => {
        return {
          src: imageObj?.src,
          size: imageObj?.size,
          name: imageObj?.name,
        };
      }),
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
      const resp = await createContentBlock({
        variables: {
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
        },
        context: { source: sdk.current.services.gql.contextSources.composeDB },
      });
      return {
        response: { blockID: resp.data.createAkashaContentBlock.document.id },
        blockInfo: props.blockInfo,
        retryCount: retryCount.current,
      };
    } catch (err) {
      console.error('error creating content block', err);
      return {
        response: {
          blockID: null,
          error: err.message,
        },
        blockInfo: props.blockInfo,
        retryCount: retryCount.current,
      };
    }
  }, [alignState, caption, createContentBlock, contentBlockImages, props.blockInfo]);

  const retryCreate = React.useCallback(async () => {
    if (contentBlockQuery.called) {
      contentBlockQuery.reset();
    }
    retryCount.current += 1;
    return createBlock();
  }, [contentBlockQuery, createBlock]);

  useImperativeHandle(
    props.blockRef,
    () => ({
      createBlock: createBlock,
      retryBlockCreation: retryCreate,
    }),
    [createBlock, retryCreate],
  );

  const handleChange = e => {
    setImageLink(e.currentTarget.value);
    if (!isImgUrl(e.currentTarget.value)) {
      const notifMsg = t(`URL doesn't contain an image.`);
      _uiEvents.current.next({
        event: NotificationEvents.ShowNotification,
        data: {
          name: 'error',
          message: notifMsg,
        },
      });
    }
  };

  const uploadInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);
  const [uploading, setUploading] = React.useState(false);
  const [imageUploadDisabled, setImageUploadDisabled] = React.useState(false);

  const handleMediaClick = () => {
    if (uploadInputRef.current && !imageUploadDisabled) {
      uploadInputRef.current.click();
    }
  };

  const onUpload = async (image: File | string, isUrl?: boolean) => {
    if (!image || contentBlockImages.length > 4) return null;
    setUiState('gallery');
    setUploading(true);

    const imageName = typeof image === 'string' ? image : image.name || 'beam-block-image';

    const mediaFile = await saveMediaFile({
      name: imageName,
      isUrl: isUrl || false,
      content: image,
    });
    setUploading(false);
    if (!mediaFile) return null;

    const mediaUri = `ipfs://${mediaFile.CID}`;

    const mediaUrl = getMediaUrl(mediaUri);

    const imageObj = {
      size: { height: mediaFile.size.height, width: mediaFile.size.width },
      displaySrc: mediaUrl.originLink || mediaUrl.fallbackLink,
      src: mediaUri,
      name: imageName,
      originalSrc: typeof image === 'string' ? image : URL.createObjectURL(image),
    };

    return imageObj;
  };

  const uploadNewImage = async (image: File | string, isUrl?: boolean) => {
    const uploadedImage = await onUpload(image, isUrl);
    setContentBlockImages(prev => [
      ...prev,
      {
        name: uploadedImage?.name,
        src: uploadedImage?.src,
        displaySrc: uploadedImage?.displaySrc,
        originalSrc: uploadedImage?.originalSrc,
        size: uploadedImage?.size,
      },
    ]);
  };

  const uploadEditedImage = async (image: File, indexOfEditedImage: number) => {
    const uploadedImage = await onUpload(image);
    const oldImage = contentBlockImages[indexOfEditedImage];
    setContentBlockImages(prev => [
      ...prev.slice(0, indexOfEditedImage),
      {
        name: oldImage?.name,
        src: uploadedImage?.src,
        displaySrc: uploadedImage?.displaySrc,
        originalSrc: uploadedImage?.originalSrc,
        size: uploadedImage?.size,
      },
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
    const newImages = contentBlockImages.filter(image => image.src !== element.src);

    if (newImages.length < 4) {
      setImageUploadDisabled(false);
    }
    if (newImages.length === 0) {
      setUiState('menu');
    }
    setContentBlockImages(newImages);
    const notifMsg = t('Uploaded image removed.');
    _uiEvents.current.next({
      event: NotificationEvents.ShowNotification,
      data: {
        name: 'success',
        message: notifMsg,
      },
    });
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
                  customStyle="w-5/6"
                />
                <Button
                  label={t('Add')}
                  variant="secondary"
                  disabled={!imageLink}
                  onClick={() => uploadNewImage(imageLink, true)}
                />
              </Stack>
            </Stack>
            <Divider />
            <Stack direction="column" spacing="gap-2" customStyle="overflow-auto pt-8">
              <Stack direction="row" justify="between">
                <Text variant="h6">{t('Uploaded images')} </Text>
                <Text variant="subtitle2">{`${contentBlockImages.length}/4 ${t('images')}`}</Text>
              </Stack>
              {contentBlockImages.map((imageObj, index) => (
                <Stack key={index} direction="row" justify="between">
                  <Stack direction="row" spacing="gap-1">
                    <Image
                      alt={imageObj.name}
                      src={imageObj.displaySrc}
                      customStyle="object-contain w-8 h-8 rounded-lg"
                    />
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
      {uiState === 'gallery' && uploading && contentBlockImages.length === 0 && (
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
      {uiState === 'gallery' && imageGalleryImages.length !== 0 && (
        <Stack spacing="gap-1">
          <Stack alignSelf={alignState}>
            <ImageBlockGallery images={imageGalleryImages} />
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
