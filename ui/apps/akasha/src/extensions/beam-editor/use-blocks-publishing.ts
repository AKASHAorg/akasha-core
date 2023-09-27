import * as React from 'react';
import {
  BlockInstanceMethods,
  ContentBlockModes,
  ContentBlockRootProps,
} from '@akashaorg/typings/lib/ui';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { AkashaBeamInput } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { useCreateBeamMutation } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

/**
 * Steps when publishBeam is called:
 * - check if every used blocks is valid for publishing
 * - fire an event for each block to trigger contentBlockCreation
 * - listen for a generic event to gather contentBlockData for each block
 * when each block si successfully published:
 * - publish the beam
 * - *
 */

// this can be made configurable via world config
const DEFAULT_TEXT_BLOCK = 'slate-block';

export const useBlocksPublishing = () => {
  const [availableBlocks, setAvailableBlocks] = React.useState([]);
  const { getExtensionsPlugin } = useRootComponentProps();
  React.useLayoutEffect(() => {
    if (getExtensionsPlugin()) {
      setAvailableBlocks(getExtensionsPlugin().contentBlockStore.getInfos());
    }
  }, [getExtensionsPlugin]);

  const createBeam = useCreateBeamMutation();

  const [isPublishing, setIsPublishing] = React.useState(false);

  const [blocksInUse, setBlocksInUse] = React.useState<
    (ContentBlockRootProps['blockInfo'] & {
      appName: string;
      blockRef: React.RefObject<any>;
      status?: 'success' | 'pending' | 'error';
      response?: { blockID: string; error?: string };
    })[]
  >([]);

  const defaultTextBlock = availableBlocks.find(block => block.propertyType === DEFAULT_TEXT_BLOCK);

  // always add the default block
  React.useEffect(() => {
    if (blocksInUse.length === 0) {
      setBlocksInUse([
        {
          ...defaultTextBlock,
          order: 0,
          mode: ContentBlockModes.EDIT,
          blockRef: React.createRef<BlockInstanceMethods>(),
        },
      ]);
    }
  }, [blocksInUse, defaultTextBlock]);

  React.useEffect(() => {
    if (!blocksInUse.length) return;
    if (blocksInUse.every(bl => bl.status === 'success')) {
      const beamContent: AkashaBeamInput = {
        active: true,
        content: blocksInUse.map(blockData => ({
          blockID: blockData.response.blockID,
          order: blockData.order,
        })),
        createdAt: new Date().toISOString(),
      };

      if (createBeam.isLoading || createBeam.error) return;

      createBeam
        .mutateAsync({
          i: {
            content: beamContent,
          },
        })
        .then(res => {
          console.info('Beam successfully created', res);
          setBlocksInUse([]);
          setIsPublishing(false);
        })
        .catch(err => {
          // @TODO: handle errors!
          console.error('error creating beam.', err);
        });
    }
  }, [blocksInUse]);

  const createContentBlocks = React.useCallback(async () => {
    setIsPublishing(true);
    for (const [idx, block] of blocksInUse.entries()) {
      if (block.status !== 'success' && block.status !== 'pending') {
        setBlocksInUse(prev => [
          ...prev.slice(0, idx),
          { ...block, status: 'pending' },
          ...prev.slice(idx + 1),
        ]);
        const data = await block.blockRef.current.createBlock();
        if (data.response) {
          console.log('block:', data.blockInfo, 'created successfully...');
          setBlocksInUse(prev => [
            ...prev.slice(0, idx),
            { ...block, status: 'success', response: data.response },
            ...prev.slice(idx + 1),
          ]);
        }
      }
    }
  }, [blocksInUse]);

  // convenience method to add a new block into the beam editor
  // if index (idx) param is omitted, it will be added as the last block in the list
  const addBlockToList = (selectedBlock: { id: string; appName: string }, afterIdx: number) => {
    const block = availableBlocks.find(
      bl => bl.propertyType === selectedBlock.id && bl.appName === selectedBlock.appName,
    );

    if (afterIdx) {
      setBlocksInUse(prev => [
        ...prev.slice(0, afterIdx),
        {
          ...block,
          order: afterIdx,
          blockRef: React.createRef<BlockInstanceMethods>(),
          mode: ContentBlockModes.EDIT,
        },
        ...prev.slice(afterIdx).map(bl => ({
          ...bl,
          order: bl.order + 1,
        })),
      ]);
    }
    setBlocksInUse(prev => [
      ...prev,
      {
        ...block,
        order: prev.length,
        blockRef: React.createRef<BlockInstanceMethods>(),
        mode: ContentBlockModes.EDIT,
      },
    ]);
  };

  return {
    isPublishing,
    setIsPublishing,
    createContentBlocks,
    blocksInUse,
    addBlockToList,
    availableBlocks,
  };
};
