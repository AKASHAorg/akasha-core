import React, { useImperativeHandle } from 'react';
import { useTranslation } from 'react-i18next';
import {} from '@akashaorg/ui-awf-hooks';
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

  return (
    <Card background={{ dark: 'grey3', light: 'grey9' }}>
      <Stack direction="column" padding={16} justify="evenly">
        <Stack direction="column" spacing="gap-2">
          <Stack direction="row" justify="between">
            <Text variant="h5">{t('Add an image')} </Text>
            <Text>{`${uploadedImages.length}/4 ${t('images')}`}</Text>
          </Stack>
          <Text variant="subtitle1">
            {t('You can upload JPEG, PNG, or WebP images to your Beam, up to 1.5MB each.')}
          </Text>
        </Stack>
        <Stack direction="row" justify="between">
          <Text variant="h5">{t('From Device')}</Text>
          <Button label={t('Select')} variant="text" />
        </Stack>
        <Stack direction="column" spacing="gap-1">
          <Text variant="subtitle1">{t('Or upload an image using a URL')}</Text>
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
  );
};
