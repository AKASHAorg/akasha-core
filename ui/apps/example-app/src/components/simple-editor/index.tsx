import React, { useEffect, useLayoutEffect } from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { useTranslation } from 'react-i18next';
import { EditorBlockExtension } from '@akashaorg/ui-lib-extensions/lib/react/content-block/editor-block-extension';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import {
  type BlockInstanceMethods,
  ContentBlockModes,
  type ContentBlockRootProps,
} from '@akashaorg/typings/lib/ui';

type SimpleEditorProps = {};

/**
 * A simplified editor example. For a more complete version see:
 * https://github.com/AKASHAorg/akasha-core/blob/next/ui/apps/akasha/src/extensions/beam-editor/beam-editor.tsx
 */

const SimpleEditor: React.FC<SimpleEditorProps> = () => {
  const { getExtensionsPlugin } = useRootComponentProps();
  const DEFAULT_BLOCK_TYPE = 'text-block';
  const availableBlocks = React.useMemo(
    () => getExtensionsPlugin().contentBlockStore.getInfos(),
    [getExtensionsPlugin],
  );
  const [blocksInUse, setBlocksInUse] = React.useState<
    (ContentBlockRootProps['blockInfo'] & {
      appName: string;
      blockRef: React.RefObject<BlockInstanceMethods>;
      key: number;
      status?: 'success' | 'pending' | 'error';
      response?: { blockID: string; error?: string };
      disablePublish?: boolean;
    })[]
  >([]);

  useLayoutEffect(() => {
    const defaultTextBlock = availableBlocks.find(bl => bl.propertyType === DEFAULT_BLOCK_TYPE);
    if (availableBlocks.length && !blocksInUse.length) {
      setBlocksInUse([
        {
          ...defaultTextBlock,
          order: 0,
          mode: ContentBlockModes.EDIT,
          blockRef: React.createRef<BlockInstanceMethods>(),
          key: 0,
        },
      ]);
    }
  }, [availableBlocks, blocksInUse.length]);

  const { t } = useTranslation();

  const handleSubmit = () => {
    // create the beam
    console.log('create the beam');
  };

  const setFocusedBlock = (blockId: number) => {
    return;
  };

  return (
    <Card>
      {!availableBlocks.length && <div>{t('No available blocks.')}</div>}
      {blocksInUse.map((blockData, idx) => (
        <Card
          key={blockData.key}
          id={`${blockData.propertyType}-${idx}`}
          type="plain"
          onClick={() => setFocusedBlock(blockData.key)}
        >
          <EditorBlockExtension
            propertyType={blockData.propertyType}
            appName={blockData.appName}
            blockRef={blockData.blockRef}
          />
        </Card>
      ))}
      <>
        <Button
          variant="primary"
          customStyle="flex place-self-end"
          label={`${t('Beam it')}`}
          onClick={handleSubmit}
        />
      </>
    </Card>
  );
};

export default SimpleEditor;
