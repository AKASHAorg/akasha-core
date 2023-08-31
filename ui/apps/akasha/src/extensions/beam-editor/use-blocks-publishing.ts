import * as React from 'react';
import { RootComponentProps, UIEventData } from '@akashaorg/typings/ui';
import { EditorBlockInterface } from '@akashaorg/typings/ui/editor-blocks';

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
  availableBlocks: EditorBlockInterface[];
};

export const useBlocksPublishing = (props: UseBlocksPublishingProps) => {
  const { uiEvents, availableBlocks } = props;
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [blocksInUse, setBlocksInUse] = React.useState<EditorBlockInterface[]>([]);

  const [publishedBlocks, setPublishedBlocks] = React.useState();
  const defaultTextBlock = availableBlocks.find(block => block.name === DEFAULT_TEXT_BLOCK);

  React.useEffect(() => {
    if (blocksInUse.length === 0) {
      // always add the default block
      setBlocksInUse([defaultTextBlock]);
    }
  }, [blocksInUse]);

  const publishBeam = React.useCallback(() => {
    console.log('fire an event to create contentBlocks for', blocksInUse);
  }, [blocksInUse]);

  return {
    isPublishing,
    setIsPublishing,
    publishBeam,
    blocksInUse,
    setBlocksInUse,
  };
};
