import React, { useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import { getMediaUrl, saveMediaFile } from '@akashaorg/ui-awf-hooks';
import type { BlockInstanceMethods, ContentBlockRootProps } from '@akashaorg/typings/lib/ui';

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
import { ImageObject } from '@akashaorg/typings/lib/ui';
import {
  XMarkIcon,
  ArrowPathIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import getSDK from '@akashaorg/awf-sdk';

// @TODO: replace this with actual data
const TEST_APP_VERSION_ID = 'kjzl6kcym7w8y5yp2ew8mc4ryswawpn914fm6qhe6bpoobipgu9r1pcwsu441cf';

export const ImageEditorBlock = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  const { t } = useTranslation('app-akasha-integration');
  const sdk = React.useRef(getSDK());
  const [createContentBlock, contentBlockQuery] = useCreateContentBlockMutation();
  const retryCount = React.useRef<number>();
  const [imageLink, setImageLink] = React.useState('');
  const [uiState, setUiState] = React.useState('menu');

  const [images, setImages] = React.useState<ImageObject[]>([]);
  const [alignState, setAlignState] = React.useState<'start' | 'center' | 'end'>('start');
  const [showCaption, setShowCaption] = React.useState(false);
  const [caption, setCaption] = React.useState('');

  const createBlock = React.useCallback(async () => {
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
  }, [alignState, caption, createContentBlock, images, props.blockInfo]);

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
  };

  const uploadInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);
  const [uploading, setUploading] = React.useState(false);
  const [imageUploadDisabled, setImageUploadDisabled] = React.useState(false);

  const handleMediaClick = () => {
    if (uploadInputRef.current && !imageUploadDisabled) {
      uploadInputRef.current.click();
    }
  };

  const onUpload = async (image: File) => {
    if (!image || images.length > 4) return null;
    setUiState('gallery');
    setUploading(true);

    const mediaFile = await saveMediaFile({
      name: image.name || 'beam-block-image',
      isUrl: false,
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
    };
    setImages(prev => [...prev, imageObj]);
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
    setUiState('menu');
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
          <Stack direction="column" spacing="gap-4">
            <Stack direction="column" spacing="gap-2">
              <Stack direction="row" justify="between">
                <Text variant="h6">{t('Add an image')} </Text>
                <Text variant="subtitle2">{`${images.length}/4 ${t('images')}`}</Text>
              </Stack>
              <Text variant="subtitle2">
                {t('You can upload JPEG, PNG, or WebP images to your Beam, up to 1.5MB each.')}
              </Text>
            </Stack>
            <Stack direction="row" justify="between">
              <Text variant="h6">{t('From Device')}</Text>
              <Button
                label={t('Select')}
                variant="text"
                onClick={handleMediaClick}
                disabled={imageUploadDisabled}
              />
            </Stack>
            <Stack direction="column" spacing="gap-2">
              <Text variant="subtitle2">{t('Or upload an image using a URL')}</Text>
              <Stack direction="row" justify="between">
                <TextField
                  value={imageLink}
                  placeholder={t('Paste image link')}
                  type={'text'}
                  onChange={handleChange}
                  disabled={imageUploadDisabled}
                />
                <Button label={t('Upload')} variant="text" />
              </Stack>
            </Stack>
            <Stack direction="column" spacing="gap-2" customStyle="overflow-auto">
              {images.map((imageObj, index) => (
                <Stack key={index} direction="row" justify="between">
                  <Stack direction="row" spacing="gap-1">
                    <Image src={imageObj.src.url} customStyle="object-contain w-8 h-8" />
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
          justifySelf="center"
          background={{ light: 'grey3', dark: 'grey5' }}
          spacing="gap-2"
        >
          <Icon icon={<ArrowPathIcon />} rotateAnimation />
          <Text>{t('Uploading image')}</Text>
        </Stack>
      )}
      {uiState === 'gallery' && images.length !== 0 && (
        <Stack spacing="gap-1">
          <Stack alignSelf={alignState}>
            <ImageBlockGallery images={images} />
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
        </Stack>
      )}
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        onChange={e => onUpload(e.target.files[0])}
        hidden
      />
    </>
  );
};
