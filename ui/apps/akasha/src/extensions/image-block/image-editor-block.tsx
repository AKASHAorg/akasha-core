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
import ImageGallery from '@akashaorg/design-system-components/lib/components/ImageGallery';
import { ImageObject } from '@akashaorg/design-system-components/lib/components/ImageGallery/image-grid-item';

// @TODO: replace this with actual data
const TEST_APP_VERSION_ID = 'kjzl6kcym7w8y5yp2ew8mc4ryswawpn914fm6qhe6bpoobipgu9r1pcwsu441cf';

export const ImageEditorBlock = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  const { t } = useTranslation('app-akasha-integration');
  const createContentBlock = useCreateContentBlockMutation();

  const [uploadedImages, setUploadedImages] = React.useState([]);

  useImperativeHandle(
    props.blockRef,
    () => ({
      createBlock: async () => {
        const content = JSON.stringify(uploadedImages);
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
    [uploadedImages, props.blockInfo],
  );

  const [imageLink, setImageLink] = React.useState('');

  const handleChange = e => {
    setImageLink(e.currentTarget.value);
  };

  const uploadInputRef: React.RefObject<HTMLInputElement> = React.useRef(null);
  const [uploading, setUploading] = React.useState(false);
  const [imageUploadDisabled, setImageUploadDisabled] = React.useState(false);

  const [images, setImages] = React.useState<ImageObject[]>([]);

  const handleMediaClick = () => {
    if (uploadInputRef.current && !imageUploadDisabled) {
      uploadInputRef.current.click();
    }
  };

  const onUpload = async (image: File) => {
    if (!image) return null;
    setUiState('gallery');
    setUploading(true);

    const mediaFile = await saveMediaFile({
      name: 'beam-block-image',
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

  const [uiState, setUiState] = React.useState('menu');

  return (
    <>
      {uiState === 'menu' && (
        <Card background={{ dark: 'grey3', light: 'grey9' }}>
          <Stack direction="column" spacing="gap-4">
            <Stack direction="column" spacing="gap-2">
              <Stack direction="row" justify="between">
                <Text variant="h6">{t('Add an image')} </Text>
                <Text variant="subtitle2">{`${uploadedImages.length}/4 ${t('images')}`}</Text>
              </Stack>
              <Text variant="subtitle2">
                {t('You can upload JPEG, PNG, or WebP images to your Beam, up to 1.5MB each.')}
              </Text>
            </Stack>
            <Stack direction="row" justify="between">
              <Text variant="h6">{t('From Device')}</Text>
              <Button label={t('Select')} variant="text" onClick={handleMediaClick} />
            </Stack>
            <Stack direction="column" spacing="gap-2">
              <Text variant="subtitle2">{t('Or upload an image using a URL')}</Text>
              <Stack direction="row" justify="between">
                <TextField
                  value={imageLink}
                  placeholder={t('Paste image link')}
                  type={'text'}
                  onChange={handleChange}
                />
                <Button label={t('Upload')} variant="text" />
              </Stack>
            </Stack>
          </Stack>
        </Card>
      )}
      {uiState === 'gallery' && uploading && <Stack>Loading</Stack>}
      {uiState === 'gallery' && images.length && <ImageGallery images={images} />}
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
