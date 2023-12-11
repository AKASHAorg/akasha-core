import * as React from 'react';
import {
  BlockInstanceMethods,
  ContentBlockModes,
  ContentBlockRootProps,
} from '@akashaorg/typings/lib/ui';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import type { AkashaBeamInput } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { useCreateBeamMutation } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

/**
 * Steps when publishBeam is called:
 * - check if every used blocks is valid for publishing
 * - call async fn `createBlock` method on each block
 * when each block si successfully published:
 * - publish the beam
 * - add the beam to indexing service
 */

// this can be made configurable via world config
const DEFAULT_TEXT_BLOCK = 'slate-block';

export const useBlocksPublishing = () => {
  const [availableBlocks, setAvailableBlocks] = React.useState([]);
  const globalIdx = React.useRef(0);

  const { getExtensionsPlugin } = useRootComponentProps();
  React.useLayoutEffect(() => {
    if (getExtensionsPlugin()) {
      setAvailableBlocks(getExtensionsPlugin().contentBlockStore.getInfos());
    }
  }, [getExtensionsPlugin]);

  const [createBeam, createBeamQuery] = useCreateBeamMutation();

  const [isPublishing, setIsPublishing] = React.useState(false);

  const [blocksInUse, setBlocksInUse] = React.useState<
    (ContentBlockRootProps['blockInfo'] & {
      appName: string;
      blockRef: React.RefObject<BlockInstanceMethods>;
      key: number;
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
          key: 0,
        },
      ]);
      globalIdx.current = 1;
    }
  }, [blocksInUse, defaultTextBlock]);

  React.useEffect(() => {
    if (!blocksInUse.length) return;
    if (blocksInUse.every(bl => bl.status === 'success')) {
      const beamContent: AkashaBeamInput = {
        active: true,
        content: blocksInUse.map(blockData => ({
          blockID: blockData.response?.blockID,
          order: blockData.order,
        })),
        createdAt: new Date().toISOString(),
      };

      if (createBeamQuery.loading || createBeamQuery.error) return;

      createBeam({
        variables: {
          i: {
            content: beamContent,
          },
        },
      })
        .then(() => {
          setBlocksInUse([]);
          setIsPublishing(false);
        })
        .catch(err => {
          // @TODO: handle errors!
          console.error('error creating beam.', err);
        });
    }
  }, [blocksInUse, createBeam, createBeamQuery]);

  const createContentBlocks = React.useCallback(async () => {
    setIsPublishing(true);
    for (const [idx, block] of blocksInUse.entries()) {
      if (!block.status) {
        setBlocksInUse(prev => [
          ...prev.slice(0, idx),
          { ...block, status: 'pending' },
          ...prev.slice(idx + 1),
        ]);
        try {
          const data = await block.blockRef.current.createBlock();
          if (data.response && data.response.blockID) {
            setBlocksInUse(prev => [
              ...prev.slice(0, idx),
              { ...block, status: 'success', response: data.response },
              ...prev.slice(idx + 1),
            ]);
          }
          if (data.response && data.response.error) {
            setBlocksInUse(prevState => [
              ...prevState.slice(0, idx),
              { ...block, status: 'error', response: data.response },
              ...prevState.slice(idx + 1),
            ]);
          }
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, [blocksInUse]);

  // convenience method to add a new block into the beam editor
  // if index (idx) param is omitted, it will be added as the last block in the list
  const addBlockToList = (
    selectedBlock: { propertyType: string; appName: string },
    afterIdx?: number,
  ) => {
    const block = availableBlocks.find(
      bl => bl.propertyType === selectedBlock.propertyType && bl.appName === selectedBlock.appName,
    );

    if (afterIdx) {
      setBlocksInUse(prev => [
        ...prev.slice(0, afterIdx),
        {
          ...block,
          order: afterIdx,
          blockRef: React.createRef<BlockInstanceMethods>(),
          mode: ContentBlockModes.EDIT,
          key: globalIdx.current + 1,
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
        key: globalIdx.current + 1,
      },
    ]);
    globalIdx.current += 1;
  };

  const removeBlockFromList = (index: number) => {
    setBlocksInUse(prev => {
      const beforeSlice = prev.slice(0, index);
      const afterSlice = prev.slice(index + 1).map(bl => ({ ...bl, order: bl.order - 1 }));
      return beforeSlice.concat(afterSlice);
    });
  };

  return {
    isPublishing,
    setIsPublishing,
    createContentBlocks,
    blocksInUse,
    addBlockToList,
    removeBlockFromList,
    availableBlocks,
  };
};
