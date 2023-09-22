import * as React from 'react';
import {
  BlockAction,
  BlockCommandRequest,
  BlockCommandResponse,
  ContentBlockExtensionInterface,
  ContentBlockModes,
  ContentBlockRootProps,
  RootComponentProps,
} from '@akashaorg/typings/lib/ui';
import { BlockActionType } from '@akashaorg/typings/lib/ui/editor-blocks';
import { filterEvents } from '@akashaorg/ui-awf-hooks';

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

export type UseBlocksPublishingProps = {
  uiEvents: RootComponentProps['uiEvents'];
  availableBlocks: (Omit<ContentBlockExtensionInterface, 'loadingFn'> & { appName: string })[];
  onBeamPublish: (publishedBlocks: BlockCommandResponse['data'][]) => Promise<void>;
};

export const useBlocksPublishing = (props: UseBlocksPublishingProps) => {
  const { uiEvents, availableBlocks, onBeamPublish } = props;
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [blocksInUse, setBlocksInUse] = React.useState<
    (ContentBlockRootProps['blockInfo'] & {
      appName: string;
    })[]
  >([]);

  const [publishedBlocks, setPublishedBlocks] = React.useState<BlockCommandResponse['data'][]>([]);
  const defaultTextBlock = availableBlocks.find(block => block.propertyType === DEFAULT_TEXT_BLOCK);
  const publishBeam = React.useRef(onBeamPublish);

  React.useEffect(() => {
    if (blocksInUse.length === 0) {
      // always add the default block
      setBlocksInUse([{ ...defaultTextBlock, order: 0, mode: ContentBlockModes.EDIT }]);
    }
  }, [blocksInUse, defaultTextBlock]);

  // subscribe to contentBlock creation event
  // add the response along with the block data to the publishedBlocks state
  React.useEffect(() => {
    const blockEvents =
      blocksInUse.map<`${string}_${string}/${BlockAction.PUBLISH}_${BlockActionType.SUCCESS}`>(
        block => `${block.appName}_${block.eventMap.publish}_${BlockActionType.SUCCESS}`,
      );

    const sub = uiEvents.pipe(filterEvents(blockEvents)).subscribe({
      next: (event: BlockCommandResponse) => {
        const blockData = event.data.block;
        if (
          publishedBlocks.some(
            published =>
              published.block.propertyType === blockData.propertyType &&
              published.block.order === blockData.order,
          )
        ) {
          return;
        }
        setPublishedBlocks(prev => [...prev, event.data]);
      },
    });
    return () => {
      sub.unsubscribe();
    };
  }, [blocksInUse, publishedBlocks, uiEvents]);

  // check if all used blocks are published
  // and then trigger beam publishing;
  React.useEffect(() => {
    // this check is mandatory because array.some returns true if the array is empty :O
    if (!publishedBlocks.length) {
      return;
    }
    const isAllPublishedWithSuccess = blocksInUse.every(bl =>
      publishedBlocks.some(
        pBlock =>
          pBlock.block.propertyType === bl.propertyType &&
          pBlock.block.order === bl.order &&
          !pBlock.response.error,
      ),
    );
    // @TODO: handle errors!
    if (isAllPublishedWithSuccess) {
      publishBeam.current(publishedBlocks).finally(() => {
        // @TODO: check for errors before reseting publishedBlocks
        setPublishedBlocks([]);
        setIsPublishing(false);
      });
    }
  }, [blocksInUse, publishedBlocks]);

  const createContentBlocks = React.useCallback(() => {
    setIsPublishing(true);
    for (const block of blocksInUse) {
      uiEvents.next({
        event: `${block.appName}_${block.eventMap.publish}`,
        data: block as BlockCommandRequest['data'],
      });
    }
  }, [blocksInUse, uiEvents]);

  // convenience method to add a new block into the beam editor
  // if index (idx) param is omitted, it will be added as the last block in the list
  const addBlockToList = (block: UseBlocksPublishingProps['availableBlocks'][0], idx?: number) => {
    if (idx) {
      // setBlocksInUse(prev => [
      //   ...prev.slice(0, idx),
      //   { ...block, idx: idx },
      //   ...prev.slice(idx).map(bl => ({
      //     ...bl,
      //     idx: bl.order + 1,
      //   })),
      // ]);
    }
    // setBlocksInUse(prev => [...prev, { ...block, idx: prev.length }]);
  };

  return {
    isPublishing,
    setIsPublishing,
    createContentBlocks,
    blocksInUse,
    addBlockToList,
  };
};
