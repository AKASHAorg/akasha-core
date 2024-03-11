import { ContentBlockModes } from '@akashaorg/typings/lib/ui';
import { MatchingBlock } from './common.types';
import { ILogger } from '@akashaorg/typings/lib/sdk/log';
import { hasOwn } from '@akashaorg/ui-awf-hooks';

interface IResolveConfigs {
  matchingBlocks: MatchingBlock[];
  mode: ContentBlockModes;
  logger: ILogger;
}

const blocksConfigCache = new Map();

export const resolveConfigs = async ({ matchingBlocks, mode, logger }: IResolveConfigs) => {
  const newBlocks = [];
  for (const block of matchingBlocks) {
    try {
      let id = null;
      if (block?.blockData && hasOwn(block.blockData, 'id')) {
        id = block.blockData.id;
      }
      if (!blocksConfigCache.has(id)) {
        const config = await block.blockInfo.loadingFn({
          blockInfo: { ...block.blockInfo, mode },
          blockData: block.blockData,
        })();
        blocksConfigCache.set(id, config);
      }
      const config = blocksConfigCache.get(id);
      newBlocks.push({ ...block, config });
    } catch (err) {
      logger.error('content block resolveConfigs function', err);
    }
  }
  return newBlocks;
};
