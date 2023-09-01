import * as React from 'react';
import { BlockCommandResponse, RootComponentProps } from '@akashaorg/typings/ui';
import { BlockActionType, EditorBlock } from '@akashaorg/typings/ui/editor-blocks';
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
  availableBlocks: Omit<EditorBlock, 'idx'>[];
  onBeamPublish: (publishedBlocks: BlockCommandResponse['data'][]) => Promise<void>;
};

export const useBlocksPublishing = (props: UseBlocksPublishingProps) => {
  const { uiEvents, availableBlocks, onBeamPublish } = props;
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [blocksInUse, setBlocksInUse] = React.useState<EditorBlock[]>([]);

  const [publishedBlocks, setPublishedBlocks] = React.useState<BlockCommandResponse['data'][]>([]);
  const defaultTextBlock = availableBlocks.find(block => block.name === DEFAULT_TEXT_BLOCK);

  React.useEffect(() => {
    if (blocksInUse.length === 0) {
      // always add the default block
      setBlocksInUse([{ ...defaultTextBlock, idx: 0 }]);
    }
  }, [blocksInUse, defaultTextBlock]);

  // subscribe to contentBlock creation event
  // add the response along with the block data to the publishedBlocks state
  React.useEffect(() => {
    const blockEvents = blocksInUse.map(
      block => `${block.appName}_${block.eventMap.publish}_${BlockActionType.SUCCESS}`,
    );

    const sub = uiEvents.pipe(filterEvents(blockEvents)).subscribe({
      next: (event: BlockCommandResponse) => {
        const blockData = event.data.block;
        if (
          publishedBlocks.some(
            published =>
              published.block.name === blockData.name && published.block.idx === blockData.idx,
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
          pBlock.block.name === bl.name && pBlock.block.idx === bl.idx && !pBlock.response.error,
      ),
    );
    // @TODO: handle errors!
    if (isAllPublishedWithSuccess && !isPublishing) {
      setIsPublishing(true);
      onBeamPublish(publishedBlocks)
        .then(() => {
          setIsPublishing(false);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [blocksInUse, isPublishing, onBeamPublish, publishedBlocks]);

  const createContentBlocks = React.useCallback(() => {
    for (const block of blocksInUse) {
      uiEvents.next({
        event: `${block.appName}_${block.eventMap.publish}`,
        data: block,
      });
    }
  }, [blocksInUse, uiEvents]);

  // convenience method to add a new block into the beam editor
  // if index (idx) param is omitted, it will be added as the last block in the list
  const addBlockToList = (block: UseBlocksPublishingProps['availableBlocks'][0], idx?: number) => {
    if (idx) {
      setBlocksInUse(prev => [
        ...prev.slice(0, idx),
        { ...block, idx: idx },
        ...prev.slice(idx).map(bl => ({
          ...bl,
          idx: bl.idx + 1,
        })),
      ]);
    }
    setBlocksInUse(prev => [...prev, { ...block, idx: prev.length }]);
  };

  return {
    isPublishing,
    setIsPublishing,
    createContentBlocks,
    blocksInUse,
    addBlockToList,
  };
};
