import * as React from 'react';
import {
  BlockInstanceMethods,
  ContentBlockModes,
  ContentBlockRootProps,
} from '@akashaorg/typings/lib/ui';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import type { AkashaBeamInput } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { useCreateBeamMutation } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import getSDK from '@akashaorg/core-sdk';
import type { CreateBeamMutation } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';

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
const MAX_ALLOWED_BLOCKS = 10;
const MAX_ALLOWED_TAGS = 10;
export type UseBlocksPublishingProps = {
  onComplete?: (beamData: CreateBeamMutation['createAkashaBeam']) => void;
};
export const useBlocksPublishing = (props: UseBlocksPublishingProps) => {
  const { onComplete } = props;
  const [availableBlocks, setAvailableBlocks] = React.useState([]);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [errors, setErrors] = React.useState<Error[]>([]);
  const sdk = React.useRef(getSDK());
  const [isNsfw, setIsNsfw] = React.useState(false);
  const [editorTags, setEditorTags] = React.useState([]);
  const { getCorePlugins } = useRootComponentProps();

  React.useLayoutEffect(() => {
    if (getCorePlugins()) {
      setAvailableBlocks(getCorePlugins().contentBlockStore.getInfos());
    }
  }, [getCorePlugins]);

  const [createBeam, createBeamQuery] = useCreateBeamMutation({
    context: { source: sdk.current.services.gql.contextSources.composeDB },
  });

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
          key: crypto.randomUUID(),
        },
      ]);
    }
  }, [blocksInUse, defaultTextBlock]);

  React.useEffect(() => {
    if (!blocksInUse.length) return;
    if (blocksInUse.every(bl => bl.status === 'success')) {
      const tagLabelType = sdk.current.services.gql.labelTypes.TAG;
      const tags = editorTags.map(tagName => {
        return {
          labelType: tagLabelType,
          value: tagName,
        };
      });
      const beamContent: AkashaBeamInput = {
        active: true,
        nsfw: isNsfw,
        tags: tags,
        content: blocksInUse.map(blockData => ({
          blockID: blockData.response?.blockID,
          order: blockData.order,
        })),
        createdAt: new Date().toISOString(),
      };

      if (createBeamQuery.loading || createBeamQuery.error) return;
      if (createBeamQuery.called) return;

      createBeam({
        variables: {
          i: {
            content: beamContent,
          },
        },
      })
        .then(resp => {
          setBlocksInUse([]);
          setIsPublishing(false);
          onComplete?.(resp.data.createAkashaBeam);
        })
        .catch(err => {
          setErrors(prev => [...prev, new Error(`failed to create beam: ${err.message}`)]);
        });
    }
  }, [blocksInUse, createBeam, createBeamQuery, isNsfw, editorTags]);

  const createContentBlocks = React.useCallback(
    async (nsfw: boolean, editorTags: string[], blocksWithActiveNsfw: Map<number, boolean>) => {
      setIsPublishing(true);
      setIsNsfw(nsfw);
      setEditorTags(editorTags);
      for (const [idx, block] of blocksInUse.entries()) {
        if (!block.status) {
          setBlocksInUse(prev => [
            ...prev.slice(0, idx),
            { ...block, status: 'pending' },
            ...prev.slice(idx + 1),
          ]);
          try {
            const data = await block.blockRef.current.createBlock({
              nsfw: !!blocksWithActiveNsfw.get(idx),
            });
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
            setErrors(prev => [
              ...prev,
              new Error(`Failed to create content blocks: ${err.message}`),
            ]);
            const data = await block.blockRef.current.createBlock({
              nsfw: !!blocksWithActiveNsfw.get(idx),
            });
            if (data.response) {
              setBlocksInUse(prev => [
                ...prev.slice(0, idx),
                { ...block, status: 'success', response: data.response },
                ...prev.slice(idx + 1),
              ]);
            }
          }
        }
      }
    },
    [blocksInUse],
  );

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
          key: crypto.randomUUID(),
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
        key: crypto.randomUUID(),
      },
    ]);
  };

  const removeBlockFromList = (index: number) => {
    setBlocksInUse(prev => {
      const filtered = prev.filter(bl => bl.order !== index);
      const reordered = filtered.map((bl, idx) => {
        return {
          ...bl,
          order: idx,
        };
      });
      return reordered;
    });
  };

  const increaseBlockOrder = (index: number) => {
    if (index < blocksInUse.length - 1) {
      setBlocksInUse(prev => {
        const blockToBeReordered = prev[index];
        const blockAfter = prev[index + 1];
        return [
          ...prev.slice(0, index),
          {
            ...blockAfter,
            order: blockAfter?.order - 1,
          },
          {
            ...blockToBeReordered,
            order: blockToBeReordered?.order + 1,
          },
          ...prev.slice(index + 2),
        ];
      });
    }
  };

  const decreaseBlockOrder = (index: number) => {
    if (index > 0) {
      setBlocksInUse(prev => {
        const blockToBeReordered = prev[index];
        const blockBefore = prev[index - 1];
        return [
          ...prev.slice(0, index - 1),

          {
            ...blockToBeReordered,
            order: blockToBeReordered?.order - 1,
          },
          {
            ...blockBefore,
            order: blockBefore?.order + 1,
          },
          ...prev.slice(index + 1),
        ];
      });
    }
  };

  const updateBlockDisablePublishState = (value: boolean, key: number) => {
    setBlocksInUse(prev => {
      const next = prev.map(elem => {
        if (elem.key === key) {
          return { ...elem, disablePublish: value };
        } else {
          return elem;
        }
      });
      return next;
    });
  };

  const formattedErrors = React.useMemo(() => {
    const err = [];
    if (errors.length) {
      err.push(errors.map(err => err.message));
    }
    if (createBeamQuery.error) {
      err.push(createBeamQuery.error.message);
    }
    return err;
  }, [createBeamQuery.error, errors]);

  return {
    isPublishing,
    setIsPublishing,
    createContentBlocks,
    blocksInUse,
    maxAllowedBlocks: MAX_ALLOWED_BLOCKS,
    maxAllowedTags: MAX_ALLOWED_TAGS,
    addBlockToList,
    removeBlockFromList,
    increaseBlockOrder,
    decreaseBlockOrder,
    updateBlockDisablePublishState,
    availableBlocks,
    errors: formattedErrors,
    isLoading: createBeamQuery.loading,
  };
};
